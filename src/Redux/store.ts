import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import participantsSlice from "./reducers/participantsSlice";
import userSlice from "./reducers/userSlice";
import administratorsSlice from "./reducers/administratorsSlice";
import questionSlice from "./reducers/questionSlice";
import responseSlice from "./reducers/responseSlice";
import appSlice from "./reducers/appSlice";
import studySlice from "./reducers/studySlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    participants: participantsSlice,
    administrators: administratorsSlice,
    question: questionSlice,
    response: responseSlice,
    study: studySlice,
    app: appSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
