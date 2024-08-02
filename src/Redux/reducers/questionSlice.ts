import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createNewRepeatedColumn,
  createNewDependency,
  createNewGrid,
  createNewOption,
  createNewValidation,
} from "../../utils/question";

export interface QuestionState {
  // Basic
  questionName: string;
  error: string;
  loading: boolean;
  editable: boolean;
  formSubmitting: boolean;

  status: string; // Unused X
  formDirty: boolean; // Unused X

  // Modal Props
  showPropModal: boolean;
  modalQuestion: any;
  modalIsEdit: boolean;

  // Tab Validation
  isBasicError: string;
  isChoicesError: string;
  isRepeatedConfigError: string;
  isGridConfigError: string;
  isValidationsError: string;
  isDependencyError: string;

  // Currently In Use
  questions: any[];
  qid: string; //FormId
  studyId: string;
  revision: number;
  formCategory: string; // 'visit' | 'repeated_data'
  optionGroups?: any[];
}

export const initialQuestionState: QuestionState = {
  // Basic
  questionName: "",
  error: "",
  loading: true,
  editable: true,
  formSubmitting: false,

  status: "", // Unused X
  formDirty: false, // Unused X

  //Modal Props
  showPropModal: false,
  modalQuestion: null,
  modalIsEdit: false,

  // Tab Validation
  isBasicError: "",
  isChoicesError: "",
  isRepeatedConfigError: "",
  isGridConfigError: "",
  isValidationsError: "",
  isDependencyError: "",

  // Currently In Use
  questions: [],
  qid: "", //FormId
  studyId: "",
  revision: 0,
  formCategory: "", // 'visit' | 'repeated_data'
  optionGroups: [],
};

export const questionSlice = createSlice({
  name: "question",
  initialState: initialQuestionState,
  reducers: {
    reset: () => initialQuestionState,
    setQuestionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setQuestionLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setQuestionSubmitting: (state, action: PayloadAction<boolean>) => {
      state.formSubmitting = action.payload;
    },
    resetQuestionState: (state) => {
      state.questionName = "";
      state.error = "";
      state.loading = true;
      state.editable = true;
      state.formSubmitting = false;

      state.status = "";
      state.formDirty = false;

      state.showPropModal = false;
      state.modalQuestion = null;
      state.modalIsEdit = false;

      state.questions = [];
      state.qid = "";
      state.studyId = "";
      state.revision = 0;
      state.formCategory = "";
      state.optionGroups = [];
    },
    setQuestionnaireDetails: (state, action: PayloadAction<QuestionState>) => {
      state.questionName = action.payload.questionName;
      state.error = action.payload.error;
      state.loading = action.payload.loading;
      state.editable = action.payload.editable;
      state.formSubmitting = action.payload.formSubmitting;

      state.status = action.payload.status;
      state.formDirty = action.payload.formDirty;

      state.showPropModal = action.payload.showPropModal;
      state.modalQuestion = action.payload.modalQuestion;
      state.modalIsEdit = action.payload.modalIsEdit;

      state.questions = action.payload.questions;
      state.qid = action.payload.qid;
      state.studyId = action.payload.studyId;
      state.revision = action.payload.revision;
      state.formCategory = action.payload.formCategory;
    },
    setOptionGroups: (
      state,
      action: PayloadAction<{
        options: any[];
      }>
    ) => {
      state.optionGroups = action.payload.options;
    },
    setQuestionModalDetails: (
      state,
      action: PayloadAction<{
        show: boolean;
        question: any;
        modalIsEdit: boolean;
        currentIndex?: number | null;
        parentIndex?: number | null;
      }>
    ) => {
      state.showPropModal = action.payload.show;
      state.modalQuestion = action.payload.question;
      state.modalIsEdit = action.payload.modalIsEdit;
    },
    handleAddRemoveChoices: (
      state,
      action: PayloadAction<{
        actionType: "add" | "remove";
        actionIndex: number;
        removedRef?: string;
      }>
    ) => {
      const { actionType, actionIndex, removedRef } = action.payload;
      let currQuestionChoices = state.modalQuestion.choices;

      const newOpt = createNewOption();

      if (actionType === "add") {
        currQuestionChoices.push({
          ...newOpt,
          position: state.modalQuestion.choices.length + 1,
        });
      } else if (actionType === "remove") {
        currQuestionChoices.splice(actionIndex, 1);
        currQuestionChoices.forEach((opt: any, i: number) => {
          opt.position = i + 1;
        });

        // Reset Validation Tab Value
        state.modalQuestion.validations.forEach((val: any) => {
          if (val?.questionChoiceId === removedRef) {
            val.questionChoiceId = "";
          }
        });
      }

      state.modalQuestion.choices = currQuestionChoices;
    },
    handleOptionGroupPrefill: (
      state,
      action: PayloadAction<{
        options: any[];
      }>
    ) => {
      const { options } = action.payload;
      let currQuestionChoices = state.modalQuestion.choices;
      const len = state.modalQuestion.choices.length;
      options.forEach((newOpt, i) => {
        currQuestionChoices.push({
          ...newOpt,
          position: i + len + 1,
        });
      });
    },
    handleChoicesRearrange: (
      state,
      action: PayloadAction<{
        actionIndex: number;
        actionType: "up" | "down";
      }>
    ) => {
      const { actionType, actionIndex } = action.payload;
      let currQuestionChoices = state.modalQuestion.choices;

      if (actionType === "up" && actionIndex > 0) {
        currQuestionChoices[actionIndex].position -= 1;
        currQuestionChoices[actionIndex - 1].position += 1;
      } else if (
        actionType === "down" &&
        actionIndex < currQuestionChoices.length - 1
      ) {
        currQuestionChoices[actionIndex].position += 1;
        currQuestionChoices[actionIndex + 1].position -= 1;
      }
      currQuestionChoices.sort((a: any, b: any) => a.position - b.position);

      state.modalQuestion.choices = [...currQuestionChoices];
    },
    handleAddRemoveValidations: (
      state,
      action: PayloadAction<{
        actionType: "add" | "remove";
        actionIndex?: number;
      }>
    ) => {
      const { actionType, actionIndex } = action.payload;
      let currQuestionValidations = state.modalQuestion.validations;

      const newVal = createNewValidation();

      if (actionType === "add") {
        currQuestionValidations.push(newVal);
      } else if (actionType === "remove") {
        currQuestionValidations.splice(actionIndex, 1);
      }

      state.modalQuestion.validations = currQuestionValidations;
    },
    handleChoiceModification: (
      state,
      action: PayloadAction<{
        currentRef: string;
        section: "label" | "value" | "isOther" | "imageUrl" | "previewUrl";
        value: any;
      }>
    ) => {
      const { currentRef, section, value } = action.payload;
      state.modalQuestion.choices.forEach((c: any) => {
        if (c.ref === currentRef) {
          let val = section === "value" ? parseFloat(value) : value;
          if (section === "value" && isNaN(val as number)) {
            val = "";
          }

          c[section] = val;
        }
      });
    },
    handleAddRemoveRepeatedConfigs: (
      state,
      action: PayloadAction<{
        actionType: "add" | "remove";
        actionIndex: number;
      }>
    ) => {
      const { actionType, actionIndex } = action.payload;
      let currQuestionConfig =
        state.modalQuestion.properties.repeatedConfig.columns;

      const newOpt = createNewRepeatedColumn();

      if (actionType === "add") {
        currQuestionConfig.splice(actionIndex + 1, 0, {
          ...newOpt,
        });
      } else if (actionType === "remove") {
        currQuestionConfig.splice(actionIndex, 1);
      }
    },

    handleRepeatedConfigModification: (
      state,
      action: PayloadAction<{
        currentIndex: number;
        optIndex?: number;
        section: "label" | "type" | "options" | "format";
        value: any;
      }>
    ) => {
      const { currentIndex, optIndex, section, value } = action.payload;
      let currQuestionColumns =
        state.modalQuestion.properties.repeatedConfig.columns;

      const c = currQuestionColumns[currentIndex];
      if (section === "type") {
        c[section] = value;
        if (value === "text" || value === "number") {
          c.format && delete c.format;
          c.options && delete c.options;
        } else if (value === "date") {
          c.options && delete c.options;
          c.format = "DD/MM/YYYY";
        } else if (value === "dropdown") {
          c.format && delete c.format;
          c.options = ["", ""];
        }
      } else if (section === "options" && typeof optIndex !== "undefined") {
        let currentColumnOption = c.options;
        currentColumnOption[optIndex] = value;
      } else {
        c[section] = value;
      }
    },

    handleAddRemoveRepeatedOptions: (
      state,
      action: PayloadAction<{
        actionType: "add" | "remove";
        columnIndex: number;
        actionIndex: number;
      }>
    ) => {
      const { actionType, columnIndex, actionIndex } = action.payload;
      let currQuestionConfig =
        state.modalQuestion.properties.repeatedConfig.columns[columnIndex]
          .options;
      if (actionType === "add") {
        currQuestionConfig.splice(actionIndex + 1, 0, "");
      } else if (actionType === "remove") {
        currQuestionConfig.splice(actionIndex, 1);
      }
    },

    handleAddRemoveGridConfigs: (
      state,
      action: PayloadAction<{
        actionType: "add" | "remove";
        actionIndex: number;
        type: "rows" | "columns";
      }>
    ) => {
      const { actionType, actionIndex, type } = action.payload;
      let currQuestionConfig = state.modalQuestion?.properties?.gridConfig;

      const items = currQuestionConfig?.[type];

      const newOpt =
        currQuestionConfig.fieldType === "row"
          ? type === "rows"
            ? createNewGrid()
            : { label: "" }
          : type === "columns"
          ? createNewGrid()
          : { label: "" };

      if (actionType === "add") {
        items.splice(actionIndex + 1, 0, {
          ...newOpt,
        });
      } else if (actionType === "remove") {
        items.splice(actionIndex, 1);
      }
    },

    handleGridConfigModification: (
      state,
      action: PayloadAction<{
        currentIndex?: number;
        optIndex?: number;
        section: "label" | "type" | "options" | "format" | "fieldType";
        value: any;
        type?: any;
      }>
    ) => {
      const { currentIndex, optIndex, section, value, type } = action.payload;

      const gridConfig = state.modalQuestion?.properties?.gridConfig;
      if (section === "fieldType") {
        gridConfig[section] = value;
        if (value === "row") {
          gridConfig["columns"].forEach((col: any) => {
            delete col.type;
            delete col.options;
            delete col.format;
          });

          gridConfig["rows"].forEach((row: any) => {
            row.type = "text";
          });
        } else {
          gridConfig["rows"].forEach((row: any) => {
            delete row.type;
            delete row.options;
            delete row.format;
          });

          gridConfig["columns"].forEach((col: any) => {
            col.type = "text";
          });
        }
      } else if (typeof currentIndex !== "undefined") {
        let currQuestion = gridConfig?.[type];
        const c = currQuestion?.[currentIndex];
        if (!c) {
          return;
        }
        if (section === "type") {
          c[section] = value;
          if (value === "text" || value === "number") {
            c.format && delete c.format;
            c.options && delete c.options;
          } else if (value === "date") {
            c.options && delete c.options;
            c.format = "DD/MM/YYYY";
          } else if (value === "dropdown") {
            c.format && delete c.format;
            c.options = ["", ""];
          }
        } else if (section === "options" && typeof optIndex !== "undefined") {
          let currentColumnOption = c.options;
          currentColumnOption[optIndex] = value;
        } else {
          c[section] = value;
        }
      }
    },

    handleAddRemoveGridOptions: (
      state,
      action: PayloadAction<{
        actionType: "add" | "remove";
        columnIndex: number;
        actionIndex: number;
        type: "rows" | "columns";
      }>
    ) => {
      const { actionType, columnIndex, actionIndex, type } = action.payload;
      let currQuestionConfig =
        state.modalQuestion?.properties?.gridConfig?.[type]?.[columnIndex]
          ?.options;

      if (actionType === "add" && currQuestionConfig) {
        currQuestionConfig.splice(actionIndex + 1, 0, "");
      } else if (actionType === "remove" && currQuestionConfig) {
        currQuestionConfig.splice(actionIndex, 1);
      }
    },

    handleTabErrors: (
      state,
      action: PayloadAction<{
        errorHandler: {
          basic: string;
          choices: string;
          repeatedConfig: string;
          gridConfig: string;
          validations: string;
          dependency: string;
        };
      }>
    ) => {
      const {
        basic,
        choices,
        repeatedConfig,
        gridConfig,
        validations,
        dependency,
      } = action.payload.errorHandler;

      state.isBasicError = basic;
      state.isChoicesError = choices;
      state.isRepeatedConfigError = repeatedConfig;
      state.isGridConfigError = gridConfig;
      state.isValidationsError = validations;
      state.isDependencyError = dependency;
    },
    handleValidationDateChange: (
      state,
      action: PayloadAction<{
        dateValue: string;
        currentValidationIndex: number;
      }>
    ) => {
      const { dateValue, currentValidationIndex } = action.payload;

      state.modalQuestion.validations.forEach((val: any, index: number) => {
        if (index === currentValidationIndex) {
          val.textValue = dateValue;
        }
      });
    },
    handleDependencyDateChange: (
      state,
      action: PayloadAction<{
        dateValue: string;
      }>
    ) => {
      const { dateValue } = action.payload;
      state.modalQuestion.dependency.textValue = dateValue;
    },
    handleDateFormatChange: (
      state,
      action: PayloadAction<{
        format: string;
      }>
    ) => {
      const { format } = action.payload;
      state.modalQuestion.properties.format = format;

      state.modalQuestion.validations.forEach((val: any) => {
        val.textValue = "";
      });
    },
    handleTextFormatChange: (
      state,
      action: PayloadAction<{
        format: string;
      }>
    ) => {
      const { format } = action.payload;
      state.modalQuestion.properties.format = format;
    },
    handleValidationsChange: (
      state,
      action: PayloadAction<{
        index: number;
        key: string;
        value: any;
        convertToNum?: boolean;
      }>
    ) => {
      const { index, key, value, convertToNum } = action.payload;

      state.modalQuestion.validations.forEach((val: any, i: number) => {
        if (i === index) {
          let input = convertToNum ? parseFloat(value) : value;
          if (convertToNum && isNaN(input as number)) {
            input = "";
          }

          val[key] = input;
        }
      });
    },
    handleBasicsChange: (
      state,
      action: PayloadAction<{
        key: string;
        value: any;
        isProp?: boolean;
        convertToNum?: boolean;
      }>
    ) => {
      const { key, value, isProp, convertToNum } = action.payload;

      let val = convertToNum ? parseFloat(value) : value;
      if (convertToNum && isNaN(val as number)) {
        val = "";
      }

      if (isProp) {
        state.modalQuestion.properties[key] = val;
        return;
      }

      state.modalQuestion[key] = val;
    },
    handleBasicsSwitchChange: (
      state,
      action: PayloadAction<{
        key: string;
        value: any;
      }>
    ) => {
      const { key, value } = action.payload;

      state.modalQuestion.properties[key] = value;
    },
    handleDependencySwitch: (
      state,
      action: PayloadAction<{
        value: boolean;
      }>
    ) => {
      if (action.payload.value) {
        state.modalQuestion.dependency = createNewDependency(
          state.formCategory,
          state.qid
        );
      } else {
        delete state.modalQuestion["dependency"];
      }
    },
    handleDependencyChange: (
      state,
      action: PayloadAction<{
        key: string;
        value: any;
        convertToNum?: boolean;
      }>
    ) => {
      const { key, value, convertToNum } = action.payload;

      //If key formId, reset everything else
      if (key === "parentFormId") {
        state.modalQuestion.dependency.parentQuestionId = "";
        state.modalQuestion.dependency.operator = "";

        delete state.modalQuestion.dependency?.textValue;
        delete state.modalQuestion.dependency?.numberValue;
        delete state.modalQuestion.dependency?.questionChoiceId;
      }

      if (key === "parentQuestionId") {
        state.modalQuestion.dependency.operator = "";

        delete state.modalQuestion.dependency?.textValue;
        delete state.modalQuestion.dependency?.numberValue;
        delete state.modalQuestion.dependency?.questionChoiceId;
      }

      //Clear Values
      if (key === "textValue") {
        delete state.modalQuestion.dependency?.numberValue;
        delete state.modalQuestion.dependency?.questionChoiceId;
      } else if (key === "numberValue") {
        delete state.modalQuestion.dependency?.textValue;
        delete state.modalQuestion.dependency?.questionChoiceId;
      } else if (key === "questionChoiceId") {
        delete state.modalQuestion.dependency?.textValue;
        delete state.modalQuestion.dependency?.numberValue;
      }

      let val = convertToNum ? parseFloat(value) : value;
      if (convertToNum && isNaN(val as number)) {
        val = "";
      }

      //Set Value
      state.modalQuestion.dependency[key] = val;
    },
  },
});

export const {
  setQuestionnaireDetails,
  setQuestionLoader,
  setQuestionSubmitting,
  setQuestionError,
  setQuestionModalDetails,
  handleAddRemoveChoices,
  handleChoiceModification,
  handleAddRemoveRepeatedConfigs,
  handleRepeatedConfigModification,
  handleAddRemoveRepeatedOptions,
  handleGridConfigModification,
  handleAddRemoveGridConfigs,
  handleAddRemoveGridOptions,
  handleTabErrors,
  handleAddRemoveValidations,
  handleValidationDateChange,
  handleDependencyDateChange,
  handleDateFormatChange,
  handleValidationsChange,
  handleBasicsChange,
  handleBasicsSwitchChange,
  handleDependencySwitch,
  handleDependencyChange,
  resetQuestionState,
  setOptionGroups,
  handleOptionGroupPrefill,
  handleTextFormatChange,
  handleChoicesRearrange,
  reset,
} = questionSlice.actions;

export default questionSlice.reducer;
