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
  Checkbox,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
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
import { CheckCircle, CircleOutlined, Edit } from "@mui/icons-material";
import { StudySettingsIcon } from "../../Common/assets/Sidebar";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddSiteModal from "../AddSiteModal";
import DeleteConfirmModal from "../../Common/UI/DeleteConfirm";
import { setStateToggle } from "../../../Redux/reducers/userSlice";
import { useAppDispatch } from "../../../Redux/hooks";

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  canEdit: boolean;
};

const Sites = ({ showModal, setShowModal, canEdit }: Props) => {
  const { id: studyId } = useParams();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  // const [toggleLoader, setToggleLoader] = useState(false);
  const [siteData, setSiteData] = useState<any>([]);
  const [siteDataCount, setSiteDataCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [menuLoader, setMenuLoader] = useState<boolean>(false);
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") ?? "0") || 0
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        let url = `/study/${studyId}/sites`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;

        const newData = data?.map((item: any) => ({
          id: item?.id,
          siteName: item?.name,
          abbreviation: item?.abbreviation,
          isMainSite: item?.isMainSite,
          code: item?.code,
          countryId: item?.countryId,
          country: item?.country?.label,
        }));

        setSiteData(newData || []);
        setSiteDataCount(data?.length || 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchSiteData();
  }, [page, studyId]);

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
  const openModal = () => {
    setShowModal(true);
    setAnchorEl(null);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };
  // const refreshPage = () => {
  //   setToggleLoader((prev) => !prev);
  // };
  const closeDeleteConfirmModal = () => {
    setShowDeleteModal(false);
    setSelectedRow(null);
  };
  const deleteSite = async () => {
    if (selectedRow?.isMainSite) {
      toastMessage("error", "Main site cannot be deleted");
      return;
    }
    try {
      setMenuLoader(true);
      const res: AxiosResponse = await http.delete(
        `/study/${studyId}/sites/${selectedRow?.id}`
      );
      closeDeleteConfirmModal();
      toastMessage("success", res.data.message);
      setMenuLoader(false);
      // refreshPage();
      dispatch(setStateToggle());
    } catch (err) {
      errorToastMessage(err as Error);
      setMenuLoader(false);
    }
  };

  const markAsMain = async (row: any) => {
    if (row?.isMainSite) return;
    try {
      setMenuLoader(true);
      const res: AxiosResponse = await http.post(
        `/study/${studyId}/sites/${row?.id}/mark-as-main`
      );
      toastMessage("success", res.data.message);
      setMenuLoader(false);
      // refreshPage();
      dispatch(setStateToggle());
    } catch (err) {
      errorToastMessage(err as Error);
      setMenuLoader(false);
    }
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDeleteClick = (row: any) => {
    if (row?.isMainSite) {
      toastMessage("error", "Main site cannot be deleted");
      return;
    }
    setDeleteConfirmation({
      title: `Delete ${row?.siteName}?`,
      description: `Are you sure you want to delete ${row?.siteName}?`,
    });
    setSelectedRow(row);
    setShowDeleteModal(true);
  };

  return (
    <Box>
      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Site Name</StyledTableCell>
            <StyledTableCell>Code</StyledTableCell>
            <StyledTableCell>Abbreviation</StyledTableCell>
            <StyledTableCell>Country</StyledTableCell>
            <StyledTableCell>Main Site</StyledTableCell>
            {canEdit && <StyledTableCell>Edit Site</StyledTableCell>}
            {canEdit && <StyledTableCell>Actions</StyledTableCell>}
          </TableRow>
        </TableHead>
        {!loading && siteData?.length > 0 && (
          <>
            <TableBody>
              {siteData?.map((row: any) => (
                <TableRow key={row?.id}>
                  <StyledTableCell>{row?.siteName || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.code || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.abbreviation || "-"}</StyledTableCell>
                  <StyledTableCell>{row?.country || "-"}</StyledTableCell>
                  <StyledTableCell>
                    <Checkbox
                      icon={<CircleOutlined htmlColor={"#9CA3AF"} />}
                      checkedIcon={<CheckCircle />}
                      checked={row?.isMainSite}
                      onChange={() => markAsMain(row)}
                      disabled={!canEdit}
                    />
                  </StyledTableCell>

                  {canEdit && (
                    <StyledTableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, row)}>
                        <StudySettingsIcon />
                      </IconButton>
                    </StyledTableCell>
                  )}
                  {canEdit && (
                    <StyledTableCell>
                      <IconButton onClick={() => handleDeleteClick(row)}>
                        <CloseRoundedIcon sx={{ color: "text.secondary" }} />
                      </IconButton>
                    </StyledTableCell>
                  )}
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
        <MenuItem onClick={openModal} disabled={menuLoader}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Site</ListItemText>
        </MenuItem>
      </Menu>

      {showModal && (
        <AddSiteModal
          showModal={showModal}
          closeModal={closeModal}
          data={selectedRow}
          // refreshPage={refreshPage}
          studyId={studyId}
        />
      )}
      <DeleteConfirmModal
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
        onOk={deleteSite}
        show={showDeleteModal}
        onClose={closeDeleteConfirmModal}
      />
    </Box>
  );
};

export default Sites;
