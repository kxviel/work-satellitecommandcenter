import { Slider, Stack, SxProps, Typography } from "@mui/material";

type Props = {
  currentQuestion: any;
};

const sliderStyles: SxProps = {
  "& .MuiSlider-thumb": {
    height: 30,
    width: 30,
    backgroundColor: "#fff",
    border: "8px solid",
    borderColor: "primary.main",
  },
  "& .MuiSlider-track": {
    height: "12px",
  },
  "& .MuiSlider-rail": {
    height: "12px",
    color: "#E5E7EB",
  },
};

const marks = (minVal: number, maxVal: number) => [
  {
    value: minVal,
    label: "",
  },
  {
    value: maxVal,
    label: "",
  },
];

const SliderPreview = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;

  return (
    <Stack gap={1}>
      <Slider
        sx={sliderStyles}
        defaultValue={0}
        min={properties?.min}
        max={properties?.max}
        step={properties?.step}
        valueLabelDisplay="auto"
        marks={marks(properties?.min, properties?.max)}
      />

      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography>{properties?.minLabel}</Typography>
        <Typography>{properties?.maxLabel}</Typography>
      </Stack>
    </Stack>
  );
};
export default SliderPreview;
