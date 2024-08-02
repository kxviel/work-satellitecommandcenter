import { Box, Button, Typography } from "@mui/material";
import { HeaderStyle } from "../Common/styles/header";
import DashboardContent from "./DashboardContent/DashboardContent";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AddWidgetModal from "./Modals/AddWidgetModal";

const Dashboard = () => {
  const [toggleLoader, setToggleLoader] = useState<boolean>(false);
  const [openWidgets, setOpenWidgets] = useState<boolean>(false);
  const [widgetList, setWidgetList] = useState<any[]>([]);
  const refreshPage = () => {
    setToggleLoader((prev: boolean) => !prev);
  };

  const openWidgetModal = () => {
    setOpenWidgets(true);
  };
  const closeWidgetModal = () => {
    setOpenWidgets(false);
  };

  return (
    <>
      <Box sx={HeaderStyle}>
        <Typography fontSize={30} fontWeight="700" color="text.primary">
          Dashboard
        </Typography>
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openWidgetModal}
          >
            Add Widget
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 3, height: "calc(100vh - 144px)", overflow: "scroll" }}>
        <DashboardContent
          toggleLoader={toggleLoader}
          openWidgetModal={openWidgetModal}
          refreshPage={refreshPage}
          setWidgetList={setWidgetList}
        />
      </Box>
      {openWidgets && (
        <AddWidgetModal
          showModal={openWidgets}
          closeModal={closeWidgetModal}
          refreshPage={refreshPage}
          widgets={widgetList}
        />
      )}
    </>
  );
};

export default Dashboard;
