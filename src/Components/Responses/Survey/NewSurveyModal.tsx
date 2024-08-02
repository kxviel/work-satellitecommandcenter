import {
  Alert,
  Box,
  Button,
  // Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  // Stack,
  // Table,
  // TableBody,
  // TableHead,
  // TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { commonContainerWrapper } from "../../Common/styles/flex";
import { Form, Formik } from "formik";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import { AxiosResponse } from "axios";
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
import { useAppSelector } from "../../../Redux/hooks";

const dateSchedulerOptions = [
  {
    label: "Now",
    value: "now",
  },
  {
    label: "Decide later",
    value: "later",
  },
  {
    label: "On a specific date or schedule",
    value: "scheduled",
  },
];

// const repeatedSurveyOptions = [
//   { label: "Schedule 1 (0, 1, 3)", value: [0, 1, 3] as any },
//   { label: "Schedule 2 (2, 4, 6)", value: [2, 4, 6] as any },
//   { label: "Schedule 3 (10, 15, 20)", value: [10, 15, 20] as any },
// ];

const schema = yup.object().shape({
  surveyPackageId: yup.string().required("Please select a package"),
  emailSubject: yup.string().required("Email Subject is Required"),
  messageBody: yup.string().required("Message Body is Required"),
  sendType: yup.string().required("Send Type is Required"),
  plannedSendDate: yup.string().when("sendType", {
    is: (value: string) => value === "scheduled",
    then: (schema) => schema.required("Please select a date"),
    otherwise: (schema) => schema.optional(),
  }),
});

const NewSurveyModal = ({ showModal, closeModal, refreshPage }: any) => {
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [surveyPackageData, setSurveyPackageData] = useState<any>([]);
  // const [tableLoading, setTableLoading] = useState(false);
  // const [tableData, setTableData] = useState<any>({});

  const { id: studyId, participantId } = useParams();
  const participantLabel = useQuery().get("participant");
  const { hasEmail } = useAppSelector((state) => state.response);

  useEffect(() => {
    const fetchSurveyPackageData = async () => {
      try {
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/survey-package`
        );
        const data = res.data?.data;

        const formattedData = data?.map((item: any) => ({
          surveyPackageId: item?.id,
          name: item?.name || "",
          invitationSubject: item?.invitationSubject || "",
          invitationBody: item?.invitationBody || "",
        }));

        setSurveyPackageData(formattedData || []);
      } catch (err) {
        errorToastMessage(err as Error);
      }
    };
    fetchSurveyPackageData();
  }, [studyId]);

  const submitHandler = async (values: any) => {
    try {
      setButtonLoader(true);
      let body: any = {
        packageId: values?.surveyPackageId,
        participantId: participantId,
        invitationSubject: values?.emailSubject,
        invitationBody: values?.messageBody,
        sendType: values?.sendType,
      };
      if (values?.sendType === "scheduled") {
        body = {
          ...body,
          scheduledAt: values?.plannedSendDate,
        };
      }
      await http.post(
        `/study/${studyId}/survey-assignment/assign-package`,
        body
      );
      if (hasEmail) {
        toastMessage(
          "success",
          values?.sendType === "now"
            ? `Invitation sent successfully`
            : values?.sendType === "scheduled"
            ? `Invitation scheduled successfully`
            : `Invitation created successfully`
        );
      } else {
        toastMessage("success", `Invitation created successfully`);
      }
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
          title={`Create Invitation To ${participantLabel ?? participantId}`}
          onCloseClick={closeModal}
        />
        <Box>
          <Formik
            initialValues={{
              surveyPackageId: "",
              emailSubject: "",
              messageBody: "",
              sendType: "now",
              plannedSendDate: "",
              // repeatedSurveys: data?.repeatedSurveys || "",
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
                    <FormLabel sx={LabelStyle} htmlFor="surveyPackage">
                      Select a Package{" "}
                      <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <Select
                      id="surveyPackage"
                      value={values.surveyPackageId}
                      onChange={(e) => {
                        setFieldValue("surveyPackageId", e.target.value);
                        const selectedPackage = surveyPackageData.find(
                          (item: any) =>
                            item?.surveyPackageId === e.target.value
                        );
                        if (selectedPackage) {
                          setFieldValue(
                            "emailSubject",
                            selectedPackage?.invitationSubject
                          );
                          setFieldValue(
                            "messageBody",
                            selectedPackage?.invitationBody
                          );
                        }
                      }}
                    >
                      {surveyPackageData?.length ? (
                        surveyPackageData.map((item: any, index: number) => (
                          <MenuItem
                            key={item.surveyPackageId}
                            value={item.surveyPackageId}
                          >
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
                      {touched?.surveyPackageId && errors?.surveyPackageId
                        ? (errors?.surveyPackageId as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  {/* <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="belongs-to">
                      Belongs to
                    </FormLabel>
                    <TextField
                      id="belongs-to"
                      {...getFieldProps("belongsTo")}
                      error={
                        touched?.belongsTo && errors?.belongsTo ? true : false
                      }
                      helperText={
                        touched?.belongsTo && errors?.belongsTo
                          ? errors?.belongsTo
                          : " "
                      }
                    />
                  </FormControl> */}
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
                          ? errors?.emailSubject
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
                          ? errors?.messageBody
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

                  {/* <FormControl sx={{ ...InputWrapper, mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: "#9CA3AF",
                          }}
                          checked={values.surveyLocked}
                          onChange={(e) => {
                            setFieldValue("surveyLocked", e.target.checked);
                          }}
                        />
                      }
                      label="Lock survey if finished"
                      sx={{ fontSize: "16px" }}
                    />
                  </FormControl> */}
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} id="send-type">
                      Send on date / schedule
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="send-type"
                      name="send-type"
                      value={values?.sendType}
                      onChange={(event) => {
                        setFieldValue("sendType", event.target.value);
                        setFieldValue("plannedSendDate", "");
                        // setFieldValue("repeatedSurveys", "");
                      }}
                    >
                      {dateSchedulerOptions.map((option) => (
                        <Box key={option.value}>
                          <FormControlLabel
                            value={option.value}
                            control={<Radio sx={{ color: "#9CA3AF" }} />}
                            disabled={!hasEmail}
                            label={
                              <Typography
                                fontSize={16}
                                fontWeight={500}
                                color="text.primary"
                              >
                                {option.label}
                              </Typography>
                            }
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                    {values?.sendType === "scheduled" && (
                      <>
                        <Box mt={2}>
                          <FormControl sx={InputWrapper}>
                            <FormLabel
                              sx={LabelStyle}
                              htmlFor="planned-send-date"
                            >
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
                          {/* <FormControl sx={InputWrapper}>
                            <FormLabel
                              sx={LabelStyle}
                              htmlFor="repeated-surveys"
                            >
                              Schedule repeated surveys
                            </FormLabel>
                            <Select
                              id="repeated-surveys"
                              value={values.repeatedSurveys}
                              onChange={(e) => {
                                setFieldValue(
                                  "repeatedSurveys",
                                  e.target.value
                                );
                              }}
                            >
                              {repeatedSurveyOptions.map((menuItem) => (
                                <MenuItem
                                  key={menuItem.label}
                                  value={menuItem.value}
                                >
                                  {menuItem.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText sx={{ color: "#d32f2f" }}>
                              {touched?.repeatedSurveys &&
                              errors?.repeatedSurveys
                                ? (errors?.repeatedSurveys as string)
                                : " "}
                            </FormHelperText>
                          </FormControl> */}
                        </Box>
                        {/* {values?.surveyPackageId &&
                          values?.repeatedSurveys?.length > 0 && (
                            <Table
                              sx={{
                                ...TableBorderRadiusTopLeftRight,
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>
                                    Survey Package Name
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Survey Order
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Survey send date
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values?.repeatedSurveys?.map(
                                  (row: any, index: number) => (
                                    <TableRow key={row?.id}>
                                      <StyledTableCell>
                                        {
                                          surveyPackageData.find(
                                            ({ surveyPackageId }: any) =>
                                              surveyPackageId ===
                                              values?.surveyPackageId
                                          ).name
                                        }
                                      </StyledTableCell>
                                      <StyledTableCell>{index}</StyledTableCell>
                                      <StyledTableCell>
                                        {row}
                                        {values?.plannedSendDate}
                                      </StyledTableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          )} */}
                      </>
                    )}
                    <FormHelperText
                      error={
                        touched?.sendType && errors?.sendType ? true : false
                      }
                    >
                      {touched?.sendType && errors?.sendType
                        ? (errors?.sendType as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  {!hasEmail && (
                    <Alert severity="warning">
                      The Participant has no email, hence emails wont be sent.
                    </Alert>
                  )}
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

export default NewSurveyModal;
