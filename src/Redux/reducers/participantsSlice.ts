import { pageSize } from "./../../Components/Common/styles/table";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PaginationProps = {
  page: number;
  pageSize: number;
};

export interface ParticipantsState {
  loading: boolean;
  participantsData: any[];
  totalParticipants: number;
  paginationModel: PaginationProps;
  toggleLoader: boolean;
  sortOrder: string;
  sortColumn: string;
  siteIds: string[];
  status: string;
  isLocked: string;
  columns: { label: string; varname: string }[];
}

const initialState: ParticipantsState = {
  loading: true,
  toggleLoader: false,
  paginationModel: {
    page: 0,
    pageSize: pageSize,
  },
  participantsData: [],
  totalParticipants: 0,
  sortOrder: "",
  sortColumn: "",
  siteIds: [],
  status: "",
  isLocked: "",
  columns: [],
};

export const participantsSlice = createSlice({
  name: "participants",
  initialState: initialState,
  reducers: {
    setParticipantsLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setParticipantsDetails: (state, action: PayloadAction<any>) => {
      state.participantsData = action.payload;
    },
    setColumnData: (state, action: PayloadAction<any>) => {
      state.columns = action.payload;
    },
    setParticipantsCount: (state, action: PayloadAction<number>) => {
      state.totalParticipants = action.payload;
    },
    setParticipantsPage: (state, action: PayloadAction<PaginationProps>) => {
      state.paginationModel = action.payload;
    },

    setParticipantToggle: (state) => {
      state.toggleLoader = !state.toggleLoader;
    },
    setParticipantSort: (
      state,
      action: PayloadAction<{ column: string; order: string }>
    ) => {
      state.sortColumn = action.payload.column;
      state.sortOrder = action.payload.order;
    },
    setParticipantFilter: (
      state,
      action: PayloadAction<{
        siteIds: string[];
        status: string;
        isLocked: string;
      }>
    ) => {
      state.paginationModel.page = 0;
      state.siteIds = action.payload.siteIds;
      state.status = action.payload.status;
      state.isLocked = action.payload.isLocked;
    },
    reset: () => initialState,
  },
});

export const {
  setParticipantsLoader,
  setParticipantsDetails,
  setParticipantsCount,
  setParticipantsPage,
  setParticipantToggle,
  setParticipantSort,
  setParticipantFilter,
  setColumnData,
  reset,
} = participantsSlice.actions;

export default participantsSlice.reducer;
