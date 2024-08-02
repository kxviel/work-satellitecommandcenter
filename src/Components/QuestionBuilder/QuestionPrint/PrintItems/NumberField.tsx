import { Stack } from "@mui/material";

type Props = {
  currentQuestion: any;
};

const NumberField = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;

  return (
    <Stack gap={1} direction={"row"} alignItems={"center"}>
      <input style={{ width: "200px", height: "35px" }} />
      {properties.measurementUnit && <div>{properties.measurementUnit}</div>}
    </Stack>
  );
};
export default NumberField;
