import { SxProps } from "@mui/material";

export const AuthLayout: SxProps = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "auto",
  backgroundColor: "#FFF6EB",
};

export const SignInWrapper: SxProps = {
  backgroundColor: "#fff",
  boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.08)",
  borderRadius: "16px",
  minWidth: "450px",
  width: "30%",
  padding: "40px",
};

export const AuthRadioSelector: SxProps = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  mb: 3,
};

export const FormHelperTextContainer: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mt: 3,
};
