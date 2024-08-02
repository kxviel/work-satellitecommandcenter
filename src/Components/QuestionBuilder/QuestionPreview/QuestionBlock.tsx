import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { useAppDispatch } from "../../../Redux/hooks";
import {
  QuestionItemStyle,
  requiredStyles,
  previewIndexStyle,
} from "../question.style";
import { setQuestionModalDetails } from "../../../Redux/reducers/questionSlice";
import { PreviewcomponentMap } from "./PreviewMap";
import { Settings } from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";
import { useState } from "react";
import ImagePreview from "../../Common/UI/ImagePreview";

type BlockProp = {
  question: any;
  index: number;
};

const QuestionBlock: React.FC<BlockProp> = ({ question, index }) => {
  const dispatch = useAppDispatch();
  const [showImagePreview, setImagePreview] = useState(false);
  const toggleImagePreview = () => {
    setImagePreview((prev) => !prev);
  };

  const handleEditQuestion = () => {
    dispatch(
      setQuestionModalDetails({
        question,
        show: true,
        modalIsEdit: true,
      })
    );
  };

  const Component = PreviewcomponentMap[question.type];

  return (
    <Stack sx={QuestionItemStyle} justifyContent={"center"} gap={2}>
      <Stack
        direction="row"
        alignItems={"flex-start"}
        justifyContent={"space-between"}
      >
        <Stack direction="row" alignItems={"flex-start"} gap={2}>
          {["statement", "summary"].includes(question.type) ? (
            <></>
          ) : (
            <Stack sx={previewIndexStyle}>{index + 1}</Stack>
          )}

          <Box sx={{ flex: 1, minWidth: "0px" }}>
            <Box
              mt={1}
              sx={question?.properties?.required ? requiredStyles : {}}
            >
              <MDEditor.Markdown
                wrapperElement={{
                  "data-color-mode": "light",
                }}
                source={question.labelMarkdown}
                rehypePlugins={[rehypeSanitize]}
                style={{ fontWeight: "400" }}
              />
            </Box>
          </Box>
        </Stack>

        <Stack direction="row" alignItems={"center"}>
          <Tooltip title={"View Details"}>
            <IconButton onClick={handleEditQuestion}>
              <Settings color="primary" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {(Component || question?.signedImageUrl) && (
        <Stack gap={1} sx={{ width: "85%", pl: "60px" }}>
          {question?.signedImageUrl && (
            <Box
              sx={{
                maxHeight: 97,
                maxWidth: 192,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={toggleImagePreview}
            >
              <img
                src={question.signedImageUrl}
                alt="preview"
                style={{
                  maxHeight: "97px",
                  maxWidth: "192px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
          {Component && <Component currentQuestion={question} />}
        </Stack>
      )}

      {showImagePreview && (
        <ImagePreview
          closeHandler={toggleImagePreview}
          image={question.signedImageUrl || ""}
        />
      )}
    </Stack>
  );
};

export default QuestionBlock;
