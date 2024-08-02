import {
  LinearProgress,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import {
  NoDataContainer,
  pageSize,
  paginationLabel,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
  TablePaginationStyle,
} from "../../Common/styles/table";
import { AxiosResponse } from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import http from "../../../utils/http";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { DateTime } from "luxon";
import UploadRandomizationModal from "../Modals/UploadRandomizationModal";
import RandomizationModal from "../Modals/RandomizationModal";
import RandomizationDetailsModal from "../Modals/RandomizationDetailsModal";

type Props = {
  modalContent: string;
  setModalContent: Function;
  canEdit: boolean;
};

const RandomizationList = ({
  modalContent,
  setModalContent,
  canEdit,
}: Props) => {
  const { id: studyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleLoader, setToggleLoader] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<any>([]);
  const [siteDataCount, setSiteDataCount] = useState<number>(0);
  const [downloadingRowId, setDownloadingRowId] = useState<string>("");
  const [siteId, setSiteId] = useState<string>("");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") ?? "0") || 0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/randomization/list/uploads?studyId=${studyId}`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;

        const newData = data?.map((item: any) => ({
          id: item?.id,
          siteId: item?.site?.id || null,
          siteName: item?.site?.name || "All Sites",
          uploadedFileName: item?.originalFileName,
          uploadedDate: item?.createdAt
            ? DateTime.fromISO(item?.createdAt).toFormat("yyyy-LL-dd")
            : "-",
          numberOfPartcipants: item?.metadata?.totalParticipants,
        }));

        setSiteData(newData || []);
        setSiteDataCount(data?.length || 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [page, toggleLoader, studyId]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    setSearchParams(params, {
      replace: true,
    });
  }, [setSearchParams, page]);

  const handleChangePage = (_1: any, newPage: number) => {
    setPage(newPage);
  };

  const closeModal = () => {
    setModalContent("");
  };
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };
  const handleDownload = async (randomizationId: string) => {
    try {
      setDownloadingRowId(randomizationId);
      let res = await http.get(
        `/randomization/list/uploads/${randomizationId}/download?studyId=${studyId}`
      );
      const downloadLink = res?.data?.data?.downloadLink;
      const link = document.createElement("a");
      link.setAttribute("href", downloadLink);
      link.setAttribute("download", "randomization.csv");
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
  const handleRowClick = (siteId: string) => {
    setSiteId(siteId);
    setModalContent("randomization_details");
  };

  return (
    <Box>
      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Site Name</StyledTableCell>
            <StyledTableCell>Uploaded File Name</StyledTableCell>
            <StyledTableCell>Uploaded Date</StyledTableCell>
            <StyledTableCell>Number of Participants</StyledTableCell>
            <StyledTableCell>Download</StyledTableCell>
          </TableRow>
        </TableHead>
        {!loading && siteData?.length > 0 && (
          <>
            <TableBody>
              {siteData?.map((row: any) => (
                <TableRow key={row?.id}>
                  <StyledTableCell
                    onClick={() => handleRowClick(row?.siteId)}
                    sx={{ cursor: "pointer" }}
                  >
                    {row?.siteName || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row?.uploadedFileName || "-"}
                  </StyledTableCell>
                  <StyledTableCell>{row?.uploadedDate || "-"}</StyledTableCell>
                  <StyledTableCell>
                    {row?.numberOfPartcipants || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {downloadingRowId === row?.id ? (
                      <CircularProgress size={18} />
                    ) : (
                      <IconButton
                        onClick={() => handleDownload(row?.id)}
                        disabled={downloadingRowId !== ""}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            {siteDataCount > pageSize && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    sx={TablePaginationStyle}
                    count={siteDataCount}
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
      {!loading && siteData.length === 0 && (
        <NoDataContainer>
          <Typography variant="body1" color="gray">
            No Data
          </Typography>
        </NoDataContainer>
      )}
      {loading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {modalContent === "upload" && (
        <UploadRandomizationModal
          showModal={modalContent === "upload"}
          closeModal={closeModal}
          studyId={studyId}
          refreshPage={refreshPage}
        />
      )}
      {modalContent === "randomization" && (
        <RandomizationModal
          showModal={modalContent === "randomization"}
          closeModal={closeModal}
          studyId={studyId}
          refreshPage={refreshPage}
        />
      )}
      {modalContent === "randomization_details" && (
        <RandomizationDetailsModal
          showModal={modalContent === "randomization_details"}
          closeModal={closeModal}
          studyId={studyId}
          siteId={siteId}
        />
      )}
    </Box>
  );
};

export default RandomizationList;
