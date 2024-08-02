export type onboardingQuestionType =
  | "statement"
  | "multiple_choice"
  | "likert_scale"
  | "text"
  | "number"
  | "date"
  | "group"
  | "checkbox"
  | "picture_choice";

export interface OnboardingQuestion {
  id: string;
  type: onboardingQuestionType;
  variableName: string;
  title: string;
  description: string;
  imageUrl: string | null;
  exit: boolean;
  userType: number;
  placeholder: string | null;
  isTooltip: boolean;
  tooltipLabel: string | null;
  tooltipValue: string | null;
  unitOfMeasurement: string[];
  typeLabel?: string;

  choices?: {
    label: string;
    response: string;
    id: string;
    nextStepId: string;
    exit: boolean;
    value: string;
    iconUrl: string | null;
  }[];

  childSteps?: OnboardingQuestion[];

  // [x: string | number | symbol]: unknown;
}
