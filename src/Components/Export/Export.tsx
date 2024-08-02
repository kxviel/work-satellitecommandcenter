import { useEffect, useState } from "react";
import { HeaderRightContent, StyledHeader } from "../Common/styles/header";
import {
  Box,
  CircularProgress,
  IconButton,
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
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { useParams } from "react-router-dom";
import { CompletedStatusTag } from "../Common/UI/StatusTag";
import { DateTime } from "luxon";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { RefreshOutlined } from "@mui/icons-material";
import { formatEventName } from "../../utils/audit";

const eventType: any = {
  export_study: "Export study",
};

const Export = () => {
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [exportData, setExportData] = useState<any>([]);
  const [exportDataCount, setExportDataCount] = useState<number>(0);
  const [downloadingRowId, setDownloadingRowId] = useState<string>("");

  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let url = `/exports?studyId=${id}&page=${page + 1}&size=${pageSize}`;

        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;

        const newData = data?.map((row: any) => ({
          id: row?.id,
          type: row?.event ? eventType[row?.event] : "-",
          fileType: row?.exportType.toUpperCase() || "-",
          fileName: row?.fileName || "-",
          fileSize: row?.fileSize
            ? row?.fileSizeUnit
              ? `${row.fileSize} ${row.fileSizeUnit}`
              : `${row.fileSize}`
            : "-",
          requestedOn: row?.createdAt
            ? DateTime.fromISO(row?.createdAt).toFormat("dd MMM yyyy HH:mm")
            : "-",
          status: row?.status ? formatEventName(row?.status) : "-",
          downloadable: DateTime.fromISO(row?.expiresOn) > DateTime.now(),
          expiresOn: row?.expiresOn
            ? DateTime.fromISO(row?.expiresOn).toFormat("dd MMM yyyy HH:mm")
            : "-",
        }));
        setExportData(newData || []);
        setExportDataCount(data?.count || 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchDetails();
  }, [id, page, toggle]);

  const handleChangePage = (_1: any, newPage: number) => {
    setPage(newPage);
  };

  const handleDownload = async (exportId: string) => {
    try {
      setDownloadingRowId(exportId);
      let res = await http.post(`/exports/${exportId}/download`, {
        studyId: id,
      });
      const downloadLink = res?.data?.data?.downloadLink;
      const link = document.createElement("a");
      link.setAttribute("href", downloadLink);
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toastMessage("success", res.data.message);
      setDownloadingRowId("");
    } catch (err) {
      setDownloadingRowId("");
      errorToastMessage(err as Error);
    }
  };

  const refreshPage = () => {
    setToggle((prev) => !prev);
  };

  return (
    <>
      <StyledHeader>
        <Box sx={{ ...HeaderRightContent, gap: 1 }}>
          <Typography fontSize={20} fontWeight={600} color="text.primary">
            Export
          </Typography>
          <IconButton onClick={refreshPage}>
            <RefreshOutlined />
          </IconButton>
        </Box>
      </StyledHeader>
      <Box sx={{ height: "calc(100vh - 144px)", overflow: "auto", p: 2.5 }}>
        <Box sx={{ borderRadius: "8px 8px 0 0", overflowX: "scroll" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>File Type</StyledTableCell>
                <StyledTableCell>File Name</StyledTableCell>
                <StyledTableCell>File Size</StyledTableCell>
                <StyledTableCell>Requested On</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Expires On</StyledTableCell>
                <StyledTableCell>Download</StyledTableCell>
              </TableRow>
            </TableHead>
            {!loading && exportData?.length > 0 && (
              <>
                <TableBody>
                  {exportData?.map((row: any) => (
                    <TableRow key={row?.id}>
                      <StyledTableCell>{row?.type}</StyledTableCell>
                      <StyledTableCell>{row?.fileType}</StyledTableCell>
                      <StyledTableCell>{row?.fileName}</StyledTableCell>
                      <StyledTableCell>{row?.fileSize}</StyledTableCell>
                      <StyledTableCell>{row?.requestedOn}</StyledTableCell>
                      <StyledTableCell>
                        <CompletedStatusTag status={row?.status} />
                      </StyledTableCell>
                      <StyledTableCell>{row?.expiresOn}</StyledTableCell>
                      <StyledTableCell>
                        {downloadingRowId === row?.id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <IconButton
                            onClick={() => handleDownload(row?.id)}
                            disabled={
                              downloadingRowId !== "" || !row?.downloadable
                            }
                          >
                            <CloudDownloadIcon />
                          </IconButton>
                        )}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {exportDataCount > pageSize && (
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        sx={TablePaginationStyle}
                        count={exportDataCount}
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
          {!loading && exportData.length === 0 && (
            <NoDataContainer>
              <Typography variant="body1" color="gray">
                No Data
              </Typography>
            </NoDataContainer>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Export;
