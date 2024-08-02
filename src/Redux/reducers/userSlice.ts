import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserState {
  isUserAuthenticated: boolean;
  userId: string;
  role: string;
  studyPermissions: any[];
  sitePermissions: { [key: string]: any };
  sitesList: any[];
  toggleLoader: boolean;
}

const initialState: UserState = {
  isUserAuthenticated: false,
  userId: "",
  role: "",
  studyPermissions: [],
  sitesList: [],
  sitePermissions: {},
  toggleLoader: false,
};

const getIntialState = (): UserState => {
  let isUserAuthenticated = false;
  let role = "";
  let userId = "";
  const token = localStorage.getItem("sm-access-token") ?? "";
  if (token) {
    try {
      userId = localStorage.getItem("user-id") ?? "";
      isUserAuthenticated = true;
    } catch (err) {}
  }
  return {
    ...initialState,
    isUserAuthenticated: isUserAuthenticated,
    userId: userId,
    role: role,
    studyPermissions: [],
    sitePermissions: {},
    toggleLoader: false,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: getIntialState,
  reducers: {
    setUserAuth: (
      state,
      action: PayloadAction<{
        authenticated: boolean;
        role: string;
        userId: string;
      }>
    ) => {
      state.role = action.payload.role;
      state.isUserAuthenticated = action.payload.authenticated;
      state.userId = action.payload.userId;
    },
    setRbacState: (
      state,
      action: PayloadAction<{
        studyPermissions: string[];
        sitePermissions: { [key: string]: string[] };
        sitesList: any[];
      }>
    ) => {
      state.studyPermissions = action.payload.studyPermissions;
      state.sitePermissions = action.payload.sitePermissions;
      state.sitesList = action.payload.sitesList;
    },
    setStateToggle: (state) => {
      state.toggleLoader = !state.toggleLoader;
    },
    reset: () => initialState,
  },
});

export const { setUserAuth, reset, setRbacState, setStateToggle } =
  userSlice.actions;

export default userSlice.reducer;
