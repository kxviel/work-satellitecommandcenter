import { IconButton, Stack, SxProps, Typography } from "@mui/material";
import { ErrorOutline, InfoOutlined } from "@mui/icons-material";
import { QuestionValidation } from "../../types/FormData.types";

type Props = {
  validationObject: QuestionValidation;
};

const root: SxProps = {
  width: "100%",
  alignItems: "center",
};

const ValidationField = ({ validationObject }: Props) => {
  return (
    <Stack direction={"row"} sx={root} gap={1}>
      {validationObject.type === "info" && (
        <IconButton>
          <InfoOutlined color="info" />
        </IconButton>
      )}
      {validationObject.type === "warning" && (
        <IconButton>
          <ErrorOutline color="warning" />
        </IconButton>
      )}
      {validationObject.type === "error" && (
        <IconButton>
          <ErrorOutline color="error" />
        </IconButton>
      )}
      <Typography>{validationObject.message}</Typography>
    </Stack>
  );
};
export default ValidationField;
