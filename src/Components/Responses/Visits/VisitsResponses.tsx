import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { errorToastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import PhaseList from "../PhaseList";
import QuestionItemWrapper from "../QuestionItemWrapper";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { getFormData } from "../../../Redux/actions/responseAction";
import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import {
  setPhaseList,
  setResponseLoader,
  setSelectedPhase,
} from "../../../Redux/reducers/responseSlice";
import { VisitPhaseRoot } from "../../../types/VisitPhases.types";
import { PhasesList } from "../types";
import { handlePhaseStatus } from "../utils";
import { MenuLabels } from "../../../Redux/reducers/studySlice";
import { DateTime } from "luxon";

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

const VisitResponses = ({ menuLabels }: Props) => {
  const { id: studyId, participantId } = useParams();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const { selectedPhase, togglePhase } = useAppSelector(
    (state) => state.response
  );

  const fetchStudyPhases = useCallback(async () => {
    try {
      if (studyId && participantId) {
        setIsLoading(true);
        dispatch(setResponseLoader(true));
        let params: any = {
          participantId,
        };

        const { data } = await http.get<VisitPhaseRoot>(
          `/study/${studyId}/study-phase/participant`,
          { params }
        );

        if (data?.data.length === 0) {
          // Set Reducer Form Loading State to false
          dispatch(setResponseLoader(false));
          setIsLoading(false);
          return;
        }

        const phases: PhasesList[] = data?.data
          .map((phase) => {
            const phaseForms = phase.phaseForms
              .map((phaseForm) => ({
                position: phaseForm.position,
                id: phaseForm.form.id,
                name: phaseForm.form.name,
                attempt: phaseForm.form.formAttempts?.[0]?.id,
                status: phaseForm.form.formAttempts?.[0]?.status || "active",
                locked: phaseForm.form.formAttempts?.[0]?.isLocked || false,
                lockedBy: phaseForm.form.formAttempts?.[0]?.lockedBy
                  ? phaseForm.form.formAttempts?.[0]?.lockedBy?.firstName +
                    " " +
                    phaseForm.form.formAttempts?.[0]?.lockedBy?.lastName
                  : "",
                lockedAt: phaseForm.form.formAttempts?.[0]?.lockedAt
                  ? DateTime.fromISO(
                      phaseForm.form.formAttempts?.[0]?.lockedAt
                    ).toFormat("dd MMMM yyyy hh:mm a")
                  : "",
                phaseName: phase.name,
                phaseId: phase.id,
              }))
              .sort((a, b) => a.position - b.position);

            const phaseStatus = handlePhaseStatus(phaseForms);

            return {
              id: phase.id,
              name: phase.name,
              position: phase.position,
              phaseStatus: phaseStatus,
              phaseForms: phaseForms,
            };
          })
          .sort((a, b) => a.position - b.position);

        let selectedForm = null;
        if (phases.length > 0) {
          const formId = sessionStorage.getItem("response-visit-form");
          let selPhase = phases?.[0].id;

          if (formId) {
            phases.forEach((phase) => {
              const selForm = phase.phaseForms.find((pf) => pf.id === formId);
              if (selForm) {
                selPhase = phase.id;
                selectedForm = selForm;
              }
            });
          }
          if (selectedForm) {
            dispatch(getFormData({ studyId, selectedForm, participantId }));
          } else {
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
          }
          dispatch(setSelectedPhase({ phase: selPhase }));
        }

        dispatch(setPhaseList({ list: phases }));
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(setResponseLoader(false));
      setIsLoading(false);
      errorToastMessage(error as Error);
    }
  }, [studyId, participantId, dispatch, togglePhase]);

  useEffect(() => {
    fetchStudyPhases();
  }, [fetchStudyPhases]);

  return (
    <Stack direction={"row"} gap={2} sx={rootResponses}>
      {/* Phases and Forms */}
      <PhaseList
        isLoading={isLoading}
        selectedPhaseId={selectedPhase}
        currentTab={menuLabels?.visit || "Visits"}
      />

      {/* Question List */}
      <QuestionItemWrapper />
    </Stack>
  );
};
export default VisitResponses;
