import {
  Backdrop,
  CircularProgress,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  QuestionSlice,
  handleAddFile,
} from "../../../Redux/reducers/responseSlice";
import { useParams } from "react-router-dom";
import { updateResponse } from "../../../Redux/actions/responseAction";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import { useCallback, useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { useDropzone } from "react-dropzone";
import { responsesGetUploadUrl } from "../../../utils/upload";
import FileWrapper from "./FileWrapper";

const uploadWrapper: SxProps = {
  borderRadius: "8px",
  border: 2,
  borderColor: "primary.main",
  borderStyle: "dashed",
  bgcolor: "secondary.main",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 2,
  px: 4,
  "&:hover": {
    bgcolor: "secondary.dark",
    cursor: "pointer",
  },
  "& .preview-image": {
    height: "48px",
    objectFit: "contain",
  },
};

type Props = {
  currentQuestion: QuestionSlice;
};

const UploadFile = ({ currentQuestion }: Props) => {
  const { id: studyId, participantId, surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector((state) => !state.response.formEditable);
  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );
  const surveyAssignmentId = useAppSelector(
    (state) => state.response.surveyAssignmentId
  );

  const { responses, properties } = currentQuestion;
  const currentResponse = responses?.[0]?.files;

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (fileObj: any) => {
      if (!isFieldSubmitting && !isPreview) {
        dispatch(
          handleAddFile({
            fileObj,
            id: currentQuestion.id,
          })
        );

        if (currentQuestion?.id) {
          dispatch(
            updateResponse({
              studyId,
              questionId: currentQuestion.id,
              surveySlug,
            })
          );
        }
      }
    },
    [
      currentQuestion.id,
      dispatch,
      isFieldSubmitting,
      isPreview,
      studyId,
      surveySlug,
    ]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            toastMessage("warning", "File Size cannot be greater than 5 MB!");
            return;
          }

          setLoading(true);

          const postSignedUrl = await responsesGetUploadUrl(
            file,
            studyId,
            participantId,
            surveySlug,
            surveyAssignmentId
          );
          if (postSignedUrl) {
            handleSubmit({ url: postSignedUrl, name: file.name });
          }

          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    },
    [handleSubmit, participantId, studyId, surveySlug, surveyAssignmentId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    disabled:
      isPreview ||
      !!isFieldSubmitting ||
      currentResponse?.length === properties?.max,
  });

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
      {loading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        {...getRootProps({ className: "dropzone" })}
        sx={{ ...uploadWrapper }}
      >
        <input {...getInputProps()} />

        <ImageIcon color="primary" />
        <Typography color="primary" fontSize={14} fontWeight={600}>
          {currentResponse?.length === properties?.max
            ? "No more files allowed"
            : "Drop files to upload"}
        </Typography>
      </Stack>

      <Stack direction={"row"} alignItems={"center"} gap={1} flexWrap={"wrap"}>
        {currentResponse?.map((res: any, index: number) => (
          <FileWrapper
            key={index}
            res={res}
            currentQuestion={currentQuestion}
            index={index}
          />
        ))}
      </Stack>
    </Stack>
  );
};
export default UploadFile;
