import { Stack, TextField } from "@mui/material";
import { QuestionSlice } from "../../../Redux/reducers/responseSlice";
import ValidationField from "../ValidationField";

type Props = {
  currentQuestion: QuestionSlice;
};

const CalculatedField = ({ currentQuestion }: Props) => {
  const { responses } = currentQuestion;
  const currentResponse = responses?.[0]?.numberValue;

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
        placeholder="Calculated Value"
        value={typeof currentResponse === "number" ? currentResponse : ""}
        InputProps={{ readOnly: true }}
      />

      {responses?.[0]?.questionValidation && (
        <ValidationField
          validationObject={responses?.[0]?.questionValidation}
        />
      )}
    </Stack>
  );
};
export default CalculatedField;
