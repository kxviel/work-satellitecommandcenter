import CalculatedFieldPreview from "../PreviewItems/CalculatedFieldPreview";
import DatePreview from "../PreviewItems/DatePreview";
import DropdownPreview from "../PreviewItems/DropdownPreview";
import ExcludeParticipantPreview from "../PreviewItems/ExcludeParticipantPreview";
import GridFieldPreview from "../PreviewItems/GridFieldPreview";
import NumberFieldPreview from "../PreviewItems/NumberFieldPreview";
import RadioFieldPreview from "../PreviewItems/RadioFieldPreview";
import RandomizePreview from "../PreviewItems/RandomizePreview";
import RepeatedFieldPreview from "../PreviewItems/RepeatedFieldPreview";
import SliderPreview from "../PreviewItems/SliderPreview";
import TextFieldPreview from "../PreviewItems/TextFieldPreview";
import UploadFilePreview from "../PreviewItems/UploadFile";

export const PreviewcomponentMap: Record<string, any> = {
  radio: RadioFieldPreview,
  dropdown: DropdownPreview,
  checkbox: RadioFieldPreview,
  grid: GridFieldPreview,
  calculated_field: CalculatedFieldPreview,
  text: TextFieldPreview,
  number: NumberFieldPreview,
  slider: SliderPreview,
  date: DatePreview,
  upload_file: UploadFilePreview,
  repeated_data: RepeatedFieldPreview,
  statement: null,
  randomize: RandomizePreview,
  eligibility: ExcludeParticipantPreview,
};
