import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "./routes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-main">
      <CssBaseline />
      <RouterProvider router={routes} fallbackElement={<div>Loading...</div>} />
      <ToastContainer />
    </div>
  );
}

export default App;
