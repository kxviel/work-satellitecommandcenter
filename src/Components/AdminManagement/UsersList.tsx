import { useState, useEffect, useMemo, useCallback } from "react";
import {
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridPagination,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  NoDataContainer,
  pageSize,
  paginationLabel,
  StyledDataGrid,
  TablePaginationStyle,
} from "../Common/styles/table";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import NewUserModal from "./Modals/NewUserModal";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdministratorsList } from "../../Redux/actions/usersAction";
import {
  refreshAdministratorsPage,
  setAdministratorsPage,
} from "../../Redux/reducers/administratorsSlice";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { LockedIcon, UnlockedIcon } from "../Common/assets/Icons";

function CustomPagination(props: any) {
  return (
    <GridPagination
      sx={TablePaginationStyle}
      labelDisplayedRows={paginationLabel}
      {...props}
    />
  );
}

type Props = {
  canEdit: boolean;
};

const UsersList = ({ canEdit }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    loading,
    administratorsData,
    totalAdministrators,
    paginationModel,
    // type,
    searchText,
    sortOrder,
    sortColumn,
    toggleLoader,
  } = useAppSelector((state) => state.administrators);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  const { id } = useParams();
  const [menuLoader, setMenuLoader] = useState(false);
  const openModal = (row: any) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  useEffect(() => {
    dispatch(
      fetchAdministratorsList(
        paginationModel.page,
        sortColumn,
        sortOrder,
        searchText,
        id
      )
    );
  }, [
    dispatch,
    paginationModel,
    sortOrder,
    sortColumn,
    searchText,
    toggleLoader,
    id,
  ]);

  // const handleSort = (order: string, column: string) => {
  //   if (sortColumn === column && sortOrder === order) {
  //     dispatch(setAdministratorsSort({ column: "", order: "" }));
  //   } else {
  //     dispatch(setAdministratorsSort({ column, order }));
  //   }
  // };

  const modifyUser = useCallback(
    async (params: any, action: string) => {
      let body: any = {};
      let url: string = ``;
      try {
        setMenuLoader(true);
        if (action === "lock-unlock") {
          const userId = localStorage.getItem("user-id");
          if (params?.userId === userId) {
            toastMessage("error", "Locking your own account is not allowed.");
            setMenuLoader(false);
            return;
          }
          url = `/study/${id}/users/${params?.userId}/access-status`;
          body = {
            studyAccessStatus:
              params?.studyAccessStatus === "locked" ? "active" : "locked",
          };
        } else if (action === "re-invite") {
          url = `/study/${id}/users/reinvite`;
          body = {
            userId: params?.userId,
          };
        }
        const res: AxiosResponse = await http.post(url, body);
        setMenuLoader(false);
        dispatch(refreshAdministratorsPage());
        toastMessage("success", res.data.message);
      } catch (err) {
        setMenuLoader(false);
        errorToastMessage(err as Error);
      }
    },
    [dispatch, id]
  );

  const columns = useMemo<GridColDef<any>[]>(
    () =>
      administratorsData
        ? [
            {
              field: "firstName",
              headerName: "First Name",
              flex: 1,
              sortable: false,
              renderCell: (params: GridRenderCellParams<any>) => {
                return (
                  <Box
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <Typography fontSize={14} fontWeight={500}>
                      {params?.row?.firstName}
                    </Typography>
                  </Box>
                );
              },
            },
            {
              field: "lastName",
              headerName: "Last Name",
              flex: 1,
              sortable: false,
              renderCell: (params: GridRenderCellParams<any>) => {
                return (
                  <Box
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <Typography fontSize={14} fontWeight={500}>
                      {params?.row?.lastName}
                    </Typography>
                  </Box>
                );
              },
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              sortable: false,
              renderCell: (params: GridRenderCellParams<any>) => (
                <Box textTransform={"capitalize"}>{params?.value}</Box>
              ),
            },
            {
              field: "roles",
              headerName: "Role(s)",
              flex: 1,
              sortable: false,
              renderCell: (params: GridRenderCellParams<any>) => {
                return (
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography>
                      {params?.row?.roleLabels?.length + 1}
                    </Typography>
                  </Box>
                );
              },
            },

            {
              field: "sites",
              headerName: "Site(s)",
              sortable: false,
              flex: 1.5,
              renderCell: (params: GridRenderCellParams<any>) => {
                const maxVisibleSites = 2;
                const visibleSites = params.row?.siteLabels?.slice(
                  0,
                  maxVisibleSites
                );
                const hiddenSitesCount =
                  params.row?.siteLabels?.length - maxVisibleSites;
                return (
                  <Box display={"flex"} gap={1} alignItems={"center"}>
                    {visibleSites.map(
                      (site: any) =>
                        site?.id && (
                          <Chip
                            key={site?.id}
                            label={site?.name}
                            sx={{
                              borderRadius: 1,
                              maxWidth: "10ch",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          />
                        )
                    )}
                    {hiddenSitesCount > 0 && (
                      <Typography>+{hiddenSitesCount}</Typography>
                    )}
                  </Box>
                );
              },
            },
            {
              field: "email",
              headerName: "Email Address",
              flex: 2,
              sortable: false,
            },
            {
              field: "studyAccessStatus",
              headerName: "Lock",
              renderHeader: () => (
                <Box>
                  <LockedIcon />
                </Box>
              ),
              maxWidth: 50,
              sortable: false,
              renderCell: (params: GridRenderCellParams<any>) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {params?.row?.studyAccessStatus === "locked" ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LockedIcon />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <UnlockedIcon />
                      </Box>
                    )}
                  </Box>
                );
              },
            },
            {
              field: "id",
              type: "actions",
              flex: 1,
              headerAlign: "right",
              align: "right",
              getActions: (params: any) => {
                if (!canEdit) {
                  return [];
                }

                return [
                  <GridActionsCellItem
                    showInMenu
                    label="Edit"
                    key="edit"
                    onClick={() => openModal(params?.row)}
                    sx={{
                      "& .MuiListItemIcon-root": {
                        minWidth: 0,
                      },
                    }}
                  />,
                  params?.row?.status === "accepted" ? (
                    <GridActionsCellItem
                      showInMenu
                      label={
                        params?.row?.studyAccessStatus === "locked"
                          ? "Unlock"
                          : "Lock"
                      }
                      key="lock"
                      disabled={menuLoader}
                      onClick={() => modifyUser(params?.row, "lock-unlock")}
                      sx={{
                        "& .MuiListItemIcon-root": {
                          minWidth: 0,
                        },
                      }}
                    />
                  ) : (
                    <GridActionsCellItem
                      showInMenu
                      label="Reinvite"
                      key="reinvite"
                      disabled={menuLoader}
                      onClick={() => modifyUser(params?.row, "re-invite")}
                      sx={{
                        "& .MuiListItemIcon-root": {
                          minWidth: 0,
                        },
                      }}
                      icon={
                        menuLoader ? (
                          <CircularProgress size={18} sx={{ ml: 1 }} />
                        ) : (
                          <></>
                        )
                      }
                    />
                  ),
                ];
              },
            },
          ]
        : [],
    [administratorsData, menuLoader, modifyUser, canEdit]
  );
  // const SortLabel = ({ column }: { column: string }) => {
  //   return (
  //     <>
  //       <StyledSortLabel
  //         active={column === sortColumn && sortOrder === "asc"}
  //         direction="asc"
  //         hideSortIcon={false}
  //         onClick={() => handleSort("asc", column)}
  //       />
  //       <StyledSortLabel
  //         active={column === sortColumn && sortOrder === "desc"}
  //         direction="desc"
  //         hideSortIcon={false}
  //         onClick={() => handleSort("desc", column)}
  //       />
  //     </>
  //   );
  // };

  const handleCellClick = (params: GridCellParams) => {
    const { field, row } = params;
    if (field === "firstName" || field === "lastName") {
      navigate(`/studies/${id}/user-management/users/${row?.userId}`);
    }
  };

  return (
    <>
      <StyledDataGrid
        rows={loading ? [] : administratorsData}
        loading={loading}
        slots={{
          loadingOverlay: () => <LinearProgress />,
          pagination: CustomPagination,
          noRowsOverlay: () => (
            <NoDataContainer>
              <Typography variant="body1" color="gray">
                No Data
              </Typography>
            </NoDataContainer>
          ),
        }}
        hideFooter={totalAdministrators < pageSize}
        columns={columns}
        onCellClick={handleCellClick}
        keepNonExistentRowsSelected
        disableRowSelectionOnClick
        // checkboxSelection={true}
        // onRowSelectionModelChange={(newRowSelectionModel: any) => {
        //   dispatch(setSelectedRows(newRowSelectionModel));
        // }}
        // rowSelectionModel={selectedRows}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) =>
          dispatch(setAdministratorsPage(model))
        }
        pageSizeOptions={[pageSize]}
        rowCount={totalAdministrators}
        disableColumnMenu
        autoHeight
        columnHeaderHeight={52}
        rowHeight={65}
      />
      {showModal && (
        <NewUserModal
          showModal={showModal}
          closeModal={closeModal}
          data={selectedRow}
        />
      )}
    </>
  );
};

export default UsersList;
