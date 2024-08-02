import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Modal,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { useAppDispatch } from "../../../Redux/hooks";
import { setStateToggle } from "../../../Redux/reducers/userSlice";

type Props = {
  data: any;
  showModal: boolean;
  closeModal: () => void;
  studyId: any;
  refreshPage: () => void;
};

let schema = yup.object().shape({
  defaultLabel: yup.string().optional(),
  displayLabel: yup.string().required("Display Label is Required"),
});

const MenuLabelModal = ({
  data,
  showModal,
  closeModal,
  studyId,
  refreshPage,
}: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const dispatch = useAppDispatch();
  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        studyId: studyId,
        key: values?.defaultLabel,
        label: values?.displayLabel,
      };
      let res: AxiosResponse;
      res = await http.post(`/ui/menu-labels`, body);
      toastMessage("success", res?.data?.message);
      closeModal();
      setSubmitLoader(false);
      refreshPage();
      dispatch(setStateToggle());
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <ModalHeader
          title={data?.id ? "Edit Label" : "Add Label"}
          onCloseClick={closeModal}
        />
        <Formik
          initialValues={{
            defaultLabel: data?.key || "",
            displayLabel: data?.label || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ errors, touched, getFieldProps }) => (
            <Form>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="default-label">
                  Default Label
                </FormLabel>
                <TextField
                  id="default-label"
                  placeholder="Default Label"
                  inputProps={{ readOnly: true }}
                  {...getFieldProps("defaultLabel")}
                  error={
                    touched?.defaultLabel && errors?.defaultLabel ? true : false
                  }
                  helperText={
                    touched?.defaultLabel && errors?.defaultLabel
                      ? (errors?.defaultLabel as string)
                      : " "
                  }
                />
              </FormControl>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="display-label">
                  Display Label <span style={{ color: "#f16262" }}>*</span>
                </FormLabel>
                <TextField
                  id="display-label"
                  placeholder="Display Label"
                  {...getFieldProps("displayLabel")}
                  error={
                    touched?.displayLabel && errors?.displayLabel ? true : false
                  }
                  helperText={
                    touched?.displayLabel && errors?.displayLabel
                      ? (errors?.displayLabel as string)
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

export default MenuLabelModal;
