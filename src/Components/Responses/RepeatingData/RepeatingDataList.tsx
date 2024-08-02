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
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../utils/http";
import { errorToastMessage } from "../../../utils/toast";
import {
  NoDataContainer,
  pageSize,
  paginationLabel,
  StyledTableCell,
  TablePaginationStyle,
} from "../../Common/styles/table";
import { Delete, Edit, MoreVert, Visibility } from "@mui/icons-material";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import AddRepeatingDataModal from "./AddRepeatingDataModal";
import { repeatedDataTypes } from "../../../utils/question";
import {
  setRepeatedAttemptId,
  setResponseLoader,
} from "../../../Redux/reducers/responseSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { RepeatedDataRoot } from "../../../types/RepeatingData.types";
import DeleteRepeatingDataModal from "./DeleteRepeatingDataModal";
import { MenuLabels } from "../../../Redux/reducers/studySlice";

type Props = {
  page: number;
  searchText: string;
  showModal: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  menuLabels: MenuLabels;
};

const statusMap: any = {
  active: "Not Started",
  completed: "Completed",
  inprogress: "In Progress",
};

type DataList = {
  id: string;
  status: string;
  repeatData: string;
  name: string;
  type: any;
  phaseId: string;
  parentPhaseId: string;
  createdOn: string;
  assignedTo: string;
  createdBy: string;
};

const RepeatingDataList = ({
  page,
  showModal,
  searchText,
  setPage,
  setShowModal,
  menuLabels,
}: Props) => {
  const { id: studyId, participantId } = useParams();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [repeatingData, setRepeatingData] = useState<DataList[]>([]);
  const [repeatingDataCount, setRepeatingDataCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [menuLoader] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const editable = useAppSelector((state) => state.response.editable);

  useEffect(() => {
    const fetchRepeatingData = async () => {
      try {
        setLoading(true);

        let params: any = {
          participantId,
          page: page + 1,
          size: pageSize,
        };

        if (searchText) {
          params.search = searchText;
        }

        const res = await http.get<RepeatedDataRoot>(
          `/study/${studyId}/repeated-responses/attempts`,
          { params }
        );

        const data = res.data?.data;
        const newData = data?.rows?.map((item) => ({
          id: item?.id,
          status: item?.status ? statusMap[item?.status] : item?.status,
          repeatData: item?.phase.name || "",
          name: item?.name || "",
          type: repeatedDataTypes[item?.phase?.type] || "",
          phaseId: item?.phaseId || "",
          parentPhaseId: item?.parentPhaseId || "",
          createdOn: item?.createdAt
            ? DateTime.fromISO(item?.createdAt).toFormat("dd/MM/yyyy")
            : "",
          createdBy: item?.actor
            ? `${item?.actor?.firstName} ${item?.actor?.lastName}`
            : "",
          assignedTo: item?.parentPhase?.name || "",
        }));
        setRepeatingData(newData || []);
        setRepeatingDataCount(data?.count || 0);

        if (newData.length === 0 && data?.count > 0 && page !== 0) {
          setPage(0);
          return;
        }

        dispatch(setResponseLoader(false));
        setLoading(false);
      } catch (err) {
        dispatch(setResponseLoader(false));
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchRepeatingData();
  }, [
    searchText,
    page,
    toggleLoader,
    studyId,
    participantId,
    setPage,
    dispatch,
  ]);

  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const handleChangePage = (_1: any, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    row: DataList
  ) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const openModal = () => {
    setShowModal(true);
    setAnchorEl(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleRowClick = async (attempt: DataList) => {
    dispatch(setRepeatedAttemptId({ repeatedAttemptId: attempt.id }));
  };

  const viewRepeatingData = async () => {
    dispatch(setRepeatedAttemptId({ repeatedAttemptId: selectedRow.id }));
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setAnchorEl(null);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRow(null);
  };

  return (
    <Box sx={{ p: 2.5, height: "calc(100vh - 282px)", overflow: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Name
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                {menuLabels?.repeating_data || "Repeating Data"}
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Type
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Created on
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Created by
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Status
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Assigned to
              </Box>
            </StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>

        {!loading && repeatingData?.length > 0 && (
          <>
            <TableBody>
              {repeatingData?.map((row) => (
                <TableRow key={row?.id}>
                  <StyledTableCell
                    onClick={() => handleRowClick(row)}
                    sx={{ cursor: "pointer" }}
                  >
                    {row?.name || "-"}
                  </StyledTableCell>
                  <StyledTableCell>{row?.repeatData || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.type || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.createdOn || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.createdBy || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.status || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.assignedTo || "-"}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, row)}>
                      <MoreVert />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>

            {repeatingDataCount > pageSize && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    sx={TablePaginationStyle}
                    count={repeatingDataCount}
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
      {!loading && repeatingData.length === 0 && (
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
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={viewRepeatingData} disabled={menuLoader}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        {editable && (
          <MenuItem onClick={openModal} disabled={menuLoader}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {editable && (
          <MenuItem onClick={openDeleteModal} disabled={menuLoader}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {showModal && (
        <AddRepeatingDataModal
          showModal={showModal}
          closeModal={closeModal}
          data={selectedRow}
          refreshPage={refreshPage}
          menuLabels={menuLabels}
        />
      )}
      {showDeleteModal && (
        <DeleteRepeatingDataModal
          openModal={showDeleteModal}
          closeModal={closeDeleteModal}
          repeatingDataId={selectedRow?.id}
          refreshPage={refreshPage}
        />
      )}
    </Box>
  );
};

export default RepeatingDataList;
