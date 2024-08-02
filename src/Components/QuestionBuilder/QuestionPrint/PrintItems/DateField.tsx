import { Stack } from "@mui/material";

type Props = {
  currentQuestion: any;
};

const DateField = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;

  return (
    <Stack gap={1} direction={"row"} alignItems={"center"}>
      <input style={{ width: "200px", height: "35px" }} />
      <div style={{ fontSize: "14px" }}>({properties.format})</div>
    </Stack>
  );
};
export default DateField;
