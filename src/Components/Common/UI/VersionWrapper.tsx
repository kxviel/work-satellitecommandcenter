import { Box, Typography } from "@mui/material";
import { PoweredByLogo } from "../assets/Sidebar";

const VersionWrapper = () => (
  <Box>
    <Box
      sx={{
        mt: "auto",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <PoweredByLogo />
      <Typography variant="body1" fontWeight={"medium"} color="gray">
        Powered by Mahalo
      </Typography>
    </Box>
    <Typography
      variant="body1"
      fontWeight={"medium"}
      color="gray"
      fontSize={12}
      sx={{ textAlign: "center" }}
    >
      Version 2.1.3 (01/08/2024)
    </Typography>
  </Box>
);

export default VersionWrapper;
