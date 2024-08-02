import { createTheme } from "@mui/material";

export const theme = createTheme({
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    body1: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "150%",
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "150%",
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "150%",
    },
    h2: {
      fontWeight: 700,
      fontSize: 30,
      lineHeight: "150%",
    },
    h6: {
      fontWeight: 500,
      fontSize: 20,
      lineHeight: "150%",
    },
  },
  palette: {
    primary: {
      main: "#327091",
    },
    secondary: {
      main: "#E3F1F4",
    },
    text: {
      primary: "#111928",
      secondary: "#6B7280",
    },
    divider: "#e0e3eb",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fieldSet: {
            borderColor: "#e0e3eb",
          },
          "& input::placeholder": {
            color: "#637e85",
            fontWeight: 400,
          },
          "& .MuiSvgIcon-root": {
            color: "#637e85",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          fontSize: "16px",
          height: "48px",
          padding: "15px 20px",
          fontWeight: 600,
        },
      },
    },
  },
});
