import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import {
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridPagination,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import { useNavigate, useParams } from "react-router-dom";
import {
  NoDataContainer,
  StyledDataGrid,
  TablePaginationStyle,
  pageSize,
  paginationLabel,
} from "../Common/styles/table";
import { LockedIcon, UnlockedIcon } from "../Common/assets/Icons";
import ParticipantArchiveModal from "./Modals/ParticipantArchiveModal";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { UnfoldMore } from "@mui/icons-material";
import ParticipantFilterModal from "./Modals/ParticipantFilterModal";
import { fetchParticipantsList } from "../../Redux/actions/participantsAction";
import {
  setParticipantSort,
  setParticipantsPage,
  setParticipantToggle,
} from "../../Redux/reducers/participantsSlice";
import ProgressDetailModal from "./Modals/ProgressDetailModal";

function CustomPagination(props: any) {
  return (
    <GridPagination
      sx={TablePaginationStyle}
      labelDisplayedRows={paginationLabel}
      {...props}
    />
  );
}
export const getColorByStatus = (status: string) => {
  if (status === "completed") {
    return "#70AE71";
  } else if (status === "inprogress") {
    return "#F49D4C";
  } else if (status === "not_started") {
    return "#9CA3AF";
  } else {
    return "#9CA3AF";
  }
};

type Props = {
  type: string;
};

export const permissionAccess = (
  siteId: string,
  permission: string,
  sitePermissions: any
) => {
  if (sitePermissions?.[siteId]?.permissions?.includes(permission)) {
    return true;
  }
  return false;
};
const RecordsList = ({ type }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const { sitePermissions } = useAppSelector((state) => state.user);
  const [selectedRecord, setSelectedRecord] = useState<string>("");
  const [lockLoader, setLockLoader] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [progressData, setProgressData] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  const { menuLabels } = useAppSelector((state) => state.study);

  const {
    loading,
    participantsData,
    totalParticipants,
    paginationModel,
    toggleLoader,
    sortColumn,
    sortOrder,
    siteIds,
    status,
    isLocked,
    columns,
  } = useAppSelector((state) => state.participants);

  useEffect(() => {
    dispatch(
      fetchParticipantsList(
        paginationModel.page,
        sortOrder,
        sortColumn,
        siteIds,
        status,
        isLocked,
        id
      )
    );
  }, [
    type,
    toggleLoader,
    paginationModel,
    id,
    sitePermissions,
    sortOrder,
    sortColumn,
    siteIds,
    status,
    isLocked,
    dispatch,
  ]);

  const handleActionClick = useCallback(
    async (params: GridCellParams, action: string) => {
      try {
        let url: string = ``;
        setLockLoader(true);
        if (action === "lockUnlock") {
          url = `/participants/${params?.row?.id}/${
            params?.row?.isLocked ? "unlock" : "lock"
          }?studyId=${id}`;
        } else if (action === "unarchive") {
          url = `participants/${params?.row?.id}/unarchive`;
        }
        let res: AxiosResponse = await http.post(
          url,
          action === "unarchive" ? { studyId: id } : undefined
        );
        setLockLoader(false);
        toastMessage("success", res?.data?.message);
        dispatch(setParticipantToggle());
      } catch (err) {
        setLockLoader(false);
        errorToastMessage(err as Error);
      }
    },
    [id, dispatch]
  );

  const archiveClick = (params: GridCellParams) => {
    setSelectedRecord(params?.row?.id);
    setShowArchive(true);
  };
  const closeArchiveModal = () => {
    setShowArchive(false);
    setSelectedRecord("");
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  const closeFilterModal = () => {
    setShowFilterModal(false);
  };
  const handleProgressCellClick = (data: any) => {
    setShowProgressModal(true);
    setProgressData(data);
  };
  const closeProgressModal = () => {
    setShowProgressModal(false);
  };
  const gridColumns = useMemo<GridColDef<any>[]>(() => {
    const handleSort = (column: string) => {
      if (column === sortColumn) {
        if (sortOrder === "ASC") {
          dispatch(setParticipantSort({ column: column, order: "DESC" }));
        } else {
          dispatch(setParticipantSort({ column: "", order: "" }));
        }
      } else {
        dispatch(setParticipantSort({ column: column, order: "ASC" }));
      }
    };
    return participantsData
      ? [
          {
            field: "participantId",
            headerName: "Participant ID",
            flex: 1,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any>) => {
              return (
                <Box
                  sx={{
                    cursor: params?.row?.isArchived ? "default" : "pointer",
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    {params?.row?.participantId}
                  </Typography>
                </Box>
              );
            },
          },
          {
            field: "site",
            headerName: "Site",
            flex: 1,
            sortable: false,
          },
          {
            field: "randomization",
            headerName: "Randomization Group",
            flex: 1,
            sortable: false,
          },
          ...columns.map((item) => {
            return {
              field: item?.varname,
              headerName: item?.label,
              flex: 1,
              sortable: false,
              renderCell: (params: GridRenderCellParams<any>) => {
                const value = params?.row?.[item.varname];
                return (
                  <Typography fontSize={14} fontWeight={500}>
                    {value ?? "-"}
                  </Typography>
                );
              },
            };
          }),

          {
            field: "progress",
            headerName: (menuLabels.visit || "Visit") + " Progress",
            flex: 1,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any>) => {
              const progressData = params?.row?.progress;
              return (
                <Box
                  sx={{ display: "flex", gap: 0.5, cursor: "pointer" }}
                  onClick={() => handleProgressCellClick(progressData)}
                >
                  {progressData?.map((item: any) => (
                    <Box
                      key={item?.id}
                      sx={{
                        height: "26px",
                        width: "8px",
                        borderRadius: "12px",
                        bgcolor: getColorByStatus(item?.status),
                      }}
                    ></Box>
                  ))}
                </Box>
              );
            },
          },
          {
            field: "createdOn",
            headerName: "Created On",
            flex: 1,
            sortable: false,
            renderHeader: () => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography fontSize={14} fontWeight={600}>
                  Created On
                </Typography>
                <IconButton onClick={() => handleSort("createdAt")}>
                  <UnfoldMore color={"primary"} />
                </IconButton>
              </Box>
            ),
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any>) => (
              <Typography textTransform={"capitalize"} fontWeight={500}>
                {params.row.status}
              </Typography>
            ),
          },
          {
            field: "lock",
            headerName: "Lock",
            maxWidth: 50,
            sortable: false,
            renderHeader: () => (
              <Box display={"flex"} ml={0.5}>
                <LockedIcon />
              </Box>
            ),
            renderCell: (params: GridRenderCellParams<any>) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() => handleActionClick(params, "lockUnlock")}
                    disabled={
                      lockLoader ||
                      params?.row?.isArchived ||
                      !params?.row?.canLock
                    }
                  >
                    {params?.row?.isLocked ? (
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
                  </IconButton>
                </Box>
              );
            },
          },
          {
            field: "id",
            type: "actions",
            headerAlign: "right",
            align: "right",
            renderHeader: () => (
              <IconButton onClick={openFilterModal}>
                <FilterAltIcon
                  color={
                    siteIds.length > 0 || status || isLocked
                      ? "primary"
                      : "disabled"
                  }
                />
              </IconButton>
            ),
            getActions: (params: any) => [
              <GridActionsCellItem
                showInMenu
                key="archive"
                label={params?.row?.isArchived ? "Un-archive" : "Archive"}
                onClick={() =>
                  params?.row?.isArchived
                    ? handleActionClick(params, "unarchive")
                    : archiveClick(params)
                }
                disabled={lockLoader || !params?.row?.canArchive}
                sx={{
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                  },
                }}
              />,
              <GridActionsCellItem
                showInMenu
                key="lock"
                label={params?.row?.isLocked ? "Unlock" : "Lock"}
                onClick={() => handleActionClick(params, "lockUnlock")}
                disabled={
                  params?.row?.isArchived || !params?.row?.canLock || lockLoader
                }
                sx={{
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                  },
                }}
              />,
            ],
          },
        ]
      : [];
  }, [
    participantsData,
    handleActionClick,
    lockLoader,
    columns,
    siteIds,
    status,
    isLocked,
    dispatch,
    sortOrder,
    sortColumn,
    menuLabels,
  ]);

  const handleCellClick = (params: GridCellParams) => {
    const { field, row } = params;
    if (field === "participantId" && !params?.row?.isArchived) {
      navigate(
        `/studies/${id}/responses/${row?.id}?participant=${row.participantId}`
      );
    }
  };

  return (
    <>
      <StyledDataGrid
        rows={loading ? [] : participantsData}
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
        onCellClick={handleCellClick}
        hideFooter={totalParticipants < pageSize}
        columns={gridColumns}
        keepNonExistentRowsSelected
        disableRowSelectionOnClick
        // checkboxSelection
        // onRowSelectionModelChange={(newRowSelectionModel: any) => {
        //   dispatch(setSelectedRows(newRowSelectionModel));
        // }}
        // rowSelectionModel={selectedRows}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) =>
          dispatch(setParticipantsPage(model))
        }
        pageSizeOptions={[pageSize]}
        rowCount={totalParticipants}
        disableColumnMenu
        autoHeight
        columnHeaderHeight={52}
        rowHeight={65}
      />
      {showArchive && (
        <ParticipantArchiveModal
          openModal={showArchive}
          closeModal={closeArchiveModal}
          participantId={selectedRecord}
        />
      )}
      {showFilterModal && (
        <ParticipantFilterModal
          showModal={showFilterModal}
          closeModal={closeFilterModal}
          studyId={id}
        />
      )}
      {showProgressModal && (
        <ProgressDetailModal
          showModal={showProgressModal}
          closeModal={closeProgressModal}
          data={progressData}
        />
      )}
    </>
  );
};

export default RecordsList;
