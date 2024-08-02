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
// import * as yup from "yup";
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

const AuthPreviewWrapperV3 = ({ data, closeModal, showModal }: any) => {
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
            position: "absolute",
            top: "120px",
            left: "42px",
            "& .logo-preview": {
              maxWidth: "258px",
              maxHeight: "100px",
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
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            backgroundImage: `url(${data?.images?.topRight?.previewUrl})`,
            backgroundRepeat: "no-repeat",
            alignItems: "center",
            backgroundSize: "cover",
            p: "3%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              padding: "35px",
              maxWidth: "400px",
              maxHeight: "600px",
              borderRadius: "32px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "& .MuiInputBase-root": {
                backgroundColor: "white",
              },
              boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Welcome to
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color={"primary.main"}
                  >
                    Mahalo!
                  </Typography>
                </Box>
                <Typography variant="h2" mt={1} mb={3}>
                  Sign In
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color={"text.secondary"}>
                  No account?
                </Typography>
                <Typography variant="subtitle1" color={"primary.main"}>
                  Sign up
                </Typography>
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
            <Box sx={{ ...ModalActionButtonStyles, mt: 10 }}>
              <StyledButton
                variant="contained"
                type="submit"
                sx={{ width: "50%" }}
              >
                Sign In
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthPreviewWrapperV3;
