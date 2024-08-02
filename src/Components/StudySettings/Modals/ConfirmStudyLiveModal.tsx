import {
  Box,
  Button,
  CircularProgress,
  Modal,
  SxProps,
  Typography,
} from "@mui/material";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import { setStateToggle } from "../../../Redux/reducers/userSlice";

type Props = {
  showModal: boolean;
  closeModal: () => void;
};
const bulletSx: SxProps = {
  color: "text.primary",
  "&:before": {
    content: '"•"',
    display: "inline-block",
    width: "4px",
    height: "4px",
    mx: "10px",
  },
};

const ConfirmStudyLiveModal = ({ showModal, closeModal }: Props) => {
  const dispatch = useAppDispatch();
  const [submitLoader, setSubmitLoader] = useState(false);
  const { id: studyId } = useParams();

  const submitHandler = async () => {
    try {
      setSubmitLoader(true);
      let url = `/study/${studyId}/live`;
      let res: AxiosResponse;
      res = await http.post(url);
      toastMessage("success", res.data.message);
      closeModal();
      setSubmitLoader(false);
      dispatch(setStateToggle());
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader title={"Go Live"} onCloseClick={closeModal} />
        <Box>
          <Typography fontSize={18} fontWeight={600} color="text.primary">
            Are you sure you want to make this study “Live”?
          </Typography>
          <Typography
            fontSize={18}
            fontWeight={600}
            color="text.primary"
            mb={1}
          >
            Making study live will do the following:
          </Typography>
          <Typography fontSize={18} fontWeight={600} sx={bulletSx}>
            Visits, Forms and Repeating data becomes read-only
          </Typography>
          <Typography fontSize={18} fontWeight={600} sx={bulletSx}>
            Current participants and queries will be cleared
          </Typography>
          <Typography fontSize={18} fontWeight={600} sx={bulletSx}>
            Surveys, Survey Packages and reminders cannot be changed
          </Typography>
        </Box>

        <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
          {!submitLoader ? (
            <>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={submitHandler} variant="contained">
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

export default ConfirmStudyLiveModal;
