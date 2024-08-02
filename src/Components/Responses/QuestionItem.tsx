import { memo, useState } from "react";
import {
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { InfoOutlined, MoreVert } from "@mui/icons-material";
import Text from "./TypeBased/Text";
import NumberField from "./TypeBased/Number";
import CheckboxField from "./TypeBased/Checkbox";
import CalculatedField from "./TypeBased/CalculatedField";
import RadioField from "./TypeBased/Radio";
import DropdownField from "./TypeBased/Dropdown";
import DateField from "./TypeBased/Date";
import SliderField from "./TypeBased/Slider";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { updateResponse } from "../../Redux/actions/responseAction";
import {
  QuestionSlice,
  setQueryModal,
} from "../../Redux/reducers/responseSlice";
import GridField from "./TypeBased/GridField";
import RepeatedField from "./TypeBased/RepeatedField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import UploadFile from "./TypeBased/UploadFile";
import RemarkModal from "./RemarkModal";
import { RemarksIcon } from "../Common/assets/Icons";
import Randomize from "./TypeBased/RandomizeField";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";
import ImagePreview from "../Common/UI/ImagePreview";
import ExcludeField from "./TypeBased/ExcludeField";
import RepeatedMeasureField from "./TypeBased/RepeatedMeasureField";
import HistoryModal from "./HistoryModal";

type Props = {
  question: QuestionSlice;
  index: number;
  // scrollToRef: RefObject<HTMLDivElement> | null;
};

export const requiredStyles: SxProps = {
  // whiteSpace: "pre-line",
  display: "flex",
  "&::after": {
    content: '"*"',
    color: "red",
    marginLeft: "3px",
  },
};

const responseItemStyle: SxProps = {
  width: "100%",
  p: 2,
  border: 1,
  borderColor: "#E7E7E7",
  borderRadius: 1,
  backgroundColor: "#FFFFFF",

  "&:not(:last-child)": {
    marginBottom: 2.5,
  },
};

export const responseIndexStyle: SxProps = {
  height: "44px",
  width: "44px",
  bgcolor: "primary.main",
  color: "#FFF",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  borderRadius: 0.5,
};

const componentMap: Record<string, any> = {
  text: Text,
  number: NumberField,
  radio: RadioField,
  checkbox: CheckboxField,
  calculated_field: CalculatedField,
  dropdown: DropdownField,
  date: DateField,
  slider: SliderField,
  grid: GridField,
  repeated_data: RepeatedField,
  upload_file: UploadFile,
  statement: null,
  summary: null,
  randomize: Randomize,
  eligibility: ExcludeField,
  repeated_measure: RepeatedMeasureField,
};

const QuestionItem = ({ question, index }: Props) => {
  const { id: studyId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const {
    formEditable: editable,
    canAmendQueries,
    queries,
    fieldSubmitting: isResponseSubmitting,
    isLoading: isResponseLoading,
    surveyAssignmentId,
  } = useAppSelector((state) => state.response);

  const Component = componentMap[question.type];
  const query = queries[question.id];

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showHelperText, setShowHelperText] = useState(false);
  const [showImagePreview, setImagePreview] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isResponseSubmitting || isResponseLoading) return;

    setAnchorEl(event.currentTarget);
  };

  const toggleImagePreview = () => {
    setImagePreview((prev) => !prev);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearValue = () => {
    if (question?.id) {
      dispatch(
        updateResponse({
          studyId,
          questionId: question.id,
          isClearResponseSelected: true,
          surveySlug,
        })
      );
      setAnchorEl(null);
    }
  };

  const showNewQuery = () => {
    dispatch(
      setQueryModal({
        queryModal: {
          type: "new-query",
          title:
            question.labelCopy.length > 50
              ? question.labelCopy.slice(0, 50) + "..."
              : question.labelCopy,
          qid: question.id,
        },
      })
    );
    setAnchorEl(null);
  };

  const showQueryComments = () => {
    dispatch(
      setQueryModal({
        queryModal: {
          type: "query-comments",
          title:
            question.labelCopy.length > 50
              ? question.labelCopy.slice(0, 50) + "..."
              : question.labelCopy,
          qid: question.id,
          query: query,
        },
      })
    );
    setAnchorEl(null);
  };

  const showQuery = () => {
    dispatch(
      setQueryModal({
        queryModal: {
          type: "show-query",
          title:
            question.labelCopy.length > 50
              ? question.labelCopy.slice(0, 50) + "..."
              : question.labelCopy,
          qid: question.id,
          query: query,
        },
      })
    );
    setAnchorEl(null);
  };

  const handleBadgeColor = () => {
    if (
      question?.responses?.length > 0 &&
      !question.responses[0]?.notSaved &&
      !question.responses[0]?.isCleared
    ) {
      return "#31C48D";
    } else {
      return "#FACA15";
    }
  };

  const handleShowHelperText = () => {
    setShowHelperText((prev) => !prev);
  };

  const handleAddRemark = () => {
    setShowRemarkModal(true);
    setAnchorEl(null);
  };

  const handleCloseRemark = () => {
    setShowRemarkModal(false);
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
    setAnchorEl(null);
  };

  const handleCloseHistory = () => {
    setShowHistoryModal(false);
  };

  return (
    <Stack
      sx={responseItemStyle}
      gap={2}
      // ref={scrollToRef}
    >
      <Stack
        direction="row"
        alignItems={"flex-start"}
        justifyContent={"space-between"}
      >
        <Stack direction="row" alignItems={"flex-start"} gap={2}>
          {[
            "statement",
            "randomize",
            "summary",
            "eligibility",
            "repeated_measure",
          ].includes(question?.type) ? (
            ["statement", "summary"].includes(question?.type) ? (
              <></>
            ) : (
              <Stack sx={responseIndexStyle}>{index + 1}</Stack>
            )
          ) : isResponseSubmitting === question.id ? (
            <Stack sx={responseIndexStyle}>
              <CircularProgress color="inherit" size={18} />
            </Stack>
          ) : (
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: handleBadgeColor(),
                  fontSize: "40px",
                },
              }}
              variant="dot"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Stack sx={responseIndexStyle}>{index + 1}</Stack>
            </Badge>
          )}
          <Box
            mt={["summary", "statement"].includes(question?.type) ? 0 : 1}
            sx={question.properties?.required ? requiredStyles : {}}
          >
            <MDEditor.Markdown
              wrapperElement={{
                "data-color-mode": "light",
              }}
              source={question.label}
              rehypePlugins={[rehypeSanitize]}
              style={{ fontWeight: "400" }}
            />
          </Box>
          {/* <Typography
            fontWeight={600}
            sx={
              question.properties?.required
                ? requiredStyles
                : { whiteSpace: "pre-line" }
            }
          >
            {question.label}
          </Typography> */}
        </Stack>

        <Stack direction="row" alignItems={"center"} gap={1}>
          {question?.helperText && (
            <Tooltip
              title={showHelperText ? "Hide Helper Text" : "Show Helper Text"}
            >
              <IconButton onClick={handleShowHelperText}>
                <InfoOutlined color="primary" />
              </IconButton>
            </Tooltip>
          )}

          {query?.open > 0 && (
            <Badge color="error" badgeContent={query.open}>
              <HelpOutlineIcon />
            </Badge>
          )}

          {question?.properties?.remarkText && (
            <Tooltip title={"Show Remark"}>
              <IconButton onClick={handleAddRemark}>
                <RemarksIcon />
              </IconButton>
            </Tooltip>
          )}

          {![
            "statement",
            "summary",
            "randomize",
            "eligibility",
            "repeated_measure",
          ].includes(question.type) && (
            <IconButton onClick={handleClick}>
              <MoreVert color="primary" />
            </IconButton>
          )}

          <Menu
            id="Question-Item-Menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {!surveySlug && !surveyAssignmentId && (
              <MenuItem onClick={handleOpenHistory}>View History</MenuItem>
            )}
            {editable && question?.type !== "calculated_field" && (
              <MenuItem onClick={handleClearValue}>Clear</MenuItem>
            )}
            {canAmendQueries && !surveySlug && !surveyAssignmentId && (
              <MenuItem onClick={showNewQuery}>Add Query</MenuItem>
            )}
            {question?.properties?.remarkText && (
              <MenuItem onClick={handleAddRemark}>
                {editable ? "Add" : "View"} Remark
              </MenuItem>
            )}
            {!surveySlug && query?.queries?.length > 0 && (
              <MenuItem onClick={showQueryComments}>View Comments</MenuItem>
            )}
            {!surveySlug && query?.queries?.length > 0 && (
              <MenuItem onClick={showQuery}>View Query</MenuItem>
            )}
          </Menu>
        </Stack>
      </Stack>

      {(showHelperText || Component || question?.signedImageUrl) && (
        <Stack gap={1}>
          {question?.signedImageUrl && (
            <Box
              sx={{
                maxHeight: 97,
                maxWidth: 192,
                borderRadius: "8px",
                pl: "60px",
                cursor: "pointer",
              }}
              onClick={toggleImagePreview}
            >
              <img
                src={question.signedImageUrl}
                alt="preview"
                style={{
                  maxHeight: "97px",
                  maxWidth: "192px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
          {Component && <Component currentQuestion={question} />}

          {showHelperText && (
            <Stack sx={{ width: "100%", pl: "60px" }} gap={2}>
              <Typography>{question?.helperText}</Typography>
            </Stack>
          )}
        </Stack>
      )}

      {showRemarkModal && (
        <RemarkModal
          showModal={showRemarkModal}
          closeModal={handleCloseRemark}
          question={question}
        />
      )}
      {showHistoryModal && (
        <HistoryModal
          showModal={showHistoryModal}
          closeModal={handleCloseHistory}
          question={question}
        />
      )}

      {showImagePreview && (
        <ImagePreview
          closeHandler={toggleImagePreview}
          image={question.signedImageUrl || ""}
        />
      )}
    </Stack>
  );
};

export default memo(QuestionItem);
