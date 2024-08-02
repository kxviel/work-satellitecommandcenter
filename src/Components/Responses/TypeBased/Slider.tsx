import { Slider, Stack, SxProps, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { handleFieldUpdate } from "../../../Redux/reducers/responseSlice";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import ValidationField from "../ValidationField";

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

const SliderField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { responses, properties } = currentQuestion;
  const currentResponse = responses?.[0]?.numberValue || null;

  const handleChange = (value: number | number[]) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleFieldUpdate({
          key: "numberValue",
          convertToInt: true,
          value: value.toString(),
          id: currentQuestion.id,
        })
      );
    }
  };

  const handleBlur = () => {
    if (currentQuestion?.id && !isPreview && !isFieldSubmitting) {
      dispatch(
        updateResponse({
          studyId,
          questionId: currentQuestion.id,
          surveySlug,
        })
      );
    }
  };

  return (
    <Stack
      sx={{
        width: {
          xs: "90%",
          md: "80%",
        },
        pl: "60px",
      }}
      gap={1}
    >
      <Slider
        sx={sliderStyles}
        defaultValue={0}
        min={properties?.min}
        max={properties?.max}
        step={properties?.step}
        valueLabelDisplay="auto"
        value={currentResponse}
        marks={marks(properties?.min, properties?.max)}
        onChange={(_, val) => handleChange(val)}
        onChangeCommitted={handleBlur}
        disabled={isPreview}
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

      {responses?.[0]?.questionValidation && (
        <ValidationField
          validationObject={responses?.[0]?.questionValidation}
        />
      )}
    </Stack>
  );
};
export default SliderField;
