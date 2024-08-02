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
import { MenuLabels } from "../../Redux/reducers/studySlice";

let schema = yup.object().shape({
  name: yup.string().required("Study Phase Name is Required"),
  duration: yup.number().optional(),
});
type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: any;
  studyId: any;
  refreshPage: () => void;
  menuLabels: MenuLabels;
};

const AddVisitModal = ({
  showModal,
  closeModal,
  data,
  studyId,
  refreshPage,
  menuLabels,
}: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        name: values?.name || "",
        duration:
          typeof values?.duration === "number" ? values?.duration : null,
        category: "visit",
      };
      if (data?.id) {
        await http.patch(`/study/${studyId}/study-phase/${data?.id}`, body);
      } else {
        await http.post(`/study/${studyId}/study-phase`, body);
      }
      toastMessage(
        "success",
        data?.id
          ? `${menuLabels?.visit || "Visit"} updated successfully`
          : `${menuLabels?.visit || "Visit"} created successfully`
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
              ? "Edit " + (menuLabels?.visit || "Visit")
              : "Add " + (menuLabels?.visit || "Visit")
          }
          onCloseClick={closeModal}
        />
        <Formik
          initialValues={{
            name: data?.name || "",
            duration: data?.duration ?? "",
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
                    {menuLabels?.visit || "Visit"} Name{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Name"
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
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="duration">
                    Duration in Months
                  </FormLabel>
                  <TextField
                    type="number"
                    placeholder="Duration in months"
                    id="duration"
                    {...getFieldProps("duration")}
                    error={touched?.duration && errors?.duration ? true : false}
                    helperText={
                      touched?.duration && errors?.duration
                        ? (errors?.duration as string)
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
                        : "Add " + (menuLabels?.visit || "Visit")}
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

export default AddVisitModal;
