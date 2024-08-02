import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createRepeatedDataResSkeleton,
  handlePhaseStatus,
} from "../../Components/Responses/utils";
import { PhaseListForms, PhasesList } from "../../Components/Responses/types";
import { FormQuestion, QuestionValidation } from "../../types/FormData.types";

export type Responses = {
  id?: string;
  isCleared?: boolean;
  remarkValue?: any;
  textValue?: any;
  numberValue?: any;
  questionChoiceId?: any;
  questionChoice?: any;
  files?: any;
  questionId?: string;
  gridData?: any; // FE
  repeatedData?: any; // FE
  questionValidation?: QuestionValidation;
  notSaved?: boolean; // FE
};

export type QuestionSlice = FormQuestion & {
  responses: Responses[];
  responsesBackup: Responses[];
  isVisible: boolean;
};

export type ExternalResponsesDict = {
  [key: string]: {
    textValue: any;
    numberValue: any;
    type: string;
    calculationOperands: string[];
    choiceLabel?: string;
  };
};

export type ConfirmationModalProps = {
  show: boolean;
  varnames: string[];
  questionId: string;
  remarkValue?: string;
  studyId?: string;
  surveySlug?: string;
  isClearResponseSelected?: boolean;
  details: any[];
};

export interface ResponseState {
  toggleLoader: boolean;
  togglePhase: boolean;

  isArchived: boolean;
  isLocked: boolean;
  isExcluded: boolean;
  editable: boolean;
  canRandomize: boolean;
  viewRandomization: boolean;
  canAmendQueries: boolean;
  canSendSurveys: boolean;
  canEditSurveys: boolean;
  canEditVisits: boolean;
  hasEmail: boolean;
  canLock: boolean;

  isLoading: boolean;
  fieldSubmitting: string;
  checkingPermissions: boolean;

  participantId: string;
  siteId: string;
  subjectId: string;
  email: string;

  repeatedAttemptId: string;
  surveyAssignmentId: string;

  phaseList: PhasesList[];
  selectedForm: PhaseListForms | null;
  selectedPhase: string;
  questionList: QuestionSlice[];

  queries: any;
  queryModal: any;
  formEditable: boolean;

  calcFields: string[];
  externalResponses: ExternalResponsesDict;
  summaryExternalResponses: ExternalResponsesDict;
  showChangeConfirmModal: ConfirmationModalProps;
}

export const initialResponseState: ResponseState = {
  toggleLoader: false,
  togglePhase: false,

  isArchived: false,
  isLocked: false,
  isExcluded: false,
  editable: false,
  canRandomize: false,
  viewRandomization: false,
  canAmendQueries: false,
  canSendSurveys: false,
  canEditSurveys: false,
  canEditVisits: false,
  hasEmail: true,
  canLock: false,

  isLoading: false,
  fieldSubmitting: "",
  checkingPermissions: true,

  participantId: "",
  siteId: "",
  subjectId: "",
  email: "",

  repeatedAttemptId: "",
  surveyAssignmentId: "",

  phaseList: [],
  selectedForm: null,
  questionList: [],
  selectedPhase: "",

  queries: {},
  queryModal: {},
  formEditable: false,

  calcFields: [],
  externalResponses: {},
  summaryExternalResponses: {},
  showChangeConfirmModal: {
    show: false,
    varnames: [],
    questionId: "",
    details: [],
  },
};

export const responseSlice = createSlice({
  name: "response",
  initialState: initialResponseState,
  reducers: {
    reset: () => initialResponseState,
    resetResponseState: (state) => {
      state.isArchived = false;
      state.isLocked = false;
      state.isExcluded = false;
      state.editable = false;
      state.canAmendQueries = false;
      state.canRandomize = false;
      state.canSendSurveys = false;
      state.viewRandomization = false;
      state.canEditSurveys = false;
      state.canEditVisits = false;
      state.hasEmail = false;
      state.canLock = false;

      state.isLoading = true;
      state.fieldSubmitting = "";
      state.checkingPermissions = true;

      state.subjectId = "";
      state.participantId = "";
      state.siteId = "";
      state.email = "";

      state.phaseList = [];
      state.selectedPhase = "";
      state.selectedForm = null;
      state.questionList = [];

      state.repeatedAttemptId = "";
      state.surveyAssignmentId = "";

      state.queries = {};
      state.queryModal = {};
      state.formEditable = false;

      state.externalResponses = {};
      state.summaryExternalResponses = {};
      state.calcFields = [];
      state.showChangeConfirmModal = {
        show: false,
        varnames: [],
        questionId: "",
        details: [],
      };
    },
    resetResponseFormState: (state) => {
      state.isLoading = true;
      state.fieldSubmitting = "";
      state.checkingPermissions = false;
      state.selectedForm = null;
      state.queries = {};
      state.formEditable = false;
      state.questionList = [];
      state.repeatedAttemptId = "";
      state.surveyAssignmentId = "";
      state.queryModal = {};
      state.phaseList = [];
      state.selectedPhase = "";
      state.calcFields = [];
      state.externalResponses = {};
      state.summaryExternalResponses = {};
      state.showChangeConfirmModal = {
        show: false,
        varnames: [],
        questionId: "",
        details: [],
      };
    },
    // setResponseState: (state, action: PayloadAction<ResponseState>) => {
    //   state.editable = action.payload.editable;
    //   state.isLoading = action.payload.isLoading;
    //   state.fieldSubmitting = action.payload.fieldSubmitting;
    //   state.checkingPermissions = action.payload.checkingPermissions;
    //   state.participantId = action.payload.participantId;
    //   state.selectedForm = action.payload.selectedForm;
    //   state.queries = action.payload.queries;
    //   state.questionList = action.payload.questionList;
    //   state.repeatedAttemptId = action.payload.repeatedAttemptId;
    //   state.queryModal = action.payload.queryModal;
    //   state.phaseList = action.payload.phaseList;
    // },
    setResponsePermission: (state, action: PayloadAction<boolean>) => {
      state.checkingPermissions = action.payload;
    },
    setResponseLoader: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setResponseSubmitting: (state, action: PayloadAction<string>) => {
      state.fieldSubmitting = action.payload;
    },
    setResponseIsEditable: (state, action: PayloadAction<boolean>) => {
      state.editable = action.payload;
    },
    setResponseFormEditable: (state, action: PayloadAction<boolean>) => {
      state.formEditable = action.payload;
    },
    setShowChangeConfirmModal: (
      state,
      action: PayloadAction<ConfirmationModalProps>
    ) => {
      state.showChangeConfirmModal = action.payload;
    },
    setEmailSubjectId: (
      state,
      action: PayloadAction<{ email: string; subjectId: string }>
    ) => {
      state.email = action.payload.email;
      state.subjectId = action.payload.subjectId;
    },
    setResPermissions: (
      state,
      action: PayloadAction<{
        canRandomize: boolean;
        viewRandomization: boolean;
        canAmendQueries: boolean;
        canSendSurveys: boolean;
        canEditSurveys: boolean;
        canEditVisits: boolean;
        editable: boolean;
        isExcluded: boolean;
        isLocked: boolean;
        isArchived: boolean;
        hasEmail: boolean;
        canLock: boolean;
      }>
    ) => {
      state.isExcluded = action.payload.isExcluded;
      state.isArchived = action.payload.isArchived;
      state.isLocked = action.payload.isLocked;
      state.canRandomize = action.payload.canRandomize;
      state.viewRandomization = action.payload.viewRandomization;
      state.canAmendQueries = action.payload.canAmendQueries;
      state.canSendSurveys = action.payload.canSendSurveys;
      state.canEditSurveys = action.payload.canEditSurveys;
      state.canEditVisits = action.payload.canEditVisits;
      state.editable = action.payload.editable;
      state.hasEmail = action.payload.hasEmail;
      state.canLock = action.payload.canLock;
    },
    setParticipantId: (state, action: PayloadAction<string>) => {
      state.participantId = action.payload;
    },
    setSiteId: (state, action: PayloadAction<string>) => {
      state.siteId = action.payload;
    },
    setSelectedForm: (
      state,
      action: PayloadAction<{ form: PhaseListForms }>
    ) => {
      state.selectedForm = action.payload.form;
    },
    setRepeatedAttemptId: (
      state,
      action: PayloadAction<{ repeatedAttemptId: string }>
    ) => {
      state.repeatedAttemptId = action.payload.repeatedAttemptId;
    },
    setSurveyAttemptId: (
      state,
      action: PayloadAction<{ surveyAssignmentId: string }>
    ) => {
      state.surveyAssignmentId = action.payload.surveyAssignmentId;
    },
    setQuestionsList: (
      state,
      action: PayloadAction<{ list: QuestionSlice[] }>
    ) => {
      state.questionList = action.payload.list;
    },
    revertQuestionChange: (state, action: PayloadAction<{ id: string }>) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          q.responses = q.responsesBackup;
        }
      });
    },
    handleFieldUpdate: (
      state,
      action: PayloadAction<{
        id: string;
        key: string;
        value: string;
        convertToInt?: boolean;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          let val = action.payload.convertToInt
            ? parseFloat(action.payload.value)
            : action.payload.value;
          if (action.payload.convertToInt && isNaN(val as number)) {
            val = "";
          }
          let obj: any = {
            notSaved: true,
            [action.payload.key]: val,
          };

          if (q.responses[0]?.remarkValue)
            obj.remarkValue = q.responses[0].remarkValue;

          q.responses[0] = obj;
        }
      });
    },
    handleRadioUpdate: (
      state,
      action: PayloadAction<{
        id: string;
        choiceId: string;
        textValue?: string;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          let obj: any = {
            notSaved: true,
            questionChoiceId: action.payload.choiceId,
          };

          if (q.responses[0]?.remarkValue)
            obj.remarkValue = q.responses[0].remarkValue;

          if (action.payload.textValue) {
            obj.textValue = action.payload.textValue;
          }

          q.responses[0] = obj;
        }
      });
    },
    handleCheckboxUpdate: (
      state,
      action: PayloadAction<{
        id: string;
        choiceId: string;
        textValue?: string;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          // Remove the choiceId from responses if it already exists
          const found = q.responses.find(
            (response: any) =>
              response.questionChoiceId === action.payload.choiceId
          );

          if (found) {
            if (action.payload.textValue) {
              // Update the textValue
              found.textValue = action.payload.textValue;
            } else {
              // Remove the response
              q.responses = q.responses.filter(
                (response: any) =>
                  response.questionChoiceId !== action.payload.choiceId
              );
            }
          } else {
            // Add the new response
            let obj: any = {
              notSaved: true,
              questionChoiceId: action.payload.choiceId,
            };

            if (action.payload.textValue) {
              obj.textValue = action.payload.textValue;
            }

            if (q.responses[0]?.remarkValue)
              obj.remarkValue = q.responses[0].remarkValue;

            q.responses.push(obj);
          }
        }
      });
    },
    handleCheckboxIsOtherUpdate: (
      state,
      action: PayloadAction<{
        id: string;

        choiceId: string;
        textValue: string;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          if (q.responses.length > 0) {
            let found = false;
            q.responses.forEach((response) => {
              if (response.questionChoiceId === action.payload.choiceId) {
                //If Already Exists
                found = true;
                response.textValue = action.payload.textValue;
              }
            });
            if (!found) {
              //If Not Already Exists
              let obj: any = {
                questionChoiceId: action.payload.choiceId,
                textValue: action.payload.textValue,
              };

              q.responses.push(obj);
            }
          } else {
            let obj: any = {
              questionChoiceId: action.payload.choiceId,
              textValue: action.payload.textValue,
            };

            q.responses.push(obj);
          }
        }
      });
    },
    handleGridUpdate: (
      state,
      action: PayloadAction<{
        id: string;
        convertToInt: boolean;
        rowIndex: number;
        colIndex: number;
        key: string;
        value: string;
      }>
    ) => {
      let val = action.payload.convertToInt
        ? parseFloat(action.payload.value)
        : action.payload.value;
      if (action.payload.convertToInt && isNaN(val as number)) {
        val = "";
      }
      const obj = {
        [action.payload.key]: val,
      };

      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          if (q.responses[0]?.remarkValue)
            obj.remarkValue = q.responses[0].remarkValue;

          if (q.responses[0]?.gridData) {
            q.responses[0].gridData[action.payload.rowIndex][
              action.payload.colIndex
            ] = obj;
          }
        }
      });
    },
    handleRepeatedUpdate: (
      state,
      action: PayloadAction<{
        id: string;
        convertToInt: boolean;
        rowIndex: number;
        colIndex: number;
        key: string;
        value: string;
      }>
    ) => {
      let val = action.payload.convertToInt
        ? parseFloat(action.payload.value)
        : action.payload.value;
      if (action.payload.convertToInt && isNaN(val as number)) {
        val = "";
      }
      const obj = {
        notSaved: true,
        [action.payload.key]: val,
      };

      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          if (q.responses[0]?.remarkValue)
            obj.remarkValue = q.responses[0].remarkValue;

          if (q.responses[0]?.repeatedData) {
            q.responses[0].repeatedData[action.payload.rowIndex][
              action.payload.colIndex
            ] = obj;
          }
        }
      });
    },
    handleAddRepeatedData: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          const obj = createRepeatedDataResSkeleton(
            q.properties.repeatedConfig
          );
          if (q.responses[0].repeatedData) {
            const newConfig = obj[0].repeatedData[0];
            q.responses[0].repeatedData.push(newConfig);
          }
        }
      });
    },
    handleRemoveRepeatedData: (
      state,
      action: PayloadAction<{
        id: string;
        index: number;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id && q.responses[0].repeatedData) {
          q.responses[0].repeatedData.splice(action.payload.index, 1);
        }
      });
    },
    setQueries: (
      state,
      action: PayloadAction<{
        queries: any;
      }>
    ) => {
      state.queries = action.payload.queries;
    },
    setQueryModal: (
      state,
      action: PayloadAction<{
        queryModal: any;
      }>
    ) => {
      state.queryModal = action.payload.queryModal;
    },
    setPhaseList: (
      state,
      action: PayloadAction<{
        list: PhasesList[];
      }>
    ) => {
      state.phaseList = action.payload.list;
    },
    setSelectedPhase: (
      state,
      action: PayloadAction<{
        phase: string;
        toggle?: boolean;
      }>
    ) => {
      if (action.payload.toggle) {
        state.selectedPhase =
          state.selectedPhase === action.payload.phase
            ? ""
            : action.payload.phase;
      } else {
        state.selectedPhase = action.payload.phase;
      }
    },
    handleFormStatus: (state, action: PayloadAction<string>) => {
      state.phaseList.forEach((phase) => {
        phase.phaseForms.forEach((form) => {
          if (state.selectedForm && form.id === state.selectedForm.id) {
            form.status = action.payload;
          }
        });
      });

      state.phaseList.forEach((phase) => {
        phase.phaseStatus = handlePhaseStatus(phase.phaseForms);
      });
    },
    handleAddFile: (
      state,
      action: PayloadAction<{
        fileObj: { url: string; name: string };
        id: string;
      }>
    ) => {
      const fileObj = action.payload.fileObj;

      let obj: any = {
        notSaved: true,
      };

      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          if (!q.responses[0]?.files) {
            if (q.responses[0]?.remarkValue)
              obj.remarkValue = q.responses[0].remarkValue;

            obj.files = [fileObj];
            q.responses[0] = obj;
          } else {
            q.responses[0].notSaved = true;
            q.responses[0].files.push(fileObj);
          }
        }
      });
    },
    handleRemoveFile: (
      state,
      action: PayloadAction<{
        index: number;
        id: string;
      }>
    ) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload.id) {
          q.responses[0].files.splice(action.payload.index, 1);
        }
      });
    },
    setCalcFields: (
      state,
      action: PayloadAction<{
        f: string[];
      }>
    ) => {
      const arr = [...state.calcFields, ...action.payload.f];
      state.calcFields = [...new Set(arr)];
    },
    popCalcFields: (state) => {
      state.calcFields = state.calcFields.slice(0, -1);
    },
    setExternalResponses: (
      state,
      action: PayloadAction<ExternalResponsesDict>
    ) => {
      state.externalResponses = action.payload;
    },
    setSummaryExternalResponses: (
      state,
      action: PayloadAction<ExternalResponsesDict>
    ) => {
      state.summaryExternalResponses = action.payload;
    },

    setNotSaved: (state, action: PayloadAction<string>) => {
      state.questionList.forEach((q) => {
        if (q.id === action.payload) {
          q.responses[0].notSaved = false;
          if (q.responsesBackup?.[0]?.questionValidation) {
            q.responses[0].questionValidation =
              q.responsesBackup[0].questionValidation;
          }
        }
      });
    },
    toggleResponseState: (state) => {
      state.toggleLoader = !state.toggleLoader;
    },
    togglePhaseLoader: (state) => {
      state.togglePhase = !state.togglePhase;
    },
  },
});

export const {
  resetResponseState,
  resetResponseFormState,
  // setResponseState,
  setResponseLoader,
  setResponseSubmitting,
  setSelectedForm,
  setPhaseList,
  setSelectedPhase,
  handleFormStatus,
  setQuestionsList,
  handleFieldUpdate,
  handleRadioUpdate,
  handleCheckboxUpdate,
  handleCheckboxIsOtherUpdate,
  setRepeatedAttemptId,
  setSurveyAttemptId,
  handleGridUpdate,
  handleAddRepeatedData,
  handleRemoveRepeatedData,
  handleRepeatedUpdate,
  setQueries,
  setEmailSubjectId,
  setQueryModal,
  handleAddFile,
  handleRemoveFile,
  setParticipantId,
  setSiteId,
  setResponseIsEditable,
  setResPermissions,
  setResponsePermission,
  setCalcFields,
  popCalcFields,
  setExternalResponses,
  setSummaryExternalResponses,
  revertQuestionChange,
  setNotSaved,
  setShowChangeConfirmModal,
  reset,
  toggleResponseState,
  togglePhaseLoader,
  setResponseFormEditable,
} = responseSlice.actions;

export default responseSlice.reducer;
