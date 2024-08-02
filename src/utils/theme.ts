import { createTheme, darken, lighten } from "@mui/material";

export const getCustomTheme = (
  primaryColor: string,
  secondaryColor: string,
  textColor: string,
  secondaryTextColor: string
) => {
  const lightSecondary = lighten(secondaryColor, 0.6);
  const darkSecondary = darken(secondaryColor, 0.05);
  const theme = createTheme({
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
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
        light: lightSecondary,
        dark: darkSecondary,
      },
      text: {
        primary: textColor,
        secondary: secondaryTextColor,
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
              color: secondaryTextColor,
              fontWeight: 400,
            },
            "& .MuiSvgIcon-root": {
              color: secondaryTextColor,
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
  return theme;
};
