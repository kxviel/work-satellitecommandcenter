import { useCallback, useEffect, useState } from "react";
import { Stack, SxProps } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import PhaseList from "../PhaseList";
import { useParams } from "react-router-dom";
import http from "../../../utils/http";
import { getFormData } from "../../../Redux/actions/responseAction";
import { errorToastMessage } from "../../../utils/toast";
import QuestionItemWrapper from "../QuestionItemWrapper";
import {
  setPhaseList,
  setResponseLoader,
  setSelectedPhase,
} from "../../../Redux/reducers/responseSlice";
import { RepeatedDataPhaseRoot } from "../../../types/RepeatedDataPhases";
import { PhasesList } from "../types";
import { handlePhaseStatus } from "../utils";
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

const RepeatedFormWrapper = () => {
  const dispatch = useAppDispatch();
  const { id: studyId, participantId } = useParams();

  const repeatedAttemptId = useAppSelector(
    (state) => state.response.repeatedAttemptId
  );

  const [isLoading, setIsLoading] = useState(false);
  const { selectedPhase, togglePhase } = useAppSelector(
    (state) => state.response
  );

  const fetchStudyPhases = useCallback(async () => {
    try {
      if (studyId && participantId) {
        setIsLoading(true);
        dispatch(setResponseLoader(true));

        if (repeatedAttemptId) {
          const { data } = await http.get<RepeatedDataPhaseRoot>(
            `/study/${studyId}/repeated-responses/${repeatedAttemptId}?participantId=${participantId}`
          );

          const phaseForms =
            data?.data?.phase?.phaseForms
              .map((phaseForm) => ({
                position: phaseForm.position,
                id: phaseForm.form.id,
                name: phaseForm.form.name,
                attempt: phaseForm.form.formAttempts?.[0]?.id,
                status: phaseForm.form.formAttempts?.[0]?.status ?? "active",
                phaseName: data?.data?.phase?.name,
                phaseId: data?.data?.phase?.id,
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
              }))
              .sort((a, b) => a.position - b.position) || [];

          const phaseStatus = handlePhaseStatus(phaseForms);

          const phase: PhasesList = {
            id: data?.data?.phase?.id,
            name: data?.data?.name,
            position: 1,
            category: data?.data?.phase?.type,
            phaseStatus,
            phaseForms,
          };

          const formId = sessionStorage.getItem("response-repeated-form");
          const selectedForm =
            phaseForms.find((phaseForm) => phaseForm.id === formId) ||
            phaseForms[0];

          dispatch(setPhaseList({ list: [phase] }));
          dispatch(setSelectedPhase({ phase: phase.id }));
          if (phaseForms?.[0]) {
            dispatch(
              getFormData({
                studyId,
                selectedForm: { ...selectedForm },
                participantId,
              })
            );
          } else {
            dispatch(setResponseLoader(false));
          }
        } else {
          dispatch(setResponseLoader(false));
        }
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(setResponseLoader(false));
      errorToastMessage(error as Error);
      setIsLoading(false);
    }
  }, [studyId, participantId, repeatedAttemptId, dispatch, togglePhase]);

  useEffect(() => {
    fetchStudyPhases();
  }, [fetchStudyPhases]);

  return (
    <Stack direction={"row"} gap={2} sx={rootResponses}>
      {/* Phases and Forms */}
      <PhaseList
        isLoading={isLoading}
        selectedPhaseId={selectedPhase}
        currentTab={"Repeating Data"}
      />

      {/* Question List */}
      <QuestionItemWrapper />
    </Stack>
  );
};
export default RepeatedFormWrapper;
