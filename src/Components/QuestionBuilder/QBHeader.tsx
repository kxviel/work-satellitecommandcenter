import { ChevronLeft, Menu, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  SxProps,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";

import RearrangeModal from "./RearrangeModal";
import { ChangeEvent, useState } from "react";
import { toastMessage } from "../../utils/toast";
import UploadIcon from "@mui/icons-material/Upload";
import { importQuestion } from "../../Redux/actions/questionAction";
import { headerStyle } from "./question.style";

const LoaderStyle: SxProps = {
  mr: "50px",
};

const QBHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { editable, loading, formSubmitting, questionName } = useAppSelector(
    (state) => state.question
  );
  const length = useAppSelector((state) => state.question.questions.length);

  const [showModal, setShowModal] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handlePreview = () => {
    navigate(`../preview`, { relative: "path" });
  };

  const openModal = (name: string) => {
    setShowModal(name);
  };

  const closeModal = () => {
    setShowModal("");
  };

  const uploadCSV = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toastMessage("warning", "File size must smaller than 5MB!");
        return false;
      }
      dispatch(importQuestion(file));
    }
  };

  return (
    <Box sx={headerStyle}>
      <ChevronLeft
        onClick={handleBack}
        sx={{ cursor: "pointer", mr: 1 }}
        fontSize="large"
      />

      <Typography
        fontSize={30}
        fontWeight="bold"
        sx={{
          flex: 1,
          minWidth: "0px",
        }}
        noWrap
      >
        {questionName || "Form Builder"}
      </Typography>

      <span style={{ marginLeft: "auto" }} />

      {!loading ? (
        formSubmitting ? (
          <CircularProgress size={25} sx={LoaderStyle} />
        ) : (
          <>
            <Button
              onClick={handlePreview}
              variant="outlined"
              sx={{ mr: 2 }}
              startIcon={<Visibility />}
            >
              Preview
            </Button>

            {editable && (
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ mr: 2 }}
              >
                <span>Import Questions</span>
                <input
                  hidden
                  accept="text/csv"
                  type="file"
                  onChange={uploadCSV}
                />
              </Button>
            )}

            {editable && length >= 2 && (
              <Button
                variant="outlined"
                startIcon={<Menu />}
                onClick={() => openModal("rearrangeQuestions")}
                sx={{ mr: 2 }}
              >
                Rearrange
              </Button>
            )}

            {showModal === "rearrangeQuestions" && (
              <RearrangeModal closeModal={closeModal} />
            )}
          </>
        )
      ) : null}
    </Box>
  );
};

export default QBHeader;
