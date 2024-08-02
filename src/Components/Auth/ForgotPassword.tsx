import { useState } from "react";
import {
  Box,
  // Button,
  CircularProgress,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { Form, Formik, FormikValues } from "formik";
import * as yup from "yup";

import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import {
  AuthLayout,
  // FormHelperTextContainer,
  SignInWrapper,
} from "./auth.style";
import { StyledButton } from "../Common/styles/button";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import isEmail from "validator/es/lib/isEmail";

const schema = yup.object({
  email: yup
    .string()

    .required("Email ID is Required")
    .test("is-valid", "*Please enter a valid Email ID.", (value) =>
      value ? isEmail(value) : false
    ),
});

const ForgotPassword = () => {
  const [submitLoader, setSubmitLoader] = useState(false);

  // const navigate = useNavigate();

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      let data = {
        username: values.email,
        strategy: "email",
      };
      const url = "/user/auth/forgot-password";
      const res: AxiosResponse = await http.post(url, data);
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
          Forgot your password?
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight={500}
          color="text.secondary"
          mb={2}
        >
          Don't fret! Just type in your email and we will send you a link to
          reset your password!
        </Typography>

        <Formik
          initialValues={{
            email: "",
          }}
          enableReinitialize
          onSubmit={(data: FormikValues) => {
            submitHandler(data);
          }}
          validationSchema={schema}
        >
          {({ values, errors, touched, getFieldProps }) => {
            return (
              <Form>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="email">
                    Your email
                  </FormLabel>
                  <TextField
                    placeholder="name@example.com"
                    id="email"
                    error={touched?.email && errors?.email ? true : false}
                    helperText={
                      touched?.email && errors?.email
                        ? (errors?.email as string)
                        : " "
                    }
                    {...getFieldProps("email")}
                  />
                </FormControl>
                <Box mt={1} sx={{ display: "flex", justifyContent: "center" }}>
                  {!submitLoader ? (
                    <StyledButton type="submit" variant="contained" fullWidth>
                      Submit
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

export default ForgotPassword;
