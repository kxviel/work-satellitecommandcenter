import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pageSize } from "../../Components/Common/styles/table";

type PaginationProps = {
  page: number;
  pageSize: number;
};

interface AdministratorsState {
  urlLoaded: boolean;
  loading: boolean;
  // page: number;
  paginationModel: PaginationProps;
  searchText: string;
  sortOrder: string;
  sortColumn: string;
  administratorsData: any[];
  totalAdministrators: number;
  toggleLoader: boolean;
}

const initialState: AdministratorsState = {
  urlLoaded: false,
  loading: true,
  paginationModel: {
    page: 0,
    pageSize: pageSize,
  },
  // page: 0,
  searchText: "",
  sortOrder: "",
  sortColumn: "",
  toggleLoader: false,

  administratorsData: [],
  totalAdministrators: 0,
};

export const administratorsSlice = createSlice({
  name: "administrators",
  initialState: initialState,
  reducers: {
    setAdministratorsLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAdministratorsPage: (state, action: PayloadAction<PaginationProps>) => {
      state.paginationModel = action.payload;
    },
    refreshAdministratorsPage: (state) => {
      state.toggleLoader = !state.toggleLoader;
    },
    setAdministratorsSearchText: (state, action: PayloadAction<string>) => {
      state.paginationModel = {
        page: 0,
        pageSize: pageSize,
      };
      state.searchText = action.payload;
    },
    setAdministratorsDetails: (state, action: PayloadAction<any>) => {
      state.administratorsData = action.payload;
    },
    setAdministratorsCount: (state, action: PayloadAction<number>) => {
      state.totalAdministrators = action.payload;
    },
    setAdministratorsSort: (
      state,
      action: PayloadAction<{ column: string; order: string }>
    ) => {
      state.sortColumn = action.payload.column;
      state.sortOrder = action.payload.order;
    },
    setAdministratorsDefaults: (
      state,
      action: PayloadAction<{
        search: string;
        // type: string;
        order: string;
        sort: string;
        pagination: PaginationProps;
      }>
    ) => {
      // state.type = action.payload.type;
      state.searchText = action.payload.search;
      state.sortOrder = action.payload.order;
      state.sortColumn = action.payload.sort;
      state.paginationModel = action.payload.pagination;
      state.urlLoaded = true;
    },
    setUrlLoadedFalse: (state) => {
      state.urlLoaded = false;
    },
    reset: () => initialState,
  },
});

export const {
  setAdministratorsLoader,
  setAdministratorsPage,
  setAdministratorsDefaults,
  setUrlLoadedFalse,
  setAdministratorsSearchText,
  setAdministratorsDetails,
  setAdministratorsCount,
  setAdministratorsSort,
  refreshAdministratorsPage,
  reset,
} = administratorsSlice.actions;

export default administratorsSlice.reducer;
