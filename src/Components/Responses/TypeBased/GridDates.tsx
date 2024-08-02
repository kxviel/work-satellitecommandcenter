import { Sigh } from "./GridField";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
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

const GridDates = ({
  rowIndex,
  colIndex,
  currentQuestion,
  dateFormat,
  handleChange,
  isGrid,
  isPreview,
}: Sigh) => {
  const { responses } = currentQuestion;
  const currentResponse =
    responses?.[0]?.[isGrid ? "gridData" : "repeatedData"]?.[rowIndex][colIndex]
      ?.textValue || "";

  return (
    <>
      {dateFormat && dateTimePickerFormats.includes(dateFormat) && (
        <DateTimePicker
          readOnly={isPreview}
          format={luxonFormats[dateFormat]}
          value={
            currentResponse
              ? DateTime.fromFormat(currentResponse, luxonFormats[dateFormat])
              : null
          }
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
          onChange={(newValue: any) => {
            handleChange(
              newValue.toFormat(luxonFormats[dateFormat]),
              rowIndex,
              colIndex,
              "textValue"
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
                width: 200,
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     sx={{ width: 200 }}
          //     inputProps={{
          //       ...params.inputProps,
          //       readOnly: true,
          //       placeholder: "Select date",
          //     }}
          //   />
          // )}
        />
      )}
      {dateFormat && timePickerFormats.includes(dateFormat) && (
        <TimePicker
          readOnly={isPreview}
          views={
            dateFormat === "HH:mm:ss"
              ? ["hours", "minutes", "seconds"]
              : ["hours", "minutes"]
          }
          format={luxonFormats[dateFormat]}
          value={
            currentResponse
              ? DateTime.fromFormat(currentResponse, luxonFormats[dateFormat])
              : null
          }
          onChange={(newValue: any) => {
            handleChange(
              newValue.toFormat(luxonFormats[dateFormat]),
              rowIndex,
              colIndex,
              "textValue"
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
              sx: {
                width: 200,
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     sx={{ width: 200 }}
          //     inputProps={{
          //       ...params.inputProps,
          //       readOnly: true,
          //       placeholder: "Select time",
          //     }}
          //   />
          // )}
        />
      )}
      {dateFormat && datePickerFormats.includes(dateFormat) && (
        <DatePicker
          readOnly={isPreview}
          views={
            dateFormat === "YYYY"
              ? ["year"]
              : dateFormat === "MM/YYYY"
              ? ["month", "year"]
              : undefined
          }
          format={luxonFormats[dateFormat]}
          value={
            currentResponse
              ? DateTime.fromFormat(currentResponse, luxonFormats[dateFormat])
              : null
          }
          onChange={(newValue: any) => {
            handleChange(
              newValue.toFormat(luxonFormats[dateFormat]),
              rowIndex,
              colIndex,
              "textValue"
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
                width: 200,
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     fullWidth
          //     sx={{ width: 200 }}
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
export default GridDates;
