import { InputAdornment, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  QuestionSlice,
  handleFieldUpdate,
} from "../../../Redux/reducers/responseSlice";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import { useState } from "react";
import ValidationField from "../ValidationField";

type Props = {
  currentQuestion: QuestionSlice;
};

const NumberField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>("");

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { responses, properties } = currentQuestion;
  const currentResponse = responses?.[0]?.numberValue;

  const validator = (value: string) => {
    const valueAsNumber = parseFloat(value);

    if (!properties?.allowDecimal && value.toString().includes(".")) {
      setError("Value must not be a decimal");
    } else if (
      typeof properties?.min === "number" &&
      typeof properties?.max === "number" &&
      (valueAsNumber < properties.min || valueAsNumber > properties.max)
    ) {
      setError(
        `Value must be between ${properties?.min} and ${properties?.max}`
      );
    } else if (
      typeof properties?.min === "number" &&
      valueAsNumber < properties.min
    ) {
      setError(`Value must be greater than ${properties?.min}`);
    } else if (
      typeof properties?.max === "number" &&
      valueAsNumber > properties.max
    ) {
      setError(`Value must be less than ${properties?.max}`);
    } else {
      setError("");
    }
  };

  const handleChange = (value: string) => {
    if (!isFieldSubmitting && !isPreview) {
      validator(value);
      dispatch(
        handleFieldUpdate({
          key: "numberValue",
          convertToInt: true,
          value: value,
          id: currentQuestion.id,
        })
      );
    }
  };

  const handleBlur = () => {
    if (currentQuestion?.id && !isPreview && !error && !isFieldSubmitting) {
      dispatch(
        updateResponse({
          studyId,
          questionId: currentQuestion.id,
          surveySlug,
        })
      );
    }
  };

  return (
    <Stack
      sx={{
        width: {
          xs: "100%",
          md:
            typeof properties?.fieldWidth === "number"
              ? 32 + (properties?.fieldWidth - 4) * 3 + "%"
              : "80%",
        },
        pl: "60px",
      }}
    >
      <TextField
        type="number"
        name="numberValue"
        fullWidth
        placeholder="Enter Value"
        value={typeof currentResponse === "number" ? currentResponse : ""}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        InputProps={{
          readOnly: isPreview,
          inputProps: {
            min: properties?.min,
            max: properties?.max,
          },
          endAdornment: properties?.measurementUnit ? (
            <InputAdornment position="end">
              {properties.measurementUnit}
            </InputAdornment>
          ) : null,
        }}
        error={!!error}
        helperText={error}
      />

      {responses?.[0]?.questionValidation && (
        <ValidationField
          validationObject={responses?.[0]?.questionValidation}
        />
      )}
    </Stack>
  );
};
export default NumberField;
