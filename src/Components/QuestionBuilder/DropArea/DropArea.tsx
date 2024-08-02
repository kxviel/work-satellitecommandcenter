import React from "react";
import { useAppSelector } from "../../../Redux/hooks";
import { Box } from "@mui/material";
import QuestionItemWrapper from "./QuestionItemWrapper";
import { QuestionListStyle } from "../question.style";

const DropArea: React.FC = () => {
  const questions = useAppSelector((state) => state.question.questions);

  return (
    <Box sx={QuestionListStyle}>
      {questions.map((question, index) => (
        <QuestionItemWrapper
          key={question.id}
          index={index}
          question={question}
        />
      ))}
    </Box>
  );
};

export default DropArea;
