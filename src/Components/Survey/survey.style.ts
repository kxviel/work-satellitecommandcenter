import { SxProps } from "@mui/material";
export const Layout2ContainerStyle: SxProps = {
  width: "100%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  height: "100vh",
  overflow: "auto",
  p: 1,
};
export const HeaderStyle: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "70px",
  backgroundColor: "#FFF",
};

export const ContentContainerStyle: SxProps = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "calc(100vh - 71px)",
  justifyContent: "flex-start",
  overflow: "auto",
  p: 2,
};

export const ContentContainerLayout2: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "start",
};
