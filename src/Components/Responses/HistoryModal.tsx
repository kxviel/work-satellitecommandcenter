import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import { ModalBaseStyles, ModalHeader } from "../Common/styles/modal";
import { NoDataContainer, StyledTableCell } from "../Common/styles/table";
import { QuestionSlice } from "../../Redux/reducers/responseSlice";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../Redux/hooks";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  question: QuestionSlice;
};

const HistoryModal = ({ showModal, closeModal, question }: Props) => {
  const { id: studyId, participantId } = useParams();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { repeatedAttemptId } = useAppSelector((state) => state.response);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        let url = `/study/${studyId}`;
        if (repeatedAttemptId) {
          url += `/repeated-responses/${question?.formId}/question/${question?.id}?participantId=${participantId}&repeatedAttemptId=${repeatedAttemptId}`;
        } else {
          url += `/responses/${question?.formId}/question/${question?.id}?participantId=${participantId}`;
        }
        const res: AxiosResponse = await http.get(url);
        const resData = res?.data?.data;

        const groupedData = ["checkbox"].includes(question?.type)
          ? resData?.reduce((acc: any, item: any) => {
              const version = item?.version;
              if (!acc[version]) {
                acc[version] = {
                  id: item?.id,
                  user: item?.actor?.firstName
                    ? item?.actor?.lastName
                      ? `${item?.actor?.firstName} ${item?.actor?.lastName}`
                      : `${item?.actor?.firstName}`
                    : "-",
                  createdTime: item?.createdAt
                    ? DateTime.fromISO(item?.createdAt).toFormat(
                        "dd MMM yyyy hh:mm:ss a"
                      )
                    : "-",
                  responses: [],
                  version: item?.version,
                };
              }
              acc[version].responses.push(
                item?.isCleared
                  ? "Response cleared"
                  : item?.questionChoice?.label
                  ? item?.textValue
                    ? `${item?.questionChoice?.label} - ${item?.textValue}`
                    : item?.questionChoice?.label
                  : "-"
              );
              return acc;
            }, {})
          : resData;

        const newData = ["checkbox"].includes(question?.type)
          ? Object.values(groupedData).map((group: any) => ({
              ...group,
              response: group.responses.join(", "),
            }))
          : resData?.map((item: any) => ({
              id: item?.id,
              user: item?.actor?.firstName
                ? item?.actor?.lastName
                  ? `${item?.actor?.firstName} ${item?.actor?.lastName}`
                  : `${item?.actor?.firstName}`
                : "-",
              createdTime: item?.createdAt
                ? DateTime.fromISO(item?.createdAt).toFormat(
                    "dd MMM yyyy hh:mm:ss a"
                  )
                : "-",
              response: item?.isCleared
                ? "Response cleared"
                : ["text", "date"].includes(question?.type)
                ? item?.textValue
                : ["number", "calculated_field", "slider"].includes(
                    question?.type
                  )
                ? item?.numberValue
                : ["upload_file"].includes(question?.type)
                ? item?.files?.map((file: any) => file.name).join(", ")
                : ["grid", "repeated_data"].includes(question?.type)
                ? item?.gridValue
                    ?.flat()
                    .map(
                      (grid: any) => grid.textValue ?? grid.numberValue ?? "-"
                    )
                    .join(", ")
                : ["radio", "dropdown"].includes(question?.type)
                ? item?.questionChoice?.label
                  ? item?.textValue
                    ? `${item?.questionChoice?.label} - ${item?.textValue}`
                    : item?.questionChoice?.label
                  : ""
                : "-",
              version: item?.version,
            }));
        newData.sort((a: any, b: any) => b.version - a.version);

        setData(newData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchTableData();
  }, [studyId, participantId, repeatedAttemptId, question]);
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, width: "60vw", minHeight: "20vh" }}>
        <ModalHeader title={"Response history"} onCloseClick={closeModal} />
        {!loading && data?.length > 0 && (
          <Box>
            <Box
              sx={{
                maxHeight: "calc(100vh - 295px)",
                overflow: "auto",
                mb: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>User</StyledTableCell>
                    <StyledTableCell>Created Time</StyledTableCell>
                    <StyledTableCell>Response</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.map((row: any) => (
                    <TableRow key={row?.id}>
                      <StyledTableCell>{row?.user}</StyledTableCell>
                      <StyledTableCell>{row?.createdTime}</StyledTableCell>
                      <StyledTableCell>{row?.response}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
        {!loading && data.length === 0 && (
          <NoDataContainer>
            <Typography variant="body1" color="gray">
              No Data
            </Typography>
          </NoDataContainer>
        )}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default HistoryModal;
