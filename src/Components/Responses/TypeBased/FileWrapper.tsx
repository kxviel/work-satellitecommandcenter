import {
  CircularProgress,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  QuestionSlice,
  handleRemoveFile,
} from "../../../Redux/reducers/responseSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import { errorToastMessage } from "../../../utils/toast";
import { updateResponse } from "../../../Redux/actions/responseAction";

const root: SxProps = {
  width: "fit-content",
  p: 1.5,

  border: "1px solid",
  borderColor: "divider",
  borderRadius: 3,

  height: "68px",
};

const name: SxProps = {
  maxWidth: "140px",
  fontSize: "12px",
  fontWeight: 600,
};

type Props = {
  res: { url: string; name: string };
  currentQuestion: QuestionSlice;
  index: number;
};

const FileWrapper = ({ res, currentQuestion, index }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const { id: studyId, participantId, surveySlug } = useParams();
  const dispatch = useAppDispatch();
  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const { surveyAssignmentId } = useAppSelector((state) => state.response);

  const { id, responses } = currentQuestion;

  const [isDownloading, setIsDownloading] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);

  useEffect(() => {
    const element = ref.current!;
    setIsOverflown(element.scrollWidth > element.clientWidth);
  }, []);

  const handleFileDownload = useCallback(async () => {
    setIsDownloading(true);

    const responseId = responses?.[0]?.id;
    const params: any = {
      participantId,
    };

    if (surveyAssignmentId) {
      params.surveyAssignmentId = surveyAssignmentId;
    }

    try {
      const { data } = await http.get<any>(
        surveySlug
          ? `/survey/${surveySlug}/get_read_signed_url/${responseId}`
          : surveyAssignmentId
          ? `/study/${studyId}/survey-responses/get_read_signed_url/${responseId}`
          : `/study/${studyId}/responses/get_read_signed_url/${responseId}`,
        { params }
      );
      window.open(data.data?.files?.[index].url, "_blank");
    } catch (err) {
      errorToastMessage(err as Error);
    }

    setIsDownloading(false);
  }, [
    index,
    participantId,
    responses,
    studyId,
    surveySlug,
    surveyAssignmentId,
  ]);

  const handleRemove = () => {
    if (!isPreview) {
      dispatch(
        handleRemoveFile({
          id,
          index,
        })
      );
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
    <Stack direction={"row"} alignItems={"center"} gap={1} sx={root}>
      <Stack marginLeft={1} sx={{ maxWidth: "192px" }}>
        <Tooltip title={res.name} disableHoverListener={!isOverflown}>
          <Typography sx={name} noWrap ref={ref}>
            {res.name}
          </Typography>
        </Tooltip>
      </Stack>

      <IconButton size="small" sx={{ ml: "auto" }} onClick={handleRemove}>
        <RemoveIcon fontSize="inherit" />
      </IconButton>
      <IconButton size="small" onClick={handleFileDownload}>
        {isDownloading ? (
          <CircularProgress size={16} />
        ) : (
          <FileDownloadIcon fontSize="inherit" />
        )}
      </IconButton>
    </Stack>
  );
};
export default FileWrapper;
