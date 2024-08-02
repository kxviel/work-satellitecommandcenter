import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Form, Formik, FormikValues } from "formik";
import * as yup from "yup";
import {
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";

import { AuthLayout, SignInWrapper } from "./auth.style";
import { StyledButton } from "../Common/styles/button";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import { useQuery } from "../../utils/hooks";

let schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .required("Password is Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is Required"),
});

const SetPassword = () => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = useQuery().get("token");
  const navigate = useNavigate();

  const handleClickShowPassword = (type: string) => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      let resultObj = {
        password: values.password,
        token: token,
        firstName: values.firstName,
        lastName: values.lastName,
      };
      const res: AxiosResponse = await http.post(
        `/user/auth/set-password`,
        resultObj
      );
      navigate("/auth/login");
      setSubmitLoader(false);
      toastMessage("success", res.data.message);
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Box sx={AuthLayout}>
      <Box sx={SignInWrapper}>
        <Typography variant="h2" mb={3}>
          Register Your Account
        </Typography>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(data: FormikValues) => {
            submitHandler(data);
          }}
          validationSchema={schema}
        >
          {({ errors, touched, getFieldProps }) => {
            return (
              <Form>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="first-name">
                      First Name
                    </FormLabel>
                    <TextField
                      placeholder="First Name"
                      id="first-name"
                      {...getFieldProps("firstName")}
                      inputProps={{
                        form: {
                          autocomplete: "given-name",
                        },
                      }}
                      error={
                        touched?.firstName && errors?.firstName ? true : false
                      }
                      helperText={
                        touched?.firstName && errors?.firstName
                          ? (errors?.firstName as string)
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="last-name">
                      Last Name
                    </FormLabel>
                    <TextField
                      inputProps={{
                        form: {
                          autocomplete: "family-name",
                        },
                      }}
                      placeholder="Last Name"
                      id="last-name"
                      {...getFieldProps("lastName")}
                      error={
                        touched?.lastName && errors?.lastName ? true : false
                      }
                      helperText={
                        touched?.lastName && errors?.lastName
                          ? (errors?.lastName as string)
                          : " "
                      }
                    />
                  </FormControl>
                </Box>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="password">
                    Password
                  </FormLabel>
                  <TextField
                    placeholder="Your password here"
                    id="password"
                    {...getFieldProps("password")}
                    error={touched?.password && errors?.password ? true : false}
                    helperText={
                      touched?.password && errors?.password
                        ? (errors?.password as string)
                        : " "
                    }
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() => handleClickShowPassword("password")}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl sx={InputWrapper} className="input-wrapper mb-3">
                  <FormLabel sx={LabelStyle} htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <TextField
                    placeholder="Confirm password"
                    id="confirmPassword"
                    {...getFieldProps("confirmPassword")}
                    error={
                      touched?.confirmPassword && errors?.confirmPassword
                        ? true
                        : false
                    }
                    helperText={
                      touched?.confirmPassword && errors?.confirmPassword
                        ? (errors?.confirmPassword as string)
                        : " "
                    }
                    type={showConfirmPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() =>
                              handleClickShowPassword("confirmPassword")
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
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
                <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
                  {!submitLoader ? (
                    <StyledButton type="submit" variant="contained" fullWidth>
                      Register
                    </StyledButton>
                  ) : (
                    <CircularProgress size={25} />
                  )}
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};

export default SetPassword;
