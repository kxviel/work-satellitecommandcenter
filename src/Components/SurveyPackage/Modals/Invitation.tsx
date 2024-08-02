import { FormControl, FormLabel, TextField } from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";

const Invitation = ({ touched, errors, getFieldProps }: any) => {
  return (
    <>
      <FormControl sx={InputWrapper}>
        <FormLabel sx={LabelStyle} htmlFor="email-subject">
          Email Subject <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <TextField
          placeholder="Email Subject"
          id="email-subject"
          {...getFieldProps("invitationSubject")}
          error={
            touched?.invitationSubject && errors?.invitationSubject
              ? true
              : false
          }
          helperText={
            touched?.invitationSubject && errors?.invitationSubject
              ? (errors?.invitationSubject as string)
              : " "
          }
        />
      </FormControl>

      <FormControl sx={InputWrapper}>
        <FormLabel sx={LabelStyle} htmlFor="message-body">
          Message Body <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <TextField
          multiline
          placeholder="Message"
          minRows={4}
          id="message-body"
          {...getFieldProps("invitationBody")}
          error={
            touched?.invitationBody && errors?.invitationBody ? true : false
          }
          helperText={
            touched?.invitationBody && errors?.invitationBody
              ? (errors?.invitationBody as string)
              : " "
          }
        />
      </FormControl>
    </>
  );
};

export default Invitation;
