import { Box, Button } from "@mui/material";

const RandomizePreview = () => {
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          md: "80%",
        },
      }}
    >
      <Button variant="contained">Randomize</Button>
    </Box>
  );
};
export default RandomizePreview;
