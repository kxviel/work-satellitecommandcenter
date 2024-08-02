import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  FilterAlt,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  Select,
  Stack,
  Switch,
  SxProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  handleAddRemoveChoices,
  handleBasicsChange,
  handleChoiceModification,
  handleChoicesRearrange,
  handleOptionGroupPrefill,
} from "../../../Redux/reducers/questionSlice";
import { useCallback, useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { builderGetUploadUrl } from "../../../utils/upload";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { prefillOptionFormatter } from "../../../utils/question";

type Props = {
  question: any;
};

type UploadProps = {
  choiceId: string;
  previewUrl: string;
};

const previewWrapper: SxProps = {
  width: "100%",
  height: 50,
  borderRadius: "8px",
  border: 2,
  borderColor: "primary.main",
  borderStyle: "dashed",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "4px",
  "&:hover": {
    bgcolor: "secondary.dark",
    cursor: "pointer",
  },
};

const uploadWrapper: SxProps = {
  width: "100%",
  height: 50,
  borderRadius: "8px",
  border: 2,
  borderColor: "primary.main",
  borderStyle: "dashed",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    bgcolor: "secondary.dark",
    cursor: "pointer",
  },
};

const UploadItem = ({ choiceId, previewUrl }: UploadProps) => {
  const { id: studyId } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isPreview = useAppSelector(({ question }) => !question.editable);
  const { modalQuestion } = useAppSelector((state) => state.question);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles?.[0];
        if (file && studyId) {
          if (file.size > 5 * 1024 * 1024) {
            toastMessage("warning", "File Size cannot be greater than 5 MB!");
            return;
          }

          setLoading(true);

          const obj = await builderGetUploadUrl(
            file,
            studyId,
            modalQuestion.id
          );

          if (obj.postUploadImageUrl) {
            dispatch(
              dispatch(
                handleChoiceModification({
                  currentRef: choiceId,
                  section: "imageUrl",
                  value: obj.postUploadImageUrl,
                })
              )
            );
          }
          if (obj.previewUrl) {
            dispatch(
              handleChoiceModification({
                currentRef: choiceId,
                section: "previewUrl",
                value: obj.previewUrl,
              })
            );
          }
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    },
    [dispatch, modalQuestion.id, studyId, choiceId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      // "application/pdf": [],
    },
    disabled: isPreview,
  });

  return (
    <Stack gap={1}>
      {loading ? (
        <Box sx={{ color: "text.secondary" }}>
          <CircularProgress />
        </Box>
      ) : previewUrl ? (
        <Tooltip title={"Upload Image"} placement="right">
          <Box {...getRootProps({ className: "dropzone" })} sx={previewWrapper}>
            <input {...getInputProps()} />
            <Avatar
              src={previewUrl}
              variant="rounded"
              sx={{ width: "100%", height: 40 }}
            />
          </Box>
        </Tooltip>
      ) : (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          {...getRootProps({ className: "dropzone" })}
          sx={{ ...uploadWrapper }}
        >
          <input {...getInputProps()} />

          <Stack alignItems={"center"} gap={1}>
            <Add fontSize="medium" sx={{ color: "text.secondary" }} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

const ChoiceTab = ({ question }: Props) => {
  const dispatch = useAppDispatch();
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const openFilter = Boolean(filterEl);
  const openFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterEl(event.currentTarget);
  };
  const closeFilterMenu = () => {
    setFilterEl(null);
  };
  const { choices }: { choices: any[] } = question || [];
  const isChoicesError = useAppSelector(
    ({ question }) => question.isChoicesError
  );
  const isPreview = useAppSelector(({ question }) => !question.editable);
  const optionsGroups = useAppSelector(({ question }) => question.optionGroups);
  const [optionVal, setOptionVal] = useState("");

  const prefillOptions = () => {
    if (!isPreview && optionVal) {
      const optionGroup = optionsGroups?.find((item) => item.id === optionVal);
      if (optionGroup) {
        const newOptions = prefillOptionFormatter(optionGroup.options);
        dispatch(handleOptionGroupPrefill({ options: newOptions }));
      }
    }
  };
  const getDisplayType = (index: number, value?: any) => {
    if (question?.properties?.bulletStyle === "alphabetical") {
      return String.fromCharCode(65 + index);
    } else if (question?.properties?.bulletStyle === "numerical") {
      return index + 1;
    } else if (question?.properties?.bulletStyle === "values") {
      return value;
    } else if (question?.properties?.bulletStyle === "bullets") {
      return "•";
    } else {
      return String.fromCharCode(65 + index);
    }
  };
  const handleFilter = (value: string) => {
    if (!isPreview) {
      dispatch(
        handleBasicsChange({
          key: "bulletStyle",
          value,
          isProp: true,
        })
      );
    }
  };

  return (
    <Stack gap={1} py={1}>
      {isChoicesError && (
        <Typography variant="caption" fontWeight="medium" color={"red"}>
          {isChoicesError}
        </Typography>
      )}

      {!isPreview && (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2 }}>
            Choice Values
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Select
              fullWidth
              sx={{ mb: 2, height: "48px" }}
              value={optionVal}
              onChange={(e) => setOptionVal(e.target.value)}
            >
              {optionsGroups?.length ? (
                optionsGroups.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem key={"none"} value={""}>
                  No Option Groups available
                </MenuItem>
              )}
            </Select>
            <Button
              variant="contained"
              onClick={prefillOptions}
              sx={{ ml: 2 }}
              disabled={!optionVal}
            >
              Prefill
            </Button>
          </Box>
        </Box>
      )}

      <Stack direction="row" alignItems={"center"} mb={3} gap={2}>
        {question.type !== "dropdown" && (
          <Box
            sx={{
              width: "80px",
              display: "flex",
              alignItems: "center",
            }}
          ></Box>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: "1px",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Label</Typography>

          {question.type !== "dropdown" && (
            <IconButton onClick={openFilterMenu}>
              <FilterAlt color={"primary"} />
            </IconButton>
          )}
        </Box>
        <Typography
          sx={{ fontWeight: 600, fontSize: 14, flex: 1, minWidth: "1px" }}
        >
          Value
        </Typography>
        {question.type !== "dropdown" && (
          <Typography sx={{ fontWeight: 600, fontSize: 14, width: "100px" }}>
            Image
          </Typography>
        )}
        {question.type !== "dropdown" && (
          <Typography sx={{ fontWeight: 600, fontSize: 14, width: "80px" }}>
            Is Other
          </Typography>
        )}
        {!isPreview && (
          <Typography sx={{ fontWeight: 600, fontSize: 14, width: "150px" }}>
            Actions
          </Typography>
        )}
      </Stack>

      {choices &&
        choices.map((choice, i) => (
          <Stack
            key={choice.ref}
            direction="row"
            alignItems={"center"}
            mb={3}
            gap={2}
          >
            {question.type !== "dropdown" && (
              <Box sx={{ width: "80px", textAlign: "center" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                  {getDisplayType(i, choice.value)}
                </Typography>
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: "1px" }}>
              <TextField
                fullWidth
                placeholder="Label"
                value={choice.label}
                onChange={(e) =>
                  dispatch(
                    handleChoiceModification({
                      currentRef: choice.ref,
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
            </Box>
            <Box sx={{ flex: 1, minWidth: "1px" }}>
              <TextField
                fullWidth
                type="number"
                placeholder="Value"
                value={choice.value}
                onChange={(e) =>
                  dispatch(
                    handleChoiceModification({
                      currentRef: choice.ref,
                      section: "value",
                      value: e.target.value,
                    })
                  )
                }
                name="option-value"
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Box>
            {question.type !== "dropdown" && (
              <Box sx={{ width: "100px" }}>
                <UploadItem
                  choiceId={choice.ref}
                  previewUrl={choice.previewUrl}
                />
              </Box>
            )}

            {question.type !== "dropdown" && (
              <Box sx={{ width: "80px" }}>
                <Switch
                  checked={choice.isOther}
                  onChange={(e) =>
                    dispatch(
                      handleChoiceModification({
                        currentRef: choice.ref,
                        section: "isOther",
                        value: e.target.checked,
                      })
                    )
                  }
                  disabled={isPreview}
                />
              </Box>
            )}

            {!isPreview && (
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                sx={{ width: "150px" }}
              >
                <IconButton
                  aria-label="add"
                  size="small"
                  onClick={() =>
                    dispatch(
                      handleAddRemoveChoices({
                        actionType: "add",
                        actionIndex: i,
                      })
                    )
                  }
                  color="primary"
                >
                  <Add fontSize="small" />
                </IconButton>

                <IconButton
                  aria-label="delete"
                  size="small"
                  color="error"
                  onClick={() =>
                    dispatch(
                      handleAddRemoveChoices({
                        actionType: "remove",
                        actionIndex: i,
                        removedRef: choice.ref,
                      })
                    )
                  }
                  disabled={choices.length === 1}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="add"
                  size="small"
                  onClick={() =>
                    dispatch(
                      handleChoicesRearrange({
                        actionType: "up",
                        actionIndex: i,
                      })
                    )
                  }
                  disabled={choices.length === 1 || i === 0}
                  color="primary"
                >
                  <ArrowUpward fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="add"
                  size="small"
                  onClick={() =>
                    dispatch(
                      handleChoicesRearrange({
                        actionType: "down",
                        actionIndex: i,
                      })
                    )
                  }
                  disabled={choices.length === 1 || i === choices.length - 1}
                  color="primary"
                >
                  <ArrowDownward fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={filterEl}
                  open={openFilter}
                  onClose={closeFilterMenu}
                  sx={{
                    "& .MuiPaper-root": {
                      width: 200,
                    },
                  }}
                >
                  {["alphabetical", "numerical", "bullets", "values"].map(
                    (item) => (
                      <MenuItem key={item} onClick={() => handleFilter(item)}>
                        <ListItemIcon>
                          <Radio
                            checked={
                              (question?.properties?.bulletStyle ||
                                "alphabetical") === item
                            }
                          />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: "capitalize" }}>
                          {item}
                        </ListItemText>
                      </MenuItem>
                    )
                  )}
                </Menu>
              </Stack>
            )}
          </Stack>
        ))}
    </Stack>
  );
};
export default ChoiceTab;
