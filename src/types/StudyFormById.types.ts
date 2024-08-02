export interface StudyFormByIdResponse {
  data: StudyFormById;
  message: string;
}

export interface StudyFormById {
  id: string;
  name: string;
  revision: number;
  questionCount: number;
  questions: Question[];
  phaseForm: PhaseForm;
}

export interface Question {
  id: string;
  position: number;
  type: string;
  label: string;
  varname: string;
  helperText?: string;
  imageUrl: any;
  calculationTemplate: any;
  properties: Properties;
  studyId: string;
  formId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  choices: any[];
  dependency: any;
  validations: Validation[];
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

export interface Validation {
  id: string;
  operator: string;
  type: string;
  textValue: string;
  numberValue: any;
  message: string;
  questionChoiceId: any;
  questionId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface PhaseForm {
  id: string;
  phase: Phase;
}

export interface Phase {
  id: string;
  category: string;
}
