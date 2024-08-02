import {
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
import GridDates from "./GridDates";

type Props = {
  currentQuestion: any;
};

const InputField = () => {
  return (
    <TextField
      name="textValue"
      fullWidth
      sx={{ width: 250 }}
      placeholder="Enter Value"
    />
  );
};

const NumberField = () => {
  return (
    <TextField
      type="number"
      name="numberValue"
      fullWidth
      sx={{ width: 250 }}
      placeholder="Enter Numeric Value"
    />
  );
};

const SelectField = ({ choices }: { choices: string[] }) => {
  return (
    <Select fullWidth sx={{ width: 250 }} id="position" defaultValue={""}>
      {choices?.map((choice, i) => (
        <MenuItem key={i} value={choice}>
          {choice}
        </MenuItem>
      ))}
    </Select>
  );
};

const GridFieldPreview = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;
  const gridConfig = properties?.gridConfig;

  return (
    <Stack gap={1}>
      {gridConfig?.fieldType === "row" && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead
              sx={{
                bgcolor: "secondary.main",
              }}
            >
              <TableRow>
                <TableCell> </TableCell>
                {gridConfig?.columns.map((col: any, i: number) => (
                  <TableCell key={col.label} component="th" scope="row">
                    {col.label || "Column " + (i + 1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gridConfig?.rows.map((row: any, i: number) => (
                <TableRow
                  key={row.label}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      bgcolor: "secondary.main",
                      width: 100,
                    }}
                  >
                    {row.label || "Row " + (i + 1)}
                  </TableCell>

                  {gridConfig?.columns.map((_: any, j: number) => (
                    <TableCell key={i + j} component="th" scope="row">
                      {row.type === "text" ? (
                        <InputField />
                      ) : row.type === "number" ? (
                        <NumberField />
                      ) : row.type === "date" ? (
                        <GridDates dateFormat={row?.format} />
                      ) : (
                        <SelectField choices={row.options || []} />
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
            <TableHead
              sx={{
                bgcolor: "secondary.main",
              }}
            >
              <TableRow>
                <TableCell> </TableCell>
                {gridConfig?.columns.map((col: any, i: number) => (
                  <TableCell key={i} component="th" scope="row">
                    {col.label || "Column " + (i + 1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gridConfig?.rows.map((row: any, i: number) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      bgcolor: "secondary.main",
                      width: 100,
                    }}
                  >
                    {row.label || "Row " + (i + 1)}
                  </TableCell>

                  {gridConfig?.columns.map((col: any, j: number) => (
                    <TableCell key={col.label} component="th" scope="row">
                      {col.type === "text" ? (
                        <InputField />
                      ) : col.type === "number" ? (
                        <NumberField />
                      ) : col.type === "date" ? (
                        <GridDates dateFormat={col?.format} />
                      ) : (
                        <SelectField choices={col.options || []} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default GridFieldPreview;
