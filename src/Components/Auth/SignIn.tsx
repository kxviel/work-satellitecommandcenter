import { useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import {
  AuthLayout,
  //  AuthRadioSelector,
  SignInWrapper,
} from "./auth.style";
import { StyledButton } from "../Common/styles/button";
import ForceLogoutModal from "./ForceLogoutModal";
import { useAppDispatch } from "../../Redux/hooks";
import { setUserAuth } from "../../Redux/reducers/userSlice";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import isEmail from "validator/es/lib/isEmail";
import { Logo } from "../Common/assets/Sidebar";
import { useQuery } from "../../utils/hooks";

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

const SignIn = () => {
  const emailverified = useQuery().get("email_invite");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [logoutData, setLogoutData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = (data: any) => {
    setLogoutData(data);
    setShowModal(true);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (data: any) => {
    try {
      setSubmitLoader(true);
      const body: any = {
        username: data.email,
        password: data.password,
        userAgent: window.navigator.userAgent,
        strategy: "email",
      };
      let url = "user/auth/login";
      const res = await http.post(url, body);
      setSubmitLoader(true);
      const token = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;
      const userId = res.data.data.id;
      const firstName = res?.data?.data?.firstName;
      const lastName = res?.data?.data?.lastName;
      localStorage.setItem("sm-access-token", token);
      localStorage.setItem("sm-refresh-token", refreshToken);
      localStorage.setItem("user-id", userId);
      localStorage.setItem("first-name", firstName);
      localStorage.setItem("last-name", lastName);
      dispatch(setUserAuth({ authenticated: true, role: "", userId }));
    } catch (err) {
      setSubmitLoader(false);
      if (axios.isAxiosError(err) && err?.response?.status === 409) {
        openModal(data);
      } else {
        errorToastMessage(err as Error);
      }
    }
  };

  return (
    <Box sx={AuthLayout}>
      <Box sx={SignInWrapper}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
          <Logo />
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
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="email">
                    Your Email
                  </FormLabel>
                  <TextField
                    placeholder="name@example.com"
                    id="email"
                    {...getFieldProps("email")}
                    error={touched?.email && errors?.email ? true : false}
                    helperText={
                      touched?.email && errors?.email ? errors?.email : " "
                    }
                  />
                </FormControl>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="password">
                    Password
                  </FormLabel>
                  <TextField
                    placeholder="Your password"
                    id="password"
                    {...getFieldProps("password")}
                    error={touched?.password && errors?.password ? true : false}
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                {!submitLoader ? (
                  <StyledButton variant="contained" type="submit" fullWidth>
                    Sign In
                  </StyledButton>
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={25} />
                  </Box>
                )}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <NavLink to="/auth/forgot-password">Forgot password</NavLink>
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
  );
};

export default SignIn;
