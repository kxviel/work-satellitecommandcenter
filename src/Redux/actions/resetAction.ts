import { reset as adminReset } from "../reducers/administratorsSlice";
// import { reset as partReset } from "../reducers/participantsSlice";
import { reset as userReset } from "../reducers/userSlice";
import { reset as quesReset } from "../reducers/questionSlice";
import { reset as studyReset } from "../reducers/studySlice";
import { reset as responseReset } from "../reducers/responseSlice";
import { AppThunk } from "../store";

export const resetState = (): AppThunk => (dispatch) => {
  // dispatch(partReset());
  dispatch(userReset());
  dispatch(adminReset());
  dispatch(quesReset());
  dispatch(studyReset());
  dispatch(responseReset());
};
