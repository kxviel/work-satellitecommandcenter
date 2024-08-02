import { useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchQueries } from "../../../Redux/actions/responseAction";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  ModalHeader,
  ModalBaseStyles,
  ModalActionButtonStyles,
} from "../../Common/styles/modal";
import { setQueryModal } from "../../../Redux/reducers/responseSlice";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AddQueryModal = ({ showModal }: any) => {
  const { id: studyId } = useParams();
  const dispatch = useAppDispatch();
  const [remark, setRemark] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);
  const { queryModal, selectedForm, participantId, repeatedAttemptId, siteId } =
    useAppSelector((state) => state.response);

  const changeHandler = (event: any) => {
    setRemark(event.target.value);
  };

  const submitHandler = async () => {
    try {
      if (!remark.trim()) {
        toastMessage("warning", "Remark cannot be empty");
        return;
      }
      setSubmitLoader(true);
      const body = {
        remark: remark,
        questionId: queryModal.qid,
        formId: selectedForm?.id,
        participantId,
        repeatedAttemptId: repeatedAttemptId || undefined,
        siteId,
      };
      let res = await http.post(`/study/${studyId}/queries`, body);
      toastMessage("success", res.data.message);
      await dispatch(fetchQueries(studyId ?? ""));
      dispatch(setQueryModal({ queryModal: {} }));
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  const closeModal = () => {
    dispatch(setQueryModal({ queryModal: {} }));
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader
          title={"Add query for field " + queryModal.title}
          onCloseClick={closeModal}
        />
        <Box>
          <FormControl sx={InputWrapper}>
            <FormLabel sx={LabelStyle} htmlFor="query-remark">
              Query Status
            </FormLabel>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography>Open</Typography>
              <HelpOutlineIcon sx={{ color: "red", ml: 1 }} />
            </Box>
          </FormControl>
          <FormControl sx={InputWrapper}>
            <FormLabel sx={LabelStyle} htmlFor="query-remark">
              Remark <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              placeholder="Query Remark"
              id="query-remark"
              value={remark}
              onChange={changeHandler}
              multiline={true}
              rows={2}
            />
          </FormControl>
        </Box>
        <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
          {!submitLoader ? (
            <>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={submitHandler} variant="contained">
                Add Query
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

export default AddQueryModal;
