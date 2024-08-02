import {
  Button,
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
  handleGridUpdate,
} from "../../../Redux/reducers/responseSlice";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import GridDates from "./GridDates";

type Props = {
  currentQuestion: QuestionSlice;
};

export type Sigh = Props & {
  rowIndex: number;
  colIndex: number;
  handleChange: (
    value: any,
    rowIndex: number,
    colIndex: number,
    key: string
  ) => void;
  dateFormat?: string;
  isGrid?: boolean;
  isPreview?: boolean;
};

const InputField = ({
  rowIndex,
  colIndex,
  currentQuestion,
  handleChange,
  isPreview,
}: Sigh) => {
  const { responses } = currentQuestion;
  const currentResponse = responses?.[0]?.gridData?.[rowIndex][colIndex] || "";

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
  const currentResponse = responses?.[0]?.gridData?.[rowIndex][colIndex] || "";

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
  const currentResponse = responses?.[0]?.gridData?.[rowIndex][colIndex] || "";

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

const GridField = ({ currentQuestion }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );

  const { properties } = currentQuestion;
  const gridConfig = properties?.gridConfig;

  const handleChange = (
    value: any,
    rowIndex: number,
    colIndex: number,
    key: string
  ) => {
    if (!isFieldSubmitting && !isPreview) {
      dispatch(
        handleGridUpdate({
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
      {gridConfig?.fieldType === "row" && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead sx={{ bgcolor: "secondary.main" }}>
              <TableRow>
                <TableCell> </TableCell>
                {gridConfig?.columns.map((col, index) => (
                  <TableCell key={col.label + index} component="th" scope="row">
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gridConfig?.rows.map((row, i) => (
                <TableRow
                  key={row.label + i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ bgcolor: "secondary.main", width: 100 }}
                  >
                    {row.label}
                  </TableCell>

                  {gridConfig?.columns.map((_, j) => (
                    <TableCell key={i + j} component="th" scope="row">
                      {row.type === "text" ? (
                        <InputField
                          rowIndex={i}
                          colIndex={j}
                          currentQuestion={currentQuestion}
                          handleChange={handleChange}
                          isPreview={isPreview}
                        />
                      ) : row.type === "number" ? (
                        <NumberField
                          rowIndex={i}
                          colIndex={j}
                          currentQuestion={currentQuestion}
                          handleChange={handleChange}
                          isPreview={isPreview}
                        />
                      ) : row.type === "date" ? (
                        <GridDates
                          rowIndex={i}
                          colIndex={j}
                          dateFormat={row?.format}
                          currentQuestion={currentQuestion}
                          handleChange={handleChange}
                          isGrid={true}
                          isPreview={isPreview}
                        />
                      ) : (
                        <SelectField
                          rowIndex={i}
                          colIndex={j}
                          currentQuestion={currentQuestion}
                          handleChange={handleChange}
                          choices={row.options || []}
                          isPreview={isPreview}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {gridConfig?.fieldType === "column" && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead sx={{ bgcolor: "secondary.main" }}>
              <TableRow>
                <TableCell> </TableCell>
                {gridConfig?.columns.map((col, i) => (
                  <TableCell key={i} component="th" scope="row">
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gridConfig?.rows.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ bgcolor: "secondary.main", width: 100 }}
                  >
                    {row.label}
                  </TableCell>

                  {gridConfig?.columns.map((col, j) => (
                    <TableCell key={col.label + j} component="th" scope="row">
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
                          isGrid={true}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

export default GridField;
