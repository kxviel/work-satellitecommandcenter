import { Close } from "@mui/icons-material";
import { Divider, IconButton } from "@mui/material";
import { MouseEventHandler } from "react";

interface Props {
  buttonClick: MouseEventHandler;
}

export const CloseButton = ({ buttonClick }: Props) => (
  <IconButton
    sx={{
      position: "relative",
    }}
    color="primary"
    component="label"
    onClick={buttonClick}
  >
    <Close
      sx={{
        fontSize: "20px",
      }}
    />
  </IconButton>
);

export const DividerWithBG = () => (
  <Divider
    variant="fullWidth"
    sx={{ bgcolor: "background.dividerBg", mt: "12px", mb: "30px" }}
  />
);

export const inputLabelStyle = {
  fontSize: "14px",
  fontWeight: 600,
  mb: 1,
  textTransform: "uppercase",
};
