import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  QuestionSlice,
  handleAddRepeatedData,
  handleRemoveRepeatedData,
  handleRepeatedUpdate,
} from "../../../Redux/reducers/responseSlice";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import GridDates from "./GridDates";
import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import { Sigh } from "./GridField";

type Props = {
  currentQuestion: QuestionSlice;
};

const InputField = ({
  rowIndex,
  colIndex,
  currentQuestion,
  handleChange,
  isPreview,
}: Sigh) => {
  const { responses } = currentQuestion;
  const currentResponse =
    responses?.[0]?.repeatedData?.[rowIndex][colIndex] || "";

  return (
    <TextField
      name="textValue"
      fullWidth
      sx={{ width: 200 }}
      placeholder="Enter Value"
      value={currentResponse?.textValue || ""}
      onChange={(e) =>
        handleChange(e.target.value, rowIndex, colIndex, "textValue")
      }
      InputProps={{ readOnly: isPreview }}
    />
  );
};

const NumberField = ({
  rowIndex,
  colIndex,
  currentQuestion,
  handleChange,
  isPreview,
}: Sigh) => {
  const { responses } = currentQuestion;
  const currentResponse =
    responses?.[0]?.repeatedData?.[rowIndex][colIndex] || "";
  return (
    <TextField
      type="number"
      name="numberValue"
      fullWidth
      sx={{ width: 200 }}
      placeholder="Enter Numeric Value"
      value={currentResponse.numberValue || ""}
      onChange={(e) =>
        handleChange(e.target.value, rowIndex, colIndex, "numberValue")
      }
      InputProps={{ readOnly: isPreview }}
    />
  );
};

const SelectField = ({
  choices,
  rowIndex,
  colIndex,
  currentQuestion,
  handleChange,
  isPreview,
}: Sigh & { choices: string[] }) => {
  const { responses } = currentQuestion;
  const currentResponse =
    responses?.[0]?.repeatedData?.[rowIndex][colIndex] || "";

  return (
    <Select
      fullWidth
      sx={{ width: 200 }}
      id="position"
      value={currentResponse.textValue || ""}
      onChange={(e) => {
        handleChange(e.target.value, rowIndex, colIndex, "textValue");
      }}
      readOnly={isPreview}
    >
      {choices?.map((choice, i) => (
        <MenuItem key={i} value={choice}>
          {choice}
        </MenuItem>
      ))}
    </Select>
  );
};

const RepeatedField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const isPreview = useAppSelector((state) => !state.response.formEditable);

  const { properties, responses } = currentQuestion;
  const repeatedConfig = properties?.repeatedConfig.columns;
  const currentResArray = responses[0].repeatedData;

  const handleChange = (
    value: any,
    rowIndex: number,
    colIndex: number,
    key: string
  ) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleRepeatedUpdate({
          key,
          convertToInt: key === "numberValue",
          value: value,
          id: currentQuestion.id,
          rowIndex,
          colIndex,
        })
      );
    }
  };

  const handleBlur = () => {
    if (currentQuestion?.id && !isPreview && !isFieldSubmitting) {
      dispatch(
        updateResponse({
          studyId,
          questionId: currentQuestion.id,
          surveySlug,
        })
      );
    }
  };

  return (
    <Stack
      sx={{
        width: {
          xs: "100%",
          md: "80%",
        },
        pl: "60px",
      }}
      gap={1}
    >
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead sx={{ bgcolor: "secondary.main" }}>
            <TableRow>
              {repeatedConfig?.map((col, i) => (
                <TableCell key={i} component="th" scope="row">
                  {col.label}
                </TableCell>
              ))}
              {!isPreview && (
                <TableCell component="th" scope="row">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentResArray?.map((_: any, i: number) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {repeatedConfig?.map((col, j) => (
                  <TableCell key={j}>
                    {col.type === "text" ? (
                      <InputField
                        rowIndex={i}
                        colIndex={j}
                        currentQuestion={currentQuestion}
                        handleChange={handleChange}
                        isPreview={isPreview}
                      />
                    ) : col.type === "number" ? (
                      <NumberField
                        rowIndex={i}
                        colIndex={j}
                        currentQuestion={currentQuestion}
                        handleChange={handleChange}
                        isPreview={isPreview}
                      />
                    ) : col.type === "date" ? (
                      <GridDates
                        rowIndex={i}
                        colIndex={j}
                        dateFormat={col?.format}
                        currentQuestion={currentQuestion}
                        handleChange={handleChange}
                        isGrid={false}
                        isPreview={isPreview}
                      />
                    ) : (
                      <SelectField
                        rowIndex={i}
                        colIndex={j}
                        currentQuestion={currentQuestion}
                        handleChange={handleChange}
                        choices={col.options || []}
                        isPreview={isPreview}
                      />
                    )}
                  </TableCell>
                ))}

                {!isPreview && (
                  <TableCell sx={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      onClick={() => {
                        dispatch(
                          handleAddRepeatedData({ id: currentQuestion.id })
                        );
                      }}
                    >
                      <Add color="primary" />
                    </IconButton>
                    {i !== 0 && (
                      <IconButton
                        onClick={() => {
                          dispatch(
                            handleRemoveRepeatedData({
                              id: currentQuestion.id,
                              index: i,
                            })
                          );
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        disabled={!!isFieldSubmitting || isPreview}
        variant="contained"
        onClick={handleBlur}
        sx={{ width: "fit-content", alignSelf: "flex-end" }}
      >
        Save
      </Button>
    </Stack>
  );
};

export default RepeatedField;
