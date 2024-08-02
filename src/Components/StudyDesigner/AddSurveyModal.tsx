import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import { Form, Formik } from "formik";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../Common/styles/modal";

let schema = yup.object().shape({
  name: yup.string().required("Study Phase Name is Required"),
  description: yup.string().optional(),
  introText: yup.string().optional(),
  outroText: yup.string().optional(),
  remarks: yup.string().optional(),
});

const AddSurveyModal = ({
  showModal,
  closeModal,
  data,
  studyId,
  refreshPage,
  menuLabels,
}: any) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = { ...values, category: "survey" };
      if (data?.id) {
        await http.patch(`/study/${studyId}/study-phase/${data?.id}`, body);
      } else {
        await http.post(`/study/${studyId}/study-phase`, body);
      }
      toastMessage(
        "success",
        data?.id
          ? `${menuLabels?.survey || "Survey"} updated successfully`
          : `${menuLabels?.survey || "Survey"} created successfully`
      );
      closeModal();
      setSubmitLoader(false);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader
          title={
            data?.id
              ? `Edit ${menuLabels?.survey || "Survey"}`
              : `Add ${menuLabels?.survey || "Survey"}`
          }
          onCloseClick={closeModal}
        />
        <Formik
          initialValues={{
            name: data?.name || "",
            description: data?.description || "",
            introText: data?.introText || "",
            outroText: data?.outroText || "",
            remarks: data?.remarks || "",
            // namingStrategy: data?.namingStrategy || "",
            // manualEditing: data?.manualEditing || false,
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ getFieldProps, errors, touched }) => (
            <Form>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="phase-name">
                    {menuLabels?.survey || "Survey"} Name{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder={`Name`}
                    id="phase-name"
                    {...getFieldProps("name")}
                    error={touched?.name && errors?.name ? true : false}
                    helperText={
                      touched?.name && errors?.name
                        ? (errors?.name as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="description">
                    {menuLabels?.survey || "Survey"} Description
                  </FormLabel>
                  <TextField
                    multiline
                    placeholder={`Description`}
                    minRows={4}
                    id="description"
                    {...getFieldProps("description")}
                    error={
                      touched?.description && errors?.description ? true : false
                    }
                    helperText={
                      touched?.description && errors?.description
                        ? (errors?.description as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="introText">
                    Introduction Text
                  </FormLabel>
                  <TextField
                    multiline
                    placeholder={`Introduction Text`}
                    minRows={4}
                    id="introText"
                    {...getFieldProps("introText")}
                    error={
                      touched?.introText && errors?.introText ? true : false
                    }
                    helperText={
                      touched?.introText && errors?.introText
                        ? (errors?.introText as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="outroText">
                    Outro Text
                  </FormLabel>
                  <TextField
                    multiline
                    placeholder="Outro Text"
                    minRows={4}
                    id="outroText"
                    {...getFieldProps("outroText")}
                    error={
                      touched?.outroText && errors?.outroText ? true : false
                    }
                    helperText={
                      touched?.outroText && errors?.outroText
                        ? (errors?.outroText as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="outroText">
                    Remarks
                  </FormLabel>
                  <TextField
                    multiline
                    placeholder="Remarks"
                    minRows={4}
                    id="outroText"
                    {...getFieldProps("remarks")}
                    error={touched?.remarks && errors?.remarks ? true : false}
                    helperText={
                      touched?.remarks && errors?.remarks
                        ? (errors?.remarks as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={ModalActionButtonStyles}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {data?.id
                        ? "Save"
                        : `Add ${menuLabels?.survey || "Survey"}`}
                    </Button>
                  </>
                ) : (
                  <CircularProgress size={25} />
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddSurveyModal;
