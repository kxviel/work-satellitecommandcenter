import { Box, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useEffect, useState } from "react";
import {
  canNavigateForm,
  getFormData,
} from "../../../Redux/actions/responseAction";
import { useNavigate, useParams } from "react-router-dom";
import { toastMessage } from "../../../utils/toast";
import { setSelectedPhase } from "../../../Redux/reducers/responseSlice";

const SurveyActions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { surveySlug } = useParams();
  const [showFinish, setFinish] = useState(false);
  const [disablePrevious, setPrevious] = useState(false);
  const { phaseList, selectedForm } = useAppSelector((state) => state.response);

  useEffect(() => {
    if (phaseList && selectedForm) {
      const phase = phaseList.find((p) => p.id === selectedForm.phaseId);
      if (phase?.position === 1 && selectedForm.position === 1) {
        setPrevious(true);
      } else {
        setPrevious(false);
      }
      if (
        phase?.position === phaseList.length &&
        selectedForm.position === phase?.phaseForms.length
      ) {
        setFinish(true);
      } else {
        setFinish(false);
      }
    }
  }, [phaseList, selectedForm]);

  const handlePrevious = () => {
    if (phaseList && selectedForm) {
      const phase = phaseList.find((p) => p.id === selectedForm.phaseId);
      let form;
      if (phase && selectedForm.position === 1) {
        const newPhase = phaseList.find(
          (p) => p.position === phase.position - 1
        );
        form = newPhase?.phaseForms?.[newPhase?.phaseForms?.length - 1];
      } else if (phase) {
        form = phase.phaseForms.find(
          (f) => f.position === selectedForm.position - 1
        );
      }
      if (form) {
        dispatch(
          getFormData({
            selectedForm: form,
            surveySlug,
          })
        );
        dispatch(setSelectedPhase({ phase: form.phaseId }));
      }
    }
  };

  const handleNext = () => {
    const canNavigate = dispatch(canNavigateForm());
    if (!canNavigate) {
      if (showFinish) {
        toastMessage(
          "warning",
          "Please complete all the required questions before finishing the survey"
        );
      } else {
        toastMessage(
          "warning",
          "Please complete all the required questions before moving to next form"
        );
      }
      return;
    }
    if (showFinish) {
      navigate(`/surveys/${surveySlug}/thank-you`);
    } else {
      if (phaseList && selectedForm) {
        const phase = phaseList.find((p) => p.id === selectedForm.phaseId);
        let form;
        if (phase && selectedForm.position === phase.phaseForms.length) {
          const newPhase = phaseList.find(
            (p) => p.position === phase.position + 1
          );
          form = newPhase?.phaseForms?.[0];
        } else if (phase) {
          form = phase.phaseForms.find(
            (f) => f.position === selectedForm.position + 1
          );
        }
        if (form) {
          dispatch(
            getFormData({
              selectedForm: form,
              surveySlug,
            })
          );
          dispatch(setSelectedPhase({ phase: form.phaseId }));
        }
      }
    }
  };

  return (
    <Box mt={2}>
      <Button
        variant="contained"
        sx={{ mr: 2 }}
        disabled={disablePrevious}
        onClick={handlePrevious}
      >
        Previous
      </Button>
      <Button variant="contained" onClick={handleNext}>
        {showFinish ? "Finish" : "Next"}
      </Button>
    </Box>
  );
};

export default SurveyActions;
