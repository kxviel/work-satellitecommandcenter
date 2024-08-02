import { Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import {
  QuestionSlice,
  handleFieldUpdate,
} from "../../../Redux/reducers/responseSlice";
import ValidationField from "../ValidationField";

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
  currentQuestion: QuestionSlice;
};

const DateField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { responses, properties } = currentQuestion;
  const currentResponse = responses?.[0]?.textValue;

  const handleChange = (value: any) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleFieldUpdate({
          key: "textValue",
          convertToInt: false,
          value: value,
          id: currentQuestion.id,
        })
      );

      if (currentQuestion?.id) {
        dispatch(
          updateResponse({
            studyId,
            questionId: currentQuestion.id,
            surveySlug,
          })
        );
      }
    }
  };

  return (
    <Stack
      gap={1}
      sx={{
        width: {
          xs: "100%",
          md: "350px",
        },
        pl: "60px",
      }}
    >
      {properties?.format &&
        dateTimePickerFormats.includes(properties.format) && (
          <DateTimePicker
            readOnly={isPreview}
            format={luxonFormats[properties.format]}
            value={
              currentResponse
                ? DateTime.fromFormat(
                    currentResponse,
                    luxonFormats[properties.format]
                  )
                : null
            }
            onChange={(newValue: any) => {
              if (properties.format) {
                handleChange(
                  newValue.toFormat(luxonFormats[properties.format])
                );
              }
            }}
            timeSteps={{
              minutes: 1,
              seconds: 1,
            }}
            slotProps={{
              textField: {
                InputProps: {
                  readOnly: true,
                  placeholder: "Select date and time",
                },
              },
            }}
            // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            //   <TextField
            //     {...params}
            //     inputProps={{
            //       ...params.inputProps,
            //       readOnly: true,
            //       placeholder: "Select date",
            //     }}
            //   />
            // )}
          />
        )}

      {properties.format && timePickerFormats.includes(properties.format) && (
        <TimePicker
          readOnly={isPreview}
          views={
            properties.format === "HH:mm:ss"
              ? ["hours", "minutes", "seconds"]
              : ["hours", "minutes"]
          }
          format={luxonFormats[properties.format]}
          value={
            currentResponse
              ? DateTime.fromFormat(
                  currentResponse,
                  luxonFormats[properties.format]
                )
              : null
          }
          onChange={(newValue: any) => {
            if (properties.format) {
              handleChange(newValue.toFormat(luxonFormats[properties.format]));
            }
          }}
          timeSteps={{
            minutes: 1,
            seconds: 1,
          }}
          slotProps={{
            textField: {
              InputProps: {
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

      {properties.format && datePickerFormats.includes(properties.format) && (
        <DatePicker
          readOnly={isPreview}
          views={
            properties.format === "YYYY"
              ? ["year"]
              : properties.format === "MM/YYYY"
              ? ["month", "year"]
              : undefined
          }
          format={luxonFormats[properties.format]}
          value={
            currentResponse
              ? DateTime.fromFormat(
                  currentResponse,
                  luxonFormats[properties.format]
                )
              : null
          }
          onChange={(newValue: any) => {
            if (properties.format) {
              handleChange(newValue.toFormat(luxonFormats[properties.format]));
            }
          }}
          slotProps={{
            textField: {
              InputProps: {
                readOnly: true,
                placeholder: "Select date",
              },
            },
          }}
          // renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          //   <TextField
          //     {...params}
          //     inputProps={{
          //       ...params.inputProps,
          //       readOnly: true,
          //       placeholder: "Select date",
          //     }}
          //   />
          // )}
        />
      )}

      {responses?.[0]?.questionValidation && (
        <ValidationField
          validationObject={responses?.[0]?.questionValidation}
        />
      )}
    </Stack>
  );
};
export default DateField;
