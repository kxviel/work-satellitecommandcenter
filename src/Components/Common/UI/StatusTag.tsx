import React from "react";
import { Typography } from "@mui/material";

export const StatusTag = ({ status }: { status: string }) => {
  return (
    <Typography
      sx={{
        textTransform: "capitalize",
        color:
          status === "Active" || status === "active" ? "#0E9F6E" : "#F05252",
        fontSize: "16px",
        fontWeight: "400",
      }}
    >
      {status || "-"}
    </Typography>
  );
};

export const LiveStatusTag = ({ status }: { status: string }) => {
  return (
    <Typography
      sx={{
        textTransform: "capitalize",
        color: status === "Live" || status === "live" ? "#0E9F6E" : "#F05252",
        fontSize: "16px",
        fontWeight: "400",
      }}
    >
      {status || "-"}
    </Typography>
  );
};
export const CompletedStatusTag = ({ status }: { status: string }) => {
  return (
    <Typography
      sx={{
        textTransform: "capitalize",
        color:
          status === "Completed" || status === "completed"
            ? "#0E9F6E"
            : "#F05252",
        fontSize: "16px",
        fontWeight: "400",
      }}
    >
      {status || "-"}
    </Typography>
  );
};
