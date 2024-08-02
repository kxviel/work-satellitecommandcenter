import { Box, Typography } from "@mui/material";
import { CircularProgressWithLabel } from "../../Common/UI/ProgressWithLabel";

const StudyCard = ({ data }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "#F9FAFB",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CircularProgressWithLabel
            value={data?.percent}
            fontWeight={700}
            fontSize={12}
          />
        </Box>
      </Box>
      <Box width={"100%"}>
        <Box>
          <Typography fontWeight={"700"} fontSize={"16px"} color={"#1F2A37"}>
            {data?.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            color={"text.secondary"}
            fontWeight={"600"}
            fontSize={"12px"}
          >
            Completed records:
          </Typography>
          <Typography
            color={"text.primary"}
            fontWeight={"700"}
            fontSize={"12px"}
          >
            {data?.completed} /{" "}
            <span style={{ color: "text.secondary" }}>{data?.total}</span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StudyCard;
