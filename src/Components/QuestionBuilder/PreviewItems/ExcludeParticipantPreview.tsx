import { Box, Button } from "@mui/material";

const ExcludeParticipantPreview = () => {
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          md: "80%",
        },
      }}
    >
      <Button variant="contained">Exclude Participant</Button>
    </Box>
  );
};
export default ExcludeParticipantPreview;
