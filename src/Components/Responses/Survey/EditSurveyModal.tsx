import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import { commonContainerWrapper } from "../../Common/styles/flex";
import { Form, Formik } from "formik";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import http from "../../../utils/http";
import * as yup from "yup";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
// import {
//   StyledTableCell,
//   TableBorderRadiusTopLeftRight,
// } from "../../Common/styles/table";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useQuery } from "../../../utils/hooks";

const schema = yup.object().shape({
  emailSubject: yup.string().required("Email Subject is Required"),
  messageBody: yup.string().required("Message Body is Required"),
  plannedSendDate: yup.string().required("Please select a date"),
});

const EditSurveyModal = ({ showModal, closeModal, refreshPage, data }: any) => {
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  const { id: studyId, participantId } = useParams();
  const participantLabel = useQuery().get("participant");

  const submitHandler = async (values: any) => {
    try {
      setButtonLoader(true);
      let body: any = {
        invitationSubject: values?.emailSubject,
        invitationBody: values?.messageBody,
        scheduledAt: values?.plannedSendDate,
      };
      await http.patch(
        `/study/${studyId}/survey-assignment/${data.id}/update-assignment?participantId=${participantId}`,
        body
      );
      toastMessage("success", `Invitation scheduled successfully`);
      setButtonLoader(false);
      closeModal();
      refreshPage();
    } catch (err) {
      setButtonLoader(false);
      errorToastMessage(err as Error);
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader
          title={`Edit Invitation To ${participantLabel ?? participantId}`}
          onCloseClick={closeModal}
        />
        <Box>
          <Formik
            initialValues={{
              emailSubject: data?.invitationSubject || "",
              messageBody: data?.invitationBody || "",
              plannedSendDate: data?.scheduledAt
                ? DateTime.fromISO(data?.scheduledAt).toFormat("dd/MM/yyyy")
                : "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ getFieldProps, setFieldValue, errors, touched, values }) => (
              <Form>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="email-subject">
                      Email Subject <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="email-subject"
                      multiline
                      minRows={2}
                      {...getFieldProps("emailSubject")}
                      error={
                        touched?.emailSubject && errors?.emailSubject
                          ? true
                          : false
                      }
                      helperText={
                        touched?.emailSubject && errors?.emailSubject
                          ? (errors?.emailSubject as string)
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...InputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="message-body">
                      Message Body <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="message-body"
                      multiline
                      minRows={3}
                      {...getFieldProps("messageBody")}
                      error={
                        touched?.messageBody && errors?.messageBody
                          ? true
                          : false
                      }
                      helperText={
                        touched?.messageBody && errors?.messageBody
                          ? (errors?.messageBody as string)
                          : " "
                      }
                    />
                    {/* <Box
                      sx={{
                        border: "1px solid #E0E3EB",
                        borderRadius: "8px",
                        p: 2,
                        display: "grid",
                        gap: 3,
                      }}
                    >
                      <Typography sx={{ fontSize: "16px" }}>
                        You are participating in the study “Example Study” and
                        we would like to ask you to fill in a survey.
                      </Typography>
                      <Typography sx={{ fontSize: "16px" }}>
                        Please click the link below to complete our survey.
                      </Typography>
                      <Typography sx={{ fontSize: "16px" }}>URL</Typography>
                      <Typography sx={{ fontSize: "16px" }}>Logo</Typography>
                    </Box> */}
                  </FormControl>
                  <Box>
                    <FormControl sx={InputWrapper}>
                      <FormLabel sx={LabelStyle} htmlFor="planned-send-date">
                        Planned send date
                      </FormLabel>
                      <DatePicker
                        disablePast
                        format="dd/MM/yyyy"
                        disableHighlightToday
                        minDate={DateTime.now().plus({ days: 1 })}
                        value={
                          values?.plannedSendDate
                            ? DateTime.fromFormat(
                                values?.plannedSendDate,
                                "dd/MM/yyyy"
                              )
                            : null
                        }
                        onChange={(newValue: any) => {
                          setFieldValue(
                            "plannedSendDate",
                            newValue.toFormat("dd/MM/yyyy")
                          );
                        }}
                        slotProps={{
                          textField: {
                            inputProps: {
                              readOnly: true,
                              placeholder: "Select date",
                              id: "planned-send-date",
                            },
                            error:
                              touched?.plannedSendDate &&
                              errors?.plannedSendDate
                                ? true
                                : false,
                            helperText:
                              touched?.plannedSendDate &&
                              errors?.plannedSendDate
                                ? (errors?.plannedSendDate as string)
                                : " ",
                          },
                        }}
                        // renderInput={(
                        //   params: JSX.IntrinsicAttributes & TextFieldProps
                        // ) => (
                        //   <TextField
                        //     {...params}
                        //     inputProps={{
                        //       ...params.inputProps,
                        //       readOnly: true,
                        //       placeholder: "Select date",
                        //       id: "planned-send-date",
                        //     }}
                        //     error={
                        //       touched?.plannedSendDate &&
                        //       errors?.plannedSendDate
                        //         ? true
                        //         : false
                        //     }
                        //     helperText={
                        //       touched?.plannedSendDate &&
                        //       errors?.plannedSendDate
                        //         ? (errors?.plannedSendDate as string)
                        //         : " "
                        //     }
                        //   />
                        // )}
                      />
                    </FormControl>
                  </Box>
                  <Box sx={ModalActionButtonStyles}>
                    {!buttonLoader ? (
                      <>
                        <Button variant="outlined" onClick={closeModal}>
                          Cancel
                        </Button>
                        <Button variant="contained" type="submit">
                          Save
                        </Button>
                      </>
                    ) : (
                      <CircularProgress size={25} />
                    )}
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSurveyModal;
