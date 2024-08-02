import { InputAdornment, Stack, TextField } from "@mui/material";
import { useState } from "react";

type Props = {
  currentQuestion: any;
};

const NumberFieldPreview = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<any>();

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
    const num = parseFloat(value);
    validator(value);
    if (isNaN(num)) {
      setValue("");
    } else setValue(num);
  };

  return (
    <Stack gap={1}>
      <TextField
        name="textValue"
        sx={{
          width:
            typeof currentQuestion?.properties?.fieldWidth === "number"
              ? 32 + (currentQuestion?.properties?.fieldWidth - 4) * 3 + "%"
              : "80%",
        }}
        value={typeof value === "number" ? value : ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder=""
        type="number"
        InputProps={{
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
    </Stack>
  );
};
export default NumberFieldPreview;
