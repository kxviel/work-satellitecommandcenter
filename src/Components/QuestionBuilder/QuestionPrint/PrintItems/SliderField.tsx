import { Stack } from "@mui/material";

type Props = {
  currentQuestion: any;
};

const SliderPreview = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;

  return (
    <Stack gap={1} direction={"row"} alignItems={"center"}>
      <span style={{ textAlign: "center" }}>
        <div>{properties?.minLabel}</div>
        <div>({properties?.min})</div>
      </span>
      <div
        style={{
          width: "200px",
          height: "1px",
          borderBottom: "1px solid black",
        }}
      />
      <span style={{ textAlign: "center" }}>
        <div>{properties?.maxLabel}</div>
        <div>({properties?.max})</div>
      </span>
    </Stack>
  );
};
export default SliderPreview;
