import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  handleAddRemoveGridConfigs,
  handleAddRemoveGridOptions,
  handleGridConfigModification,
} from "../../../Redux/reducers/questionSlice";
import { LabelStyle } from "../../Common/styles/form";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import CloseEyeIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState } from "react";
import GridFieldPreview from "../PreviewItems/GridFieldPreview";

type Props = {
  question: any;
};

const GridConfigTab = ({ question }: Props) => {
  const dispatch = useAppDispatch();
  const isPreview = useAppSelector(({ question }) => !question.editable);
  const isGridConfigError = useAppSelector(
    ({ question }) => question.isGridConfigError
  );

  const gridConfig: {
    fieldType: "row" | "column";
    rows: any[];
    columns: any[];
  } = question.properties?.gridConfig || {};

  const [showPreview, setShowPreview] = useState(false);

  return (
    <Stack gap={2} py={1}>
      {isGridConfigError && (
        <Typography variant="caption" fontWeight="medium" color={"red"}>
          {isGridConfigError}
        </Typography>
      )}

      <Stack
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={showPreview ? "flex-end" : "space-between"}
      >
        {!showPreview && (
          <FormControl disabled={isPreview}>
            <RadioGroup
              row
              value={gridConfig.fieldType}
              onChange={(e) =>
                dispatch(
                  handleGridConfigModification({
                    section: "fieldType",
                    value: e.target.value,
                  })
                )
              }
            >
              <FormControlLabel value="row" control={<Radio />} label="Row" />
              <FormControlLabel
                value="column"
                control={<Radio />}
                label="Column"
              />
            </RadioGroup>
          </FormControl>
        )}

        <Button
          variant="outlined"
          endIcon={showPreview ? <CloseEyeIcon /> : <EyeIcon />}
          onClick={() => setShowPreview((prev) => !prev)}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </Stack>

      {!showPreview ? (
        <>
          <Stack direction={"row"} gap={4}>
            <Box width={"50%"}>
              <Typography sx={LabelStyle}>Row Labels</Typography>
              {gridConfig &&
                gridConfig.rows.map((row: any, i: any) => (
                  <Box key={i}>
                    <Stack
                      direction="row"
                      alignItems={"center"}
                      mb={3}
                      gap={"2%"}
                    >
                      <TextField
                        sx={{ width: "70%" }}
                        placeholder=" Label"
                        value={row.label}
                        onChange={(e) =>
                          dispatch(
                            handleGridConfigModification({
                              currentIndex: i,
                              section: "label",
                              value: e.target.value,
                              type: "rows",
                            })
                          )
                        }
                        name="option-label"
                        InputProps={{
                          readOnly: isPreview,
                        }}
                      />
                      {!isPreview && (
                        <IconButton
                          aria-label="add"
                          size="medium"
                          sx={{ ml: 1 }}
                          onClick={() =>
                            dispatch(
                              handleAddRemoveGridConfigs({
                                actionType: "add",
                                actionIndex: i,
                                type: "rows",
                              })
                            )
                          }
                        >
                          <Add
                            fontSize="medium"
                            sx={{ color: "primary.main" }}
                          />
                        </IconButton>
                      )}
                      {!isPreview && i !== 0 && (
                        <IconButton
                          aria-label="delete"
                          size="medium"
                          sx={{ ml: 1 }}
                          color="error"
                          onClick={() =>
                            dispatch(
                              handleAddRemoveGridConfigs({
                                actionType: "remove",
                                actionIndex: i,
                                type: "rows",
                              })
                            )
                          }
                        >
                          <Delete
                            fontSize="medium"
                            sx={{ color: "error.main" }}
                          />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                ))}
            </Box>
            <Box width={"50%"}>
              <Typography sx={LabelStyle}>Column Labels</Typography>
              {gridConfig &&
                gridConfig.columns.map((column: any, i: any) => (
                  <Box key={i}>
                    <Stack
                      direction="row"
                      alignItems={"center"}
                      mb={3}
                      gap={"2%"}
                    >
                      <TextField
                        sx={{ width: "70%" }}
                        placeholder=" Label"
                        value={column.label}
                        onChange={(e) =>
                          dispatch(
                            handleGridConfigModification({
                              currentIndex: i,
                              section: "label",
                              value: e.target.value,
                              type: "columns",
                            })
                          )
                        }
                        name="option-label"
                        InputProps={{
                          readOnly: isPreview,
                        }}
                      />
                      {!isPreview && (
                        <IconButton
                          aria-label="add"
                          size="medium"
                          sx={{ ml: 1 }}
                          onClick={() =>
                            dispatch(
                              handleAddRemoveGridConfigs({
                                actionType: "add",
                                actionIndex: i,
                                type: "columns",
                              })
                            )
                          }
                        >
                          <Add
                            fontSize="medium"
                            sx={{ color: "primary.main" }}
                          />
                        </IconButton>
                      )}
                      {!isPreview && i !== 0 && (
                        <IconButton
                          aria-label="delete"
                          size="medium"
                          sx={{ ml: 1 }}
                          color="error"
                          onClick={() =>
                            dispatch(
                              handleAddRemoveGridConfigs({
                                actionType: "remove",
                                actionIndex: i,
                                type: "columns",
                              })
                            )
                          }
                        >
                          <Delete
                            fontSize="medium"
                            sx={{ color: "error.main" }}
                          />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                ))}
            </Box>
          </Stack>

          {gridConfig &&
            gridConfig[(gridConfig.fieldType + "s") as "rows" | "columns"].map(
              (item: any, i: any) => (
                <Box key={i}>
                  <Typography sx={LabelStyle}>
                    Field type {gridConfig.fieldType} {i + 1}:
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems={"center"}
                    mb={3}
                    gap={"2%"}
                  >
                    <Select
                      readOnly={isPreview}
                      sx={{ width: "40%" }}
                      id="type"
                      value={item.type || ""}
                      onChange={(e) =>
                        dispatch(
                          handleGridConfigModification({
                            currentIndex: i,
                            section: "type",
                            value: e.target.value,
                            type: gridConfig.fieldType + "s",
                          })
                        )
                      }
                    >
                      <MenuItem value={"text"}>Text</MenuItem>
                      <MenuItem value={"number"}>Number</MenuItem>
                      <MenuItem value={"dropdown"}>Dropdown</MenuItem>
                      <MenuItem value={"date"}>Date</MenuItem>
                    </Select>
                  </Stack>
                  {item.type === "dropdown" &&
                    item.options.map((option: any, optionIndex: any) => (
                      <Stack
                        key={optionIndex}
                        direction="row"
                        alignItems={"center"}
                        mb={3}
                        gap={2}
                      >
                        <TextField
                          sx={{ width: "82%" }}
                          placeholder="Option Label"
                          value={option}
                          onChange={(e) =>
                            dispatch(
                              handleGridConfigModification({
                                currentIndex: i,
                                optIndex: optionIndex,
                                section: "options",
                                value: e.target.value,
                                type: gridConfig.fieldType + "s",
                              })
                            )
                          }
                          name="option-label"
                          InputProps={{
                            readOnly: isPreview,
                          }}
                        />
                        {!isPreview && (
                          <IconButton
                            aria-label="add"
                            size="medium"
                            sx={{ ml: 1 }}
                            onClick={() =>
                              dispatch(
                                handleAddRemoveGridOptions({
                                  actionType: "add",
                                  columnIndex: i,
                                  actionIndex: optionIndex,
                                  type: (gridConfig.fieldType + "s") as
                                    | "rows"
                                    | "columns",
                                })
                              )
                            }
                          >
                            <Add
                              fontSize="medium"
                              sx={{ color: "primary.main" }}
                            />
                          </IconButton>
                        )}
                        {!isPreview &&
                          optionIndex !== 0 &&
                          optionIndex !== 1 && (
                            <IconButton
                              aria-label="delete"
                              size="medium"
                              sx={{ ml: 1 }}
                              color="error"
                              onClick={() =>
                                dispatch(
                                  handleAddRemoveGridOptions({
                                    actionType: "remove",
                                    columnIndex: i,
                                    actionIndex: optionIndex,
                                    type: (gridConfig.fieldType + "s") as
                                      | "rows"
                                      | "columns",
                                  })
                                )
                              }
                            >
                              <Delete
                                fontSize="medium"
                                sx={{ color: "error.main" }}
                              />
                            </IconButton>
                          )}
                      </Stack>
                    ))}
                  {item.type === "date" && (
                    <Select
                      readOnly={isPreview}
                      sx={{ width: "82%" }}
                      id="format"
                      value={item.format}
                      onChange={(e) =>
                        dispatch(
                          handleGridConfigModification({
                            currentIndex: i,
                            section: "format",
                            value: e.target.value,
                            type: gridConfig.fieldType + "s",
                          })
                        )
                      }
                    >
                      <MenuItem value={"DD/MM/YYYY"}>DD/MM/YYYY</MenuItem>
                      <MenuItem value={"MM/DD/YYYY"}>MM/DD/YYYY</MenuItem>
                      <MenuItem value={"DD/MM/YYYY HH:mm"}>
                        DD/MM/YYYY HH:mm
                      </MenuItem>
                      <MenuItem value={"MM/DD/YYYY HH:mm"}>
                        MM/DD/YYYY HH:mm
                      </MenuItem>
                      <MenuItem value={"HH:mm"}>HH:mm</MenuItem>
                      <MenuItem value={"HH:mm:ss"}>HH:mm:ss</MenuItem>
                      <MenuItem value={"YYYY"}>YYYY</MenuItem>
                      <MenuItem value={"MM/YYYY"}>MM/YYYY</MenuItem>
                    </Select>
                  )}
                </Box>
              )
            )}
        </>
      ) : (
        <Stack sx={{ width: "100%" }} alignItems={"center"}>
          <GridFieldPreview currentQuestion={question} />
        </Stack>
      )}
    </Stack>
  );
};
export default GridConfigTab;
