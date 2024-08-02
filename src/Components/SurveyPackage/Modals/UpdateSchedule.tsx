import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";

let schema = yup.object().shape({
  scheduleName: yup.string().optional(),
  sendingPattern: yup.string().optional(),
});
const UpdateSchedule = ({ data, showModal, closeModal, refreshPage }: any) => {
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        scheduleName: values?.scheduleName,
        sendingPattern: values?.sendingPattern,
      };
      let res: AxiosResponse;
      res = await http.patch(`/survey-package/${data?.id}`, body);
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
        <ModalHeader title={"Edit Schedule"} onCloseClick={closeModal} />
        <Formik
          initialValues={{
            scheduleName: data?.scheduleName || "",
            sendingPattern: data?.sendingPattern || "",
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
                  <FormLabel sx={LabelStyle} htmlFor="schedule-name">
                    Schedule Name
                  </FormLabel>
                  <TextField
                    placeholder="Schedule Name"
                    id="schedule-name"
                    {...getFieldProps("scheduleName")}
                    error={
                      touched?.scheduleName && errors?.scheduleName
                        ? true
                        : false
                    }
                    helperText={
                      touched?.scheduleName && errors?.scheduleName
                        ? (errors?.scheduleName as string)
                        : " "
                    }
                  />
                </FormControl>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="sending-pattern">
                    Sending Pattern
                  </FormLabel>
                  <TextField
                    placeholder="Sending Pattern"
                    id="sending-pattern"
                    {...getFieldProps("sendingPattern")}
                    error={
                      touched?.sendingPattern && errors?.sendingPattern
                        ? true
                        : false
                    }
                    helperText={
                      touched?.sendingPattern && errors?.sendingPattern
                        ? (errors?.sendingPattern as string)
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
                      Update
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

export default UpdateSchedule;
