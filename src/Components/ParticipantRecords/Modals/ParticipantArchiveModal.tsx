import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { useAppDispatch } from "../../../Redux/hooks";
import { setParticipantToggle } from "../../../Redux/reducers/participantsSlice";

type Props = {
  openModal: boolean;
  participantId: string;
  closeModal: () => void;
};

const ParticipantArchiveModal = ({
  openModal,
  participantId,
  closeModal,
}: Props) => {
  const { id } = useParams();
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const changeReasonHandler = (event: any) => {
    setReason(event.target.value);
  };
  const dispatch = useAppDispatch();
  const submitHandler = async () => {
    try {
      if (!reason.trim()) {
        toastMessage("warning", "Reason cannot be empty!");
        return;
      }
      setSubmitLoader(true);
      const body = {
        studyId: id,
        reason: reason,
      };
      let res: AxiosResponse = await http.post(
        `/participants/${participantId}/archive`,
        body
      );
      toastMessage("success", res.data.message);
      closeModal();
      dispatch(setParticipantToggle());
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <ModalHeader title="Archive participant" onCloseClick={closeModal} />
        <Typography sx={{ ...LabelStyle, mb: 3 }}>
          Are you sure you want to archive this participant? If so, please
          supply a reason.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={InputWrapper}>
            <FormLabel sx={LabelStyle} htmlFor="reason">
              Reason <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              id="reason"
              multiline
              fullWidth
              onChange={changeReasonHandler}
            />
          </FormControl>
        </Box>
        <Box sx={ModalActionButtonStyles}>
          {!submitLoader ? (
            <>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" onClick={submitHandler}>
                Save
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

export default ParticipantArchiveModal;
