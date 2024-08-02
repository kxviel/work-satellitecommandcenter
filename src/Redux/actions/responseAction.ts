import {
  checkIfDirty,
  createResponseSkeleton,
  updateResponseSkeleton,
  santizeResponsesMiddleware,
  SanitizedRequest,
  handleExternalVariables,
} from "../../Components/Responses/utils";
import { FormDataRoot, FormDataObject } from "../../types/FormData.types";
import { ParticipantByIdRoot } from "../../types/ParticipantById.types";
import {
  UpdateResponseData,
  UpdateResponseRoot,
} from "../../types/UpdateResponse.types";
import { permissions } from "../../utils/roles";
import { errorToastMessage } from "../../utils/toast";
import {
  ExternalResponsesDict,
  QuestionSlice,
  handleFieldUpdate,
  handleFormStatus,
  popCalcFields,
  setCalcFields,
  setEmailSubjectId,
  setExternalResponses,
  setNotSaved,
  setParticipantId,
  setQueries,
  setQuestionsList,
  setResPermissions,
  setResponseFormEditable,
  setResponseIsEditable,
  setResponseLoader,
  setResponsePermission,
  setResponseSubmitting,
  setSelectedForm,
  setShowChangeConfirmModal,
  setSiteId,
  setSummaryExternalResponses,
} from "../reducers/responseSlice";
import { AppThunk } from "../store";
import http from "../../utils/http";
import httpSurvey from "../../utils/httpSurvey";
import {
  choice_types,
  textTypes,
} from "../../Components/QuestionBuilder/questionTypes";

export const fetchParticipantById =
  (studyId: string, participantId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setResponsePermission(true));
      const sitePermissions = getState().user.sitePermissions;

      const params = {
        studyId,
      };
      const { data } = await http.get<ParticipantByIdRoot>(
        `/participants/${participantId}`,
        { params }
      );
      const isLocked = data.data.isLocked;
      const isArchived = data.data.isArchived;
      const isExcluded = data.data.eligibilityStatus === "excluded";
      const siteId = data.data.site.id;
      const subjectId = data?.data?.formattedSubjectId;
      const email = data?.data?.email;
      const hasEmail = data?.data?.hasEmail;
      const canEditVisits =
        sitePermissions?.[siteId]?.permissions?.includes(
          permissions.editParticipant
        ) &&
        !isLocked &&
        !isArchived &&
        !isExcluded;
      const canEditSurveys =
        sitePermissions?.[siteId]?.permissions?.includes(
          permissions.editSurveyResponse
        ) &&
        !isLocked &&
        !isArchived &&
        !isExcluded;
      const editable =
        sessionStorage?.getItem("response-view") === "surveys"
          ? canEditSurveys
          : canEditVisits;
      const canRandomize =
        sitePermissions?.[siteId]?.permissions?.includes(
          permissions.canAllocateRandomization
        ) &&
        !isLocked &&
        !isArchived &&
        !isExcluded;
      const canLock =
        sitePermissions?.[siteId]?.permissions?.includes(
          permissions.recordLockUnlock
        ) &&
        !isLocked &&
        !isArchived &&
        !isExcluded;
      const viewRandomization = sitePermissions?.[
        siteId
      ]?.permissions?.includes(permissions.canViewRandomization);
      const canAmendQueries =
        sitePermissions?.[siteId]?.permissions?.includes(
          permissions.amendQueries
        ) &&
        !isLocked &&
        !isArchived &&
        !isExcluded;
      const canSendSurveys =
        sitePermissions?.[siteId]?.permissions?.includes(
          permissions.sendSurveys
        ) &&
        !isLocked &&
        !isArchived &&
        !isExcluded;
      dispatch(setSiteId(siteId));
      dispatch(setParticipantId(participantId));
      dispatch(setEmailSubjectId({ email, subjectId }));

      dispatch(
        setResPermissions({
          canAmendQueries,
          canRandomize,
          canSendSurveys,
          viewRandomization,
          editable,
          canEditSurveys,
          canEditVisits,
          isExcluded,
          isLocked,
          isArchived,
          hasEmail,
          canLock,
        })
      );
      dispatch(setResponsePermission(false));
    } catch (err) {
      dispatch(setResponsePermission(false));
      errorToastMessage(err as Error);
    }
  };

type GetFormDataProps = {
  selectedForm: any;
  participantId?: string;
  studyId?: string;
  surveySlug?: string;
};

export const computeEditablePermission =
  (tab: string): AppThunk =>
  async (dispatch, getState) => {
    const { canEditSurveys, canEditVisits } = getState().response;
    if (tab === "surveys") {
      dispatch(setResponseIsEditable(canEditSurveys));
    } else {
      dispatch(setResponseIsEditable(canEditVisits));
    }
  };

export const getFormData =
  ({
    selectedForm,
    studyId,
    participantId,
    surveySlug,
  }: GetFormDataProps): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setResponseLoader(true));
      const {
        repeatedAttemptId,
        editable: isEditable,
        surveyAssignmentId,
      } = getState().response;
      const formId = selectedForm?.id;
      let responseData = {} as FormDataObject;
      let queries: any = {};
      let params: any = { participantId };

      const editable = isEditable && !selectedForm.locked;
      dispatch(setResponseFormEditable(editable));

      sessionStorage.setItem(
        repeatedAttemptId ? "response-repeated-form" : "response-visit-form",
        formId
      );

      if (surveySlug && formId) {
        // dispatch(setResponseIsEditable(true));

        const { data } = await httpSurvey.get<any>(
          `/survey/${surveySlug}/${formId}`
        );

        responseData = data.data;
      } else if (repeatedAttemptId && formId && studyId) {
        params.repeatedAttemptId = repeatedAttemptId;
        const { data } = await http.get<FormDataRoot>(
          `/study/${studyId}/repeated-responses/get/${formId}`,
          { params }
        );
        responseData = data.data;

        const queryResponse = await http.get(
          `/study/${studyId}/queries/${repeatedAttemptId}/repeating-data`,
          {
            params: {
              ...params,
              attemptId: repeatedAttemptId,
              formId,
            },
          }
        );
        queries = formatQueries(queryResponse.data.data);
      } else if (surveyAssignmentId && formId && studyId) {
        params.surveyAssignmentId = surveyAssignmentId;
        const { data } = await http.get<FormDataRoot>(
          `/study/${studyId}/survey-responses/get/${formId}`,
          { params }
        );
        responseData = data.data;
      } else if (formId && studyId) {
        const { data } = await http.get<FormDataRoot>(
          `/study/${studyId}/responses/${formId}`,
          { params }
        );
        responseData = data.data;

        const queryResponse = await http.get(`/study/${studyId}/queries/form`, {
          params: { ...params, formId },
        });

        queries = formatQueries(queryResponse.data.data);
      }

      // Combine Responses with Questions
      let questions = createResponseSkeleton(responseData);

      // Sort Questions
      questions = questions?.slice().sort((a, b) => a.position - b.position);

      const varnames: any = {};

      // Sort Choices
      questions = questions.map((q) => {
        varnames[q.varname] = 1;
        if (editable) {
          if (q.type === "calculated_field") {
            const regex = /\{(.*?)\}/g;
            const matches = q.calculationTemplate.match(regex);
            if (matches) {
              q.calculationVars = Array.from(
                new Set([...matches.map((val: string) => val.slice(1, -1))])
              );
            }
          }
        }
        if (q.type === "summary") {
          const regex = /\{(.*?)\}/g;
          const matches = q.label.match(regex);
          if (matches) {
            q.summaryVars = Array.from(
              new Set([...matches.map((val: string) => val.slice(1, -1))])
            );
          }
        }
        if (q.choices) {
          q.choices = q.choices.sort((a, b) => a.position - b.position);
        }
        return {
          ...q,
        };
      });

      const calcFieldsQuestions = questions.filter(
        (q) => q.type === "calculated_field"
      );

      const summaryQuestions = questions.filter((q) => q.type === "summary");

      questions = questions.map((question) => {
        summaryQuestions.forEach((q2) => {
          if (q2.summaryVars?.includes(question.varname)) {
            if (question.summaryOperands) {
              question.summaryOperands.push(q2.id);
            } else {
              question.summaryOperands = [q2.id];
            }
          }
        });

        if (editable) {
          calcFieldsQuestions.forEach((q2) => {
            if (q2.calculationVars?.includes(question.varname)) {
              if (question.calculationOperands) {
                question.calculationOperands.push(q2.id);
              } else {
                question.calculationOperands = [q2.id];
              }
            }
          });
        }

        return {
          ...question,
        };
      });

      if (editable) {
        let finalExternalVarnames: string[] = [];
        calcFieldsQuestions.forEach((q) => {
          if (q.calculationVars) {
            q.calculationVars.forEach((v) => {
              if (!varnames[v]) {
                finalExternalVarnames.push(v);
              }
            });
          }
        });

        finalExternalVarnames = Array.from(new Set([...finalExternalVarnames]));

        let externalResponses = {} as ExternalResponsesDict;
        if (finalExternalVarnames.length > 0) {
          externalResponses = await handleExternalVariables(
            finalExternalVarnames,
            participantId,
            surveySlug,
            studyId,
            formId,
            repeatedAttemptId,
            surveyAssignmentId
          );
        }
        // Push Dependency Ids to External Responses
        Object.keys(externalResponses).forEach((varname) => {
          calcFieldsQuestions.forEach((q) => {
            if (q.calculationVars?.includes(varname)) {
              const currObject = externalResponses[varname];

              if (
                currObject?.calculationOperands &&
                currObject.calculationOperands.length > 0
              ) {
                currObject.calculationOperands.push(q.id);
              } else {
                currObject.calculationOperands = [q.id];
              }
            }
          });
        });

        // Set External Responses
        dispatch(setExternalResponses({ ...externalResponses }));
      }

      let summaryExternalVars: string[] = [];

      summaryQuestions.forEach((q) => {
        if (q.summaryVars) {
          q.summaryVars.forEach((v) => {
            if (!varnames[v]) {
              summaryExternalVars.push(v);
            }
          });
        }
      });

      summaryExternalVars = Array.from(new Set([...summaryExternalVars]));

      let summaryExternalResponses = {} as ExternalResponsesDict;
      if (summaryExternalVars.length > 0) {
        summaryExternalResponses = await handleExternalVariables(
          summaryExternalVars,
          participantId,
          surveySlug,
          studyId,
          formId,
          repeatedAttemptId,
          surveyAssignmentId
        );
        Object.keys(summaryExternalResponses).forEach((varname) => {
          summaryQuestions.forEach((q) => {
            if (q.summaryVars?.includes(varname)) {
              const currObject = summaryExternalResponses[varname];

              if (
                currObject?.calculationOperands &&
                currObject.calculationOperands.length > 0
              ) {
                currObject.calculationOperands.push(q.id);
              } else {
                currObject.calculationOperands = [q.id];
              }
            }
          });
        });
        dispatch(setSummaryExternalResponses({ ...summaryExternalResponses }));
      }

      const summaryIds = summaryQuestions.map((q) => q.id);
      if (summaryIds.length > 0) {
        dispatch(handleSummaries(summaryIds, questions));
      }

      dispatch(setQuestionsList({ list: questions }));
      dispatch(setQueries({ queries }));
      dispatch(setResponseLoader(false));
      dispatch(setResponseSubmitting(""));
      dispatch(setParticipantId(participantId ?? ""));
      dispatch(setSelectedForm({ form: selectedForm }));

      // Calculate Response
      if (editable) {
        const fields = questions.filter((q) => q.type === "calculated_field");
        dispatch(setCalcFields({ f: fields.map((q) => q.id) }));
        dispatch(handleCalculation(studyId, surveySlug));
      }
    } catch (err) {
      dispatch(setResponseLoader(false));
      errorToastMessage(err as Error);
    }
  };

type UpdateFormDataProps = {
  questionId: string;
  remarkValue?: string;
  studyId?: string;
  surveySlug?: string;
  isClearResponseSelected?: boolean;
  isChangeConfirm?: boolean;
};

export const updateResponse =
  ({
    questionId,
    remarkValue,
    studyId,
    surveySlug,
    isClearResponseSelected = false,
    isChangeConfirm = false,
  }: UpdateFormDataProps): AppThunk =>
  async (dispatch, getState) => {
    const {
      selectedForm,
      questionList,
      participantId,
      repeatedAttemptId,
      surveyAssignmentId,
      externalResponses,
      summaryExternalResponses,
    } = getState().response;
    const currentQuestion = questionList.find((q) => q.id === questionId);

    try {
      if (currentQuestion && selectedForm) {
        dispatch(setResponseSubmitting(questionId));

        let requestBody = {} as SanitizedRequest;

        // Sanitize Responses
        if (isClearResponseSelected) {
          requestBody = {
            isCleared: true,
          };
        } else {
          requestBody = santizeResponsesMiddleware(currentQuestion);
        }

        // If remarkValue is present
        if (
          (remarkValue || currentQuestion?.responses?.[0]?.remarkValue) &&
          !isClearResponseSelected
        ) {
          if (typeof remarkValue === "string") {
            requestBody.remarkValue = remarkValue;
          } else {
            requestBody.remarkValue = currentQuestion.responses[0].remarkValue;
          }
        }

        // Edge Case is an understatement
        if (Object.entries(requestBody).length === 0) {
          dispatch(setResponseSubmitting(""));
          return;
        }

        const isDirty = checkIfDirty(requestBody, currentQuestion);

        // Compare if response has been dirtied
        if (!isDirty) {
          if (!requestBody?.isCleared) {
            dispatch(setNotSaved(currentQuestion.id));
          }
          dispatch(setResponseSubmitting(""));
          return;
        }

        if (isChangeConfirm) {
          requestBody.isConfirmed = true;
        }

        // Submit Response
        let responseData = {} as UpdateResponseData;
        let params: any = { participantId };
        const formId = selectedForm?.id;

        if (surveySlug && formId) {
          const { data } = await httpSurvey.post<any>(
            `/survey/${surveySlug}/${formId}/question/${questionId}`,
            requestBody
          );
          responseData = data.data;
        } else if (repeatedAttemptId && formId && studyId) {
          params.repeatedAttemptId = repeatedAttemptId;
          const { data } = await http.post<UpdateResponseRoot>(
            `/study/${studyId}/repeated-responses/${formId}/question/${questionId}`,
            requestBody,
            { params }
          );
          responseData = data.data;
        } else if (surveyAssignmentId && formId && studyId) {
          params.surveyAssignmentId = surveyAssignmentId;
          const { data } = await http.post<UpdateResponseRoot>(
            `/study/${studyId}/survey-responses/${formId}/question/${questionId}`,
            requestBody,
            { params }
          );
          responseData = data.data;
        } else if (formId && studyId) {
          const { data } = await http.post<UpdateResponseRoot>(
            `/study/${studyId}/responses/${formId}/question/${questionId}`,
            requestBody,
            { params }
          );
          responseData = data.data;
        }

        // Set Form Status
        dispatch(handleFormStatus(responseData?.attempt?.status || "active"));

        // Replace Responses
        const newQuestions = updateResponseSkeleton(
          questionList,
          questionId,
          responseData
        );

        // Calculate Response
        const summaryIds: any[] = [];
        let fields: any[] = [];
        let internalDependencies: string[] =
          responseData?.affectedQuestionIds || [];
        let externalDependencies: string[] =
          responseData?.affectedExternalQuestions || [];

        // Dependencies Outside the Current Form
        let externalResponsesCopy: ExternalResponsesDict = JSON.parse(
          JSON.stringify(externalResponses)
        );
        let externalSummaryResponsesCopy: ExternalResponsesDict = JSON.parse(
          JSON.stringify(summaryExternalResponses)
        );

        if (externalDependencies.length > 0) {
          externalDependencies.forEach((varname) => {
            const currObject = externalResponsesCopy?.[varname];
            if (currObject?.calculationOperands?.length > 0) {
              fields.push(...currObject.calculationOperands);
            }

            if (currObject) {
              delete externalResponsesCopy[varname];
            }

            const currSummaryObject = externalSummaryResponsesCopy?.[varname];
            if (currSummaryObject?.calculationOperands?.length > 0) {
              summaryIds.push(...currSummaryObject.calculationOperands);
            }

            if (currSummaryObject) {
              delete externalSummaryResponsesCopy[varname];
            }
          });

          dispatch(setExternalResponses(externalResponsesCopy));
          dispatch(setSummaryExternalResponses(externalSummaryResponsesCopy));
        }

        if (currentQuestion?.summaryOperands) {
          summaryIds.push(...currentQuestion.summaryOperands);
        }
        // Update Calculation Fields
        if (currentQuestion?.calculationOperands) {
          fields.push(...currentQuestion.calculationOperands);
        }

        // Dependencies Within the Current Form
        if (internalDependencies.length > 0) {
          questionList.forEach((q) => {
            if (internalDependencies.includes(q.id)) {
              if (q?.calculationOperands) {
                fields.push(...q.calculationOperands);
              }
              if (q?.summaryOperands) {
                summaryIds.push(...q.summaryOperands);
              }
            }
          });
        }

        if (summaryIds.length > 0) {
          dispatch(handleSummaries(summaryIds, newQuestions));
        }

        dispatch(setQuestionsList({ list: newQuestions }));
        dispatch(setResponseSubmitting(""));
        dispatch(setCalcFields({ f: fields }));
        dispatch(handleCalculation(studyId, surveySlug));

        const { showChangeConfirmModal } = getState().response;
        if (showChangeConfirmModal.show) {
          // Close Modal
          dispatch(
            setShowChangeConfirmModal({
              show: false,
              varnames: [],
              questionId: "",
              details: [],
            })
          );
        }
      }
    } catch (err: any) {
      // Reset Dirtied Response
      if (err?.response.data?.metadata?.varnames?.length > 0) {
        dispatch(
          setShowChangeConfirmModal({
            show: true,
            varnames: err?.response.data?.metadata?.varnames,
            details: err?.response.data?.metadata?.details,
            questionId,
            remarkValue,
            studyId,
            surveySlug,
            isClearResponseSelected,
          })
        );
      } else {
        dispatch(
          setShowChangeConfirmModal({
            show: false,
            varnames: [],
            questionId: "",
            details: [],
          })
        );
        errorToastMessage(err as Error);
      }

      dispatch(setResponseSubmitting(""));
    }
  };

export const handleCalculation =
  (studyId?: string, surveySlug?: string): AppThunk =>
  async (dispatch, getState) => {
    const { questionList, calcFields, externalResponses } = getState().response;

    if (calcFields.length === 0) {
      dispatch(setResponseSubmitting(""));
      return;
    }

    const calculationFieldId = calcFields[calcFields.length - 1];
    const calculationField = questionList.find(
      (q) => q.id === calculationFieldId
    );

    if (!calculationField?.isVisible) {
      dispatch(popCalcFields());
      dispatch(handleCalculation(studyId, surveySlug));
      return;
    }

    if (calculationField) {
      dispatch(popCalcFields());
      dispatch(setResponseSubmitting(calculationFieldId)); // Avoid a 1-2 second gap where it is an empty string

      let template = calculationField.calculationTemplate;
      let result = null;
      let variableNames: string[] = calculationField.calculationVars || [];
      let values: any[] = [];
      let notFound = false;

      // Get Value of all varNames
      for (const varName of variableNames) {
        if (notFound) break;
        const currentQues = questionList.find((q) => q.varname === varName);

        if (currentQues?.type === "calculated_field") {
          notFound = true;
          break;
        }

        if (!currentQues) {
          const currentExtQues = externalResponses[varName];

          if (currentExtQues) {
            if (currentExtQues?.type === "calculated_field") {
              notFound = true;
              break;
            }

            let response = "";
            if (textTypes.includes(currentExtQues.type)) {
              const textValue = currentExtQues?.textValue;
              response = textValue ? `"${textValue}"` : textValue;
            } else {
              response = currentExtQues?.numberValue;
            }

            if (
              response ||
              (typeof response === "number" && !isNaN(response))
            ) {
              values.push(response);
            } else {
              notFound = true;
            }
          } else {
            notFound = true;
          }
        } else if (currentQues.type === "checkbox") {
          if (currentQues.responsesBackup.length === 0) {
            notFound = true;
          } else {
            let sum = 0;
            for (let i = 0; i < currentQues.responsesBackup.length; i++) {
              const res = currentQues.responsesBackup[i];
              if (
                typeof res?.numberValue !== "number" ||
                isNaN(res?.numberValue)
              ) {
                notFound = true;
              }
              sum += res.numberValue;
            }

            values.push(sum);
          }
        } else {
          let response = "";
          if (textTypes.includes(currentQues.type)) {
            const textValue = currentQues?.responsesBackup?.[0]?.textValue;
            response = textValue ? `"${textValue}"` : textValue;
          } else {
            response = currentQues?.responsesBackup?.[0]?.numberValue;
          }

          if (response || (typeof response === "number" && !isNaN(response))) {
            values.push(response);
          } else {
            notFound = true;
          }
        }
      }

      if (!notFound) {
        // Replace template varNames with values
        variableNames.forEach((varName, index) => {
          const re = new RegExp(`{${varName}}`, "g");
          template = template.replace(re, values[index]);
        });
      }

      try {
        if (!notFound) {
          // eslint-disable-next-line no-new-func
          result = new Function(`return ${template}`)();
          if (typeof result === "number" && !isNaN(result)) {
            result = Math.round(result * 100) / 100;
          } else {
            result = null;
          }
        } else {
          result = null;
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (result || typeof result === "number") {
          if (result === calculationField?.responsesBackup[0]?.numberValue) {
            //recursively call handleCalculation
            dispatch(handleCalculation(studyId, surveySlug));
            return;
          }

          dispatch(
            handleFieldUpdate({
              key: "numberValue",
              convertToInt: false,
              value: result,
              id: calculationField.id,
            })
          );

          dispatch(
            updateResponse({
              studyId,
              questionId: calculationField.id,
              surveySlug,
              isChangeConfirm: true,
            })
          );
        } else if (
          calculationField?.responsesBackup[0]?.numberValue ||
          typeof calculationField?.responsesBackup[0]?.numberValue === "number"
        ) {
          // No result now, had previous result
          dispatch(
            updateResponse({
              studyId,
              questionId: calculationField.id,
              surveySlug,
              isClearResponseSelected: true,
              isChangeConfirm: true,
            })
          );
        } else {
          dispatch(handleCalculation(studyId, surveySlug));
        }
      }
    }
  };

export const fetchQueries =
  (studyId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { selectedForm, participantId, repeatedAttemptId } =
        getState().response;
      let params: any = {
        participantId,
      };
      let queries = {};
      if (repeatedAttemptId) {
        params.attemptId = repeatedAttemptId;
        const queryResponse = await http.get(
          `/study/${studyId}/queries/${repeatedAttemptId}/repeating-data`,
          {
            params: {
              ...params,
              formId: selectedForm?.id,
            },
          }
        );
        queries = formatQueries(queryResponse.data.data);
      } else {
        const queryResponse = await http.get(`/study/${studyId}/queries/form`, {
          params: { ...params, formId: selectedForm?.id },
        });
        queries = formatQueries(queryResponse.data.data);
      }
      dispatch(setQueries({ queries }));
    } catch (err) {
      errorToastMessage(err as Error);
    }
  };

export const canNavigateForm =
  (): AppThunk<boolean> =>
  (dispatch, getState): boolean => {
    const { phaseList, selectedForm } = getState().response;
    const phase = phaseList.find((p) => p.id === selectedForm?.phaseId);
    let form;
    if (phase) {
      form = phase.phaseForms.find((f) => f.id === selectedForm?.id);
    }
    if (form?.status === "completed") {
      return true;
    } else {
      return false;
    }
  };

const handleSummaries =
  (ids: string[], questionList: QuestionSlice[]): AppThunk =>
  async (dispatch, getState) => {
    const { summaryExternalResponses } = getState().response;
    const updatedIds = [...new Set(ids)];
    for (let i = 0; i < updatedIds.length; i++) {
      const summaryField = questionList.find((q) => q.id === updatedIds[i]);
      if (summaryField?.isVisible && summaryField.labelTemplate) {
        let template = summaryField.labelTemplate;
        let variableNames: string[] = summaryField.summaryVars || [];
        let values: any[] = [];

        // Get Value of all varNames
        for (const varName of variableNames) {
          const currentQues = questionList.find((q) => q.varname === varName);
          let notFound = false;
          if (!currentQues) {
            const currentExtQues = summaryExternalResponses[varName];

            if (currentExtQues) {
              let response = "";
              if (textTypes.includes(currentExtQues.type)) {
                response = currentExtQues?.textValue ?? "";
              } else if (choice_types.includes(currentExtQues.type)) {
                response = currentExtQues?.choiceLabel ?? "";
              } else {
                response = currentExtQues?.numberValue ?? "";
              }
              values.push(response);
            } else {
              notFound = true;
            }
          } else if (currentQues.type === "checkbox") {
            if (currentQues.responsesBackup.length === 0) {
              notFound = true;
            } else {
              let text = "";
              for (let i = 0; i < currentQues.responsesBackup.length; i++) {
                const res = currentQues.responsesBackup[i];
                if (!res?.questionChoice?.label) {
                  notFound = true;
                } else {
                  text += res?.questionChoice?.label + ", ";
                }
              }
              if (text) {
                text = text.slice(0, -2);
              }

              if (!notFound) {
                values.push(text);
              }
            }
          } else {
            let response = "";
            if (textTypes.includes(currentQues.type)) {
              response = currentQues?.responsesBackup?.[0]?.textValue ?? "";
            } else if (choice_types.includes(currentQues.type)) {
              response =
                currentQues?.responsesBackup?.[0]?.questionChoice?.label ?? "";
            } else {
              response = currentQues?.responsesBackup?.[0]?.numberValue ?? "";
            }
            values.push(response);
          }
          if (notFound) {
            values.push("");
          }
        }

        // Replace template varNames with values
        variableNames.forEach((varName, index) => {
          const re = new RegExp(`{${varName}}`, "g");
          template = template.replace(re, values[index]);
        });
        summaryField.label = template;
      }
    }
  };

const formatQueries = (queries: any[]) => {
  const queryMap: any = {};
  if (queries) {
    queries.forEach((query) => {
      if (queryMap[query.questionId]) {
        queryMap[query.questionId]?.queries?.push(query);
        if (queryMap?.[query.questionId]?.[query.status] !== undefined)
          queryMap[query.questionId][query.status]++;
      } else {
        queryMap[query.questionId] = {
          open: query.status === "open" ? 1 : 0,
          closed: query.status === "closed" ? 1 : 0,
          resolved: query.status === "resolved" ? 1 : 0,
          queries: [query],
        };
      }
    });
  }
  return queryMap;
};
