import { useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  ModalHeader,
  ModalBaseStyles,
  ModalActionButtonStyles,
} from "../../Common/styles/modal";
import { setQueryModal } from "../../../Redux/reducers/responseSlice";
import { LabelStyle } from "../../Common/styles/form";
import { DateTime } from "luxon";

import { Formik } from "formik";
type Props = {
  showModal: boolean;
  canEdit: boolean;
};

const ViewQueryComments = ({ showModal, canEdit }: Props) => {
  const { id: studyId } = useParams();
  const dispatch = useAppDispatch();
  const [submitLoader, setSubmitLoader] = useState(false);
  const { queryModal, participantId } = useAppSelector(
    (state) => state.response
  );
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // const changeHandler = (event: any) => {
  //   setRemark(event.target.value);
  // };

  const submitHandler = async (values: any, setFieldValue: Function) => {
    try {
      // if (!remark.trim()) {
      //   toastMessage("warning", "Remark cannot be empty");
      //   return;
      // }
      setSubmitLoader(true);
      const body = {
        comment: values?.comment,
        participantId: participantId,
      };
      let res = await http.post(
        `/study/${studyId}/queries/${values?.queryId}/comment`,
        body
      );
      toastMessage("success", res.data.message);
      // await dispatch(fetchQueries(studyId || ""));
      handleQuerySelection(values?.queryId);
      setFieldValue("comment", "");
      setSubmitLoader(false);
      // dispatch(setQueryModal({ queryModal: {} }));
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };
  const handleQuerySelection = async (selectedQuery: string) => {
    try {
      setLoading(true);
      let res = await http.get(
        `/study/${studyId}/queries/${selectedQuery}/comments?participantId=${participantId}`
      );
      const data = res?.data?.data;
      const commentsData = data?.map((item: any) => ({
        id: item?.id,
        comment: item?.comment,
        user: `${item?.actor?.firstName} ${item?.actor?.lastName}`,
        createdAt: DateTime.fromISO(item?.createdAt).toFormat(
          "dd'-'LL'-'yyyy hh:mm a"
        ),
      }));
      setComments(commentsData);
      setLoading(false);
      // setSelectedQuery(query);
      // dispatch(setAppLoader(false));
    } catch (err) {
      // dispatch(setAppLoader(false));
      errorToastMessage(err as Error);
    }
  };

  const closeModal = () => {
    dispatch(setQueryModal({ queryModal: {} }));
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "10vh" }}>
        <ModalHeader
          title={"Comments for " + queryModal.title}
          onCloseClick={closeModal}
        />
        <Formik
          initialValues={{
            queryId: "",
            comment: "",
          }}
          // validationSchema={schema}
          onSubmit={(values, { setFieldValue }) => {
            submitHandler(values, setFieldValue);
          }}
        >
          {({
            handleSubmit,
            getFieldProps,
            errors,
            touched,
            values,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={LabelStyle} htmlFor="queryId">
                    Select a Query <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    value={values.queryId}
                    onChange={(e) => {
                      setFieldValue("queryId", e.target.value);
                      handleQuerySelection(e.target.value);
                    }}
                  >
                    {queryModal?.query?.queries?.map((query: any) => (
                      <MenuItem key={query.id} value={query.id}>
                        {query.remark}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched?.queryId && errors?.queryId
                      ? (errors?.queryId as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
              </Box>
              {!loading ? (
                comments?.length > 0 ? (
                  <Box>
                    {!canEdit && (
                      <Typography fontSize={16} fontWeight="regular" mb={1}>
                        Comments
                      </Typography>
                    )}
                    {comments?.map((comment: any) => (
                      <Box
                        key={comment?.id}
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <Box padding={1}>
                          <Typography fontSize={16} fontWeight="light">
                            {comment?.comment}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "secondary.main",
                            padding: 1,
                          }}
                        >
                          <Typography fontSize={16} fontWeight="regular">
                            By: {comment?.user}
                          </Typography>
                          <Typography fontSize={16} fontWeight="regular">
                            Date: {comment?.createdAt}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  values?.queryId && (
                    <Typography>No comments added yet</Typography>
                  )
                )
              ) : (
                <CircularProgress size={18} sx={{ ml: 1 }} />
              )}

              {values?.queryId && canEdit && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={LabelStyle} htmlFor="comment">
                      New Comment
                    </FormLabel>
                    <TextField
                      id="comment"
                      multiline
                      fullWidth
                      minRows={2}
                      inputProps={{ readOnly: !canEdit }}
                      placeholder="Add a comment"
                      {...getFieldProps("comment")}
                      error={touched?.comment && errors?.comment ? true : false}
                      helperText={
                        touched?.comment && errors?.comment
                          ? (errors?.comment as string)
                          : " "
                      }
                    />
                  </FormControl>
                </Box>
              )}
              {canEdit ? (
                <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Add Comment
                      </Button>
                    </>
                  ) : (
                    <CircularProgress size={25} />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button onClick={closeModal} variant="outlined">
                    Close
                  </Button>
                </Box>
              )}
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ViewQueryComments;
