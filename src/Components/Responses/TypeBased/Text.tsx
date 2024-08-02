import { Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  QuestionSlice,
  handleFieldUpdate,
} from "../../../Redux/reducers/responseSlice";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import ValidationField from "../ValidationField";
import isEmail from "validator/es/lib/isEmail";
import { useState } from "react";

type Props = {
  currentQuestion: QuestionSlice;
};

const Text = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { responses, properties } = currentQuestion;
  const currentResponse = responses?.[0]?.textValue;

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    if (!isFieldSubmitting && !isPreview) {
      if (properties?.format === "email" || properties?.format === "alphabets")
        setError("");

      dispatch(
        handleFieldUpdate({
          key: "textValue",
          convertToInt: false,
          value: e.target.value,
          id: currentQuestion.id,
        })
      );
    }
  };

  const handleBlur = (e: any) => {
    if (currentQuestion?.id && !isPreview && !isFieldSubmitting) {
      if (properties?.format === "email") {
        const isEmailValid = e.target.value ? isEmail(e.target.value) : true;
        if (isEmailValid) {
          setError("");
          dispatch(
            updateResponse({
              studyId,
              questionId: currentQuestion.id,
              surveySlug,
            })
          );
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
          dispatch(
            updateResponse({
              studyId,
              questionId: currentQuestion.id,
              surveySlug,
            })
          );
        } else {
          setError("Please enter only alphabets(a-z, A-Z)");
        }
      } else {
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
      sx={{
        width: {
          xs: "100%",
          md: "80%",
        },
        pl: "60px",
      }}
      gap={1}
    >
      <TextField
        name="textValue"
        fullWidth
        placeholder="Enter Value"
        value={currentResponse || ""}
        multiline={properties?.allowMultiline}
        rows={properties?.allowMultiline ? 2 : 1}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        InputProps={{ readOnly: isPreview }}
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
export default Text;
