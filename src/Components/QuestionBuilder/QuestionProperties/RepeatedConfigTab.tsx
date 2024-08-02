import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  handleAddRemoveRepeatedConfigs,
  handleAddRemoveRepeatedOptions,
  handleRepeatedConfigModification,
} from "../../../Redux/reducers/questionSlice";
import { LabelStyle } from "../../Common/styles/form";

type Props = {
  question: any;
};

const RepeatedConfigTab = ({ question }: Props) => {
  const dispatch = useAppDispatch();
  const isPreview = useAppSelector(({ question }) => !question.editable);
  const { columns }: { columns: any[] } =
    question.properties.repeatedConfig || {};
  const isRepeatedConfigError = useAppSelector(
    ({ question }) => question.isRepeatedConfigError
  );

  return (
    <Stack gap={2} py={1}>
      {isRepeatedConfigError && (
        <Typography variant="caption" fontWeight="medium" color={"red"}>
          {isRepeatedConfigError}
        </Typography>
      )}

      {columns?.map((column, i) => (
        <Box key={i}>
          <Typography sx={LabelStyle}>Column Number {i + 1}</Typography>
          <Stack direction="row" alignItems={"center"} mb={3} gap={"2%"}>
            <TextField
              sx={{ width: "40%" }}
              placeholder=" Label"
              value={column.label}
              onChange={(e) =>
                dispatch(
                  handleRepeatedConfigModification({
                    currentIndex: i,
                    section: "label",
                    value: e.target.value,
                  })
                )
              }
              name="option-label"
              InputProps={{
                readOnly: isPreview,
              }}
            />
            <Select
              readOnly={isPreview}
              sx={{ width: "40%" }}
              id="type"
              value={column.type || ""}
              onChange={(e) =>
                dispatch(
                  handleRepeatedConfigModification({
                    currentIndex: i,
                    section: "type",
                    value: e.target.value,
                  })
                )
              }
            >
              <MenuItem value={"text"}>Text</MenuItem>
              <MenuItem value={"number"}>Number</MenuItem>
              <MenuItem value={"dropdown"}>Dropdown</MenuItem>
              <MenuItem value={"date"}>Date</MenuItem>
            </Select>

            {!isPreview && (
              <IconButton
                aria-label="add"
                size="medium"
                sx={{ ml: 1 }}
                onClick={() =>
                  dispatch(
                    handleAddRemoveRepeatedConfigs({
                      actionType: "add",
                      actionIndex: i,
                    })
                  )
                }
              >
                <Add fontSize="medium" sx={{ color: "primary.main" }} />
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
                    handleAddRemoveRepeatedConfigs({
                      actionType: "remove",
                      actionIndex: i,
                    })
                  )
                }
              >
                <Delete fontSize="medium" sx={{ color: "error.main" }} />
              </IconButton>
            )}
          </Stack>
          {column.type === "dropdown" &&
            column.options.map((option: any, optionIndex: any) => (
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
                      handleRepeatedConfigModification({
                        currentIndex: i,
                        optIndex: optionIndex,
                        section: "options",
                        value: e.target.value,
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
                        handleAddRemoveRepeatedOptions({
                          actionType: "add",
                          columnIndex: i,
                          actionIndex: optionIndex,
                        })
                      )
                    }
                  >
                    <Add fontSize="medium" sx={{ color: "primary.main" }} />
                  </IconButton>
                )}
                {!isPreview && optionIndex !== 0 && optionIndex !== 1 && (
                  <IconButton
                    aria-label="delete"
                    size="medium"
                    sx={{ ml: 1 }}
                    color="error"
                    onClick={() =>
                      dispatch(
                        handleAddRemoveRepeatedOptions({
                          actionType: "remove",
                          columnIndex: i,
                          actionIndex: optionIndex,
                        })
                      )
                    }
                  >
                    <Delete fontSize="medium" sx={{ color: "error.main" }} />
                  </IconButton>
                )}
              </Stack>
            ))}
          {column.type === "date" && (
            <Select
              readOnly={isPreview}
              sx={{ width: "82%" }}
              id="format"
              value={column.format}
              onChange={(e) =>
                dispatch(
                  handleRepeatedConfigModification({
                    currentIndex: i,
                    section: "format",
                    value: e.target.value,
                  })
                )
              }
            >
              <MenuItem value={"DD/MM/YYYY"}>DD/MM/YYYY</MenuItem>
              <MenuItem value={"MM/DD/YYYY"}>MM/DD/YYYY</MenuItem>
              <MenuItem value={"DD/MM/YYYY HH:mm"}>DD/MM/YYYY HH:mm</MenuItem>
              <MenuItem value={"MM/DD/YYYY HH:mm"}>MM/DD/YYYY HH:mm</MenuItem>
              <MenuItem value={"HH:mm"}>HH:mm</MenuItem>
              <MenuItem value={"HH:mm:ss"}>HH:mm:ss</MenuItem>
              <MenuItem value={"YYYY"}>YYYY</MenuItem>
              <MenuItem value={"MM/YYYY"}>MM/YYYY</MenuItem>
            </Select>
          )}
        </Box>
      ))}
    </Stack>
  );
};
export default RepeatedConfigTab;
