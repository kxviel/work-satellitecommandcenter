import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import isEmail from "validator/es/lib/isEmail";
type Props = {
  currentQuestion: any;
};

const TextFieldPreview = ({ currentQuestion }: Props) => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  const { properties } = currentQuestion;

  const handleChange = (e: any) => {
    if (properties?.format === "email") setError("");
    setValue(e.target.value);
  };

  const handleBlur = (e: any) => {
    if (properties?.format === "email") {
      const isEmailValid = e.target.value ? isEmail(e.target.value) : true;
      if (isEmailValid) {
        setError("");
      } else {
        setError("Please enter a valid email");
      }
    } else if (properties?.format === "alphabets") {
      let isValid = true;
      if (e.target.value) {
        const regex = /^[a-zA-Z]*$/;
        isValid = e.target.value.match(regex);
      }
      if (isValid) {
        setError("");
      } else {
        setError("Please enter only alphabets(a-z, A-Z)");
      }
    }
  };

  return (
    <Stack gap={1}>
      <TextField
        name="textValue"
        fullWidth
        placeholder=""
        error={!!error}
        helperText={error}
        value={value}
        multiline={properties?.allowMultiline}
        rows={properties?.allowMultiline ? 2 : 1}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
      />
    </Stack>
  );
};
export default TextFieldPreview;
