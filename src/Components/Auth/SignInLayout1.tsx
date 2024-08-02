import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Logo } from "../Common/assets/Sidebar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as yup from "yup";
import { InputWrapper } from "../Common/styles/form";
import { ModalActionButtonStyles } from "../Common/styles/modal";
import isEmail from "validator/lib/isEmail";
import { Form, Formik } from "formik";
import { StyledButton } from "../Common/styles/button";
import ForceLogoutModal from "./ForceLogoutModal";
import { NavLink } from "react-router-dom";

const schema = yup.object({
  email: yup
    .string()
    .required("*Email ID is Required")
    .test("is-valid", "*Please enter a valid Email ID.", (value) =>
      value ? isEmail(value) : false
    ),
  password: yup
    .string()
    .min(6, "*Password too short")
    .required("*Password is Required"),
});

const SignInLayout1 = ({
  images,
  logos,
  content,
  emailverified,
  submitLoader,
  showModal,
  logoutData,
  showPassword,
  closeModal,
  handleClickShowPassword,
  handleSubmit,
}: any) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFF",
        width: "100%",
        height: "100vh",
        display: "flex",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "40px",
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
              loading="lazy"
            />
          ) : (
            <Logo />
          )}
          {logos?.logo2?.url && (
            <img
              src={logos?.logo2?.previewUrl}
              className="logo-preview"
              alt={"Logo 2"}
              loading="lazy"
            />
          )}
        </Box>
        <Box>
          <Box sx={{ paddingY: 2 }}>
            {emailverified &&
              (emailverified === "success" ? (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                  }}
                >
                  You have successfully accepted the invitation. Please sign in
                  to continue.
                </Alert>
              ) : emailverified === "failed" ? (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                  }}
                >
                  The Invitation link is not valid anymore. Please contact
                  administrator to get a new invitation.
                </Alert>
              ) : null)}
            {/* <Typography variant="subtitle1">Welcome back!</Typography> */}
            <Typography mt={1} variant="subtitle1" fontWeight={700}>
              Login
            </Typography>
          </Box>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {({ errors, touched, getFieldProps }) => {
              return (
                <Form>
                  <FormControl sx={{ ...InputWrapper, mt: 2 }}>
                    <TextField
                      placeholder="Username or email address"
                      id="email"
                      {...getFieldProps("email")}
                      error={touched?.email && errors?.email ? true : false}
                      helperText={
                        touched?.email && errors?.email ? errors?.email : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...InputWrapper }}>
                    <TextField
                      placeholder="Password"
                      id="password"
                      {...getFieldProps("password")}
                      error={
                        touched?.password && errors?.password ? true : false
                      }
                      helperText={
                        touched?.password && errors?.password
                          ? errors?.password
                          : " "
                      }
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <Box sx={{ textAlign: "right", mb: 3 }}>
                    <Typography variant="subtitle1" color="primary.main">
                      <NavLink to="/auth/forgot-password">
                        Forgot password
                      </NavLink>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ...ModalActionButtonStyles,
                      justifyContent: "center",
                    }}
                  >
                    {!submitLoader ? (
                      <StyledButton variant="contained" type="submit" fullWidth>
                        Login
                      </StyledButton>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={25} />
                      </Box>
                    )}
                  </Box>
                  {/* <Box
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
                </Box> */}
                </Form>
              );
            }}
          </Formik>
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
            {images?.topRight?.url ? (
              <img
                src={images?.topRight?.previewUrl}
                className="preview-img-1"
                alt={"image1"}
                loading="lazy"
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
              {content?.title || "Welcome to Mahalo!"}
            </Typography>
            <Typography variant="subtitle2" fontWeight={"regular"} mt={2}>
              {content?.subtext}
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
            {images?.bottomLeft?.url ? (
              <img
                src={images?.bottomLeft?.previewUrl}
                className="preview-img-2"
                alt={"image2"}
                loading="lazy"
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
      {showModal && (
        <ForceLogoutModal
          showModal={showModal}
          closeModal={closeModal}
          logoutData={logoutData}
        />
      )}
    </Box>
  );
};

export default SignInLayout1;
