import NumberField from "./PrintItems/NumberField";
import DateField from "./PrintItems/DateField";
import RadioField from "./PrintItems/RadioField";
import SliderField from "./PrintItems/SliderField";
import TextField from "./PrintItems/TextField";
import GridField from "./PrintItems/GridField";
import RepeatedField from "./PrintItems/RepeatedField";
import {
  ExcludeField,
  FileUploadField,
  RandomizeField,
} from "./PrintItems/OtherTypes";

export const PrintcomponentMap: Record<string, any> = {
  text: TextField,
  date: DateField,
  radio: RadioField,
  dropdown: RadioField,
  checkbox: RadioField,
  number: NumberField,
  slider: SliderField,
  grid: GridField,
  repeated_data: RepeatedField,
  randomize: RandomizeField,
  upload_file: FileUploadField,
  eligibility: ExcludeField,
};
