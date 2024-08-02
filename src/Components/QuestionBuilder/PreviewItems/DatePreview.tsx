import { Stack } from "@mui/material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useState } from "react";

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
  currentQuestion: any;
};

const DatePreview = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;

  const [value, setValue] = useState<DateTime | null>(null);

  return (
    <Stack gap={1}>
      {dateTimePickerFormats.includes(properties.format) && (
        <DateTimePicker
          format={luxonFormats[properties?.format]}
          value={value}
          onChange={(newValue: any) => {
            setValue(newValue);
          }}
          slotProps={{
            textField: {
              sx: {
                width: "50%",
              },
              inputProps: {
                readOnly: true,
                placeholder: "Select date and time",
              },
            },
          }}
          timeSteps={{
            minutes: 1,
            seconds: 1,
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

      {timePickerFormats.includes(properties.format) && (
        <TimePicker
          views={
            properties.format === "HH:mm:ss"
              ? ["hours", "minutes", "seconds"]
              : ["hours", "minutes"]
          }
          format={luxonFormats[properties?.format]}
          value={value}
          onChange={(newValue: any) => setValue(newValue)}
          slotProps={{
            textField: {
              inputProps: {
                readOnly: true,
                placeholder: "Select time",
              },
              sx: {
                width: "50%",
              },
            },
          }}
          timeSteps={{
            minutes: 1,
            seconds: 1,
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

      {datePickerFormats.includes(properties.format) && (
        <DatePicker
          views={
            properties.format === "YYYY"
              ? ["year"]
              : properties.format === "MM/YYYY"
              ? ["month", "year"]
              : undefined
          }
          format={luxonFormats[properties?.format]}
          value={value}
          onChange={(newValue: any) => setValue(newValue)}
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
    </Stack>
  );
};
export default DatePreview;
