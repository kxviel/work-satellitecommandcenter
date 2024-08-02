import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";

import * as yup from "yup";
import { Formik } from "formik";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { setRepeatedAttemptId } from "../../../Redux/reducers/responseSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { MenuLabels } from "../../../Redux/reducers/studySlice";

let schema = yup.object().shape({
  phaseId: yup.string().required("Repeating Data is Required"),
  name: yup.string().required("Custom Name is Required"),
});

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: any;
  refreshPage: () => void;
  menuLabels: MenuLabels;
};

const AddRepeatingDataModal = ({
  showModal,
  closeModal,
  data,
  refreshPage,
  menuLabels,
}: Props) => {
  const { id: studyId, participantId } = useParams();
  const dispatch = useAppDispatch();
  const { subjectId } = useAppSelector((state) => state.response);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [phaseData, setPhaseData] = useState<any>([]);
  const [parentPhaseData, setParentPhaseData] = useState<any>([]);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        ...values,
        parentPhaseId: values.parentPhaseId || null,
        participantId,
      };
      let res: AxiosResponse;
      if (data?.id) {
        res = await http.patch(
          `/study/${studyId}/repeated-responses/${data?.id}/update-attempt`,
          body
        );
      } else {
        res = await http.post(
          `/study/${studyId}/repeated-responses/${values?.phaseId}/create-attempt`,
          body
        );
        dispatch(setRepeatedAttemptId({ repeatedAttemptId: res.data.data.id }));
      }
      toastMessage("success", res.data.message);
      closeModal();
      refreshPage();
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=repeated_data`
        );

        const formattedData = res.data?.data?.map((item: any) => ({
          phaseId: item?.id,
          name: item?.name || "",
        }));

        setPhaseData(formattedData || []);
      } catch (err) {
        errorToastMessage(err as Error);
      }
    };
    if (!data) {
      fetchPhaseData();
    }
  }, [studyId, data]);

  useEffect(() => {
    const fetchParentPhaseData = async () => {
      try {
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=visit`
        );
        const data = res.data?.data;

        const formattedData = data?.map((item: any) => ({
          parentPhaseId: item?.id,
          name: item?.name || "",
        }));

        setParentPhaseData(formattedData || []);
      } catch (err) {
        errorToastMessage(err as Error);
      }
    };
    fetchParentPhaseData();
  }, [studyId]);

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <ModalHeader
          title={
            data?.id
              ? `Edit ${menuLabels?.repeating_data || "Repeating Data"}`
              : `Add ${menuLabels?.repeating_data || "Repeating Data"}`
          }
          onCloseClick={closeModal}
        />

        <Formik
          initialValues={{
            name: data?.name || "",
            phaseId: data?.phaseId || "",
            parentPhaseId: data?.parentPhaseId || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({
            handleSubmit,
            getFieldProps,
            setFieldValue,
            setFieldTouched,
            errors,
            touched,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              {!data && (
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="repeatingData">
                    {menuLabels?.repeating_data || "Repeating data"}
                  </FormLabel>
                  <Select
                    id="repeatingData"
                    value={values.phaseId}
                    onChange={(e) => {
                      setFieldValue("phaseId", e.target.value);

                      const selectedPhase = phaseData.find(
                        (item: any) => item?.phaseId === e.target.value
                      );
                      const time = DateTime.now().toFormat("dd/MM/yy HH:mm:ss");
                      setFieldValue(
                        "name",
                        selectedPhase?.name + " - " + subjectId + " - " + time
                      );
                    }}
                  >
                    {phaseData?.length ? (
                      phaseData?.map((item: any) => (
                        <MenuItem key={item.phaseId} value={item.phaseId}>
                          {item.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem key={"None"} value={""} disabled>
                        No Data available
                      </MenuItem>
                    )}
                  </Select>
                  <FormHelperText sx={{ color: "#d32f2f" }}>
                    {touched?.phaseId && errors?.phaseId
                      ? (errors?.phaseId as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
              )}
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="custom-name">
                  Custom Name
                </FormLabel>
                <TextField
                  id="custom-name"
                  {...getFieldProps("name")}
                  error={touched?.name && errors?.name ? true : false}
                  helperText={
                    touched?.name && errors?.name
                      ? (errors?.name as string)
                      : " "
                  }
                />
              </FormControl>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="attachTo">
                  Attach To
                </FormLabel>
                <Select
                  id="attachTo"
                  value={values.parentPhaseId}
                  onChange={(e) => {
                    setFieldValue("parentPhaseId", e.target.value);
                  }}
                >
                  {parentPhaseData?.length ? (
                    parentPhaseData.map((item: any) => (
                      <MenuItem
                        key={item.parentPhaseId}
                        value={item.parentPhaseId}
                      >
                        {item.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={"None"} value={""} disabled>
                      No Data available
                    </MenuItem>
                  )}
                  <MenuItem
                    key={"None"}
                    value={""}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    Clear
                  </MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {data?.id ? "Edit" : "Add"}
                    </Button>
                  </>
                ) : (
                  <CircularProgress size={25} />
                )}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddRepeatingDataModal;
