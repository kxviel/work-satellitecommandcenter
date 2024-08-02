import {
  ErrorOutline,
  InfoOutlined,
  CancelOutlined as Remove,
  ReportProblemOutlined,
} from "@mui/icons-material";
import {
  Button,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  handleAddRemoveValidations,
  handleValidationsChange,
} from "../../../Redux/reducers/questionSlice";
import ValidationDatePickers from "./ValidationDatePickers";
import { requiredStyles } from "./BasicTab";

type Props = {
  question: any;
};

const fieldArray: SxProps = {
  mb: 3,
  border: "1px solid",
  borderColor: "#E5E7EB",
};

const fieldHeader: SxProps = {
  px: 2,
  py: 1,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid",
  borderColor: "#E5E7EB",
};

const fieldContent: SxProps = {
  px: 2,
  py: 1,
  gap: 4,
};

const eqArr = [
  {
    label: "Is",
    value: "eq",
  },
  {
    label: "Is Not",
    value: "not_eq",
  },
];
const conditionArr = [
  {
    label: "Greater Than or Equal To",
    value: "gte",
  },
  {
    label: "Greater Than",
    value: "gt",
  },
  {
    label: "Less Than or Equal To",
    value: "lte",
  },
  {
    label: "Less Than",
    value: "lt",
  },
  {
    label: "Equal To",
    value: "eq",
  },
  {
    label: "Not Equal To",
    value: "not_eq",
  },
];
const checkboxArr = [
  {
    label: "Checked",
    value: "is_checked",
  },
  {
    label: "Not Checked",
    value: "is_not_checked",
  },
];

export const conditionOptionMap: Record<string, any[]> = {
  text: eqArr,
  date: conditionArr,
  number: conditionArr,
  slider: conditionArr,
  calculated_field: conditionArr,
  checkbox: checkboxArr,
  dropdown: eqArr,
  radio: eqArr,
  randomize: eqArr,
};

const titleMap: Record<string, string> = {
  info: "Information",
  error: "Error",
  warning: "Warning",
};

const ValidationTab = ({ question }: Props) => {
  const { validations }: { validations: any[] } = question || {};
  const { choices }: { choices: any[] } = question || {};

  const dispatch = useAppDispatch();
  const isValidationsError = useAppSelector(
    ({ question }) => question.isValidationsError
  );
  const isPreview = useAppSelector(({ question }) => !question.editable);

  const onChange = (
    key: string,
    index: number,
    event: any,
    convertToNum?: boolean
  ) => {
    dispatch(
      handleValidationsChange({
        key,
        value: event.target.value,
        index,
        convertToNum,
      })
    );
  };

  return (
    <Stack gap={2} py={1}>
      {isValidationsError && (
        <Typography variant="caption" fontWeight="medium" color={"red"}>
          {isValidationsError}
        </Typography>
      )}

      {validations &&
        validations.map((choice, i) => (
          <Stack sx={fieldArray} key={i}>
            <Stack sx={fieldHeader}>
              <Typography variant="subtitle1" fontWeight="medium">
                {titleMap[choice.type]}
              </Typography>

              <IconButton
                color="error"
                onClick={() =>
                  dispatch(
                    handleAddRemoveValidations({
                      actionType: "remove",
                      actionIndex: i,
                    })
                  )
                }
              >
                <Remove />
              </IconButton>
            </Stack>

            <Stack sx={fieldContent}>
              <Stack gap={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={requiredStyles}
                >
                  If the field is
                </Typography>

                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <Select
                    readOnly={isPreview}
                    sx={{ width: "50%" }}
                    id={"operator"}
                    placeholder="Select"
                    inputProps={{ "aria-label": "Without label" }}
                    value={choice?.operator || ""}
                    onChange={(e) => onChange("operator", i, e)}
                  >
                    {conditionOptionMap[question.type]?.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {["text"].includes(question.type) && (
                    <TextField
                      sx={{ width: "50%" }}
                      id={"textValue"}
                      placeholder="Value"
                      value={choice.textValue}
                      onChange={(e) => onChange("textValue", i, e)}
                      name={"textValue"}
                      InputProps={{
                        readOnly: isPreview,
                      }}
                    />
                  )}

                  {/* Date and Time Pickers */}
                  {["date"].includes(question.type) && (
                    <ValidationDatePickers
                      question={question}
                      curr={choice}
                      i={i}
                    />
                  )}

                  {["number", "slider", "calculated_field"].includes(
                    question.type
                  ) && (
                    <TextField
                      type="number"
                      sx={{ width: "50%" }}
                      id={"numberValue"}
                      placeholder="Value"
                      value={choice.numberValue}
                      onChange={(e) => onChange("numberValue", i, e, true)}
                      name={"numberValue"}
                      InputProps={{
                        readOnly: isPreview,
                      }}
                    />
                  )}

                  {["radio", "dropdown", "checkbox"].includes(
                    question.type
                  ) && (
                    <Select
                      readOnly={isPreview}
                      sx={{ width: "50%" }}
                      id={"questionChoiceId"}
                      placeholder="Select"
                      inputProps={{ "aria-label": "Without label" }}
                      value={choice.questionChoiceId || ""}
                      onChange={(e) => onChange("questionChoiceId", i, e)}
                    >
                      {choices.map((c, index) => (
                        <MenuItem key={c.ref} value={c.ref}>
                          {c.label || "Choice " + (index + 1)}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Stack>
              </Stack>

              <Stack gap={1}>
                <InputLabel>Show</InputLabel>

                <RadioGroup
                  aria-labelledby="Show-Radio-Group"
                  defaultValue="error"
                  name="Show-Radio-Group"
                  onChange={(e) => onChange("type", i, e)}
                  value={choice.type || ""}
                >
                  <FormControlLabel
                    disabled={isPreview}
                    value="error"
                    control={<Radio />}
                    label={
                      <Stack direction={"row"} alignItems={"center"} gap={1}>
                        Error
                        <ReportProblemOutlined color="error" />
                      </Stack>
                    }
                  />
                  <FormControlLabel
                    disabled={isPreview}
                    value="warning"
                    control={<Radio />}
                    label={
                      <Stack direction={"row"} alignItems={"center"} gap={1}>
                        Warning
                        <ErrorOutline color="warning" />
                      </Stack>
                    }
                  />
                  <FormControlLabel
                    disabled={isPreview}
                    value="info"
                    control={<Radio />}
                    label={
                      <Stack direction={"row"} alignItems={"center"} gap={1}>
                        Information
                        <InfoOutlined color="info" />
                      </Stack>
                    }
                  />
                </RadioGroup>
              </Stack>

              <Stack gap={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={requiredStyles}
                >
                  Message
                </Typography>
                <TextField
                  name="message"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Type message here"
                  value={choice.message}
                  onChange={(e) => onChange("message", i, e)}
                  InputProps={{
                    readOnly: isPreview,
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        ))}

      <Button
        variant="outlined"
        onClick={() =>
          dispatch(
            handleAddRemoveValidations({
              actionType: "add",
            })
          )
        }
        disabled={isPreview}
        sx={{ width: "fit-content" }}
      >
        Add Validation
      </Button>
    </Stack>
  );
};
export default ValidationTab;
