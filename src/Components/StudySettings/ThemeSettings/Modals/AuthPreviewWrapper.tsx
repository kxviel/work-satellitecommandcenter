import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { InputWrapper } from "../../../Common/styles/form";
import { Visibility } from "@mui/icons-material";
import { Logo } from "../../../Common/assets/Sidebar";
import { ModalBaseStyles, ModalHeader } from "../../../Common/styles/modal";
import { useState } from "react";

const getLogos = (data: any) => {
  const logos = {
    logo1: data?.logos?.find((img: any) => img?.key === "logo_1"),
    logo2: data?.logos?.find((img: any) => img?.key === "logo_2"),
  };
  return logos;
};

const AuthPreviewWrapper = ({ data, closeModal, showModal }: any) => {
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
        }}
      >
        <ModalHeader title="Page Preview" onCloseClick={closeModal} />
        <Box sx={{ display: "flex", maxHeight: "80vh" }}>
          <Box
            sx={{
              padding: "10px 30px",
              width: "50%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                "& .logo-preview": {
                  maxWidth: "258px",
                  maxHeight: "100px",
                  // borderRadius: "50%",
                  // maxHeight: "200px",
                },
                alignItems: "center",
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
              {logos?.logo2?.url && (
                <img
                  src={logos?.logo2?.previewUrl}
                  className="logo-preview"
                  alt={"Logo 2"}
                />
              )}
            </Box>
            <Box sx={{ paddingY: 2 }}>
              <Typography variant="subtitle1">Welcome back!</Typography>
              <Typography mt={1} variant="subtitle1" fontWeight={700}>
                Please login...
              </Typography>
            </Box>
            <FormControl sx={{ ...InputWrapper, mt: 2 }}>
              <TextField placeholder="Enter your email" id="email" disabled />
            </FormControl>
            <FormControl sx={{ ...InputWrapper, mt: 2 }}>
              <TextField
                placeholder="Enter your password"
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
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <Typography variant="subtitle1">
                Don't have an account?
              </Typography>{" "}
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color={"primary.main"}
              >
                Signup
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              // backgroundColor: alpha(palette, 0.25),
              backgroundColor: "secondary.light",
              width: "50%",
              overflow: "hidden",
              height: "calc(100vh - 110px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                "& .preview-img-1": {
                  mr: 2,
                  width: "100px",
                  height: "150px",
                  borderRadius: "8px",
                  transform: "skewY(20deg)",
                  mt: 3,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Box
                  sx={{
                    backgroundColor: "secondary.dark",
                    width: "100px",
                    height: "150px",
                    borderRadius: "8px",
                    transform: "skewY(20deg)",
                    ml: 2,
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "secondary.dark",
                    mt: 3,
                    width: "50px",
                    height: "75px",
                    borderRadius: "8px",
                    transform: "skewY(20deg)",
                    ml: 2,
                  }}
                />
              </Box>

              <Box sx={{ display: "flex" }}>
                {data?.images?.topRight?.url ? (
                  <img
                    src={data?.images?.topRight?.previewUrl}
                    className="preview-img-1"
                    alt={"image1"}
                  />
                ) : (
                  <Box
                    sx={{
                      backgroundColor: "secondary.dark",
                      mr: 2,
                      width: "100px",
                      height: "150px",
                      borderRadius: "8px",
                      transform: "skewY(20deg)",
                      mt: 3,
                    }}
                  />
                )}
                <Box
                  sx={{
                    backgroundColor: "secondary.dark",
                    mt: 2,
                    width: "50px",
                    height: "75px",
                    borderRadius: "8px",
                    transform: "skewY(20deg)",
                    mr: 2,
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: "48px 72px",
                textAlign: "center",
              }}
            >
              <Box>
                <Typography variant="h2">
                  {data?.title || "Welcome to Mahalo!"}
                </Typography>
                <Typography variant="subtitle2" fontWeight={"regular"} mt={2}>
                  {data?.subtext}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                "& .preview-img-2": {
                  ml: 2,
                  width: "100px",
                  height: "150px",
                  borderRadius: "8px",
                  transform: "skewY(20deg)",
                  mb: 3,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                {data?.images?.bottomLeft?.url ? (
                  <img
                    src={data?.images?.bottomLeft?.previewUrl}
                    className="preview-img-2"
                    alt={"image2"}
                  />
                ) : (
                  <Box
                    sx={{
                      backgroundColor: "secondary.dark",
                      ml: 2,
                      width: "100px",
                      height: "150px",
                      borderRadius: "8px",
                      transform: "skewY(20deg)",
                      mb: 3,
                    }}
                  />
                )}
                <Box
                  sx={{
                    backgroundColor: "secondary.dark",
                    mb: 5,
                    width: "50px",
                    height: "75px",
                    borderRadius: "8px",
                    transform: "skewY(20deg)",
                    ml: 2,
                  }}
                />
              </Box>
              <Box display={"flex"}>
                <Box
                  sx={{
                    backgroundColor: "secondary.dark",
                    width: "100px",
                    height: "150px",
                    borderRadius: "8px",
                    mr: 2,
                    transform: "skewY(20deg)",
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "secondary.dark",
                    width: "50px",
                    height: "75px",
                    borderRadius: "8px",
                    transform: "skewY(20deg)",
                    mr: 2,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthPreviewWrapper;
