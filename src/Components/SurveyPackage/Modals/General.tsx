import { FormControl, FormLabel, TextField } from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";

const General = ({ errors, touched, getFieldProps }: any) => {
  return (
    <>
      <FormControl sx={InputWrapper}>
        <FormLabel sx={LabelStyle} htmlFor="name">
          Name <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <TextField
          placeholder="Package Name"
          id="name"
          {...getFieldProps("name")}
          error={touched?.name && errors?.name ? true : false}
          helperText={
            touched?.name && errors?.name ? (errors?.name as string) : " "
          }
        />
      </FormControl>
      <FormControl sx={InputWrapper}>
        <FormLabel sx={LabelStyle} htmlFor="introductionText">
          Introduction Text
        </FormLabel>
        <TextField
          multiline
          placeholder="Introduction Text"
          minRows={4}
          id="introductionText"
          {...getFieldProps("introText")}
          error={touched?.introText && errors?.introText ? true : false}
          helperText={
            touched?.introText && errors?.introText
              ? (errors?.introText as string)
              : " "
          }
        />
      </FormControl>

      <FormControl sx={InputWrapper}>
        <FormLabel sx={LabelStyle} htmlFor="outroText">
          Outro Text
        </FormLabel>
        <TextField
          multiline
          placeholder="Outro Text"
          minRows={4}
          id="outroText"
          {...getFieldProps("outroText")}
          error={touched?.outroText && errors?.outroText ? true : false}
          helperText={
            touched?.outroText && errors?.outroText
              ? (errors?.outroText as string)
              : " "
          }
        />
      </FormControl>

      <FormControl sx={InputWrapper}>
        <FormLabel sx={LabelStyle} htmlFor="remarks">
          Remarks
        </FormLabel>
        <TextField
          multiline
          placeholder="Remarks"
          minRows={4}
          id="remarks"
          {...getFieldProps("remarks")}
          error={touched?.remarks && errors?.remarks ? true : false}
          helperText={
            touched?.remarks && errors?.remarks
              ? (errors?.remarks as string)
              : " "
          }
        />
      </FormControl>
    </>
  );
};

export default General;
