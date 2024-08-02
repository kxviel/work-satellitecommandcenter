import { Box, Typography } from "@mui/material";
import QuestionBlock from "./QuestionBlock";
import { useAppSelector } from "../../../Redux/hooks";
import { EmptyMessageWrapper, QuestionListStyle } from "../question.style";

const QBPreviewQuestions = () => {
  const { questions, loading } = useAppSelector((state) => state.question);

  return (
    <Box sx={QuestionListStyle}>
      <Box sx={{ width: "70%" }}>
        {questions.length > 0
          ? questions
              .filter((question) => !question.properties.isHidden)
              .map((q, index) => {
                return <QuestionBlock question={q} index={index} key={q.id} />;
              })
          : null}
      </Box>
      {!loading && questions.length === 0 && (
        <EmptyMessageWrapper>
          <Typography variant="h5" color="grey">
            No questions found
          </Typography>
        </EmptyMessageWrapper>
      )}
    </Box>
  );
};

export default QBPreviewQuestions;
