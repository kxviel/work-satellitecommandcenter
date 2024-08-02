import { Box, Button, Typography } from "@mui/material";
import { DashboardNoDataIcon } from "../../Common/assets/Icons";
import { useState } from "react";

type Props = {
  openWidgetModal: () => void;
};

const NoContent = ({ openWidgetModal }: Props) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <DashboardNoDataIcon />
      <Typography fontWeight={600} fontSize={18} sx={{ color: "text.primary" }}>
        Customize your dashboard by adding pre-defined widgets
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Tailor your view with a selection of pre-built widgets. Easily add and
        arrange key metrics to focus on what matters most.
      </Typography>
      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={openWidgetModal}
      >
        Add Widget
      </Button>
    </Box>
  );
};

export default NoContent;
