import {
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { ModalBaseStyles } from "../Common/styles/modal";
import { QuestionSlice } from "../../Redux/reducers/responseSlice";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../Redux/actions/responseAction";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  question: QuestionSlice;
};

const buttonResponsiveFont: SxProps = {
  fontSize: {
    xs: 14,
    md: 16,
  },
};

const RemarkModal = ({ showModal, closeModal, question }: Props) => {
  const dispatch = useAppDispatch();
  const { id: studyId, surveySlug } = useParams();
  const editable = useAppSelector((state) => state.response.formEditable);
  const [remarkValue, setRemarkValue] = useState("");

  useEffect(() => {
    if (question?.responses?.[0]?.remarkValue) {
      setRemarkValue(question?.responses[0].remarkValue);
    }
  }, [question.responses, showModal]);

  const handleSave = () => {
    if (question?.id && remarkValue) {
      dispatch(
        updateResponse({
          studyId,
          questionId: question.id,
          remarkValue,
          surveySlug,
        })
      );
      closeModal();
    }
  };

  const handleClearSave = () => {
    if (question?.id) {
      dispatch(
        updateResponse({
          studyId,
          questionId: question.id,
          remarkValue: "",
          surveySlug,
        })
      );

      closeModal();
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <Typography
          variant="h5"
          fontWeight="medium"
          mb={1}
          sx={{ color: "#355962" }}
        >
          {editable ? "Add" : "View"} Remarks
        </Typography>

        <Divider />

        <Stack gap={1} marginY={2}>
          <Typography variant="subtitle1" fontWeight="medium">
            {question.properties?.remarkText}
          </Typography>
          <TextField
            name="remarkValue"
            fullWidth
            multiline
            rows={3}
            placeholder="Add Remark"
            value={remarkValue || ""}
            onChange={(e) => setRemarkValue(e.target.value)}
            InputProps={{ readOnly: !editable }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"flex-end"}
          sx={{ marginTop: "auto" }}
          gap={1.5}
        >
          <Button
            variant="outlined"
            onClick={closeModal}
            sx={buttonResponsiveFont}
          >
            {editable ? "Cancel" : "Close"}
          </Button>
          {editable && question?.responses?.[0]?.remarkValue && (
            <Button
              variant="contained"
              sx={buttonResponsiveFont}
              onClick={handleClearSave}
            >
              Clear
            </Button>
          )}
          {editable && (
            <Button
              variant="contained"
              sx={buttonResponsiveFont}
              onClick={handleSave}
            >
              Save
            </Button>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default RemarkModal;
