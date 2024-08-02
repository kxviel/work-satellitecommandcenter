import { Box, SxProps, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { setQuestionModalDetails } from "../../../Redux/reducers/questionSlice";
import { createQuestionSkeleton } from "../../../utils/question";

type Props = {
  questionType: {
    key: string;
    icon: any;
    type: string;
    title: string;
  };
};

const containerStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  px: 1.5,
  height: "44px",
  border: "1px solid",
  borderColor: "#E5E7EB",
  borderRadius: "10px",

  "&:not(:last-child)": {
    mb: 2,
  },
};

const QuestionPickerItem = (props: Props) => {
  const { questionType } = props;

  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.questions);
  const editable = useAppSelector((state) => state.question.editable);

  const handleSelectQuestionType = () => {
    if (editable) {
      let newQuestion: any = createQuestionSkeleton(questionType.type);
      newQuestion.position = questions.length + 1;

      if (newQuestion) {
        dispatch(
          setQuestionModalDetails({
            show: true,
            question: newQuestion,
            modalIsEdit: false,
          })
        );
      }
    }
  };

  const Icon = questionType.icon;

  return (
    <Box
      sx={{
        ...containerStyle,
        "&:hover": {
          cursor: editable ? "pointer" : "default",
          bgcolor: "#EfEfEf",
        },
      }}
      onClick={handleSelectQuestionType}
    >
      {Icon && <Icon />}
      <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1.5 }}>
        {questionType.title}
      </Typography>
    </Box>
  );
};

export default QuestionPickerItem;
