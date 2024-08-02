import { fieldMap } from "../Components/QuestionBuilder/questionTypes";
import { v4 as uuid } from "uuid";

export const repeatedDataTypes: any = {
  adverse_event: "Adverse Event",
  medication: "Medication",
  repeated_measure: "Repeated Measure",
  event: "Event",
  unscheduled_visit: "Unscheduled Visit",
  other: "Other",
};

export const createQuestionSkeleton = (type: string) => ({
  ...fieldMap(type),
  type,
  id: uuid(),
});

export const createNewOption = () => ({
  ref: uuid(),
  label: "",
  value: "",
  isOther: false,
});

export const prefillOptionFormatter = (options: any[]): any[] => {
  return options.map((opt) => {
    return {
      ref: uuid(),
      label: opt.label,
      value: opt.value,
      isOther: false,
    };
  });
};

export const createNewRepeatedColumn = () => ({
  label: "",
  type: "text",
});

export const createNewGrid = () => ({
  label: "",
  type: "text",
});

const baseValidation = {
  type: "info",
  message: "",
};

export const createNewValidation = () => {
  return baseValidation;
};

const baseDependency = {
  parentFormId: "",
  parentQuestionId: "",
  operator: "",
};

export const createNewDependency = (formCategory: string, formId: string) => {
  let item = baseDependency;

  if (formCategory !== "visit") {
    item = { ...item, parentFormId: formId };
  }

  return item;
};
