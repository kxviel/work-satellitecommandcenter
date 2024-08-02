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
  Divider,
  FormControl,
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

const formatQueryLogs = (
  remark: string,
  createdAt: string,
  actor: any,
  id: string,
  queryLogs: any[]
) => {
  let formattedLogs: any[] = [];
  const intialLog = {
    actor: actor,
    createdAt: createdAt,
    id: id,
    remark: remark,
    time: DateTime.fromISO(createdAt).toMillis(),
  };

  formattedLogs.push(intialLog);
  formattedLogs.push(
    ...queryLogs.map((log: any) => {
      return { ...log, time: DateTime.fromISO(log?.createdAt).toMillis() };
    })
  );
  formattedLogs.sort((x, y) => {
    return x?.time - y?.time;
  });

  return formattedLogs;
};

const getStatusMap = (status: string) => {
  switch (status) {
    case "open":
      return [
        {
          value: "open",
          label: "Open",
        },
        {
          value: "resolved",
          label: "Resolved",
        },
      ];
    case "resolved":
      return [
        {
          value: "open",
          label: "Open",
        },
        {
          value: "resolved",
          label: "Resolved",
        },
        {
          value: "closed",
          label: "Closed",
        },
      ];
    case "closed":
      return [
        {
          value: "closed",
          label: "Closed",
        },
      ];
    default:
      return [];
  }
};
type Props = {
  showModal: boolean;
  canEdit: boolean;
};

const ViewQueryModal = ({ showModal, canEdit }: Props) => {
  const { id: studyId, participantId } = useParams();
  const dispatch = useAppDispatch();
  const [submitLoader, setSubmitLoader] = useState(false);
  const { queryModal } = useAppSelector((state) => state.response);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("");

  const changeRemarkHandler = (event: any) => {
    setRemark(event.target.value);
  };
  const changeStatusHandler = (event: any) => {
    setStatus(event.target.value);
  };
  const [statusMap, setStatusMap] = useState<any[]>([]);

  const submitHandler = async () => {
    try {
      if (!remark.trim()) {
        toastMessage("warning", "Remark cannot be empty");
        return;
      }
      setSubmitLoader(true);
      const body = {
        status: status,
        remark: remark,
        participantId,
      };
      let res = await http.patch(`/study/${studyId}/queries/${data?.id}`, body);
      toastMessage("success", res.data.message);
      await dispatch(fetchQueries(studyId ?? ""));
      dispatch(setQueryModal({ queryModal: {} }));
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };
  const handleQuerySelection = async (selectedQuery: any) => {
    try {
      setLoading(true);
      let res = await http.get(
        `/study/${studyId}/queries/${selectedQuery?.target?.value}?participantId=${participantId}`
      );
      const data = res?.data?.data;
      const queryData = {
        id: data?.id,
        // comment: item?.comment,
        user: `${data?.actor?.firstName} ${data?.actor?.lastName}`,
        createdAt: DateTime.fromISO(data?.createdAt).toFormat(
          "dd'-'LL'-'yyyy hh:mm a"
        ),
        remark: data?.remark,
        status: data?.status,
        queryLogs: formatQueryLogs(
          data?.remark,
          data?.createdAt,
          data?.actor,
          data?.id,
          data?.queryLogs
        ),
      };
      setData(queryData);
      const status = getStatusMap(queryData?.status);
      setStatusMap(status);
      setRemark("");
      setStatus(queryData?.status);
      setLoading(false);
      //   setSelectedQuery(query);
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
          title={"Queries for " + queryModal.title}
          onCloseClick={closeModal}
        />
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ width: "100%" }}>
            <FormLabel sx={LabelStyle} htmlFor="queryId">
              Select a Query <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Select value={data?.id || ""} onChange={handleQuerySelection}>
              {queryModal?.query?.queries?.map((query: any) => (
                <MenuItem key={query.id} value={query.id}>
                  {query.remark}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {data && (
          <>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <FormControl sx={{ width: "100%" }}>
                <FormLabel sx={LabelStyle} htmlFor="remark">
                  {canEdit ? "Change Status" : "Status"}
                </FormLabel>
                <Select
                  value={status}
                  onChange={changeStatusHandler}
                  readOnly={!canEdit}
                >
                  {statusMap.map((status: any) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {canEdit && (
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={LabelStyle} htmlFor="remark">
                    Remark <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    id="remark"
                    multiline
                    onChange={changeRemarkHandler}
                    fullWidth
                    minRows={2}
                    placeholder="Add a remark"
                    inputProps={{ readOnly: !canEdit }}
                  />
                </FormControl>
              </Box>
            )}
          </>
        )}
        {!loading ? (
          data?.queryLogs?.map((row: any, index: number) => (
            <Box mb={3} key={row?.id}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, minWidth: "1px" }}>
                  <Typography fontSize={16} fontWeight="regular" mb={1}>
                    Added By
                  </Typography>
                  <Typography fontSize={16}>
                    {row?.actor?.firstName} {row?.actor?.lastName}
                  </Typography>
                </Box>
                <Box sx={{ width: "45%" }}>
                  <Typography fontSize={16} fontWeight="regular" mb={1}>
                    Date
                  </Typography>
                  <Typography fontSize={16}>
                    {DateTime.fromISO(row?.createdAt).toFormat(
                      "dd'-'LL'-'yyyy hh:mm a"
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box mt={2} sx={{ display: "flex" }} mb={3}>
                <Box sx={{ flex: 1, minWidth: "1px" }}>
                  <Typography fontSize={16} fontWeight="regular" mb={1}>
                    Remark
                  </Typography>
                  <Typography fontSize={16}>{row?.remark}</Typography>
                </Box>
                {/* <Box sx={{ width: "45%" }}>
                  <Typography fontSize={16} fontWeight="regular" mb={1}>
                    Status
                  </Typography>
                  <Typography fontSize={16}>{row?.status}</Typography>
                </Box> */}
              </Box>
              {index !== data?.queryLogs?.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <CircularProgress size={18} sx={{ ml: 1 }} />
        )}
        {canEdit ? (
          <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
            {!submitLoader ? (
              <>
                <Button onClick={closeModal} variant="outlined">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={submitHandler}
                >
                  Save
                </Button>
              </>
            ) : (
              <CircularProgress size={25} />
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={closeModal} variant="outlined">
              Close
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ViewQueryModal;
