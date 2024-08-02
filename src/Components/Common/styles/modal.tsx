import { SxProps, IconButton, Box, Typography, Divider } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

export const ModalBaseStyles: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "96vw",
    md: "40vw",
  },
  bgcolor: "white",
  boxShadow: 4,
  borderRadius: "0.7rem",
  padding: 3,
  paddingTop: 2,
  outline: "none",
  minHeight: "40vh",
  maxHeight: "80vh",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
};

export const ModalActionButtonStyles: SxProps = {
  mt: 1,
  display: "flex",
  justifyContent: "flex-end",
  gap: 2,
};

type ModalHeaderProps = {
  title: string;
  onCloseClick: () => void;
};

export const ModalHeader = ({ title, onCloseClick }: ModalHeaderProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          textTransform={"capitalize"}
          color="primary.main"
        >
          {title}
        </Typography>
        <IconButton onClick={onCloseClick}>
          <CloseRounded sx={{ color: "text.secondary" }} />
        </IconButton>
      </Box>
      <Divider sx={{ mt: 1, mb: 2 }} />
    </>
  );
};

export const CustomModalHeader = ({
  title,
  onCloseClick,
}: ModalHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        textTransform={"capitalize"}
        color="primary.main"
      >
        {title}
      </Typography>
      <IconButton onClick={onCloseClick}>
        <CloseRounded sx={{ color: "text.secondary" }} />
      </IconButton>
    </Box>
  );
};
