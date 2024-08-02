import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAppDispatch } from "../../Redux/hooks";
import { resetState } from "../../Redux/actions/resetAction";

let schema = yup.object().shape({
  currentPassword: yup.string().required("Old Password is Required"),
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

const ChangePassword = () => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = (type: string) => {
    if (type === "currentPassword") {
      setShowCurrentPassword((prev) => !prev);
    } else if (type === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      let resultObj = {
        currentPassword: values.currentPassword,
        newPassword: values.password,
      };
      const res: AxiosResponse = await http.patch(
        "user/auth/change-password",
        resultObj
      );
      await http.post("user/auth/logout");
      navigate("/");
      setSubmitLoader(false);
      toastMessage("success", res.data.message);
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    } finally {
      localStorage.clear();
      dispatch(resetState());
    }
  };

  return (
    <Box sx={AuthLayout}>
      <Box sx={SignInWrapper}>
        <Typography variant="h2" mb={3}>
          Change Password
        </Typography>
        <Formik
          initialValues={{
            currentPassword: "",
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
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="currentPassword">
                    Your Current Password
                  </FormLabel>
                  <TextField
                    placeholder="Your current password"
                    id="currentPassword"
                    {...getFieldProps("currentPassword")}
                    error={
                      touched?.currentPassword && errors?.currentPassword
                        ? true
                        : false
                    }
                    helperText={
                      touched?.currentPassword && errors?.currentPassword
                        ? (errors?.currentPassword as string)
                        : " "
                    }
                    type={showCurrentPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() =>
                              handleClickShowPassword("currentPassword")
                            }
                            edge="end"
                          >
                            {showCurrentPassword ? (
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
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="password">
                    New Password
                  </FormLabel>
                  <TextField
                    placeholder="Your new password"
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
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="confirmPassword">
                    Confirm New Password
                  </FormLabel>
                  <TextField
                    placeholder="Confirm new password"
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
                <Box mt={1}>
                  {!submitLoader ? (
                    <StyledButton type="submit" variant="contained" fullWidth>
                      Change Password
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
    </Box>
  );
};

export default ChangePassword;
