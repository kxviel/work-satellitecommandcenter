import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../Common/styles/modal";
import { InputWrapper, LabelStyle } from "../Common/styles/form";

type Props = {
  openModal: boolean;
  selectedRow: any;
  closeModal: () => void;
  refreshPage: () => void;
};

const ConfirmDeleteStudyModal = ({
  openModal,
  selectedRow,
  closeModal,
  refreshPage,
}: Props) => {
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [study, setStudy] = useState<string>("");
  const handleChange = (event: any) => {
    setStudy(event.target.value);
  };
  const submitHandler = async () => {
    try {
      setSubmitLoader(true);
      let res: AxiosResponse = await http.delete(`/study/${selectedRow?.id}`);
      toastMessage("success", res.data.message);
      closeModal();
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box
        sx={{
          ...ModalBaseStyles,
          "& .text-studyName": {
            color: "primary.main",
          },
        }}
      >
        <ModalHeader title="Delete study" onCloseClick={closeModal} />
        <Typography
          sx={{ ...LabelStyle, mb: 2 }}
          fontWeight={600}
          variant="subtitle2"
        >
          Are you sure you want to delete{" "}
          <span className="text-studyName">"{selectedRow?.studyName}"</span>{" "}
          study?
        </Typography>
        <Typography
          sx={{ ...LabelStyle, mb: 2 }}
          fontWeight={600}
          variant="subtitle2"
        >
          Please enter the study name below to delete the study.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={InputWrapper}>
            <TextField
              id="reason"
              multiline
              fullWidth
              placeholder="Enter Study Name"
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Box sx={ModalActionButtonStyles}>
          {!submitLoader ? (
            <>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={submitHandler}
                disabled={study !== selectedRow?.studyName}
              >
                Confirm
              </Button>
            </>
          ) : (
            <CircularProgress size={25} />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteStudyModal;
