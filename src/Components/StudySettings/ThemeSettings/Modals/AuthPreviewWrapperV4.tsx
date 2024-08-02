import { useState } from "react";
import {
  Box,
  FormControl,
  // FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Modal,
  // Radio,
  // RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Logo } from "../../../Common/assets/Sidebar";
import { LabelStyle, InputWrapper } from "../../../Common/styles/form";
import { StyledButton } from "../../../Common/styles/button";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../../Common/styles/modal";
const getLogos = (data: any) => {
  const logos = {
    logo1: data?.logos?.find((img: any) => img?.key === "logo_1"),
  };
  return logos;
};

const AuthPreviewWrapperV4 = ({ data, closeModal, showModal }: any) => {
  const [logos] = useState<any>(getLogos(data));

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box
        sx={{
          ...ModalBaseStyles,
          minHeight: "98vh",
          width: {
            xs: "96vw",
            md: "90vw",
          },
          p: 2,
        }}
      >
        <ModalHeader title="Page Preview" onCloseClick={closeModal} />

        <Box
          sx={{
            height: "calc(100vh - 112px)",
            backgroundImage: `url(${data?.images?.topRight?.previewUrl})`,
            backgroundRepeat: "no-repeat",
            alignItems: "center",
            backgroundSize: "cover",
            p: "32px",
            display: "flex",
          }}
        >
          <Box
            sx={{
              maxWidth: "400px",
              maxHeight: "600px",
              borderRadius: "32px",
              backgroundColor: "transparent",
              "& .MuiInputBase-root": {
                backgroundColor: "white",
              },
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Box>
                <Box
                  sx={{
                    "& .logo-preview": {
                      maxWidth: "258px",
                      maxHeight: "70px",
                    },
                  }}
                >
                  {logos?.logo1?.url ? (
                    <img
                      src={logos?.logo1?.previewUrl}
                      className="logo-preview"
                      alt={"Logo 1"}
                    />
                  ) : (
                    <Logo />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={"regular"} mt={2}>
                    Welcome back!
                  </Typography>
                  <Typography variant="h2" mt={1} mb={2}>
                    Please login...
                  </Typography>
                </Box>
              </Box>
            </Box>
            <FormControl sx={{ ...InputWrapper, opacity: "100%" }}>
              <FormLabel sx={LabelStyle} htmlFor="email">
                Enter your username or email address
              </FormLabel>
              <TextField
                placeholder="Username or email address"
                id="email"
                disabled
              />
            </FormControl>
            <FormControl sx={{ ...InputWrapper, mt: 2 }}>
              <FormLabel sx={LabelStyle} htmlFor="password">
                Enter your password
              </FormLabel>
              <TextField
                placeholder="Password"
                id="password"
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="end">
                        <Visibility />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <Box sx={{ textAlign: "right", mt: 2, mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ textDecoration: "underline" }}
                color="primary.main"
              >
                Forgot password?
              </Typography>
            </Box>
            <Box sx={{ ...ModalActionButtonStyles, mt: 6 }}>
              <StyledButton variant="contained" type="submit" fullWidth>
                Sign In
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthPreviewWrapperV4;
