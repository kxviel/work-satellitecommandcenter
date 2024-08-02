import {
  Box,
  Modal,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";

import { ModalBaseStyles, ModalHeader } from "../../Common/styles/modal";
import { NoDataContainer, StyledTableCell } from "../../Common/styles/table";
import { getColorByStatus } from "../RecordsList";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: any;
};

const statusMap: any = {
  not_started: "Not started",
  completed: "Completed",
  inprogress: "In progress",
};

const ProgressDetailModal = ({ showModal, closeModal, data }: Props) => {
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, width: "60vw", minHeight: "20vh" }}>
        <ModalHeader title={"Progress"} onCloseClick={closeModal} />
        {data?.length > 0 && (
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
                  <StyledTableCell>Visit Name</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.map((row: any) => (
                  <TableRow key={row?.id}>
                    <StyledTableCell>{row?.phaseName}</StyledTableCell>
                    <StyledTableCell>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: getColorByStatus(row?.status),
                        }}
                      >
                        {statusMap[row?.status]}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
        {data.length === 0 && (
          <NoDataContainer>
            <Typography variant="body1" color="gray">
              No Data
            </Typography>
          </NoDataContainer>
        )}
      </Box>
    </Modal>
  );
};

export default ProgressDetailModal;
