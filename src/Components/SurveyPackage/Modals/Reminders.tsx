import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  FormControlLabel,
  Typography,
  Checkbox,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";

const Reminders = ({
  touched,
  errors,
  getFieldProps,
  setFieldValue,
  values,
  menuLabels,
}: any) => {
  return (
    <>
      <FormControl sx={{ ...InputWrapper, mb: 1 }}>
        <Box>
          <FormControlLabel
            label={
              <Typography fontSize={16} fontWeight={500} color="text.primary">
                Send a reminder if the {menuLabels?.survey || "survey"} is not
                yet completed
              </Typography>
            }
            control={
              <Checkbox
                checked={values?.isReminder === true}
                onChange={(event) => {
                  setFieldValue("isReminder", event.target.checked);
                }}
              />
            }
          />
        </Box>
      </FormControl>

      {values?.isReminder === true && (
        <>
          <FormControl sx={InputWrapper}>
            <FormLabel sx={LabelStyle} htmlFor="send-reminder">
              Send Reminder After(Days) <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              placeholder="Send Reminder After (Days)"
              id="send-reminder"
              {...getFieldProps("reminderPattern")}
              error={
                touched?.reminderPattern && errors?.reminderPattern
                  ? true
                  : false
              }
              helperText={
                touched?.reminderPattern && errors?.reminderPattern
                  ? (errors?.reminderPattern as string)
                  : " "
              }
            />
          </FormControl>
          <FormControl sx={InputWrapper}>
            <FormLabel sx={LabelStyle} htmlFor="email-subject">
              Email Subject <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              placeholder="Subject"
              id="email-subject"
              {...getFieldProps("emailSubject")}
              error={
                touched?.emailSubject && errors?.emailSubject ? true : false
              }
              helperText={
                touched?.emailSubject && errors?.emailSubject
                  ? (errors?.emailSubject as string)
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
              placeholder="Message Body"
              minRows={4}
              id="message-body"
              {...getFieldProps("emailBody")}
              error={touched?.emailBody && errors?.emailBody ? true : false}
              helperText={
                touched?.emailBody && errors?.emailBody
                  ? (errors?.emailBody as string)
                  : " "
              }
            />
          </FormControl>
        </>
      )}
    </>
  );
};

export default Reminders;
