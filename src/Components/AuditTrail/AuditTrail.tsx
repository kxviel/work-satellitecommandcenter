import React, { useEffect, useState } from "react";
import { HeaderLeftContent2, StyledHeader } from "../Common/styles/header";
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  NoDataContainer,
  StyledTableCell,
  TablePaginationStyle,
  pageSize,
  paginationLabel,
} from "../Common/styles/table";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { formatEventName } from "../../utils/audit";
import AuditDetailsModal from "./AuditDetailsModal";

const AuditTrail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [auditData, setAuditData] = useState<any>([]);
  const [auditDataCount, setAuditDataCount] = useState(0);
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [modaldetails, setModalDetails] = useState<any>();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let url = `/audit-trail?studyId=${id}&page=${
          page + 1
        }&size=${pageSize}`;

        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;
        const newData = data?.audits?.map((row: any) => ({
          id: row?.id,
          user: row?.actorName,
          userEmail: row?.actorEmail,
          participant: row?.participantId,
          action: formatEventName(row?.eventType),
          date: DateTime.fromISO(row?.createdAt).toFormat(
            "dd MMM yyyy hh:mm:ss a"
          ),
          details: row?.details,
        }));
        setAuditData(newData || []);
        setAuditDataCount(data?.count || 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchDetails();
  }, [page, id]);

  const handleChangePage = (_1: any, newPage: number) => {
    setPage(newPage);
  };

  const showDetails = (row: any) => {
    setModalDetails(row);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalDetails(null);
  };

  return (
    <>
      <StyledHeader>
        <Box sx={HeaderLeftContent2}>
          <Typography fontSize={20} fontWeight={600} color="text.primary">
            Audit trail
          </Typography>
        </Box>
      </StyledHeader>
      <Box sx={{ height: "calc(100vh - 144px)", overflow: "auto", p: 2.5 }}>
        <Box sx={{ borderRadius: "8px 8px 0 0", overflowX: "scroll" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>User</StyledTableCell>
                <StyledTableCell>User Email</StyledTableCell>
                <StyledTableCell>Participant</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {!loading && auditData?.length > 0 && (
              <>
                <TableBody>
                  {auditData?.map((row: any) => (
                    <TableRow
                      key={row?.id}
                      onClick={() => showDetails(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledTableCell sx={{ maxWidth: "250px" }}>
                        <Typography noWrap fontWeight={400} fontSize="14px">
                          {row?.date}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          maxWidth: "250px",
                          color: "primary.main",
                        }}
                      >
                        <Typography noWrap fontWeight={600} fontSize="14px">
                          {row?.user}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          maxWidth: "250px",
                          color: "primary.main",
                        }}
                      >
                        <Typography noWrap fontWeight={600} fontSize="14px">
                          {row?.userEmail}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell sx={{ maxWidth: "250px" }}>
                        <Typography noWrap fontWeight={400} fontSize="14px">
                          {row?.participant}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell sx={{ maxWidth: "250px" }}>
                        <Typography noWrap fontWeight={400} fontSize="14px">
                          {row?.action}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {auditDataCount > pageSize && (
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        sx={TablePaginationStyle}
                        count={auditDataCount}
                        page={page}
                        rowsPerPage={pageSize}
                        rowsPerPageOptions={[pageSize]}
                        onPageChange={handleChangePage}
                        labelDisplayedRows={paginationLabel}
                      />
                    </TableRow>
                  </TableFooter>
                )}
              </>
            )}
          </Table>
          {loading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
          {!loading && auditData.length === 0 && (
            <NoDataContainer>
              <Typography variant="body1" color="gray">
                No Data
              </Typography>
            </NoDataContainer>
          )}
        </Box>
      </Box>
      {showModal && (
        <AuditDetailsModal
          closeModal={closeModal}
          showModal={showModal}
          audit={modaldetails}
        />
      )}
    </>
  );
};

export default AuditTrail;
