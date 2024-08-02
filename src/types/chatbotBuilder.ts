export type CbBuilderStepType =
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "yes_no"
  | "number"
  | "calendar"
  | "slider";

export type responseMsgsType = {
  attachmentUrl?: any;
  botId?: any;
  botStepId?: any;
  isNotificationEnabled?: boolean;
  careEducationLessonId?: any;
  careEducationLessonPageId?: any;
  careEducationLessonUnitId?: any;
  educationLessonId?: any;
  educationLessonPageId?: any;
  educationLessonUnitId?: any;
  id: string;
  text: string;
  type: string;
  delay: number;
  notification?: {
    title: string;
    body: string;
    triggerIn: number;
  };
};

export type botMessagesType = {
  id: string;
  type: string;
  attachmentUrl: string | null;
  text: string;
  delay: any;
};

export type botResponsesType = {
  id: string;
  answer: any;
  isDefault: boolean;
  nextStep: any;
  operator: any;
  responseMsgs: responseMsgsType[];
};

export interface CbBuilderStep {
  id: string;
  type: CbBuilderStepType;
  codeName: string;
  name: string;
  botMessages: botMessagesType[];
  botResponses: botResponsesType[];
  isReminder: boolean;
  optionSearchable: boolean;
  reminderBotId: any;
  sliderConfig?: any;

  options?: {
    id: string;
    text: string;
    imageUrl?: string | null;
  }[];
}
