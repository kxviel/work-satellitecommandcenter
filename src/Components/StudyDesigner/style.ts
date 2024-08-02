import { SxProps } from "@mui/material";

export const StudyTabContent: SxProps = {
  display: "flex",
  gap: 3,
  height: "calc(100vh - 241px)",
  alignItems: "start",
};

export const StudyCard: SxProps = {
  bgcolor: "#fff",
  boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.08)",
  borderRadius: 2,
  minHeight: "1px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  maxHeight: "100%",
};

export const HeaderStyle: SxProps = {
  minHeight: "70px",
  px: 2,
  py: 1,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
};

export const studyCardContent: SxProps = {
  flex: 1,
  minHeight: "1px",
  overflow: "hidden",
  "&:hover": {
    overflow: "auto",
  },
};
