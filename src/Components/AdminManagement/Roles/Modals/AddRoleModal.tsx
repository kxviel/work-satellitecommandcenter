import { useState } from "react";
import { AxiosResponse } from "axios";
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
import { Formik } from "formik";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../../Common/styles/modal";
import { errorToastMessage, toastMessage } from "../../../../utils/toast";
import { LabelStyle } from "../../../Common/styles/form";
import http from "../../../../utils/http";
import { useParams } from "react-router-dom";

let schema = yup.object().shape({
  label: yup.string().required("Role Name is Required"),
});

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: any;
  refreshPage: () => void;
};

const AddRoleModal = ({ showModal, closeModal, data, refreshPage }: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const { id } = useParams();
  const { type } = useParams();
  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        ...values,
        studyId: id,
        type: type,
      };
      let res: AxiosResponse;
      if (data?.id) {
        res = await http.patch(`/roles/${data.id}`, body);
      } else {
        res = await http.post(`/roles`, body);
      }
      toastMessage("success", res.data.message);
      closeModal();
      refreshPage();
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader
          title={data?.id ? "Edit Role" : "Add Role"}
          onCloseClick={closeModal}
        />

        <Formik
          initialValues={{
            label: data?.label || "",
            // description: data?.description || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ handleSubmit, getFieldProps, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={LabelStyle} htmlFor="name">
                    Name <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    id="name"
                    {...getFieldProps("label")}
                    error={touched?.label && errors?.label ? true : false}
                    helperText={
                      touched?.label && errors?.label
                        ? (errors?.label as string)
                        : " "
                    }
                  />
                </FormControl>
              </Box>
              {/* <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={LabelStyle} htmlFor="description">
                    Description
                  </FormLabel>
                  <TextField
                    id="description"
                    multiline
                    fullWidth
                    minRows={4}
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
              </Box> */}

              <Box sx={ModalActionButtonStyles}>
                {!submitLoader ? (
                  <>
                    <Button onClick={closeModal} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {data?.id ? "Edit" : "Add"} Role
                    </Button>
                  </>
                ) : (
                  <CircularProgress size={25} />
                )}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddRoleModal;
