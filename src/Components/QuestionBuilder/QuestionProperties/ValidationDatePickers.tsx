import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { useAppDispatch } from "../../../Redux/hooks";
import { handleValidationDateChange } from "../../../Redux/reducers/questionSlice";
import { DateTime } from "luxon";

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
  question: any;
  curr: any;
  i: number;
};

const ValidationDatePickers = ({ question, curr, i }: Props) => {
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
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
          onChange={(newValue: any) => {
            dispatch(
              handleValidationDateChange({
                currentValidationIndex: i,
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
              sx: {
                width: "50%",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     sx={{ width: "50%" }}
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
              handleValidationDateChange({
                currentValidationIndex: i,
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
              sx: {
                width: "50%",
              },
              inputProps: {
                readOnly: true,
                placeholder: "Select time",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
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
              handleValidationDateChange({
                currentValidationIndex: i,
                dateValue: newValue.toFormat(luxonFormats[format]),
              })
            );
          }}
          slotProps={{
            textField: {
              sx: {
                width: "50%",
              },
              inputProps: {
                readOnly: true,
                placeholder: "Select date",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     sx={{ width: "50%" }}
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
export default ValidationDatePickers;
