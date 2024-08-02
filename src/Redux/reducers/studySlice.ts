import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuLabels {
  visit: string;
  survey: string;
  repeating_data: string;
  survey_package: string;
}

export interface StudyState {
  name: string;
  status: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  secondaryTextColor: string;
  backgroundColor: string;
  menuLabels: MenuLabels;
}

const initialState: StudyState = {
  name: "",
  status: "",
  primaryColor: "#327091",
  secondaryColor: "#E3F1F4",
  textColor: "#111928",
  secondaryTextColor: "#6B7280",
  backgroundColor: "#FFF6EB",
  menuLabels: {
    visit: "Visit",
    survey: "Survey",
    repeating_data: "Repeating Data",
    survey_package: "Survey Package",
  },
};

export const studySlice = createSlice({
  name: "study",
  initialState: initialState,
  reducers: {
    setStudyDetails: (
      state,
      action: PayloadAction<{
        status: string;
        primaryColor: string;
        secondaryColor: string;
        textColor: string;
        secondaryTextColor: string;
        backgroundColor: string;
        name: string;
      }>
    ) => {
      state.status = action.payload.status;
      state.primaryColor = action.payload.primaryColor;
      state.secondaryColor = action.payload.secondaryColor;
      state.textColor = action.payload.textColor;
      state.secondaryTextColor = action.payload.secondaryTextColor;
      state.backgroundColor = action.payload.backgroundColor;
      state.name = action.payload.name;
    },
    setStudyLabels: (state, action: PayloadAction<MenuLabels>) => {
      state.menuLabels = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setStudyDetails, setStudyLabels, reset } = studySlice.actions;

export default studySlice.reducer;
