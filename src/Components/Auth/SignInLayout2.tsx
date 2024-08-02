import { NavLink } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  // FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  // Radio,
  // RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { SignInWrapper } from "./auth.style";
import { StyledButton } from "../Common/styles/button";
import ForceLogoutModal from "./ForceLogoutModal";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import isEmail from "validator/es/lib/isEmail";
import { Logo } from "../Common/assets/Sidebar";
import { ModalActionButtonStyles } from "../Common/styles/modal";

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

const SignInLayout2 = ({
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
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${images?.topRight?.previewUrl})`,
          backgroundRepeat: "no-repeat",
          alignItems: "flex-start",
          backgroundSize: "cover",
          p: "3%",
          display: "flex",
        }}
      >
        <Box
          sx={{
            ...SignInWrapper,
            borderRadius: "32px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "& .MuiInputBase-root": {
              backgroundColor: "white",
            },
          }}
        >
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
                loading="lazy"
              />
            ) : (
              <Logo />
            )}
          </Box>
          {emailverified &&
            (emailverified === "success" ? (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                }}
              >
                You have successfully accepted the invitation. Please sign in to
                continue.
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h2" fontWeight={500} mt={1} mb={3}>
                      Sign In
                    </Typography>
                  </Box>
                  <FormControl sx={{ ...InputWrapper, opacity: "100%" }}>
                    <FormLabel sx={LabelStyle} htmlFor="email">
                      Enter your username or email address
                    </FormLabel>
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
                  <FormControl sx={{ ...InputWrapper, mt: 2 }}>
                    <FormLabel sx={LabelStyle} htmlFor="password">
                      Enter your password
                    </FormLabel>
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
                  <Box sx={{ textAlign: "end" }}>
                    <NavLink to="/auth/forgot-password">
                      <Typography sx={{ textDecoration: "underline" }}>
                        Forgot password
                      </Typography>
                    </NavLink>
                  </Box>
                  <Box sx={{ ...ModalActionButtonStyles, mt: 10 }}>
                    {!submitLoader ? (
                      <StyledButton
                        variant="contained"
                        type="submit"
                        sx={{ width: "50%" }}
                      >
                        Sign In
                      </StyledButton>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={25} />
                      </Box>
                    )}
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
        {showModal && (
          <ForceLogoutModal
            showModal={showModal}
            closeModal={closeModal}
            logoutData={logoutData}
          />
        )}
      </Box>
    </>
  );
};

export default SignInLayout2;
