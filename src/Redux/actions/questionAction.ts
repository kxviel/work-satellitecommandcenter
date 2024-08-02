import http from "../../utils/http";
import { permissions } from "../../utils/roles";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import {
  resetQuestionState,
  setOptionGroups,
  setQuestionLoader,
  setQuestionnaireDetails,
  setQuestionSubmitting,
} from "../reducers/questionSlice";
import { AppThunk } from "../store";

export const loadQuestionDetails =
  (studyId: string, formId: string, previewMode?: boolean): AppThunk =>
  async (dispatch, getState) => {
    try {
      if (!studyId || !formId) {
        dispatch(resetQuestionState());
        return;
      }

      dispatch(setQuestionLoader(true));
      const { data } = await http.get(`/study/${studyId}/forms/${formId}`);

      if (data && data?.data) {
        const editPermission = previewMode
          ? false
          : getState().user.studyPermissions.includes(
              permissions.studyDesigner
            ) && getState().study.status === "not_live";

        // Sort Questions
        let questions = data.data.questions
          ?.slice()
          .sort(
            (a: { position: number }, b: { position: number }) =>
              a.position - b.position
          );

        questions = questions.map((q: any) => {
          if (q.choices) {
            q.choices = q.choices.sort(
              (a: { position: number }, b: { position: number }) =>
                a.position - b.position
            );
          }
          if (q?.validations) {
            q.validations = q.validations.sort(
              (a: { position: number }, b: { position: number }) =>
                a.position - b.position
            );
          }
          q.labelMarkdown = q.label.replace(/(?:\r\n|\r|\n)/g, "<br>");
          return {
            ...q,
          };
        });

        dispatch(
          setQuestionnaireDetails({
            questionName: data.data.name,
            error: "",
            loading: false,
            editable: editPermission,
            formSubmitting: false,

            status: "active",
            formDirty: false,

            showPropModal: false,
            modalQuestion: null,
            modalIsEdit: false,

            isBasicError: "",
            isChoicesError: "",
            isRepeatedConfigError: "",
            isGridConfigError: "",
            isValidationsError: "",
            isDependencyError: "",

            questions: questions,
            qid: formId,
            studyId: studyId,
            revision: data.data.revision,
            formCategory: data.data.phaseForm.phase.category,
          })
        );
      }
    } catch (err) {
      dispatch(setQuestionSubmitting(false));
      dispatch(setQuestionLoader(false));
      errorToastMessage(err as Error);
    }
  };

export const loadOptionGroups =
  (studyId: string): AppThunk =>
  async (dispatch, getState) => {
    const editPermission =
      getState().user.studyPermissions.includes(permissions.studyDesigner) &&
      getState().study.status === "not_live";

    if (editPermission) {
      try {
        const choiceRes = await http.get(`/study/${studyId}/option-groups`);
        let choiceData = (choiceRes.data?.data || [])?.map((item: any) => ({
          id: item?.id,
          name: item?.name || "-",
          options: item?.options || [],
        }));
        dispatch(setOptionGroups({ options: choiceData }));
      } catch (err) {}
    }
  };

export const saveQuestion =
  (isUpdate: boolean): AppThunk =>
  async (dispatch, getState) => {
    const {
      qid: formId,
      studyId,
      revision,
      modalQuestion,
    } = getState().question;

    //Add Position to Validation
    const quesValidations = modalQuestion.validations.map(
      (v: any, i: number) => {
        const {
          id,
          type,
          operator,
          numberValue,
          textValue,
          questionChoiceId,
          message,
        } = v;
        return {
          id,
          type,
          operator,
          numberValue,
          textValue,
          questionChoiceId,
          message,
          position: i + 1,
        };
      }
    );

    const choices = (modalQuestion.choices || []).map((choice: any) => {
      const { id, label, position, value, isOther, ref, imageUrl } = choice;
      return {
        id,
        label,
        position,
        value,
        isOther,
        ref,
        imageUrl,
      };
    });

    const dependency = modalQuestion?.dependency
      ? {
          parentFormId: modalQuestion.dependency?.parentFormId,
          parentQuestionId: modalQuestion.dependency?.parentQuestionId,
          operator: modalQuestion.dependency?.operator,
          numberValue: modalQuestion.dependency?.numberValue,
          textValue: modalQuestion.dependency?.textValue,
          questionChoiceId: modalQuestion.dependency?.questionChoiceId,
        }
      : undefined;

    const ques = {
      ...modalQuestion,
      dependency,
      choices,
      validations: quesValidations,
    };

    const body = {
      revision,
      question: ques,
    };

    try {
      dispatch(setQuestionLoader(true));
      dispatch(setQuestionSubmitting(true));
      if (isUpdate) {
        const { data } = await http.patch(
          `/study/${studyId}/forms/${formId}/question/${modalQuestion.id}`,
          body
        );

        toastMessage("success", data.message);
        dispatch(loadQuestionDetails(studyId, formId));
      } else {
        const { data } = await http.post(
          `/study/${studyId}/forms/${formId}/question`,
          body
        );

        toastMessage("success", data.message);
        dispatch(loadQuestionDetails(studyId, formId));
      }
    } catch (err) {
      dispatch(setQuestionSubmitting(false));
      dispatch(setQuestionLoader(false));
      errorToastMessage(err as Error);
    }
  };

export const importQuestion =
  (file: File): AppThunk =>
  async (dispatch, getState) => {
    const { qid: formId, studyId } = getState().question;
    try {
      dispatch(setQuestionLoader(true));
      dispatch(setQuestionSubmitting(true));
      const formData = new FormData();
      formData.append("file", file);
      let res = await http.post(
        `/study/${studyId}/forms/${formId}/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toastMessage("success", res?.data?.message);
      dispatch(loadQuestionDetails(studyId, formId));
    } catch (err) {
      dispatch(setQuestionSubmitting(false));
      dispatch(setQuestionLoader(false));
      errorToastMessage(err as Error);
    }
  };

export const deleteQuestion =
  (questionId: string): AppThunk =>
  async (dispatch, getState) => {
    const { qid: formId, studyId, revision } = getState().question;

    try {
      dispatch(setQuestionSubmitting(true));

      const { data } = await http.delete(
        `/study/${studyId}/forms/${formId}/question/${questionId}/${revision}`
      );
      if (data) {
        toastMessage("success", data.message);
        dispatch(loadQuestionDetails(studyId, formId));
      }
    } catch (err) {
      dispatch(setQuestionSubmitting(false));
      errorToastMessage(err as Error);
    }
  };
