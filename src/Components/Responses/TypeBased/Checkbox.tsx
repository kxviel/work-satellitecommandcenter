import { Box, Stack, SxProps, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import {
  QuestionSlice,
  handleCheckboxIsOtherUpdate,
  handleCheckboxUpdate,
} from "../../../Redux/reducers/responseSlice";
import ValidationField from "../ValidationField";
import ImagePreview from "../../Common/UI/ImagePreview";
import { useState } from "react";

type Props = {
  currentQuestion: QuestionSlice;
};

const radioWrapperStyle: SxProps = {
  width: "100%",
  minHeight: "55px",
  borderRadius: 1,

  border: "1px solid",
  borderColor: "divider",

  "&:hover": {
    cursor: "pointer",
    bgcolor: "secondary.main",
    borderColor: "primary.main",

    "&>div": {
      borderColor: "primary.main",
      color: "primary.main",
    },
  },
};

const radioIndex: SxProps = {
  p: 2,

  borderRight: "1px solid",
  borderColor: "divider",
  minWidth: "48px",
  height: "100%",
};

const radioValue: SxProps = {
  p: 2,
  flex: 1,
  alignItems: "center",
  justifyContent: "space-between",
};

const radioWrapperActiveStyle: SxProps = {
  width: "100%",
  minHeight: "55px",
  borderRadius: 1,
  border: "1px solid",
  bgcolor: "secondary.main",
  borderColor: "primary.main",
  "&:hover": {
    cursor: "pointer",
  },
};

const CheckboxField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const [imagePreview, setImagePreview] = useState<string>("");
  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { responses, choices, properties } = currentQuestion;

  const handleChange = (choiceId: string, textValue?: string) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleCheckboxUpdate({
          choiceId,
          textValue,
          id: currentQuestion.id,
        })
      );

      if (currentQuestion?.id && typeof textValue === "undefined") {
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

  const handleIsOtherChange = (choiceId: string, textValue: string) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleCheckboxIsOtherUpdate({
          choiceId,
          textValue,
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

  const showImagePreview = (
    event: React.MouseEvent<HTMLElement>,
    url?: string
  ) => {
    event.stopPropagation();
    setImagePreview(url || "");
  };

  const closeImagePreview = () => {
    setImagePreview("");
  };

  const getDisplayType = (index: number, value?: any) => {
    if (currentQuestion.properties.bulletStyle === "alphabetical") {
      return String.fromCharCode(65 + index);
    } else if (currentQuestion.properties.bulletStyle === "numerical") {
      return index + 1;
    } else if (currentQuestion.properties.bulletStyle === "values") {
      return value;
    } else if (currentQuestion.properties.bulletStyle === "bullets") {
      return "•";
    } else {
      return String.fromCharCode(65 + index);
    }
  };

  return (
    <Stack
      sx={{
        width: "100%",
        pl: {
          xs: 0,
          md: "60px",
        },
      }}
      gap={1}
    >
      <Stack
        gap={2}
        direction={properties?.orientation === "vertical" ? "column" : "row"}
        flexWrap={"wrap"}
        alignItems={
          properties?.orientation === "vertical" ? "flex-start" : "center"
        }
      >
        {choices?.map((choice, index) => (
          <Stack
            key={choice?.id}
            direction={"row"}
            gap={1}
            alignItems={"center"}
            sx={{
              width: {
                xs: "100%",
                md: "350px",
              },
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={
                responses &&
                responses?.find((r) => r.questionChoiceId === choice?.id)
                  ? radioWrapperActiveStyle
                  : radioWrapperStyle
              }
              onClick={() => {
                if (!isPreview && !choice?.isOther) {
                  handleChange(choice?.id);
                }
              }}
            >
              <Box sx={radioIndex}>{getDisplayType(index, choice?.value)}</Box>
              {choice.previewUrl && (
                <Box
                  sx={{
                    maxHeight: 50,
                    maxWidth: 192,
                    borderRadius: "8px",
                    cursor: "pointer",
                    ml: 1,
                  }}
                  onClick={(e) => showImagePreview(e, choice.previewUrl)}
                >
                  <img
                    src={choice.previewUrl}
                    alt="preview"
                    style={{
                      maxHeight: "50px",
                      maxWidth: "192px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
              <Stack
                sx={radioValue}
                direction={choice?.isOther ? "column-reverse" : "row"}
                gap={1}
              >
                <Typography
                  fontWeight={500}
                  // sx={{ width: choice?.isOther ? 70 : 265 }}
                  // noWrap
                  title={choice?.label}
                >
                  {choice?.label}
                </Typography>
                {choice?.isOther && (
                  <TextField
                    fullWidth
                    name="textValue"
                    placeholder="Enter Value"
                    sx={{ bgcolor: "white" }}
                    value={
                      responses?.find((r) => r.questionChoiceId === choice?.id)
                        ?.textValue || ""
                    }
                    onChange={(e) => {
                      handleIsOtherChange(choice?.id, e.target.value);
                    }}
                    onBlur={handleBlur}
                    InputProps={{ readOnly: isPreview }}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
      {responses?.[0]?.questionValidation && (
        <ValidationField
          validationObject={responses?.[0]?.questionValidation}
        />
      )}
      {imagePreview && (
        <ImagePreview
          closeHandler={closeImagePreview}
          image={imagePreview || ""}
        />
      )}
    </Stack>
  );
};
export default CheckboxField;
