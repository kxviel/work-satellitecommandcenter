import { Stack, SxProps } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../utils/http";
import { errorToastMessage } from "../../../utils/toast";
import { SurveyBySlugRoot } from "../../../types/SurveyBySlug.types";
import { PhasesList } from "../../Responses/types";
import { getFormData } from "../../../Redux/actions/responseAction";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  setPhaseList,
  setResponseLoader,
  setSelectedPhase,
} from "../../../Redux/reducers/responseSlice";
import PhaseList from "../../Responses/PhaseList";
import QuestionItemWrapper from "../../Responses/QuestionItemWrapper";
import { handlePhaseStatus } from "../../Responses/utils";
import { MenuLabels } from "../../../Redux/reducers/studySlice";

const rootResponses: SxProps = {
  width: "100%",
  height: "calc(100vh - 202px)",
  display: "flex",
  gap: 1,
  p: 1,
  overflow: "auto",
  position: "relative",
  alignItems: "flex-start",
};
type Props = {
  menuLabels: MenuLabels;
};

const AdminSurvey = ({ menuLabels }: Props) => {
  const { id: studyId, participantId } = useParams();
  const dispatch = useAppDispatch();

  const attemptId = useAppSelector(
    (state) => state.response.surveyAssignmentId
  );

  const [isLoading, setIsLoading] = useState(false);
  const { selectedPhase } = useAppSelector((state) => state.response);
  const [packageName, setPackageName] = useState("");

  const fetchStudyPhases = useCallback(async () => {
    try {
      setIsLoading(true);
      dispatch(setResponseLoader(true));
      if (attemptId && studyId && participantId) {
        const { data } = await http.get<SurveyBySlugRoot>(
          `/study/${studyId}/survey-responses/${attemptId}?participantId=${participantId}`
        );

        setPackageName(data?.data.package.name);

        if (data?.data.package.surveyLinks.length === 0) {
          // Set Reducer Form Loading State to false
          dispatch(setResponseLoader(false));
          setIsLoading(false);
          return;
        }

        let phases: PhasesList[] = [];

        data?.data.package.surveyLinks.forEach((link) => {
          if (link.phase) {
            const phaseForms = link.phase.phaseForms
              .map((phaseForm) => ({
                position: phaseForm.position,
                id: phaseForm.form.id,
                name: phaseForm.form.name,
                attempt: phaseForm.form.formAttempts?.[0]?.id,
                status: phaseForm.form.formAttempts?.[0]?.status || "active",
                phaseName: link.phase.name,
                phaseId: link.phase.id,
                locked: false,
                lockedBy: "",
                lockedAt: "",
              }))
              .sort((a, b) => a.position - b.position);

            const phaseStatus = handlePhaseStatus(phaseForms);

            phases.push({
              id: link.phase.id,
              name: link.phase.name,
              position: link.position,
              phaseForms,
              phaseStatus,
            });
          }
        });

        phases.sort((a, b) => a.position - b.position);

        if (phases.length === 0) {
          // Set Reducer Form Loading State to false
          dispatch(setResponseLoader(false));
          setIsLoading(false);
          return;
        }

        let selectedForm = null;
        if (phases.length > 0) {
          let selPhase = phases?.[0].id;

          phases.some((phase) => {
            const selForm = phase.phaseForms.find(
              (pf) => pf.status === "active" || pf.status === "inprogress"
            );
            if (selForm) {
              selPhase = phase.id;
              selectedForm = selForm;
            }
            return !!selForm;
          });
          if (!selectedForm) {
            selectedForm = phases?.[0]?.phaseForms?.[0];
          }

          if (selectedForm) {
            dispatch(getFormData({ studyId, selectedForm, participantId }));
          } else {
            dispatch(setResponseLoader(false));
          }

          dispatch(setSelectedPhase({ phase: selPhase }));
        }

        dispatch(setPhaseList({ list: phases }));
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      dispatch(setResponseLoader(false));
      errorToastMessage(error);
    }
  }, [dispatch, attemptId, studyId, participantId]);

  useEffect(() => {
    fetchStudyPhases();
  }, [fetchStudyPhases]);

  return (
    <Stack direction={"row"} gap={2} sx={rootResponses}>
      {/* Phases and Forms */}

      <PhaseList
        packageName={packageName}
        isLoading={isLoading}
        selectedPhaseId={selectedPhase}
        currentTab={menuLabels?.survey || "Surveys"}
      />

      {/* Question List */}
      <QuestionItemWrapper />
    </Stack>
  );
};

export default AdminSurvey;
