import {
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
import GridDates from "./GridDates";
import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { v4 as uuid } from "uuid";

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

const RepeatedFieldPreview = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;
  const repeatedConfig = properties?.repeatedConfig.columns;

  const [array, setArray] = useState<string[]>([uuid()]);

  return (
    <Stack gap={1}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead
            sx={{
              bgcolor: "secondary.main",
            }}
          >
            <TableRow>
              {repeatedConfig?.map((col: any, i: number) => (
                <TableCell key={i} component="th" scope="row">
                  {col.label}
                </TableCell>
              ))}
              <TableCell component="th" scope="row">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {array?.map((id, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {repeatedConfig?.map((col: any, j: number) => (
                  <TableCell key={j}>
                    {col.type === "text" ? (
                      <InputField />
                    ) : col.type === "number" ? (
                      <NumberField />
                    ) : col.type === "date" ? (
                      <GridDates dateFormat={col?.format!} />
                    ) : (
                      <SelectField choices={col.options || []} />
                    )}
                  </TableCell>
                ))}

                <TableCell sx={{ display: "flex", gap: "10px" }}>
                  <IconButton
                    onClick={() => {
                      setArray((prevArray) => [...prevArray, uuid()]);
                    }}
                  >
                    <Add color="primary" />
                  </IconButton>
                  {i !== 0 && (
                    <IconButton
                      onClick={() => {
                        setArray((prevArray) =>
                          prevArray.filter((arrId) => arrId !== id)
                        );
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default RepeatedFieldPreview;
