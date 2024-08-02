import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PhaseListForms } from "../types";
import { ModalBaseStyles } from "../../Common/styles/modal";
import { useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { togglePhaseLoader } from "../../../Redux/reducers/responseSlice";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";

type Props = {
  show: boolean;
  onClose: () => void;
  form: PhaseListForms;
};

const LockModal: React.FC<Props> = ({ form, onClose, show }) => {
  const dispatch = useAppDispatch();
  const { id: studyId, participantId } = useParams();
  const { repeatedAttemptId } = useAppSelector((state) => state.response);
  const [isLoading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    onClose();
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const handleContinue = async () => {
    try {
      if (form.locked && !reason.trim()) {
        toastMessage("warning", "Reason cannot be empty!");
        return;
      }
      setLoading(true);
      await http.post(
        `/study/${studyId}/responses/${form?.id}/lock?participantId=${participantId}`,
        {
          lock: form.locked ? false : true,
          reason: form.locked ? reason : undefined,
          repeatedAttemptId: repeatedAttemptId || undefined,
        }
      );

      toastMessage(
        "success",
        form.locked ? "Form unlocked successfully" : "Form locked successfully"
      );
      onClose();
      dispatch(togglePhaseLoader());
    } catch (err) {
      errorToastMessage(err as Error);
      setLoading(false);
    }
  };

  return (
    <Modal open={show}>
      <Box
        sx={{ ...ModalBaseStyles, height: "fit-content", minHeight: "20vh" }}
      >
        <Typography
          variant="h5"
          fontWeight="medium"
          mb={1}
          sx={{ color: "#355962" }}
        >
          {form.locked ? "Unlock Form" : "Lock Form"}
        </Typography>

        <Divider />

        <Typography
          mt={2}
          sx={{
            fontSize: 16,
          }}
        >
          Are you sure you want to {form.locked ? "unlock" : "lock"} this form?
        </Typography>

        {form.locked && (
          <Stack gap={1} marginY={2}>
            <Typography variant="subtitle1" fontWeight="medium">
              Reason for unlocking the form
            </Typography>
            <TextField
              name="reason"
              fullWidth
              placeholder="Enter reason"
              value={reason}
              onChange={changeHandler}
            />
          </Stack>
        )}

        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"flex-end"}
          sx={{ marginTop: "auto" }}
          gap={1.5}
        >
          {isLoading ? (
            <CircularProgress color="inherit" size={18} />
          ) : (
            <>
              <Button variant="outlined" onClick={handleCancel}>
                No
              </Button>

              <Button variant="contained" onClick={handleContinue}>
                Yes
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default LockModal;
