import { memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { IconMap } from "../questionTypes";
import { deleteQuestion } from "../../../Redux/actions/questionAction";
import {
  setQuestionModalDetails,
  setQuestionSubmitting,
} from "../../../Redux/reducers/questionSlice";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Edit,
  ContentCopy,
  Delete,
} from "@mui/icons-material";
import { copyQuestionMiddleware } from "../QuestionProperties/utils";
import DeleteConfirmModal from "./DeleteConfirm";
import { errorToastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";
import { PreviewcomponentMap } from "../QuestionPreview/PreviewMap";
import {
  QuestionItemStyle,
  QuestionDescriptorStyle,
  requiredStyles,
} from "../question.style";

type Props = {
  question: any;
  index: number;
};

const QuestionItemWrapper: React.FC<Props> = ({ question, index }) => {
  const dispatch = useAppDispatch();

  const {
    qid: formId,
    studyId,
    editable,
    formSubmitting,
  } = useAppSelector((state) => state.question);

  const Icon = IconMap[question.type];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleCopyQuestion = () => {
    const modifiedQuestion = copyQuestionMiddleware(question);
    dispatch(
      setQuestionModalDetails({
        question: modifiedQuestion,
        show: true,
        modalIsEdit: false,
      })
    );
  };

  const handleEditQuestion = () => {
    dispatch(
      setQuestionModalDetails({
        question,
        show: true,
        modalIsEdit: true,
      })
    );
  };

  const handleDeleteQuestion = () => {
    dispatch(deleteQuestion(question.id));
  };

  const handleDeleteQuestionPopup = async () => {
    if (!formSubmitting) {
      dispatch(setQuestionSubmitting(true));

      try {
        const { data } = await http.get(
          `/study/${studyId}/forms/${formId}/question/${question.id}/dependencies`
        );
        const resData = data?.data;
        setData(resData);
        dispatch(setQuestionSubmitting(false));
        setShowDeleteModal(true);
      } catch (error) {
        dispatch(setQuestionSubmitting(false));
        errorToastMessage(error as Error);
      }
    }
  };

  const Component = PreviewcomponentMap[question.type];

  return (
    <Stack sx={QuestionItemStyle} justifyContent={"center"} gap={2}>
      <Stack
        direction="row"
        alignItems={"flex-start"}
        justifyContent={"space-between"}
      >
        <Stack direction="row" alignItems={"flex-start"}>
          <Stack
            sx={QuestionDescriptorStyle}
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
            flexShrink={0}
          >
            <Typography fontWeight={500} fontSize={16}>
              {index + 1}
            </Typography>
            {Icon && <Icon />}
          </Stack>

          <Box sx={{ flex: 1, minWidth: "0px" }}>
            {/* <Typography
              fontSize={16}
              fontWeight={500}
              sx={question?.properties?.required ? requiredStyles : {}}
            >
              {question.label}
            </Typography> */}
            <Box sx={question?.properties?.required ? requiredStyles : {}}>
              <MDEditor.Markdown
                wrapperElement={{
                  "data-color-mode": "light",
                }}
                source={question.labelMarkdown}
                rehypePlugins={[rehypeSanitize]}
                style={{ fontWeight: "400" }}
              />
            </Box>

            <Typography
              fontSize={12}
              fontWeight={500}
              sx={{ color: "text.secondary" }}
              mt={1}
            >
              ({question.varname})
              {question?.dependency && (
                <DependencyTextPreview dep={question?.dependency} />
              )}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems={"center"}>
          {![
            "statement",
            "randomize",
            "summary",
            "eligibility",
            "repeated_measure",
          ].includes(question.type) && (
            <Tooltip title={showChoices ? "Hide Preview" : "Show Preview"}>
              <IconButton onClick={() => setShowChoices((prev) => !prev)}>
                {showChoices ? (
                  <KeyboardArrowUp sx={{ color: "text.secondary" }} />
                ) : (
                  <KeyboardArrowDown sx={{ color: "text.secondary" }} />
                )}
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={editable ? "Edit" : "View Details"}>
            <IconButton onClick={handleEditQuestion}>
              <Edit fontSize="small" sx={{ color: "text.secondary" }} />
            </IconButton>
          </Tooltip>

          {editable && (
            <Tooltip title={"Duplicate"}>
              <IconButton onClick={handleCopyQuestion}>
                <ContentCopy
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </IconButton>
            </Tooltip>
          )}

          {editable && (
            <Tooltip title={"Delete"}>
              <IconButton
                onClick={handleDeleteQuestionPopup}
                disabled={formSubmitting}
                color="error"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {editable && showDeleteModal && (
          <DeleteConfirmModal
            title={question.varname}
            onOk={handleDeleteQuestion}
            show={showDeleteModal}
            data={data}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </Stack>

      {Component && showChoices && (
        <Stack gap={2} sx={{ width: "85%", pl: "92px" }}>
          {question?.signedImageUrl && (
            <Box sx={{ maxHeight: 97, maxWidth: 192, borderRadius: "8px" }}>
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
          <Component currentQuestion={question} />
        </Stack>
      )}
    </Stack>
  );
};

export default memo(QuestionItemWrapper);

const symbolMap: Record<string, string> = {
  eq: "is equal to",
  not_eq: "is not",
  gt: "greater than",
  lt: "less than",
  gte: "greater than or equal to",
  lte: "less than or equal to",
  is_checked: "is checked",
  is_not_checked: "is not checked",
};

const keyMap: Record<string, string> = {
  text: "textValue",
  date: "textValue",
  number: "numberValue",
  slider: "numberValue",
  calculated_field: "numberValue",
  radio: "questionChoice",
  dropdown: "questionChoice",
  checkbox: "questionChoice",
  randomize: "textValue",
};

const DependencyTextPreview = ({ dep }: { dep: any }) => {
  const dependent = dep?.parentQuestion?.varname;
  const operator = symbolMap[dep?.operator];
  const type = dep?.parentQuestion?.type;
  const label = ["radio", "dropdown", "checkbox"].includes(type)
    ? dep?.[keyMap[type]]?.label
    : dep?.[keyMap[type]];

  return (
    <>
      {type === "checkbox" ? (
        <Typography
          fontSize={12}
          fontWeight={500}
          sx={{ color: "text.secondary" }}
          component={"span"}
        >
          &nbsp;&nbsp;|&nbsp;&nbsp; ({label} in {dependent}
          &nbsp;
          <strong>{operator}</strong>)
        </Typography>
      ) : (
        <Typography
          fontSize={12}
          fontWeight={500}
          sx={{ color: "text.secondary" }}
          component={"span"}
        >
          &nbsp;&nbsp;|&nbsp;&nbsp; ({dependent} <strong>{operator}</strong>{" "}
          {label})
        </Typography>
      )}
    </>
  );
};
