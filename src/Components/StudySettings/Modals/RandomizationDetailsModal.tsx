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
import { ModalBaseStyles, ModalHeader } from "../../Common/styles/modal";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage } from "../../../utils/toast";
import { NoDataContainer, StyledTableCell } from "../../Common/styles/table";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  studyId: any;
  siteId: any;
};

const RandomizationDetailsModal = ({
  showModal,
  closeModal,
  studyId,
  siteId,
}: Props) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        let url = `/randomization/list?studyId=${studyId}`;
        if (siteId) {
          url += `&siteId=${siteId}`;
        }
        const res: AxiosResponse = await http.get(url);
        const resData = res?.data?.data;
        const newData = resData?.map((item: any) => ({
          subjectId: item?.randomizationNumber,
          blockId: item?.blockId || "",
          treatmentGroupName: item?.treatmentGroupName || "",
          blockSize: item?.blockSize || "",
        }));

        setData(newData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchTableData();
  }, [studyId, siteId]);
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, width: "60vw", minHeight: "20vh" }}>
        <ModalHeader
          title={"Randomization Details"}
          onCloseClick={closeModal}
        />
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
                    <StyledTableCell>
                      <Box display={"flex"} alignItems={"center"}>
                        ID
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box display={"flex"} alignItems={"center"}>
                        Block ID
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box display={"flex"} alignItems={"center"}>
                        Block Size
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box display={"flex"} alignItems={"center"}>
                        Group
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.map((row: any) => (
                    <TableRow key={row?.subjectId}>
                      <StyledTableCell>{row?.subjectId}</StyledTableCell>
                      <StyledTableCell>{row?.blockId}</StyledTableCell>
                      <StyledTableCell>{row?.blockSize}</StyledTableCell>
                      <StyledTableCell>
                        {row?.treatmentGroupName}
                      </StyledTableCell>
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
            <CircularProgress size={18} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default RandomizationDetailsModal;
