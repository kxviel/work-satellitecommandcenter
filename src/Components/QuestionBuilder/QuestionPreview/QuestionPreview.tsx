import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { loadQuestionDetails } from "../../../Redux/actions/questionAction";
import QBPreviewHeader from "./QBPreviewHeader";
import QBPreviewQuestions from "./QBPreviewQuestions";
import QuestionPropertiesModalWrapper from "../QuestionProperties/QuestionPropertiesModalWrapper";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { resetQuestionState } from "../../../Redux/reducers/questionSlice";
import { QBArea, QBMessageWrapper } from "../question.style";

const QuestionPreview: React.FC = () => {
  const { id: studyId, formId } = useParams();

  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.question);

  useEffect(() => {
    if (studyId && formId) dispatch(loadQuestionDetails(studyId, formId, true));
    return () => {
      dispatch(resetQuestionState());
    };
  }, [dispatch, studyId, formId]);

  return (
    <div>
      {loading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <QBPreviewHeader />
      {error ? (
        <QBMessageWrapper>
          <Typography variant="h5" color="grey">
            {error}
          </Typography>
        </QBMessageWrapper>
      ) : (
        <QBArea>
          <QBPreviewQuestions />
          <QuestionPropertiesModalWrapper />
        </QBArea>
      )}
    </div>
  );
};

export default QuestionPreview;
