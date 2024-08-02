import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  CircularProgress,
  Typography,
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
import { InputUploadWrapper } from "../style";
import { AddRounded } from "@mui/icons-material";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  studyId: any;
  refreshPage: () => void;
};

let schema = yup.object().shape({
  siteId: yup.string().required("Site Name is Required"),
  file: yup.mixed().required("File is Required"),
});

const UploadFile = ({ showModal, closeModal, studyId, refreshPage }: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteList, setSiteList] = useState<any>([]);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  const submitHandler = async (values: any) => {
    if (values.file && values.file.length > 0) {
      const file = values.file[0];
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toastMessage("warning", "File size must be smaller than 5MB!");
        return false;
      }
      try {
        setSubmitLoader(true);
        const formData = new FormData();
        formData.append("file", file);
        const fileData = formData.get("file");
        const body = {
          siteId: values.siteId === "all" ? null : values.siteId,
          file: fileData,
        };
        let res: AxiosResponse;
        res = await http.post(
          `/randomization/import?studyId=${studyId}`,
          body,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toastMessage("success", res?.data?.message);
        closeModal();
        setSubmitLoader(false);
        refreshPage();
      } catch (err) {
        errorToastMessage(err as Error);
        setSubmitLoader(false);
      }
    }
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader title={"Upload File"} onCloseClick={closeModal} />
        {!loading ? (
          <Formik
            initialValues={{
              siteId: "",
              file: null,
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
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
                <Typography fontWeight={500} fontSize={14} color="text.primary">
                  I already have my randomized data. I want to use my data to
                  randomize the patients
                </Typography>

                <Box sx={InputUploadWrapper} component="label">
                  {values.file ? (
                    <>
                      {Array.from(values.file).map(
                        (item: any, index: number) => (
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color={"text.secondary"}
                            key={index}
                          >
                            {item.name}
                          </Typography>
                        )
                      )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <AddRounded
                        sx={{ color: "text.secondary", fontSize: "40px" }}
                      />
                      <Typography
                        fontSize={12}
                        fontWeight={400}
                        color={"text.secondary"}
                      >
                        Upload File
                      </Typography>
                      <input
                        hidden
                        accept="text/csv"
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const file = files[0];
                            if (file.size > MAX_FILE_SIZE) {
                              toastMessage(
                                "warning",
                                "File size must be smaller than 5MB!"
                              );
                              return;
                            } else {
                              setFieldValue("file", files);
                            }
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <FormHelperText
                  error={touched?.file && errors?.file ? true : false}
                >
                  {touched?.file && errors?.file
                    ? (errors?.file as string)
                    : " "}
                </FormHelperText>
                <Box sx={ModalActionButtonStyles}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Upload File
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

export default UploadFile;
