import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { useParams, useSearchParams } from "react-router-dom";
import { errorToastMessage, toastMessage } from "../../../utils/toast";

const ConfirmExclusion = ({
  showModal,
  closeModal,
  setShowError,
  refreshPage,
}: any) => {
  const [submitLoader, setSubmitLoader] = useState(false);

  const { id: studyId } = useParams();
  const { participantId } = useParams();
  const [searchParams] = useSearchParams();
  const participantNumber = searchParams.get("participant");

  const handleRandomize = async () => {
    try {
      setSubmitLoader(true);
      let url = `/participants/${participantId}/exclude`;

      const res: AxiosResponse = await http.post(url, {
        studyId,
      });

      setSubmitLoader(false);
      toastMessage("success", res?.data?.message);
      refreshPage();
      closeModal();
    } catch (err) {
      setSubmitLoader(false);
      if (setShowError) {
        setShowError(true);
      } else {
        errorToastMessage(err as Error);
      }
      closeModal();
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, width: "60%", minHeight: "20vh" }}>
        <ModalHeader
          title={`Confirm exclusion of the participant ${participantNumber}`}
          onCloseClick={closeModal}
        />
        <Typography fontSize="16px" fontWeight="500">
          Please confirm to exclude the participant {participantNumber} from the
          study. This cannot be undone.
        </Typography>
        <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
          {!submitLoader ? (
            <>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                onClick={handleRandomize}
              >
                Exclude
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

export default ConfirmExclusion;
