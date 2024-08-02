import { SxProps } from "@mui/material";

export const InputWrapper: SxProps = {
  width: "100%",
  justifyContent: "space-between",
};
export const HalfInputWrapper: SxProps = {
  width: "50%",
  justifyContent: "space-between",
};

export const LabelStyle: SxProps = {
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "150%",
  mb: "10px",
  color: "text.primary",
  "& .MuiFormLabel-asterisk": {
    color: "#F05252",
  },
};
