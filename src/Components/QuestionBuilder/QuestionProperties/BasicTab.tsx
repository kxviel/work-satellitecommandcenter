import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  SxProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  handleBasicsChange,
  handleBasicsSwitchChange,
  handleDateFormatChange,
  handleTextFormatChange,
} from "../../../Redux/reducers/questionSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { builderGetUploadUrl } from "../../../utils/upload";
import { useParams } from "react-router-dom";
import Add from "@mui/icons-material/Add";
import { Visibility } from "@mui/icons-material";
import MDEditor, { commands } from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";
import MarkdownPreview from "./MarkdownPreview";
import RepeatedMeasure from "./RepeatedMeasure";

type Props = {
  isEdit: boolean;
  question: any;
};

export const requiredStyles: SxProps = {
  "&::after": {
    content: '"*"',
    color: "red",
    marginLeft: "3px",
  },
};

const uploadWrapper: SxProps = {
  width: 200,
  height: 140,
  borderRadius: "8px",
  border: 2,
  borderColor: "primary.main",
  borderStyle: "dashed",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 2,
  px: 4,
  "&:hover": {
    bgcolor: "secondary.dark",
    cursor: "pointer",
  },
};

const previewWrapper: SxProps = {
  width: 200,
  height: 140,
  borderRadius: "8px",
  border: 2,
  borderColor: "primary.main",
  borderStyle: "dashed",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 2,
  px: 4,
  "&:hover": {
    bgcolor: "secondary.dark",
    cursor: "pointer",
  },
};

export const BasicTab = ({ isEdit, question }: Props) => {
  const { id: studyId } = useParams();
  const dispatch = useAppDispatch();
  const { menuLabels } = useAppSelector((state) => state.study);

  const questionList = useAppSelector(({ question }) => question.questions);
  const isBasicError = useAppSelector(({ question }) => question.isBasicError);
  const isPreview = useAppSelector(({ question }) => !question.editable);

  const [previewUrl, setPreviewUrl] = useState(question.signedImageUrl || "");
  const [loading, setLoading] = useState(false);
  const [allowRemark, setAllowRemark] = useState(
    !!question?.properties?.remarkText
  );

  const [displayMarkdown, setMarkdown] = useState(false);

  const onChange = (
    key: string,
    value: string | boolean,
    isProp?: boolean,
    convertToNum?: boolean
  ) => {
    if (!isPreview)
      dispatch(
        handleBasicsChange({
          key,
          value,
          isProp,
          convertToNum,
        })
      );
  };

  const showMarkdown = () => {
    setMarkdown(true);
  };

  const closeMarkdown = () => {
    setMarkdown(false);
  };

  const onSwitch = (key: string, event: any) => {
    dispatch(handleBasicsSwitchChange({ key, value: event.target.checked }));
  };

  const handleAllowRemark = (e: ChangeEvent<HTMLInputElement>) => {
    setAllowRemark(e.target.checked);
    onChange("remarkText", e.target.checked ? "Enter Remark" : "", true);
  };

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

          const obj = await builderGetUploadUrl(file, studyId, question.id);
          setPreviewUrl(obj?.previewUrl ?? "");
          if (obj.postUploadImageUrl) {
            dispatch(
              handleBasicsChange({
                key: "imageUrl",
                value: obj.postUploadImageUrl,
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
    [dispatch, question.id, studyId]
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
    <Stack gap={2} py={1}>
      {isBasicError && (
        <Typography variant="caption" fontWeight="medium" color={"red"}>
          {isBasicError}
        </Typography>
      )}

      <Stack gap={1}>
        {loading ? (
          <Box sx={{ color: "text.secondary" }}>
            <CircularProgress />
          </Box>
        ) : previewUrl ? (
          <Tooltip title={"Upload Image"} placement="right">
            <Box
              {...getRootProps({ className: "dropzone" })}
              sx={previewWrapper}
            >
              <input {...getInputProps()} />
              <Avatar
                src={previewUrl}
                variant="rounded"
                sx={{ width: 200, height: 140 }}
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
              <Typography
                sx={{ color: "text.secondary" }}
                fontSize={14}
                fontWeight={600}
                textAlign={"center"}
              >
                Add Image <br />
                <Typography
                  sx={{ color: "text.secondary" }}
                  component={"span"}
                  fontSize={14}
                  fontWeight={400}
                >
                  or drag and drop
                </Typography>
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>

      <Stack gap={1}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            sx={requiredStyles}
          >
            Label
          </Typography>
          <IconButton onClick={showMarkdown} size="small">
            <Visibility fontSize="small" />
          </IconButton>
        </Stack>

        <div className="container">
          <MDEditor
            data-color-mode="light"
            value={question.label}
            onChange={(value) => {
              onChange("label", value || "");
            }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            textareaProps={{
              placeholder: "Enter text here",
              readOnly: isPreview,
            }}
            extraCommands={[]}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.quote,
              commands.unorderedListCommand,
              commands.orderedListCommand,
            ]}
            visibleDragbar={false}
            preview="edit"
          />
        </div>
      </Stack>

      {!isEdit && (
        <Stack gap={1}>
          <Typography variant="subtitle1" fontWeight="medium">
            Position
          </Typography>
          <FormControl fullWidth>
            <Select
              fullWidth
              id="position"
              value={question.position || ""}
              onChange={(e) => onChange("position", e.target.value)}
            >
              <MenuItem value={1}>Place at the Top</MenuItem>
              {questionList.map((ques) => (
                <MenuItem key={ques.id} value={ques.position + 1}>
                  Place after Question {ques.position}. ({ques.varname}):{" "}
                  {ques.label.length > 50
                    ? ques.label.slice(0, 50) + "..."
                    : ques.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      <Stack gap={1}>
        <Typography variant="subtitle1" fontWeight="medium" sx={requiredStyles}>
          Variable Name
        </Typography>
        <TextField
          name="varname"
          fullWidth
          placeholder="Variable Name"
          value={question.varname}
          onChange={(e) => onChange("varname", e.target.value)}
          InputProps={{
            readOnly: isPreview,
          }}
        />
      </Stack>

      {![
        "statement",
        "summary",
        "randomize",
        "eligibility",
        "repeated_measure",
      ].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch
                checked={question.properties.required}
                onChange={(e) => onSwitch("required", e)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Required
              </Typography>
            }
          />
        </Stack>
      )}

      {["repeated_measure"].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch
                checked={question.properties.showAll}
                onChange={(e) => onChange("showAll", e.target.checked, true)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Show Repeated Measures from all {menuLabels?.visit || "Visits"}
              </Typography>
            }
          />
        </Stack>
      )}

      {["repeated_measure"].includes(question.type) && (
        <RepeatedMeasure question={question} />
      )}

      {["calculated_field"].includes(question.type) && (
        <Stack gap={1}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            sx={requiredStyles}
          >
            Calculation Template
          </Typography>
          <TextField
            name="calculationTemplate"
            fullWidth
            multiline
            rows={2}
            placeholder="Calculation Template"
            value={question.calculationTemplate || ""}
            onChange={(e) => onChange("calculationTemplate", e.target.value)}
            InputProps={{
              readOnly: isPreview,
            }}
          />
        </Stack>
      )}

      {["date"].includes(question.type) && (
        <Stack gap={1}>
          <Typography variant="subtitle1" fontWeight="medium">
            Format
          </Typography>
          <FormControl fullWidth>
            <Select
              readOnly={isPreview}
              fullWidth
              id="format"
              value={question.properties.format}
              onChange={(e) =>
                dispatch(handleDateFormatChange({ format: e.target.value }))
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
          </FormControl>
        </Stack>
      )}

      {["text"].includes(question.type) && (
        <Stack gap={1}>
          <Typography variant="subtitle1" fontWeight="medium">
            Format
          </Typography>
          <FormControl fullWidth>
            <Select
              readOnly={isPreview}
              fullWidth
              id="format"
              displayEmpty
              value={question.properties.format || ""}
              onChange={(e) =>
                dispatch(handleTextFormatChange({ format: e.target.value }))
              }
            >
              <MenuItem value={""}>No Format</MenuItem>
              <MenuItem value={"email"}>Email</MenuItem>
              <MenuItem value={"alphabets"}>Alphabets Only</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {["calculated_field"].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch
                checked={question.properties.isHidden}
                onChange={(e) => onSwitch("isHidden", e)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Is Hidden
              </Typography>
            }
          />
        </Stack>
      )}

      {["text"].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch
                checked={question.properties.allowMultiline}
                onChange={(e) => onSwitch("allowMultiline", e)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Allow Multiline
              </Typography>
            }
          />
        </Stack>
      )}

      {["number"].includes(question.type) && (
        <>
          <Stack gap={1}>
            <FormControlLabel
              disabled={isPreview}
              control={
                <Switch
                  checked={question.properties.allowDecimal}
                  onChange={(e) => onSwitch("allowDecimal", e)}
                />
              }
              label={
                <Typography variant="subtitle1" fontWeight="medium">
                  Allow Decimal
                </Typography>
              }
            />
          </Stack>

          <Stack gap={1}>
            <Typography variant="subtitle1" fontWeight="medium">
              Measurement Unit
            </Typography>
            <TextField
              name="measurementUnit"
              fullWidth
              placeholder="Measurement Unit"
              value={question.properties.measurementUnit}
              onChange={(e) =>
                onChange("measurementUnit", e.target.value, true)
              }
              InputProps={{
                readOnly: isPreview,
              }}
            />
          </Stack>

          <Stack gap={1}>
            <Typography variant="subtitle1" fontWeight="medium">
              Field Width
            </Typography>
            <TextField
              type="number"
              name="fieldWidth"
              fullWidth
              placeholder="Field Width"
              value={
                typeof question.properties.fieldWidth === "number"
                  ? question.properties.fieldWidth
                  : ""
              }
              onChange={(e) =>
                onChange("fieldWidth", e.target.value, true, true)
              }
              InputProps={{
                readOnly: isPreview,
              }}
              helperText="Range 5-20"
            />
          </Stack>

          <Stack
            gap={1}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack gap={1} flex={1}>
              <Typography variant="subtitle1" fontWeight="medium">
                Min
              </Typography>
              <TextField
                type="number"
                name="min"
                fullWidth
                placeholder="Min"
                value={
                  typeof question.properties.min === "number"
                    ? question.properties.min
                    : ""
                }
                onChange={(e) => onChange("min", e.target.value, true, true)}
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Stack>

            <Stack gap={1} flex={1}>
              <Typography variant="subtitle1" fontWeight="medium">
                Max
              </Typography>
              <TextField
                type="number"
                name="max"
                fullWidth
                placeholder="Max"
                value={
                  typeof question.properties.max === "number"
                    ? question.properties.max
                    : ""
                }
                onChange={(e) => onChange("max", e.target.value, true, true)}
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Stack>
          </Stack>
        </>
      )}

      {["upload_file"].includes(question.type) && (
        <Stack gap={1}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            sx={requiredStyles}
          >
            Maximum Number of Files
          </Typography>
          <TextField
            type="number"
            name="max"
            fullWidth
            placeholder="Max"
            value={question.properties.max}
            onChange={(e) => onChange("max", e.target.value, true, true)}
            InputProps={{
              readOnly: isPreview,
              inputProps: { min: 1 },
            }}
          />
        </Stack>
      )}

      {["slider"].includes(question.type) && (
        <>
          <Stack
            gap={1}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack gap={1} flex={1}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={requiredStyles}
              >
                Min Label
              </Typography>
              <TextField
                name="minLabel"
                fullWidth
                placeholder="Min Label"
                value={question.properties.minLabel}
                onChange={(e) => onChange("minLabel", e.target.value, true)}
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Stack>

            <Stack gap={1} flex={1}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={requiredStyles}
              >
                Max Label
              </Typography>
              <TextField
                name="maxLabel"
                fullWidth
                placeholder="Max Label"
                value={question.properties.maxLabel}
                onChange={(e) => onChange("maxLabel", e.target.value, true)}
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Stack>
          </Stack>

          <Stack
            gap={1}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack gap={1} flex={1}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={requiredStyles}
              >
                Min
              </Typography>
              <TextField
                type="number"
                name="min"
                fullWidth
                placeholder="Min"
                value={
                  typeof question.properties.min === "number"
                    ? question.properties.min
                    : ""
                }
                onChange={(e) => onChange("min", e.target.value, true, true)}
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Stack>

            <Stack gap={1} flex={1}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={requiredStyles}
              >
                Max
              </Typography>
              <TextField
                type="number"
                name="max"
                fullWidth
                placeholder="Max"
                value={
                  typeof question.properties.max === "number"
                    ? question.properties.max
                    : ""
                }
                onChange={(e) => onChange("max", e.target.value, true, true)}
                InputProps={{
                  readOnly: isPreview,
                }}
              />
            </Stack>
          </Stack>

          <Stack gap={1}>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={requiredStyles}
            >
              Step
            </Typography>
            <TextField
              type="number"
              name="step"
              fullWidth
              placeholder="Step"
              value={question.properties.step}
              onChange={(e) => onChange("step", e.target.value, true, true)}
              InputProps={{
                readOnly: isPreview,
              }}
              inputProps={{
                min: 1,
              }}
              helperText={
                question.properties.step <= 0 ? "Must be greater than 0" : null
              }
            />
          </Stack>
        </>
      )}

      {["radio", "checkbox"].includes(question.type) && (
        <Stack gap={1}>
          <Typography variant="subtitle1" fontWeight="medium">
            Orientation
          </Typography>
          <FormControl fullWidth>
            <Select
              readOnly={isPreview}
              fullWidth
              id="orientation"
              value={question.properties.orientation}
              onChange={(e) => onChange("orientation", e.target.value, true)}
            >
              <MenuItem value={"vertical"}>Vertical</MenuItem>
              <MenuItem value={"horizontal"}>Horizontal</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {![
        "statement",
        "summary",
        "randomize",
        "eligibility",
        "repeated_measure",
      ].includes(question.type) && (
        <Stack gap={1}>
          <Typography variant="subtitle1" fontWeight="medium">
            Helper Text
          </Typography>
          <TextField
            name="helperText"
            fullWidth
            multiline
            rows={2}
            placeholder="Helper Text"
            value={question.helperText || ""}
            onChange={(e) => onChange("helperText", e.target.value)}
            InputProps={{
              readOnly: isPreview,
            }}
          />
        </Stack>
      )}

      {![
        "statement",
        "summary",
        "randomize",
        "eligibility",
        "repeated_measure",
      ].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch checked={allowRemark} onChange={handleAllowRemark} />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Allow Remark
              </Typography>
            }
          />
          {allowRemark && (
            <TextField
              name="remarkText"
              fullWidth
              placeholder="Remark"
              value={question.properties.remarkText || ""}
              onChange={(e) => onChange("remarkText", e.target.value, true)}
              InputProps={{
                readOnly: isPreview,
              }}
            />
          )}
        </Stack>
      )}

      {displayMarkdown && (
        <MarkdownPreview
          field="label"
          isProp={false}
          close={closeMarkdown}
          isPreview={isPreview}
        />
      )}
    </Stack>
  );
};
