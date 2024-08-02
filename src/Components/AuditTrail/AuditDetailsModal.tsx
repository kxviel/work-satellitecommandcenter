import {
  Box,
  Button,
  Modal,
  SxProps,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ModalHeader, ModalBaseStyles } from "../Common/styles/modal";
import { camelCaseToWords } from "../../utils/audit";
import { StyledTableCell } from "../Common/styles/table";

type Props = {
  showModal: boolean;
  audit: any;
  closeModal: Function;
};

const titleSx: SxProps = {
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "150%",
  color: "text.primary",
  mr: "10px",
  minWidth: "10ch",
};

const valueSx: SxProps = {
  fontSize: "16px",
  lineHeight: "150%",
  color: "text.primary",
};

const containerSx: SxProps = {
  display: "flex",
  mb: "10px",
};

const AuditDetailsModal = ({ showModal, audit, closeModal }: Props) => {
  const handleCloseModal = () => {
    closeModal();
  };

  let details: any[] = [],
    valueDiff = [];

  if (audit.details) {
    const { diff, ...rest } = audit.details;

    Object.entries(rest).forEach(([k, v]) => {
      const val = typeof v === "boolean" ? (v ? "Yes" : "No") : v;
      details.push({
        key: camelCaseToWords(k),
        value: val,
      });
    });
    if (diff) {
      valueDiff = diff.map((row: any) => {
        const old =
          typeof row.old === "boolean" ? (row.old ? "Yes" : "No") : row.old;
        const newVal =
          typeof row.new === "boolean" ? (row.new ? "Yes" : "No") : row.new;
        return {
          key: camelCaseToWords(row.key),
          old: old,
          new: newVal,
        };
      });
    }
  }

  return (
    <Modal open={showModal} onClose={handleCloseModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "10vh" }}>
        <ModalHeader title={audit.action} onCloseClick={handleCloseModal} />
        <Box sx={containerSx}>
          <Typography sx={titleSx}>Date:</Typography>
          <Typography sx={valueSx}>{audit.date}</Typography>
        </Box>
        <Box sx={containerSx}>
          <Typography sx={titleSx}>Action:</Typography>
          <Typography sx={valueSx}>{audit.action}</Typography>
        </Box>
        <Box sx={containerSx}>
          <Typography sx={titleSx}>User:</Typography>
          <Typography sx={valueSx}>{audit.user}</Typography>
        </Box>
        <Box sx={containerSx}>
          <Typography sx={titleSx}>User Email:</Typography>
          <Typography sx={valueSx}>{audit.userEmail}</Typography>
        </Box>
        {audit.participant && (
          <Box sx={containerSx}>
            <Typography sx={titleSx}>Participant:</Typography>
            <Typography sx={valueSx}>{audit.participant}</Typography>
          </Box>
        )}

        <>
          {details.map((row) => {
            return (
              <Box sx={containerSx} key={row.key}>
                <Typography sx={titleSx}>{row.key}:</Typography>
                <Typography sx={valueSx}>{row.value}</Typography>
              </Box>
            );
          })}
        </>

        {valueDiff.length > 0 ? (
          <Table sx={{ my: 2 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Key</StyledTableCell>
                <StyledTableCell>Old value</StyledTableCell>
                <StyledTableCell>New Value</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {valueDiff.map((row: any) => {
                return (
                  <TableRow key={row?.key}>
                    <StyledTableCell sx={{ minWidth: "150px" }}>
                      <Typography fontSize="14px">{row?.key}</Typography>
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: "150px" }}>
                      <Typography fontSize="14px">{row?.old ?? "-"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: "150px" }}>
                      <Typography fontSize="14px">{row?.new ?? "-"}</Typography>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuditDetailsModal;
