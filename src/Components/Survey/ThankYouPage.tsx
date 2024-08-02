import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { Logo } from "../Common/assets/Sidebar";

const ThankYou = ({ data }: any) => {
  // const handleProceedClick = () => {
  //   // setShowInfo((prev: boolean) => !prev);
  // };
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "70px",
          backgroundColor: "#FFF",
          px: matches ? 2 : 3,
          py: matches ? 1 : 2,
          "& .header-logo": {
            maxWidth: matches ? "150px" : "258px",
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
      <Divider />
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 71px)",
          justifyContent: "flex-start",
          overflow: "auto",
          p: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: matches ? "1.5rem" : "2.125rem" }}
        >
          {data?.title || "Thank you!"}
        </Typography>
        <Box sx={{ p: matches ? "8px 24px" : "16px 48px" }}>
          {data?.subtext && (
            <Typography
              variant="subtitle2"
              fontWeight="regular"
              whiteSpace={"pre-line"}
              sx={{ mt: 2, mb: 2, fontSize: matches ? "0.875rem" : "1rem" }}
            >
              {data?.subtext || ""}
            </Typography>
          )}
          {/* <Button
            variant="contained"
            sx={{
              mt: 4,
              width: matches ? "100%" : "400px",
              fontSize: matches ? "0.875rem" : "1rem",
            }}
            // onClick={handleProceedClick}
          >
            Close
          </Button> */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              "& .footer-logo": {
                maxWidth: matches ? "150px" : "258px",
                maxHeight: "70px",
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
          {data?.footer && (
            <Typography
              variant="subtitle2"
              fontWeight="regular"
              whiteSpace={"pre-line"}
              sx={{
                mt: 2,
                mb: 2,
                fontSize: matches ? "0.875rem" : "1rem",
              }}
            >
              {data?.footer || ""}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ThankYou;
