import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
} from "../Common/styles/modal";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import { CloseOutlined } from "@mui/icons-material";

let schema = yup.object().shape({
  name: yup.string().required("Form Name is Required"),
  description: yup.string().optional(),
});

const AddPhaseFormModal = ({
  showModal,
  closeModal,
  data,
  phaseId,
  studyId,
  refreshPage,
  formId,
}: any) => {
  const [submitLoader, setSubmitLoader] = useState(false);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        ...values,
      };
      if (formId) {
        await http.patch(`/study/${studyId}/forms/${formId}`, body);
      } else {
        await http.post(
          `/study/${studyId}/study-phase/${phaseId}/phase_form`,
          body
        );
      }
      closeModal();
      toastMessage(
        "success",
        formId ? "Form updated successfully" : "Form created successfully"
      );
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
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 600,
              fontSize: 18,
              flex: 1,
              minWidth: "0px",
            }}
            title={data?.id ? "Edit Form" : `Add Form to ${data?.phaseName}`}
            noWrap
          >
            {data?.id ? "Edit Form" : `Add Form to ${data?.phaseName}`}
          </Typography>

          <IconButton onClick={closeModal}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Formik
          initialValues={{
            name: data?.name || "",
            description: data?.description || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ getFieldProps, errors, touched }) => (
            <Form>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="form-name">
                  Form Name <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  placeholder="Form name"
                  id="form-name"
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
                <FormLabel sx={LabelStyle} htmlFor="description">
                  Form Description
                </FormLabel>
                <TextField
                  multiline
                  minRows={4}
                  placeholder="Form description"
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
              <Box sx={ModalActionButtonStyles}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {formId ? "Save" : "Add"}
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

export default AddPhaseFormModal;
