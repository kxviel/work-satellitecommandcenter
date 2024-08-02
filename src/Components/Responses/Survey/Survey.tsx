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
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
  ListItemIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import {
  NoDataContainer,
  pageSize,
  paginationLabel,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
  TablePaginationStyle,
} from "../../Common/styles/table";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import NewSurveyModal from "./NewSurveyModal";
import { MoreVert } from "@mui/icons-material";
import { SurveyRoot } from "../../../types/Surveys.types";
import EditSurveyModal from "./EditSurveyModal";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import CancelAssignmentModal from "./CancelAssignmentModal";
import {
  setResponseLoader,
  setSurveyAttemptId,
} from "../../../Redux/reducers/responseSlice";
import AdminSurvey from "./AdminSurveyForm";
import { MenuLabels } from "../../../Redux/reducers/studySlice";

type SurveyList = {
  id: string;
  packageName: string;
  packageId: string;
  invitationSubject: string;
  invitationBody: string;
  status: string;
  progress: any;
  editable: boolean;
  dateCreated: string;
  dateScheduled: string;
  dateSent: string;
  slug: string;
};

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  menuLabels: MenuLabels;
};

const Survey = ({ showModal, setShowModal, menuLabels }: Props) => {
  const { id: studyId, participantId } = useParams();
  const dispatch = useAppDispatch();
  const { canSendSurveys, surveyAssignmentId, canEditSurveys, hasEmail } =
    useAppSelector((state) => state.response);

  const [surveyData, setSurveyData] = useState<SurveyList[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [surveyDataCount, setSurveyDataCount] = useState(0);
  // const [sortOrder, setSortOrder] = useState("");
  // const [sortColumn, setSortColumn] = useState("");
  // const [searchParams, setSearchParams] = useSearchParams();
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [reInviteLoader, setReInviteLoader] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const openModal = () => {
    setEditModal(true);
    setAnchorEl(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setSelectedRow(null);
  };

  const editSurvey = () => {
    if (canEditSurveys) {
      const id = selectedRow.id;
      handleMenuClose();
      dispatch(setSurveyAttemptId({ surveyAssignmentId: id }));
    }
  };

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        let url = `/study/${studyId}/survey-assignment/${participantId}?page=${
          page + 1
        }&size=${pageSize}`;
        // if (sortOrder && sortColumn) {
        //   url += `&sortDirection=${sortOrder}&sortKey=${sortColumn}`;
        // }

        const res = await http.get<SurveyRoot>(url);
        const data = res.data?.data;
        const newData = data?.rows?.map((item) => {
          const progress = item.totalForms
            ? +((item.completedForms * 100) / item.totalForms).toFixed(2)
            : 0;
          return {
            id: item?.id,
            slug: item?.slug,
            packageName: item?.package?.name || "-",
            packageId: item?.packageId || "-",
            invitationSubject: item?.invitationSubject || "-",
            invitationBody: item?.invitationBody || "-",
            status: item?.status || "-",
            progress: progress || 0,
            editable: !item?.sentAt,
            scheduledAt: item?.scheduledAt,
            dateCreated: item?.createdAt
              ? DateTime.fromISO(item?.createdAt).toFormat("yyyy-MM-dd")
              : "-",
            dateScheduled: item?.scheduledAt
              ? DateTime.fromISO(item?.scheduledAt).toFormat("yyyy-MM-dd")
              : "-",
            dateSent: item?.sentAt
              ? DateTime.fromISO(item?.sentAt).toFormat("yyyy-MM-dd")
              : "-",
          };
        });

        setSurveyData(newData || []);
        setSurveyDataCount(data?.count || 0);

        dispatch(setResponseLoader(false));
        setLoading(false);
      } catch (err) {
        dispatch(setResponseLoader(false));
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    if (!surveyAssignmentId) {
      fetchSurveyData();
    }
  }, [
    page,
    toggleLoader,
    participantId,
    studyId,
    dispatch,
    surveyAssignmentId,
    // , sortOrder, sortColumn
  ]);

  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const handleChangePage = (_1: any, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    row: SurveyList
  ) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const reinvite = async () => {
    try {
      setReInviteLoader(true);
      const res = await http.post(
        `study/${studyId}/survey-assignment/${selectedRow.id}/reinvite?participantId=${participantId}`
      );
      toastMessage("success", res.data.message);
      setReInviteLoader(false);
      handleMenuClose();
    } catch (err) {
      setReInviteLoader(false);
      errorToastMessage(err as Error);
    }
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
    setAnchorEl(null);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedRow(null);
  };

  // const handleSort = (column: string) => {
  //   if (column === sortColumn) {
  //     if (sortOrder === "ASC") {
  //       setSortOrder("DESC");
  //     } else {
  //       setSortOrder("");
  //       setSortColumn("");
  //     }
  //   } else {
  //     setSortColumn(column);
  //     setSortOrder("ASC");
  //   }
  // };

  // <IconButton onClick={() => handleSort("createdAt")}>
  //                 <SortIcon />
  //               </IconButton>

  return (
    <Box
      sx={{
        padding: surveyAssignmentId ? 0 : 3,
        height: "calc(100vh - 202px)",
        overflow: "auto",
      }}
    >
      {surveyAssignmentId ? (
        <AdminSurvey menuLabels={menuLabels} />
      ) : (
        <>
          <Table sx={TableBorderRadiusTopLeftRight}>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Box display={"flex"} alignItems={"center"}>
                    Package Name
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display={"flex"} alignItems={"center"}>
                    Status
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display={"flex"} alignItems={"center"}>
                    Progress
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display={"flex"} alignItems={"center"}>
                    Date Created
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display={"flex"} alignItems={"center"}>
                    Date Scheduled
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display={"flex"} alignItems={"center"}>
                    Date Sent
                  </Box>
                </StyledTableCell>
                {(canSendSurveys || canEditSurveys) && <StyledTableCell />}
              </TableRow>
            </TableHead>
            {!loading && surveyData?.length > 0 && (
              <>
                <TableBody>
                  {surveyData?.map((row) => (
                    <TableRow key={row?.id}>
                      <StyledTableCell>{row?.packageName}</StyledTableCell>
                      <StyledTableCell sx={{ textTransform: "capitalize" }}>
                        {row?.status}
                      </StyledTableCell>
                      <StyledTableCell>
                        {/* <Typography
                      fontWeight={"regular"}
                      fontSize={"18px"}
                      color="#355962"
                    >
                      {row?.progress}
                    </Typography> */}
                        <LinearProgress
                          variant="determinate"
                          value={row?.progress}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{row?.dateCreated}</StyledTableCell>
                      <StyledTableCell>{row?.dateScheduled}</StyledTableCell>
                      <StyledTableCell>{row?.dateSent}</StyledTableCell>
                      {(canSendSurveys || canEditSurveys) && (
                        <StyledTableCell align="right">
                          {row?.status !== "cancelled" && (
                            <IconButton
                              onClick={(e) => handleMenuClick(e, row)}
                            >
                              <MoreVert />
                            </IconButton>
                          )}
                        </StyledTableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
                {surveyDataCount > pageSize && (
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        sx={TablePaginationStyle}
                        count={surveyDataCount}
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
          {!loading && surveyData.length === 0 && (
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
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                maxHeight: "400px",
                width: "24ch",
              },
            }}
          >
            {/* <MenuItem>
          <ListItemText>View survey responeses</ListItemText>
        </MenuItem> */}
            {selectedRow?.editable && canSendSurveys && hasEmail && (
              <MenuItem onClick={openModal}>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            )}
            {selectedRow &&
              !selectedRow?.editable &&
              canSendSurveys &&
              hasEmail &&
              selectedRow?.status !== "completed" && (
                <MenuItem onClick={reinvite} disabled={reInviteLoader}>
                  <ListItemText>Re-send invite</ListItemText>
                  {reInviteLoader && (
                    <ListItemIcon>
                      <CircularProgress size={18} sx={{ ml: 1 }} />
                    </ListItemIcon>
                  )}
                </MenuItem>
              )}
            {selectedRow && canSendSurveys && (
              <MenuItem onClick={openCancelModal} disabled={reInviteLoader}>
                <ListItemText>Cancel Assignment</ListItemText>
              </MenuItem>
            )}
            {selectedRow && !selectedRow?.editable && canEditSurveys && (
              <MenuItem onClick={editSurvey}>
                <ListItemText>{`Edit Responses`}</ListItemText>
              </MenuItem>
            )}
            {/* <MenuItem>
          <ListItemText sx={{ color: "#F05252" }}>Delete</ListItemText>
        </MenuItem> */}
          </Menu>
          {showModal && (
            <NewSurveyModal
              showModal={showModal}
              closeModal={closeModal}
              refreshPage={refreshPage}
            />
          )}
          {editModal && (
            <EditSurveyModal
              showModal={editModal}
              closeModal={closeEditModal}
              refreshPage={refreshPage}
              data={selectedRow}
            />
          )}
          {showCancelModal && (
            <CancelAssignmentModal
              openModal={showCancelModal}
              closeModal={closeCancelModal}
              surveyId={selectedRow?.id}
              refreshPage={refreshPage}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Survey;
