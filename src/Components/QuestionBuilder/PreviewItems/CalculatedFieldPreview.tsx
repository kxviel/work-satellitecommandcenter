import { Button, Stack, TextField } from "@mui/material";
import { QuestionSlice } from "../../../Redux/reducers/responseSlice";

type Props = {
  currentQuestion: QuestionSlice;
};

const CalculatedFieldPreview = ({ currentQuestion }: Props) => {
  return (
    <Stack gap={1}>
      <Stack direction={"row"} gap={2} alignItems={"center"}>
        <TextField
          name="textValue"
          fullWidth
          placeholder=""
          InputProps={{
            readOnly: true,
          }}
        />
        <Button variant="outlined">Calculate</Button>
      </Stack>
    </Stack>
  );
};
export default CalculatedFieldPreview;
