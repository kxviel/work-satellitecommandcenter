import { Box, Typography } from "@mui/material";
import { Logo } from "../../Common/assets/Sidebar";
import {
  ContentContainerLayout2,
  Layout2ContainerStyle,
} from "../survey.style";

type Props = {
  data: any;
};

const ThankyouLayout2 = ({ data }: Props) => {
  return (
    <Box sx={Layout2ContainerStyle}>
      <Box
        sx={{
          p: {
            xs: "8px 24px",
            sm: "8px 24px",
            md: "8px 36px",
          },
          display: "flex",
          "& .header-logo": {
            maxWidth: {
              xs: "150px",
              md: "258px",
            },
            maxHeight: "60px",
          },
        }}
      >
        {data?.headerLogo?.url ? (
          <img
            src={data?.headerLogo?.previewUrl}
            alt="Logo 1"
            className="header-logo"
            loading="lazy"
          />
        ) : (
          <Logo />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: {
            xs: "wrap",
            sm: "wrap",
            md: "nowrap",
          },
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            ...ContentContainerLayout2,
            width: {
              xs: "100%",
              md: "50%",
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1.5rem",
                md: "2.125rem",
              },
              p: {
                xs: "8px 24px",
                md: "8px 48px",
              },
            }}
          >
            {data?.title || "Thank you!"}
          </Typography>
          <Box
            sx={{
              p: {
                xs: "8px 24px",
                md: "8px 48px",
              },
              width: "100%",
            }}
          >
            {data?.subtext && (
              <Typography
                variant="subtitle2"
                fontWeight="regular"
                whiteSpace={"pre-line"}
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    md: "1rem",
                  },
                }}
              >
                {data?.subtext || ""}
              </Typography>
            )}
            {data?.footer && (
              <Typography
                variant="subtitle2"
                fontWeight="regular"
                whiteSpace={"pre-line"}
                sx={{
                  mt: 2,
                  fontSize: {
                    xs: "0.875rem",
                    md: "1rem",
                  },
                }}
              >
                {data?.footer || ""}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            position: {
              xs: "relative",
              md: "sticky",
            },
            top: {
              xs: "16px",
              md: "90px",
            },
            mb: {
              xs: 2,
              md: 0,
            },
            zIndex: 1,
            width: {
              xs: "100%",
              md: "50%",
            },
            p: {
              xs: "0px 24px",
            },
            alignSelf: "flex-start",
            "& .footer-logo": {
              maxWidth: "100%",
              maxHeight: "560px",
              borderRadius: "40px",
            },
          }}
        >
          {data?.footerLogo?.url ? (
            <img
              src={data?.footerLogo?.previewUrl}
              alt="Logo 2"
              loading="lazy"
              className="footer-logo"
            />
          ) : (
            <Logo />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ThankyouLayout2;
