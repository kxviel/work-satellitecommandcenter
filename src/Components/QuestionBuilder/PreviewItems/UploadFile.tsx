import { Stack, SxProps, Typography } from "@mui/material";
import { QuestionSlice } from "../../../Redux/reducers/responseSlice";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

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

const UploadFilePreview = ({ currentQuestion }: Props) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {}, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    disabled: true,
  });

  return (
    <Stack gap={1}>
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
          Drop files to upload
        </Typography>
      </Stack>
    </Stack>
  );
};
export default UploadFilePreview;
