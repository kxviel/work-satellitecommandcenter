import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Modal,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { ChipStyle } from "../Tabs/Randomization";
import { Close } from "@mui/icons-material";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  studyId: any;
  refreshPage: () => void;
};
let schema = yup.object().shape({
  siteId: yup.string().required("Site Name is Required"),
  seedVal: yup
    .number()
    .typeError("Seed Value must be a number")
    .required("Seed Value is Required"),
  groups: yup
    .string()
    .required("Treatment groups is Required")
    .test(
      "comma-separated-values",
      "Groups should be comma-separated",
      (value) => {
        const regex = /^\s*[^,\s]+(?:\s*,\s*[^,\s]+)*\s*$/;
        return regex.test(value);
      }
    )
    .test(
      "atleast-two-groups",
      "At least 2 groups should exist separated by comma",
      (value) => {
        return value.split(",").length > 1;
      }
    ),
  blockSizes: yup
    .string()
    .required("Block sizes is Required")
    .test(
      "comma-separated-numbers",
      "Block sizes must be a comma-separated list of numbers",
      (value) => {
        const regex = /^\s*\d+(\s*,\s*\d+)*\s*$/;
        return regex.test(value);
      }
    ),
  listLength: yup
    .number()
    .typeError("List length must be a number")
    .required("List length is Required"),
});

const RandomizationModal = ({
  showModal,
  closeModal,
  studyId,
  refreshPage,
}: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteList, setSiteList] = useState<any>([]);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      let updatedGroups = values?.groups?.split(",").map((item: string) => {
        return { name: item.trim() };
      });

      let updatedSizes = values?.blockSizes
        ?.split(",")
        .map((item: string) => +item);

      const body = {
        siteId: values.siteId === "all" ? null : values.siteId,
        studyId: studyId ?? "",
        treatmentGroups: updatedGroups || [],
        blockSizes: updatedSizes || [],
        totalSubjects: +values?.listLength || "",
        seed: +values?.seedVal || "",
      };
      let res: AxiosResponse;
      res = await http.post(`/randomization`, body);
      toastMessage("success", res?.data?.message);
      setSubmitLoader(false);
      closeModal();
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const siteListRes: AxiosResponse = await http.get(
          `/study/${studyId}/sites`
        );
        const siteRes = siteListRes.data?.data;

        let listData = siteRes?.map((item: any) => ({
          id: item?.id,
          name: item?.name || "",
        }));
        listData = [...listData, { id: "all", name: "All Sites" }];
        setSiteList(listData);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    fetchData();
  }, [studyId]);
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, width: "50vw", minHeight: "20vh" }}>
        <ModalHeader title={"Randomize"} onCloseClick={closeModal} />
        {!loading ? (
          <Formik
            initialValues={{
              siteId: "",
              seedVal: "",
              groups: "",
              blockSizes: "",
              listLength: "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ errors, touched, getFieldProps, setFieldValue, values }) => (
              <Form>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle}>
                    Site Name <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    fullWidth
                    value={values.siteId}
                    onChange={(e) => {
                      setFieldValue("siteId", e.target.value);
                    }}
                    error={touched?.siteId && errors?.siteId ? true : false}
                    displayEmpty
                    renderValue={
                      values.siteId !== ""
                        ? undefined
                        : () => (
                            <Typography sx={{ color: "#c1cccf" }}>
                              Select
                            </Typography>
                          )
                    }
                  >
                    {siteList.length > 0 ? (
                      siteList.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options available</MenuItem>
                    )}
                  </Select>
                  <FormHelperText
                    error={touched?.siteId && errors?.siteId ? true : false}
                  >
                    {touched?.siteId && errors?.siteId
                      ? (errors?.siteId as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
                <FormControl sx={{ ...InputWrapper, mb: 2 }}>
                  <FormLabel sx={LabelStyle} htmlFor="seed-value">
                    Seed Value <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Enter seed value"
                    id="seed-value"
                    {...getFieldProps("seedVal")}
                    error={touched?.seedVal && errors?.seedVal ? true : false}
                    helperText={
                      touched?.seedVal &&
                      errors?.seedVal &&
                      (errors?.seedVal as string)
                    }
                  />
                </FormControl>
                <FormControl sx={{ ...InputWrapper, mb: 2 }}>
                  <FormLabel sx={LabelStyle} htmlFor="treatment-groups">
                    Treatment groups <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Treatment Groups"
                    id="treatment-groups"
                    {...getFieldProps("groups")}
                    error={touched?.groups && errors?.groups ? true : false}
                    helperText={
                      touched?.groups &&
                      errors?.groups &&
                      (errors?.groups as string)
                    }
                  />
                  <Typography
                    color={"text.secondary"}
                    fontSize={"12px"}
                    fontWeight={400}
                  >
                    For 2:1 ratio enter same treatment group twice. Eg A, A, B
                  </Typography>

                  {values.groups && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "30% 30% 30%",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      {values?.groups?.split(",").map(
                        (item: string) =>
                          item.trim() !== "" && (
                            <Chip
                              label={item}
                              key={item}
                              sx={ChipStyle}
                              deleteIcon={
                                <Close htmlColor="#FF0000" fontSize="small" />
                              }
                              onDelete={() => {
                                const data = values.groups
                                  ?.split(",")
                                  .filter((group: any) => group !== item);
                                setFieldValue("groups", data.join(", "));
                              }}
                            />
                          )
                      )}
                    </Box>
                  )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="block-sizes">
                      Block Sizes <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      placeholder="2,4"
                      id="block-sizes"
                      {...getFieldProps("blockSizes")}
                      error={
                        touched?.blockSizes && errors?.blockSizes ? true : false
                      }
                      helperText={
                        touched?.blockSizes &&
                        errors?.blockSizes &&
                        (errors?.blockSizes as string)
                      }
                    />
                    <Typography
                      color={"text.secondary"}
                      fontSize={12}
                      fontWeight={400}
                    >
                      A comma seperated list of block sizes- must be multiples
                      of the number of treatments
                    </Typography>
                  </FormControl>

                  <FormControl sx={{ ...InputWrapper, mb: 2.5 }}>
                    <FormLabel sx={LabelStyle} htmlFor="list-length">
                      List length <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      placeholder="Enter list length"
                      id="list-length"
                      {...getFieldProps("listLength")}
                      error={
                        touched?.listLength && errors?.listLength ? true : false
                      }
                      helperText={
                        touched?.listLength &&
                        errors?.listLength &&
                        (errors?.listLength as string)
                      }
                    />
                    <Typography
                      color={"text.secondary"}
                      fontSize={12}
                      fontWeight={400}
                    >
                      E.g 3 age groups and 4 sites is 3 x 5 = 15 strata
                    </Typography>
                  </FormControl>
                </Box>

                <Box sx={ModalActionButtonStyles}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Randomize
                      </Button>
                    </>
                  ) : (
                    <CircularProgress size={25} />
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default RandomizationModal;
