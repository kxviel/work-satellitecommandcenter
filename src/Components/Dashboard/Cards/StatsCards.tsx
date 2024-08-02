import { MoreVert } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

const StatsCards = ({ data, handleOptionsClick }: any) => {
  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px #0000001A",
        p: 2,
        minHeight: "170px",
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            bgcolor: data?.color,
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "8px",
              border: "2px solid #FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color={"#FFFFFF"} fontWeight={"700"} fontSize={"18px"}>
              {data?.value}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton onClick={(e) => handleOptionsClick(e, data)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      <Typography
        sx={{ color: "text.secondary", fontSize: "12px", fontWeight: "600" }}
      >
        {data?.title}
      </Typography>
      <Typography
        sx={{ color: "#1F2A37", fontSize: "18px", fontWeight: "700" }}
      >
        {data?.desc}
      </Typography>
    </Box>
  );
};

export default StatsCards;
