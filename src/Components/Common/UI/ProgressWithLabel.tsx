import {
  Box,
  CircularProgress,
  CircularProgressProps,
  LinearProgress,
  LinearProgressProps,
  Typography,
  circularProgressClasses,
  linearProgressClasses,
} from "@mui/material";

export const CircularProgressWithLabel = (
  props: CircularProgressProps & {
    value: number;
    fontSize?: number;
    fontWeight?: number;
  }
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          color: "#E5E7EB",
        }}
        value={100}
        size={50}
      />
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={50}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          fontSize={props.fontSize ?? 16}
          fontWeight={props.fontWeight ?? 600}
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export const CustomCircularProgressWithLabel = (
  props: CircularProgressProps & {
    value: number;
    fontSize?: number;
    fontWeight?: number;
  }
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          color: "#70AE71",
        }}
        value={100}
        size={145}
        thickness={3}
      />
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          color: "#FACA15",
        }}
        size={145}
        thickness={3}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          variant="determinate"
          {...props}
          sx={{
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
            color: "#76A9FA",
          }}
          thickness={0.5}
          value={100}
          size={110}
        />
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          fontSize={props.fontSize || 16}
          fontWeight={props.fontWeight || 600}
          color="#FFFFFF"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            height: 16,
            borderRadius: 5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: "#E5E7EB",
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: "primary.main",
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body1" fontWeight="regular">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};
