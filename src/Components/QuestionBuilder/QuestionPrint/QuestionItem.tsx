import { PrintcomponentMap } from "./PrintMap";

const QuestionItem = ({ question }: any) => {
  const Component = PrintcomponentMap[question.type];

  return Component ? <Component currentQuestion={question} /> : null;
};

export default QuestionItem;
