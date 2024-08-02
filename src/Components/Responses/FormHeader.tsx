import {
  Box,
  Button,
  CircularProgress,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "../../utils/hooks";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { resetResponseFormState } from "../../Redux/reducers/responseSlice";
import AddIcon from "@mui/icons-material/Add";
import { HeaderRightContent } from "../Common/styles/header";
import { MenuLabels } from "../../Redux/reducers/studySlice";

export const responsesHeader: SxProps = {
  bgcolor: "background.paper",
  p: 3,
  height: "80px",
};

type Props = {
  currentCategory: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  menuLabels: MenuLabels;
};

const FormHeader = ({ currentCategory, setShowModal, menuLabels }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, participantId } = useParams();
  const participantLabel = useQuery().get("participant");

  const {
    canSendSurveys,
    email,
    fieldSubmitting: isResponseSubmitting,
    isLoading: isResponseLoading,
    repeatedAttemptId: attemptId,
    surveyAssignmentId: surveyId,
  } = useAppSelector((state) => state.response);

  const clearRepeatingId = () => {
    if (isResponseSubmitting || isResponseLoading) return;

    dispatch(resetResponseFormState());
  };

  const handleBack = () => {
    if (isResponseSubmitting || isResponseLoading) return;

    navigate(-1);
  };
  const handleNavigate = () => {
    navigate(`/studies/${id}/responses/${participantId}/details`);
  };

  return (
    <Stack
      sx={responsesHeader}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={2}
    >
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <ChevronLeft
          onClick={handleBack}
          sx={{ cursor: "pointer" }}
          fontSize="large"
        />
        <Box>
          <Typography fontWeight={600} fontSize={"20px"}>
            Participant ID: {participantLabel ?? participantId}
          </Typography>
          {email && (
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight="regular"
            >
              {email}
            </Typography>
          )}
        </Box>
      </Stack>

      <Box sx={HeaderRightContent}>
        {isResponseSubmitting && <CircularProgress color="primary" size={24} />}
        {attemptId && (
          <Button
            variant="contained"
            onClick={clearRepeatingId}
            // sx={{ ml: "auto" }}
          >
            {`View All ${menuLabels?.repeating_data || "Repeating Data"}`}
          </Button>
        )}
        {currentCategory === "surveys" && canSendSurveys && !surveyId && (
          <Button
            variant="contained"
            onClick={() => {
              setShowModal(true);
            }}
            startIcon={<AddIcon />}
          >
            {`New ${menuLabels?.survey || "Survey"} Invitation`}
          </Button>
        )}
        {surveyId && (
          <Button
            variant="contained"
            onClick={clearRepeatingId}
            // sx={{ ml: "auto" }}
          >
            {`View All ${menuLabels?.survey || "Surveys"}`}
          </Button>
        )}

        <Button variant="outlined" onClick={handleNavigate}>
          View Details
        </Button>
      </Box>
    </Stack>
  );
};
export default FormHeader;
