import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ModalBaseStyles } from "../Common/styles/modal";
import {
  ConfirmationModalProps,
  revertQuestionChange,
  setShowChangeConfirmModal,
} from "../../Redux/reducers/responseSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { updateResponse } from "../../Redux/actions/responseAction";

type Props = {
  data: ConfirmationModalProps;
};

const buttonResponsiveFont: SxProps = {
  fontSize: {
    xs: 14,
    md: 16,
  },
};

const ConfirmationModal = ({ data }: Props) => {
  const dispatch = useAppDispatch();

  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const closeModal = () => {
    dispatch(
      setShowChangeConfirmModal({
        show: false,
        varnames: [],
        questionId: "",
        details: [],
      })
    );
  };

  const handleCancel = () => {
    dispatch(revertQuestionChange({ id: data.questionId }));
    closeModal();
  };

  const handleContinue = () => {
    dispatch(
      updateResponse({
        studyId: data.studyId,
        questionId: data.questionId,
        surveySlug: data.surveySlug,
        isChangeConfirm: true,
        isClearResponseSelected: data.isClearResponseSelected,
        remarkValue: data.remarkValue,
      })
    );
  };

  return (
    <Modal open={data.show}>
      <Box
        sx={{ ...ModalBaseStyles, height: "fit-content", minHeight: "20vh" }}
      >
        <Typography
          variant="h5"
          fontWeight="medium"
          mb={1}
          sx={{ color: "#355962" }}
        >
          Please Confirm your changes
        </Typography>

        <Divider />

        <Typography
          mt={2}
          sx={{
            fontSize: 16,
          }}
        >
          If you choose to continue, it's going to clear the responses of the
          following questions. This is not reversible!
        </Typography>
        <Box mt={1}>
          {data?.details?.map((detail: any) => (
            <Box key={detail.varname} sx={{ display: "flex", mb: 1, mt: 1 }}>
              <Typography
                sx={{
                  fontSize: 16,
                  flexShrink: 0,
                  fontWeight: 500,
                }}
              >
                {detail.form},
              </Typography>
              &nbsp;
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  maxWidth: "50ch",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {detail.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"flex-end"}
          sx={{ marginTop: "auto" }}
          gap={1.5}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={buttonResponsiveFont}
            disabled={!!isFieldSubmitting}
          >
            Revert Changes
          </Button>

          <Button
            variant="contained"
            sx={buttonResponsiveFont}
            onClick={handleContinue}
            disabled={!!isFieldSubmitting}
          >
            {isFieldSubmitting ? (
              <CircularProgress color="inherit" size={18} />
            ) : (
              "Keep Changes"
            )}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
