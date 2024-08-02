import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { PageNotFoundIcon } from "../Common/assets/Icons";
import { Logo } from "../Common/assets/Sidebar";
import { useAppSelector } from "../../Redux/hooks";

const Error404 = () => {
  const { backgroundColor } = useAppSelector((state) => state.study);
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Stack
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: backgroundColor,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "70px",
          px: 3,
          py: 2,
          border: { xs: "1px solid #E5E7EB", md: "none" },
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
        }}
        gap={3}
      >
        <Logo />
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 2,
          px: matches ? 3 : 0,
          overflow: "auto",
        }}
      >
        <PageNotFoundIcon />
        <Typography
          fontWeight={600}
          fontSize={matches ? 25 : 35}
          color={"#212121"}
        >
          Oops!
        </Typography>
        <Typography
          fontWeight={500}
          fontSize={matches ? 17 : 25}
          color={"#212121"}
        >
          Page Not Found
        </Typography>
        <Typography
          fontWeight={400}
          fontSize={matches ? 14 : 17}
          color={"#212121"}
        >
          Looks like the page does not exist
        </Typography>
      </Box>
    </Stack>
  );
};
export default Error404;
