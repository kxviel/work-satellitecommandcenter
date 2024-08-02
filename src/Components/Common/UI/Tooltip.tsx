import { Circle } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export const CustomTooltip = ({ value, color, label }: any) => (
  <Box
    sx={{
      bgcolor: "#fff",
      borderRadius: 2,
      width: "180px",
      padding: 2,
      filter: "drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.08))",
      position: "relative",
      top: "55px",
      left: "105px",
      "&::before": {
        content: "''",
        position: "absolute",
        top: "50%",
        left: "-23px",
        zIndex: "-1",
        transform: "rotate(45deg) translateY(-50%)",
        borderRadius: "8px",
        height: "30px",
        width: "30px",
        bgcolor: "#fff",
      },
    }}
  >
    <Typography fontSize={32} fontWeight={600} mb={1.5} color="#355962">
      {value}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "ceter", gap: 1 }}>
      <Circle htmlColor={color} />
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        color="text.secondary"
      >
        {label}
      </Typography>
    </Box>
  </Box>
);
