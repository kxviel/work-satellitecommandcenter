import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Typography,
} from "@mui/material";

import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { ModalBaseStyles } from "../Common/styles/modal";

type Props = {
  showModal: boolean;
  closeModal: Function;
  logoutData: any;
};

const ForceLogoutModal = ({ showModal, closeModal, logoutData }: Props) => {
  const [buttonLoader, setButtonLoader] = useState(false);

  const forceLogout = async (data: any) => {
    try {
      setButtonLoader(true);
      const body = {
        email: data.email,
        password: data.password,
        strategy: "email",
      };
      let url = "/auth/force-logout";
      const res = await http.post(url, body);
      toastMessage("success", res.data.message);
      setButtonLoader(false);
      closeModal();
    } catch (err) {
      setButtonLoader(false);
      errorToastMessage(err as Error);
    }
  };

  return (
    <Modal open={showModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: 0 }}>
        <Typography variant="h2" mb={1}>
          Force Logout
        </Typography>
        <Divider />
        <Typography variant="subtitle2" mt={1.5}>
          This account is being used in an another device/browser. Do you want
          to force logout the other session?
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          {!buttonLoader ? (
            <>
              <Button onClick={() => closeModal()} variant="outlined">
                NO
              </Button>
              <Button
                onClick={() => forceLogout(logoutData)}
                variant="contained"
              >
                Yes
              </Button>
            </>
          ) : (
            <CircularProgress size={25} />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ForceLogoutModal;
