import {
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../../Common/styles/table";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import http from "../../../utils/http";
// import { SortIcon } from "../../Common/assets/Icons";
import { MoreVert } from "@mui/icons-material";
import OptionGroupModal from "../Modals/OptionGroupModal";

type Props = {
  modalContent: string;
  setModalContent: Function;
  canEdit: boolean;
};

const OptionGroup = ({ modalContent, setModalContent, canEdit }: Props) => {
  const { id: studyId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleLoader, setToggleLoader] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<any>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [menuLoader, setMenuLoader] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  //   const [sortOrder, setSortOrder] = useState("");
  //   const [sortColumn, setSortColumn] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/study/${studyId}/option-groups`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;

        const newData = data?.map((item: any) => ({
          id: item?.id,
          name: item?.name || "-",
          numberOfOptions: item?.options ? item?.options.length : "-",
          data: item,
        }));

        setSiteData(newData || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [toggleLoader, studyId]);

  const closeModal = () => {
    setModalContent("");
    setSelectedRow(null);
  };
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };
  //   const handleSort = (column: string) => {
  //     if (column === sortColumn) {
  //       if (sortOrder === "ASC") {
  //         setSortOrder("DESC");
  //       } else {
  //         setSortOrder("");
  //         setSortColumn("");
  //       }
  //     } else {
  //       setSortColumn(column);
  //       setSortOrder("ASC");
  //     }
  //   };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setSelectedRow(row?.data);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const openModal = () => {
    setModalContent("optiongroup");
    setAnchorEl(null);
  };
  const deleteOptionGroup = async () => {
    try {
      setMenuLoader(true);
      const res: AxiosResponse = await http.delete(
        `/study/${studyId}/option-groups/${selectedRow?.id}`
      );
      handleMenuClose();
      toastMessage("success", res.data.message);
      setMenuLoader(false);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setMenuLoader(false);
    }
  };

  return (
    <Box>
      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              Choice Value
              {/* <IconButton onClick={() => handleSort("optionGroup")}>
                <SortIcon />
              </IconButton> */}
            </StyledTableCell>
            <StyledTableCell>
              Number of Choices
              {/* <IconButton onClick={() => handleSort("numberOfOptions")}>
                <SortIcon />
              </IconButton> */}
            </StyledTableCell>
            {canEdit && <StyledTableCell />}
          </TableRow>
        </TableHead>
        {!loading && siteData?.length > 0 && (
          <>
            <TableBody>
              {siteData?.map((row: any) => (
                <TableRow key={row?.id}>
                  <StyledTableCell>{row?.name}</StyledTableCell>
                  <StyledTableCell>{row?.numberOfOptions}</StyledTableCell>
                  {canEdit && (
                    <StyledTableCell align="right">
                      <IconButton onClick={(e) => handleMenuClick(e, row)}>
                        <MoreVert />
                      </IconButton>
                    </StyledTableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
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
      {modalContent === "optiongroup" && (
        <OptionGroupModal
          data={selectedRow}
          showModal={modalContent === "optiongroup"}
          closeModal={closeModal}
          studyId={studyId}
          refreshPage={refreshPage}
        />
      )}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={openModal} disabled={menuLoader}>
          <ListItemText>Edit Choice Value</ListItemText>
        </MenuItem>
        <MenuItem onClick={deleteOptionGroup} disabled={menuLoader}>
          <ListItemText sx={{ color: "#F05252" }}>
            Delete Choice Value
          </ListItemText>
          {menuLoader && (
            <ListItemIcon>
              <CircularProgress size={18} sx={{ ml: 1 }} />
            </ListItemIcon>
          )}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OptionGroup;
