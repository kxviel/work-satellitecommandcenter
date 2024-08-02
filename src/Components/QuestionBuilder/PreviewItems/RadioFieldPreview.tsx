import { Stack, TextField, Box, SxProps, Typography } from "@mui/material";
import { useState } from "react";
import ImagePreview from "../../Common/UI/ImagePreview";

type Props = {
  currentQuestion: any;
};

const radioWrapperStyle: SxProps = {
  width: "350px",
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

const RadioFieldPreview = ({ currentQuestion }: Props) => {
  const { choices, properties } = currentQuestion;
  const [imagePreview, setImagePreview] = useState<string>("");
  const showImagePreview = (
    event: React.MouseEvent<HTMLElement>,
    url: string
  ) => {
    event.stopPropagation();
    setImagePreview(url);
  };

  const closeImagePreview = () => {
    setImagePreview("");
  };

  const getDisplayType = (index: number, value?: string) => {
    if (properties.bulletStyle === "alphabetical") {
      return String.fromCharCode(65 + index);
    } else if (properties.bulletStyle === "numerical") {
      return index + 1;
    } else if (properties.bulletStyle === "values") {
      return value;
    } else if (properties.bulletStyle === "bullets") {
      return "•";
    } else {
      return String.fromCharCode(65 + index);
    }
  };

  return (
    <Stack
      gap={2}
      direction={properties?.orientation === "vertical" ? "column" : "row"}
      flexWrap={"wrap"}
      alignItems={
        properties?.orientation === "vertical" ? "flex-start" : "center"
      }
    >
      {choices?.map((choice: any, index: number) => (
        <Stack
          key={choice?.id}
          direction={"row"}
          gap={1}
          alignItems={"center"}
          sx={radioWrapperStyle}
        >
          <Stack direction={"row"} alignItems={"center"}>
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
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      ))}
      {imagePreview && (
        <ImagePreview
          closeHandler={closeImagePreview}
          image={imagePreview || ""}
        />
      )}
    </Stack>
  );
};
export default RadioFieldPreview;
