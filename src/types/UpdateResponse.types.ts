export interface UpdateResponseRoot {
  data: UpdateResponseData;
  message: string;
}

export interface UpdateResponseData {
  responses: UpdateResponse[];
  attempt: UpdateAttempt;
  questionVisibilities: QuestionVisibility;
  affectedQuestionIds?: string[];
  affectedExternalQuestions?: string[];
}

export interface UpdateResponse {
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
  files: any;
  questionId: string;
  formId: string;
  formAttemptId: string;
  studyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  questionValidation: any;
}

export interface GridValue {
  textValue?: string;
  numberValue?: number;
}

export interface UpdateAttempt {
  id: string;
  status: string;
  participantId: string;
  studyId: string;
  phaseId: string;
  phaseFormId: string;
  formId: string;
  repeatedAttemptId: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface QuestionVisibility {
  [key: string]: boolean;
}
