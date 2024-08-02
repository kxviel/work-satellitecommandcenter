import { useState } from "react";
import { Box, Button, CircularProgress, Divider, Modal } from "@mui/material";
import {
  ModalTabPanel,
  StyledTab,
  StyledTabs,
  a11yProps,
} from "../Common/UI/TabPanel";
import General from "./Modals/General";
import {
  CustomModalHeader,
  ModalActionButtonStyles,
  ModalBaseStyles,
} from "../Common/styles/modal";
import Invitation from "./Modals/Invitation";
// import Schedulers from "./Modals/Schedulers";
import Reminders from "./Modals/Reminders";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { Form, Formik } from "formik";
import * as yup from "yup";

let schema = yup.object().shape({
  name: yup.string().required("Package Name is Required"),
  introText: yup.string().optional(),
  outroText: yup.string().optional(),
  remarks: yup.string().optional(),
  invitationSubject: yup.string().required("Email Subject is Required"),
  invitationBody: yup.string().required("Message Body is Required"),
  isReminder: yup.boolean().optional(),
  reminderPattern: yup.string().when("isReminder", ([isReminder], schema) => {
    return isReminder === true
      ? schema.required("Reminder Pattern is required")
      : schema.optional();
  }),
  emailSubject: yup.string().when("isReminder", ([isReminder], schema) => {
    return isReminder === true
      ? schema.required("Email Subject is required")
      : schema.optional();
  }),
  emailBody: yup.string().when("isReminder", ([isReminder], schema) => {
    return isReminder === true
      ? schema.required("Message Body is required")
      : schema.optional();
  }),
  // scheduleName: yup.string().optional(),
  // sendingPattern: yup.string().optional(),
});
const SurveyPackageModal = ({
  showModal,
  closeModal,
  data,
  studyId,
  refreshPage,
  menuLabels,
}: any) => {
  const [type, setType] = useState<string>("general");
  const [submitLoader, setSubmitLoader] = useState(false);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body: any = {
        name: values?.name,
        introText: values?.introText,
        outroText: values?.outroText,
        remarks: values?.remarks,
        invitationSubject: values?.invitationSubject,
        invitationBody: values?.invitationBody,
        reminder: values?.isReminder
          ? {
              reminderPattern: values?.reminderPattern,
              emailSubject: values?.emailSubject,
              emailBody: values?.emailBody,
            }
          : null,
      };
      let res: AxiosResponse;
      if (data?.id) {
        res = await http.patch(
          `/study/${studyId}/survey-package/${data?.id}`,
          body
        );
      } else {
        res = await http.post(`/study/${studyId}/survey-package`, body);
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

  const handleTabChange = (_1: any, val: string) => {
    setType(val);
  };
  const tabIndicatorColor = (type: string, errors: any, touched: any) => {
    let indicatorColor = "primary.main";
    if (type === "general") {
      indicatorColor =
        errors?.name && touched?.name ? "error.main" : "primary.main";
    } else if (type === "invitation") {
      indicatorColor =
        (errors?.invitationSubject && touched?.invitationSubject) ||
        (errors?.invitationBody && touched?.invitationBody)
          ? "error.main"
          : "primary.main";
    } else if (type === "reminders") {
      indicatorColor =
        (errors?.reminderPattern && touched?.reminderPattern) ||
        (errors?.emailSubject && touched?.emailSubject) ||
        (errors?.emailBody && touched?.emailBody)
          ? "error.main"
          : "primary.main";
    }
    return indicatorColor;
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <CustomModalHeader
          title={
            data?.id
              ? `Edit ${menuLabels?.survey_package || "Survey Package"}`
              : `Add ${menuLabels?.survey_package || "Survey Package"}`
          }
          onCloseClick={closeModal}
        />
        <Divider sx={{ mt: 1 }} />
        <Formik
          initialValues={{
            name: data?.name || "",
            introText: data?.introText || "",
            outroText: data?.outroText || "",
            remarks: data?.remarks || "",
            invitationSubject: data?.invitationSubject || "",
            invitationBody: data?.invitationBody || "",
            isReminder: data?.isReminder || false,
            reminderPattern: data?.surveyReminder?.reminderPattern || "",
            emailSubject: data?.surveyReminder?.emailSubject || "",
            emailBody: data?.surveyReminder?.emailBody || "",
            // scheduleName: data?.scheduleName || "",
            // sendingPattern: data?.sendingPattern || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ getFieldProps, errors, touched, setFieldValue, values }) => (
            <Form>
              <Box
                sx={{ borderBottom: 1, mb: 1, borderBottomColor: "#E5E7EB" }}
              >
                <StyledTabs
                  value={type}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTabs-indicatorSpan": {
                      backgroundColor: tabIndicatorColor(type, errors, touched),
                    },
                  }}
                >
                  <StyledTab
                    label="General"
                    value="general"
                    {...a11yProps(0)}
                    sx={{
                      color:
                        errors?.name && touched?.name
                          ? "error.main"
                          : "primary.main",
                      "&.Mui-selected": {
                        color:
                          errors?.name && touched?.name
                            ? "error.main"
                            : "primary.main",
                      },
                    }}
                  />
                  <StyledTab
                    label="Invitation"
                    value="invitation"
                    {...a11yProps(1)}
                    sx={{
                      color:
                        (errors?.invitationSubject &&
                          touched?.invitationSubject) ||
                        (errors?.invitationBody && touched?.invitationBody)
                          ? "error.main"
                          : "primary.main",
                      "&.Mui-selected": {
                        color:
                          (errors?.invitationSubject &&
                            touched?.invitationSubject) ||
                          (errors?.invitationBody && touched?.invitationBody)
                            ? "error.main"
                            : "primary.main",
                      },
                    }}
                  />
                  <StyledTab
                    label="Reminders"
                    value="reminders"
                    {...a11yProps(2)}
                    sx={{
                      color:
                        (errors?.reminderPattern && touched?.reminderPattern) ||
                        (errors?.emailSubject && touched?.emailSubject) ||
                        (errors?.emailBody && touched?.emailBody)
                          ? "error.main"
                          : "primary.main",
                      "&.Mui-selected": {
                        color:
                          (errors?.reminderPattern &&
                            touched?.reminderPattern) ||
                          (errors?.emailSubject && touched?.emailSubject) ||
                          (errors?.emailBody && touched?.emailBody)
                            ? "error.main"
                            : "primary.main",
                      },
                    }}
                  />
                  {/* <StyledTab
                    label="Schedulers"
                    value="schedulers"
                    {...a11yProps(3)}
                  /> */}
                </StyledTabs>
              </Box>
              <ModalTabPanel value={type} index={"general"}>
                <General
                  errors={errors}
                  touched={touched}
                  getFieldProps={getFieldProps}
                />
              </ModalTabPanel>
              <ModalTabPanel value={type} index={"invitation"}>
                <Invitation
                  errors={errors}
                  touched={touched}
                  getFieldProps={getFieldProps}
                />
              </ModalTabPanel>
              <ModalTabPanel value={type} index={"reminders"}>
                <Reminders
                  errors={errors}
                  touched={touched}
                  getFieldProps={getFieldProps}
                  setFieldValue={setFieldValue}
                  values={values}
                  menuLabels={menuLabels}
                />
              </ModalTabPanel>
              {/* <ModalTabPanel value={type} index={"schedulers"}>
                <Schedulers
                  // data={scheduleData}
                  errors={errors}
                  touched={touched}
                  getFieldProps={getFieldProps}
                  setFieldValue={setFieldValue}
                  values={values}
                />
              </ModalTabPanel> */}
              <Box sx={ModalActionButtonStyles}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {data?.id ? "Save" : "Add"}
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

export default SurveyPackageModal;
