import { Stack, Select, MenuItem, Box } from "@mui/material";

type Props = {
  currentQuestion: any;
};

const DropdownPreview = ({ currentQuestion }: Props) => {
  const { choices } = currentQuestion;

  return (
    <Stack>
      <Box sx={{ width: "350px" }}>
        <Select fullWidth id="position" defaultValue={""}>
          {choices?.map((choice: any) => (
            <MenuItem key={choice?.id} value={choice.id}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Stack>
  );
};
export default DropdownPreview;
