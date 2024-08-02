import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface AppSlice {
  collapsed: boolean;
}

const initialState: AppSlice = {
  collapsed: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    toggleSidebarCollapse: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
  },
});

export const { toggleSidebarCollapse } = appSlice.actions;

export default appSlice.reducer;
