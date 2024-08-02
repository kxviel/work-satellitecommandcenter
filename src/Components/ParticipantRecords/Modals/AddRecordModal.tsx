import { useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import isEmail from "validator/es/lib/isEmail";
import { setParticipantToggle } from "../../../Redux/reducers/participantsSlice";

let schema = yup.object().shape({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  email: yup
    .string()
    .trim()
    .test("is-valid", "*Please enter a valid Email ID.", (value) =>
      value ? isEmail(value) : true
    ),
  siteId: yup.string().required("Email is Required"),
});

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

type ConfirmProps = {
  show: boolean;
  onClose: () => void;
  onOk: () => void;
};

const ConfirmModal = ({ onOk, show, onClose }: ConfirmProps) => {
  const handleOk = () => {
    onClose();
    onOk();
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">
        Confirm Participant Email
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You are proceeding without entering Email for this participant.
          Continuing so, this participant will be not receiving survey emails
          and reminders. Do you want to proceed?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          No
        </Button>
        <Button variant="contained" onClick={handleOk} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddRecordModal = ({ showModal, closeModal }: Props) => {
  const [emailConfirmation, setEmailConfirmation] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const { id } = useParams();
  const { sitesList } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const submitHandler = async (values: any) => {
    try {
      if (!values.email && !emailConfirmation) {
        setShowEmail(true);
        return;
      }
      setSubmitLoader(true);
      let res: AxiosResponse;
      const body = {
        ...values,
        studyId: id,
      };
      if (!body.email) {
        delete body.email;
      }
      res = await http.post(`/participants`, body);

      toastMessage("success", res.data.message);
      closeModal();
      setSubmitLoader(false);
      dispatch(setParticipantToggle());
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <ModalHeader title="Create New Participant" onCloseClick={closeModal} />
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            siteId:
              sitesList?.length > 0
                ? sitesList?.find((site: any) => site.isMainSite)
                  ? sitesList?.find((site: any) => site.isMainSite === true)?.id
                  : sitesList?.[0]?.id
                : "",
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
            values,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="firstName">
                    First Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    id="first-name"
                    {...getFieldProps("firstName")}
                    error={
                      touched?.firstName && errors?.firstName ? true : false
                    }
                    helperText={
                      touched?.firstName && errors?.firstName
                        ? (errors?.firstName as string)
                        : " "
                    }
                    placeholder="First Name"
                  />
                </FormControl>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="lastName">
                    Last Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    id="last-name"
                    {...getFieldProps("lastName")}
                    error={touched?.lastName && errors?.lastName ? true : false}
                    helperText={
                      touched?.lastName && errors?.lastName
                        ? (errors?.lastName as string)
                        : " "
                    }
                    placeholder="Last Name"
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="email">
                    Participant Email
                  </FormLabel>
                  <TextField
                    fullWidth
                    id="email"
                    {...getFieldProps("email")}
                    error={touched?.email && errors?.email ? true : false}
                    helperText={
                      touched?.email && errors?.email
                        ? (errors?.email as string)
                        : " "
                    }
                    placeholder="Enter an email address"
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="email">
                    Site <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    value={values?.siteId}
                    onChange={(e) => setFieldValue(`siteId`, e.target.value)}
                  >
                    {sitesList?.map((site) => (
                      <MenuItem key={site.id} value={site.id}>
                        {site.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched?.siteId && errors?.siteId
                      ? (errors?.siteId as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
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
              {showEmail && (
                <ConfirmModal
                  show={showEmail}
                  onClose={() => setShowEmail(false)}
                  onOk={() => {
                    setEmailConfirmation(true);
                    handleSubmit();
                  }}
                />
              )}
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddRecordModal;
