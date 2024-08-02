import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./Redux/store";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import "./index.scss";
import ErrorBoundary from "./utils/ErrorBoundary";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </LocalizationProvider>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
