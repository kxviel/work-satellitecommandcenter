import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Form, Formik, FormikValues } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { AuthLayout, SignInWrapper } from "./auth.style";

import { StyledButton } from "../Common/styles/button";
import { InputWrapper, LabelStyle } from "../Common/styles/form";

let schema = yup.object().shape({
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .required("*New Password is Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("*Confirm Password is Required"),
});

const ResetPassword = () => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
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

      let data = {
        password: values.password,
        token: token,
      };
      const res: AxiosResponse = await http.post(
        "user/auth/reset-password",
        data
      );
      toastMessage("success", res.data.message);

      navigate("/auth/login");
      setSubmitLoader(false);
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Box sx={AuthLayout}>
      <Box sx={SignInWrapper}>
        <Typography variant="h2" mb={3}>
          Reset Password
        </Typography>
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(data: FormikValues) => {
            submitHandler(data);
          }}
          validationSchema={schema}
        >
          {({ values, errors, touched, getFieldProps }) => {
            return (
              <Form>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="password">
                    New Password
                  </FormLabel>
                  <TextField
                    placeholder="Your new password here"
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
                    Confirm New Password
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
                <Box mt={1} sx={{ display: "flex", justifyContent: "center" }}>
                  {!submitLoader ? (
                    <StyledButton type="submit" variant="contained" fullWidth>
                      Set Password
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

export default ResetPassword;
