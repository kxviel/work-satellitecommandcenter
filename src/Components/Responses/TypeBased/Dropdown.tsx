import { Stack, Select, MenuItem, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import {
  QuestionSlice,
  handleRadioUpdate,
} from "../../../Redux/reducers/responseSlice";
import ValidationField from "../ValidationField";

type Props = {
  currentQuestion: QuestionSlice;
};

const DropdownField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { responses, choices } = currentQuestion;
  const currentResponse = responses?.[0]?.questionChoiceId;

  const handleChange = (choiceId: string, textValue?: string) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleRadioUpdate({
          choiceId,
          textValue,
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
    <Stack sx={{ pl: "60px" }} gap={1}>
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "350px",
          },
        }}
      >
        <Select
          fullWidth
          id="position"
          value={currentResponse || ""}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={isPreview}
        >
          {choices?.map((choice: any) => (
            <MenuItem key={choice?.id} value={choice.id}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {responses?.[0]?.questionValidation && (
        <ValidationField
          validationObject={responses?.[0]?.questionValidation}
        />
      )}
    </Stack>
  );
};
export default DropdownField;
