import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  // CircularProgress,
  // Menu,
  // MenuItem,
  // ListItemIcon,
  // ListItemText,
} from "@mui/material";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../Common/styles/table";
// import { Edit, MoreVert } from "@mui/icons-material";
import { AxiosResponse } from "axios";
import { LiveStatusTag } from "../Common/UI/StatusTag";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import AddNewStudyModal from "./AddNewStudyModal";
import { Delete, MoreVert, UnfoldMore } from "@mui/icons-material";
import ConfirmDeleteStudyModal from "./ConfirmDeleteStudyModal";

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
};

const StudiesList = ({ searchText, showModal, setShowModal }: Props) => {
  const [loading, setLoading] = useState(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [studyData, setStudyData] = useState<any>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  // const [menuLoader, setMenuLoader] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        setLoading(true);
        let url = `/study?`;
        if (searchText) {
          url += `&query=${searchText}`;
        }
        if (sortOrder && sortColumn) {
          url += `&sortDirection=${sortOrder}&sortKey=${sortColumn}`;
        }

        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;
        const newData = data?.map((item: any) => ({
          id: item?.id,
          studyName: item?.name || "-",
          status: item?.status || "-",
          date: item?.createdAt
            ? DateTime.fromISO(item?.createdAt).toFormat("dd/MM/yy")
            : "-",
        }));

        setStudyData(newData || []);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchStudyData();
  }, [searchText, toggleLoader, sortOrder, sortColumn]);

  const deleteStudy = async () => {
    setOpenDeleteModal(true);
    setAnchorEl(null);
  };
  const closeDeleteModal = async () => {
    setOpenDeleteModal(false);
    handleMenuClose();
  };
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCellClick = (id: string) => {
    navigate(`/studies/${id}/study-designer`);
  };
  // const openModal = () => {
  //   setShowModal(true);
  //   setAnchorEl(null);
  // };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      if (sortOrder === "ASC") {
        setSortOrder("DESC");
      } else {
        setSortOrder("");
        setSortColumn("");
      }
    } else {
      setSortColumn(column);
      setSortOrder("ASC");
    }
  };

  return (
    <Box>
      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Study Name
                <IconButton onClick={() => handleSort("name")}>
                  <UnfoldMore sx={{ color: "text.secondary" }} />
                </IconButton>
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Status
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Creation Date
                <IconButton onClick={() => handleSort("createdAt")}>
                  <UnfoldMore sx={{ color: "text.secondary" }} />
                </IconButton>
              </Box>
            </StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        {!loading && studyData?.length > 0 && (
          <TableBody>
            {studyData?.map((row: any) => (
              <TableRow key={row?.id}>
                <StyledTableCell
                  onClick={() => handleCellClick(row?.id)}
                  sx={{ cursor: "pointer" }}
                >
                  {row?.studyName}
                </StyledTableCell>
                <StyledTableCell>
                  <LiveStatusTag
                    status={row?.status === "live" ? "Live" : "Not Live"}
                  />
                </StyledTableCell>
                <StyledTableCell>{row?.date}</StyledTableCell>
                <StyledTableCell align="right">
                  {row?.status === "not_live" && (
                    <IconButton onClick={(e) => handleMenuClick(e, row)}>
                      <MoreVert />
                    </IconButton>
                  )}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {!loading && studyData.length === 0 && (
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
        <MenuItem onClick={deleteStudy}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
          {/* {menuLoader && (
            <ListItemIcon>
              <CircularProgress size={18} sx={{ ml: 1 }} />
            </ListItemIcon>
          )} */}
        </MenuItem>
      </Menu>

      {showModal && (
        <AddNewStudyModal
          showModal={showModal}
          closeModal={closeModal}
          data={selectedRow}
          refreshPage={refreshPage}
        />
      )}
      {openDeleteModal && (
        <ConfirmDeleteStudyModal
          openModal={openDeleteModal}
          selectedRow={selectedRow}
          closeModal={closeDeleteModal}
          refreshPage={refreshPage}
        />
      )}
    </Box>
  );
};

export default StudiesList;
