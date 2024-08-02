import { useEffect } from "react";
import { useParams } from "react-router-dom";
import DropArea from "./DropArea/DropArea";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import QBHeader from "./QBHeader";
import {
  loadOptionGroups,
  loadQuestionDetails,
} from "../../Redux/actions/questionAction";

import QuestionPicker from "./QuestionPicker/QuestionPicker";
import { Backdrop, CircularProgress } from "@mui/material";
import { resetQuestionState } from "../../Redux/reducers/questionSlice";
import QuestionPropertiesModalWrapper from "./QuestionProperties/QuestionPropertiesModalWrapper";
import { QBArea } from "./question.style";

const QuestionBuilder = () => {
  const { id: studyId, formId } = useParams();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.question.loading);

  useEffect(() => {
    if (studyId && formId) {
      dispatch(loadQuestionDetails(studyId, formId));
      dispatch(loadOptionGroups(studyId));
    }
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

      <QBHeader />
      <QBArea>
        <QuestionPicker />
        <DropArea />
        <QuestionPropertiesModalWrapper />
      </QBArea>
    </div>
  );
};

export default QuestionBuilder;
