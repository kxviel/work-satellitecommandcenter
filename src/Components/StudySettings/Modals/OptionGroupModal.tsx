import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Modal,
  Button,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { Add, Delete } from "@mui/icons-material";

type Props = {
  data: any;
  showModal: boolean;
  closeModal: () => void;
  studyId: any;
  refreshPage: () => void;
};

let schema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  description: yup.string().optional(),
  options: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Label is Required"),
        value: yup.string().required("Value is Required"),
      })
    )
    .min(1, "At least one choice is required"),
});

const OptionGroupModal = ({
  data,
  showModal,
  closeModal,
  studyId,
  refreshPage,
}: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        ...values,
      };
      let res: AxiosResponse;
      if (data?.id) {
        res = await http.put(
          `/study/${studyId}/option-groups/${data?.id}`,
          body
        );
      } else {
        res = await http.post(`/study/${studyId}/option-groups`, body);
      }
      toastMessage("success", res?.data?.message);
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
          title={data?.id ? "Edit Choice Value" : "Add Choice Value"}
          onCloseClick={closeModal}
        />

        <Formik
          initialValues={{
            name: data?.name || "",
            description: data?.description || "",
            options:
              data?.options.length > 0
                ? [...data?.options]
                : [
                    {
                      label: "",
                      value: "",
                    },
                  ],
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ errors, touched, values, getFieldProps }) => (
            <Form>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="name">
                  Name <span style={{ color: "#f16262" }}>*</span>
                </FormLabel>
                <TextField
                  id="name"
                  placeholder="Name"
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
                  Description
                </FormLabel>
                <TextField
                  id="description"
                  placeholder="Description"
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
              <Box sx={InputWrapper}>
                <Typography sx={{ ...LabelStyle, mb: 1.5, fontSize: "20px" }}>
                  Choices
                </Typography>
                <FieldArray name="options">
                  {({ push, remove }) => (
                    <>
                      {values?.options?.map((option: any, index: number) => (
                        <Box sx={{ display: "flex", gap: 2 }} key={index}>
                          <FormControl sx={InputWrapper}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 2,
                              }}
                            >
                              <FormControl
                                sx={{ ...InputWrapper, width: "65%" }}
                              >
                                <FormLabel sx={LabelStyle}>Choice</FormLabel>
                                <TextField
                                  placeholder="Enter here"
                                  key={index}
                                  {...getFieldProps(`options.${index}.label`)}
                                  error={
                                    //@ts-ignore
                                    touched?.options?.[index]?.label &&
                                    //@ts-ignore
                                    errors?.options?.[index]?.label
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    //@ts-ignore
                                    touched?.options?.[index]?.label &&
                                    //@ts-ignore
                                    errors?.options?.[index]?.label
                                      ? //@ts-ignore
                                        errors?.options?.[index]?.label
                                      : " "
                                  }
                                />
                              </FormControl>
                              <FormControl
                                sx={{ ...InputWrapper, width: "30%" }}
                              >
                                <FormLabel sx={LabelStyle}>Value</FormLabel>
                                <TextField
                                  type="number"
                                  placeholder="Value"
                                  key={index}
                                  {...getFieldProps(`options.${index}.value`)}
                                  error={
                                    //@ts-ignore
                                    touched?.options?.[index]?.value &&
                                    //@ts-ignore
                                    errors?.options?.[index]?.value
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    //@ts-ignore
                                    touched?.options?.[index]?.value &&
                                    //@ts-ignore
                                    errors?.options?.[index]?.value
                                      ? //@ts-ignore
                                        errors?.options?.[index]?.value
                                      : " "
                                  }
                                />
                              </FormControl>
                              <IconButton
                                sx={{
                                  mb: 2,
                                  alignSelf: "flex-end",
                                }}
                                disabled={values?.options.length === 1}
                                color="error"
                                onClick={() => remove(index)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                            {values?.options.length - 1 === index && (
                              <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() =>
                                  push({
                                    label: "",
                                    value: "",
                                  })
                                }
                                sx={{ width: "200px" }}
                              >
                                Add new choice
                              </Button>
                            )}
                          </FormControl>
                        </Box>
                      ))}
                    </>
                  )}
                </FieldArray>
              </Box>

              <Box sx={ModalActionButtonStyles}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      Save
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

export default OptionGroupModal;
