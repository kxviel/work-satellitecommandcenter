import React, { useState } from "react";
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
import { Form, Formik } from "formik";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../Common/styles/modal";

const repeatedDataTypes = [
  { value: "adverse_event", label: "Adverse Event" },
  { value: "event", label: "Event" },
  { value: "medication", label: "Medication" },
  { value: "repeated_measure", label: "Repeated Measure" },
  { value: "unscheduled_visit", label: "Unscheduled Visit" },
  { value: "other", label: "Other" },
];

let schema = yup.object().shape({
  name: yup.string().required("Study Phase Name is Required"),
  type: yup.string().required("Study Phase Type is Required"),
  description: yup.string().optional(),
  // namingStrategy: yup
  //   .string()
  //   .required("Study Phase Naming Strategy is Required"),
});

const AddRepeatingModal = ({
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
      const body = { ...values, category: "repeated_data" };
      if (data?.id) {
        await http.patch(`/study/${studyId}/study-phase/${data?.id}`, body);
      } else {
        await http.post(`/study/${studyId}/study-phase`, body);
      }
      toastMessage(
        "success",
        data?.id
          ? (menuLabels?.repeating_data || "Repeating data") +
              " updated successfully"
          : (menuLabels?.repeating_data || "Repeating data") +
              " created successfully"
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
              ? "Edit " + (menuLabels?.repeating_data || "Repeating Data")
              : "Add " + (menuLabels?.repeating_data || "Repeating Data")
          }
          onCloseClick={closeModal}
        />
        <Formik
          initialValues={{
            name: data?.name || "",
            type: data?.type || "adverse_event",
            description: data?.description || "",
            // namingStrategy: data?.namingStrategy || "",
            // manualEditing: data?.manualEditing || false,
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ getFieldProps, errors, touched, values, setFieldValue }) => (
            <Form>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="phase-name">
                    {`${menuLabels?.repeating_data || "Repeating Data"} Name`}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder={`${
                      menuLabels?.repeating_data || "Repeating Data"
                    } Name`}
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
                  <FormLabel sx={LabelStyle} htmlFor="type">
                    {`${menuLabels?.repeating_data || "Repeating Data"} Type`}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    id="type"
                    value={values.type}
                    onChange={(e) => setFieldValue("type", e.target.value)}
                    error={touched?.type && errors?.type ? true : false}
                  >
                    {repeatedDataTypes.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={touched?.type && errors?.type ? true : false}
                  >
                    {touched?.type && errors?.type
                      ? (errors?.type as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="description">
                    Description
                  </FormLabel>
                  <TextField
                    multiline
                    placeholder="Description"
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
              {/* <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="naming-strategy">
                    Repeating Data Name Naming Strategy{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Repeating Data Naming Strategy"
                    id="naming-strategy"
                    {...getFieldProps("namingStrategy")}
                    error={
                      touched?.namingStrategy && errors?.namingStrategy
                        ? true
                        : false
                    }
                    helperText={
                      touched?.namingStrategy && errors?.namingStrategy
                        ? (errors?.namingStrategy as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex" }}>
                <FormControl sx={InputWrapper}>
                  <FormControlLabel
                    sx={LabelStyle}
                    label="Allow manual editing of generated names"
                    control={
                      <Checkbox
                        checked={values?.manualEditing}
                        onChange={(event) => {
                          setFieldValue("manualEditing", event.target.checked);
                        }}
                      />
                    }
                  />
                </FormControl>
              </Box> */}
              <Box sx={ModalActionButtonStyles}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {data?.id
                        ? "Save"
                        : `Add ${
                            menuLabels?.repeating_data || "Repeating Data"
                          }`}
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

export default AddRepeatingModal;
