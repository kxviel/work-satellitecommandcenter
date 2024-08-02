export interface FormDataRoot {
  data: FormDataObject;
  message: string;
}

export interface FormDataObject {
  responses: FormResponse[];
  form: Form;
  questionVisibilities: FormQuestionVisibility;
}

export interface FormResponse {
  id: string;
  participantId: string;
  actorId: string;
  isActive: boolean;
  isCleared: boolean;
  isHidden: boolean;
  reason: any;
  remarkValue: any;
  textValue: any;
  numberValue: any;
  questionChoiceId: any;
  questionValidationId: any;
  gridValue: GridValue[][];
  files?: File[];
  questionId: string;
  formId: string;
  formAttemptId: string;
  studyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  questionValidation: QuestionValidation;
}

export interface File {
  name: string;
  url: string;
}

export interface QuestionValidation {
  type: string;
  message: string;
}

export interface GridValue {
  textValue?: string;
}

export interface Form {
  id: string;
  name: string;
  revision: number;
  questionCount: number;
  questions: FormQuestion[];
  phaseForm: PhaseForm;
}

export interface FormQuestion {
  id: string;
  position: number;
  type: string;
  label: string;
  varname: string;
  helperText: any;
  imageUrl: any;
  signedImageUrl?: string;
  calculationTemplate: any;
  properties: Properties;
  studyId: string;
  formId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  choices: Choice[];
  dependency: any;
  validations: any[];
  calculationVars?: string[];
  calculationOperands?: string[];
  summaryVars?: string[];
  summaryOperands?: string[];
  labelTemplate?: string;
  labelCopy: string;
}

export interface Choice {
  id: string;
  position: number;
  label: string;
  value: number;
  imageUrl: any;
  previewUrl?: string;
  isOther: boolean;
  ref: string;
  questionId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface Properties {
  required: boolean;
  remarkText?: string;
  allowMultiline?: true;
  orientation?: string;
  bulletStyle?: string;
  measurementUnit?: string;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  gridConfig?: GridConfig;
  repeatedConfig: RepeatConfig;
  format?: string;
  fieldWidth?: number;
  isHidden?: boolean;
  showAll?: boolean;
}

export interface RepeatConfig {
  columns: Column[];
}

export interface Column {
  type: string;
  label: string;
  format?: string;
  options?: string[];
}

export interface GridConfig {
  rows: GridRow[];
  columns: GridColumn[];
  fieldType: string;
}

export interface GridRow {
  type?: string;
  label: string;
  format?: string;
  options?: string[];
}

export interface GridColumn {
  label: string;
  type?: string;
  format?: string;
  options?: string[];
}

export interface PhaseForm {
  id: string;
  phase: Phase;
}

export interface Phase {
  id: string;
  category: string;
}

export interface FormQuestionVisibility {
  [key: string]: boolean;
}
