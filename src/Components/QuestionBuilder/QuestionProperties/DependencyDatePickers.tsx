import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { useAppDispatch } from "../../../Redux/hooks";
import { handleDependencyDateChange } from "../../../Redux/reducers/questionSlice";
import { DateTime } from "luxon";
import { Question } from "../../../types/StudyFormById.types";

const datePickerFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY", "MM/YYYY"];
const dateTimePickerFormats = ["DD/MM/YYYY HH:mm", "MM/DD/YYYY HH:mm"];
const timePickerFormats = ["HH:mm", "HH:mm:ss"];
const luxonFormats: Record<string, string> = {
  "DD/MM/YYYY": "dd/MM/yyyy",
  "MM/DD/YYYY": "MM/dd/yyyy",
  "DD/MM/YYYY HH:mm": "dd/MM/yyyy HH:mm",
  "MM/DD/YYYY HH:mm": "MM/dd/yyyy HH:mm",
  "HH:mm": "HH:mm",
  "HH:mm:ss": "HH:mm:ss",
  YYYY: "yyyy",
  "MM/YYYY": "MM/yyyy",
};

type Props = {
  question: Question;
  curr: any;
};

const DependencyDatePickers = ({ question, curr }: Props) => {
  const dispatch = useAppDispatch();

  const format = question?.properties?.format!;

  return (
    <>
      {dateTimePickerFormats.includes(format) && (
        <DateTimePicker
          format={luxonFormats[format]}
          value={
            curr?.textValue
              ? DateTime.fromFormat(curr?.textValue, luxonFormats[format])
              : null
          }
          onChange={(newValue: any) => {
            dispatch(
              handleDependencyDateChange({
                dateValue: newValue.toFormat(luxonFormats[format]),
              })
            );
          }}
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              inputProps: {
                readOnly: true,
                placeholder: "Select date",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     inputProps={{
          //       ...params.inputProps,
          //       readOnly: true,
          //       placeholder: "Select date",
          //     }}
          //   />
          // )}
        />
      )}

      {timePickerFormats.includes(format) && (
        <TimePicker
          views={
            format === "HH:mm:ss"
              ? ["hours", "minutes", "seconds"]
              : ["hours", "minutes"]
          }
          format={luxonFormats[format]}
          value={
            curr?.textValue
              ? DateTime.fromFormat(curr?.textValue, luxonFormats[format])
              : null
          }
          onChange={(newValue: any) => {
            dispatch(
              handleDependencyDateChange({
                dateValue: newValue.toFormat(luxonFormats[format]),
              })
            );
          }}
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              inputProps: {
                readOnly: true,
                placeholder: "Select time",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     inputProps={{
          //       ...params.inputProps,
          //       readOnly: true,
          //       placeholder: "Select time",
          //     }}
          //   />
          // )}
        />
      )}

      {datePickerFormats.includes(format) && (
        <DatePicker
          views={
            format === "YYYY"
              ? ["year"]
              : format === "MM/YYYY"
              ? ["month", "year"]
              : undefined
          }
          format={luxonFormats[format]}
          value={
            curr?.textValue
              ? DateTime.fromFormat(curr?.textValue, luxonFormats[format])
              : null
          }
          onChange={(newValue: any) => {
            dispatch(
              handleDependencyDateChange({
                dateValue: newValue.toFormat(luxonFormats[format]),
              })
            );
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              inputProps: {
                readOnly: true,
                placeholder: "Select date",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     inputProps={{
          //       ...params.inputProps,
          //       readOnly: true,
          //       placeholder: "Select date",
          //     }}
          //   />
          // )}
        />
      )}
    </>
  );
};
export default DependencyDatePickers;
