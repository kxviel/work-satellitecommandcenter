import { useAppSelector } from "../../../Redux/hooks";
import QuestionPropertiesModal from "./QuestionPropertiesModal";

const QuestionPropertiesModalWrapper = () => {
  const showPropModal = useAppSelector((state) => state.question.showPropModal);
  return showPropModal ? <QuestionPropertiesModal /> : null;
};

export default QuestionPropertiesModalWrapper;
