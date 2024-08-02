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
  dateFormat: string;
};

const GridDates = ({ dateFormat }: Props) => {
  const format = dateFormat!;

  const [value, setValue] = useState<DateTime | null>(null);

  return (
    <>
      {dateTimePickerFormats.includes(format) && (
        <DateTimePicker
          format={luxonFormats[format]}
          value={value}
          onChange={(newValue: any) => setValue(newValue)}
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              sx: { width: 250 },
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
          //     sx={{ width: 250 }}
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
          value={value}
          onChange={(newValue: any) => setValue(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              sx: { width: 250 },
              inputProps: {
                readOnly: true,
                placeholder: "Select time",
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
          //     fullWidth
          //     sx={{ width: 250 }}
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
          value={value}
          onChange={(newValue: any) => setValue(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              sx: { width: 250 },
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
          //     sx={{ width: 250 }}
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
