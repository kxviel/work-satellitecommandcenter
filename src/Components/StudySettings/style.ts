import { SxProps } from "@mui/material";

export const UploadWrapper: SxProps = {
  width: "160px",
  borderRadius: "8px",
  border: 1,
  borderColor: "primary.main",
  background: "#ffffff",
  display: "flex",
  height: "48px",
  justifyContent: "center",
  alignItems: "center",
  mt: 2,
  mb: 2,
  "&:hover": {
    borderColor: "primary.main",
    cursor: "pointer",
  },
  "& .preview-image": {
    height: "48px",
    objectFit: "contain",
  },
};

export const CustomSliderStyle: SxProps = {
  height: "10px",
  color: "#d1d5db",
  ".MuiSlider-track": {
    display: "none",
  },
  ".MuiSlider-thumb": {
    color: "#ffffff",
  },
};

export const InputUploadWrapper: SxProps = {
  ...UploadWrapper,
  borderRadius: "12px",
  border: "2px solid #E0E3EB",
  borderColor: "#E0E3EB",
  borderStyle: "dashed",
  overflow: "hidden",
  width: "268px",
  height: "172px",
  "& .preview-image": {
    height: "172px",
    width: "268px",
  },
};
