import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import "../../utils/firebaseInit";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          minWidth: "1px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            // px: "40px",
            // py: "24px",
            flex: 1,
            minHeight: "1px",
            backgroundColor: "#FFF6EB",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
