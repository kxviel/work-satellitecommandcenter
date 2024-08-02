import { v4 as uuid } from "uuid";
import {
  CalendarIcon,
  GridIcon,
  MCQMultiIcon,
  MCQSingleIcon,
  NumberIcon,
  ShortTextIcon,
  StatementIcon,
  UploadIcon,
  SliderIcon,
  DropdownIcon,
  CalculatedIcon,
  RepeatedDataIcon,
  SummaryIcon,
  RandomizeIcon,
  EligibilityIcon,
  RepeatedMeasureIcon,
} from "./Icons";

export const displayTypes = [
  "text",
  "date",
  "slider",
  "calculated_field",
  "radio",
  "checkbox",
  "dropdown",
  "number",
];

export const textTypes = ["text", "date"];
export const number_types = ["number", "slider", "calculated_field"];
export const choice_types = ["radio", "checkbox", "dropdown"];
export const no_validation_types = [
  "statement",
  "upload_file",
  "grid",
  "repeated_data",
  "summary",
  "randomize",
  "eligibility",
  "repeated_measure",
];
export const no_advanced_types = [
  "statement",
  "summary",
  "randomize",
  "eligibility",
  "repeated_measure",
];

export const noValueTypes = [
  "statement",
  "summary",
  "eligibility",
  "repeated_measure",
];

export const IconMap: any = {
  radio: MCQSingleIcon,
  checkbox: MCQMultiIcon,
  dropdown: DropdownIcon,
  text: ShortTextIcon,
  number: NumberIcon,
  date: CalendarIcon,
  statement: StatementIcon,
  summary: SummaryIcon,
  slider: SliderIcon,
  upload_file: UploadIcon,
  calculated_field: CalculatedIcon,
  grid: GridIcon,
  repeated_data: RepeatedDataIcon,
  randomize: RandomizeIcon,
  eligibility: EligibilityIcon,
  repeated_measure: RepeatedMeasureIcon,
};

export const QuestionLabelMap: any = {
  radio: "Multiple Choice",
  checkbox: "Checkbox",
  text: "Text Field",
  date: "Date Field",
  number: "Number Field",
  upload_file: "Upload file Field",
  grid: "Grid Field",
  statement: "Statement",
  dropdown: "Dropdown Field",
  slider: "Slider Field",
  calculated_field: "Calculated Field",
  repeated_data: "Repeated Data Field",
  summary: "Summary Field",
  randomize: "Randomization Field",
  eligibility: "Exclude Participant Field",
};

export const questionTypes = [
  {
    key: "1",
    type: "radio",
    title: "Multiple Choice",
    icon: IconMap["radio"],
  },
  {
    key: "2",
    title: "Checkbox",
    type: "checkbox",
    icon: IconMap["checkbox"],
  },
  {
    key: "5",
    title: "Text",
    type: "text",
    icon: IconMap["text"],
  },
  {
    key: "6",
    title: "Number",
    type: "number",
    icon: IconMap["number"],
  },
  {
    key: "8",
    title: "Date",
    type: "date",
    icon: IconMap["date"],
  },
  {
    key: "10",
    title: "Upload file",
    type: "upload_file",
    icon: IconMap["upload_file"],
  },
  {
    key: "11",
    title: "Grid",
    type: "grid",
    icon: IconMap["grid"],
  },
  {
    key: "12",
    title: "Statement",
    type: "statement",
    icon: IconMap["statement"],
  },
  {
    key: "15",
    title: "Slider",
    type: "slider",
    icon: IconMap["slider"],
  },
  {
    key: "16",
    title: "Dropdown",
    type: "dropdown",
    icon: IconMap["dropdown"],
  },
  {
    key: "17",
    title: "Calculated Field",
    type: "calculated_field",
    icon: IconMap["calculated_field"],
  },
  {
    key: "18",
    title: "Repeated Data",
    type: "repeated_data",
    icon: IconMap["repeated_data"],
  },
  {
    key: "19",
    title: "Summary",
    type: "summary",
    icon: IconMap["summary"],
  },
  {
    key: "20",
    title: "Randomize",
    type: "randomize",
    icon: IconMap["randomize"],
  },
  {
    key: "21",
    title: "Exclude Participant",
    type: "eligibility",
    icon: IconMap["eligibility"],
  },
  {
    key: "22",
    title: "Repeated Measure",
    type: "repeated_measure",
    icon: IconMap["repeated_measure"],
  },
];

export const supportedTypes = questionTypes.map((question) => question.type);

const basicField = {
  label: "",
  varname: "",
  helperText: "",
  validations: [],
};

// TODO
const choiceField = () => {
  return {
    ref: uuid(),
    label: "",
    position: 1,
    value: "",
    isOther: false,
  };
};

const multipleChoiceField = () => ({
  ...basicField,
  excludeExport: false,
  properties: {
    required: false,
    orientation: "vertical",
    remarkText: "",
    bulletStyle: "alphabetical",
  },
  choices: [choiceField()],
});

const dropdownField = () => ({
  ...basicField,
  excludeExport: false,
  properties: {
    required: false,
    remarkText: "",
  },
  choices: [choiceField()],
});

const textField = {
  ...basicField,
  isEncrypted: false,
  excludeExport: false,
  properties: {
    required: false,
    allowMultiline: false,
    remarkText: "",
    format: "",
  },
};

const numberField = {
  ...basicField,
  isEncrypted: false,
  excludeExport: false,
  properties: {
    required: false,
    allowDecimal: false,
    measurementUnit: "",
    remarkText: "",
  },
};

const dateField = {
  ...basicField,
  isEncrypted: false,
  excludeExport: false,
  properties: {
    required: false,
    format: "DD/MM/YYYY",
  },
};

const sliderField = {
  ...basicField,
  isEncrypted: false,
  excludeExport: false,
  properties: {
    required: false,
    minLabel: "",
    maxLabel: "",
    remarkText: "",
    min: 0,
    max: 100,
    step: 1,
  },
};

const uploadField = {
  ...basicField,
  excludeExport: false,
  properties: {
    required: false,
    remarkText: "",
    max: 2,
  },
};

const calculatedField = {
  ...basicField,
  excludeExport: false,
  calculationTemplate: "",
  properties: {
    required: false,
    remarkText: "",
    isHidden: false,
  },
};

const statementField = {
  ...basicField,
  excludeExport: true,
  properties: {},
};

const randomizeField = {
  ...basicField,
  excludeExport: true,
  properties: {},
};

const repeatedMeasureField = {
  ...basicField,
  excludeExport: true,
  properties: {
    showAll: false,
    phaseId: "",
  },
};

const eligibilityField = {
  ...basicField,
  excludeExport: true,
  properties: {},
};

const gridField = {
  ...basicField,
  excludeExport: false,
  properties: {
    required: false,
    remarkText: "",
    gridConfig: {
      fieldType: "row",
      rows: [{ label: "", type: "text" }],
      columns: [{ label: "" }],
    },
  },
};

const repeatedField = {
  ...basicField,
  excludeExport: false,
  properties: {
    required: false,
    remarkText: "",
    repeatedConfig: {
      columns: [
        {
          label: "",
          type: "text",
        },
      ],
    },
  },
};

export const fieldMap = (type: string) => {
  switch (type) {
    case "radio":
      return multipleChoiceField();
    case "checkbox":
      return multipleChoiceField();
    case "dropdown":
      return dropdownField();
    case "text":
      return textField;
    case "date":
      return dateField;
    case "slider":
      return sliderField;
    case "number":
      return numberField;
    case "upload_file":
      return uploadField;
    case "statement":
      return statementField;
    case "summary":
      return statementField;
    case "randomize":
      return randomizeField;
    case "eligibility":
      return eligibilityField;
    case "grid":
      return gridField;
    case "repeated_data":
      return repeatedField;
    case "calculated_field":
      return calculatedField;
    case "repeated_measure":
      return repeatedMeasureField;
    default:
      return {};
  }
};
