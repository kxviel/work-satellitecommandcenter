import QuestionPickerItem from "./QuestionPickerItem";
import { questionTypes } from "../questionTypes";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const QBPickerWrapper = styled("div")({
  width: "278px",
  height: "100%",

  borderRadius: "4px",
  backgroundColor: "#ffffff",
  padding: "16px",
  overflowY: "hidden",

  "&:hover": {
    overflow: "auto",
  },
});

const QuestionPicker = () => {
  return (
    <QBPickerWrapper>
      <Typography variant="h5" color="textSecondary" sx={{ mb: 1.25 }}>
        Select question type
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
        Select new question types to the left. Edit or rearrange them after.
      </Typography>
      <div>
        {questionTypes.map((questionType) => (
          <QuestionPickerItem
            key={questionType.key}
            questionType={questionType}
          />
        ))}
      </div>
    </QBPickerWrapper>
  );
};

export default QuestionPicker;
