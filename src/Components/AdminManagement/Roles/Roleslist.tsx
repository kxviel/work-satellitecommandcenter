import { useState, useEffect } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import {
  HeaderLeftContent,
  HeaderRightContent,
  StyledHeader,
} from "../../Common/styles/header";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../../Common/styles/table";
import {
  Edit,
  InfoOutlined,
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { formatRolesAndPermissions, permissions } from "../../../utils/roles";
import AddRoleModal from "./Modals/AddRoleModal";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { setStateToggle } from "../../../Redux/reducers/userSlice";

const RolesList = () => {
  const [toggleLoader, setToggleLoader] = useState(false);
  const { id, type } = useParams();
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };
  const [editPermissions, setEditPermissions] = useState(false);
  const [data, setData] = useState<any>({ headers: [], rows: [] });
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const { studyPermissions } = useAppSelector((state) => state.user);
  const [canEdit] = useState(
    studyPermissions.includes(permissions.userManagement)
  );
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [showModal, setShowModal] = useState(false);

  const openModal = (row: any) => {
    setSelectedRow({ id: row.id, label: row.label });
    setShowModal(true);
  };

  const handleEditPermissions = () => {
    refreshPage();
    setEditPermissions(true);
  };
  const handleCloseEditPermissions = () => {
    setEditPermissions(false);
    refreshPage();
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const res1: AxiosResponse = await http.get(
          `/roles/matrix?studyId=${id}&type=${type}`
        );
        const res2: AxiosResponse = await http.get(
          `/permission?studyId=${id}&type=${type}`
        );
        const rolesData = res1?.data?.data;
        const permissionsData = res2?.data?.data;

        const formattedData = formatRolesAndPermissions(
          rolesData,
          permissionsData
        );
        setData(formattedData || { headers: [], rows: [] });
        setLoading(false);
      } catch (err) {
        setData({ headers: [], rows: [] });
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchUsersData();
  }, [toggleLoader, id, setLoading, type]);

  const handleCheckboxToggle = (permissionId: string, roleId: string) => {
    setData((prevData: any) => {
      const updatedRows = prevData.rows.map((row: any) => {
        if (row.id === permissionId) {
          return {
            ...row,
            [roleId]: !row[roleId],
          };
        }
        return row;
      });
      return { ...prevData, rows: updatedRows };
    });
  };

  const saveData = async () => {
    try {
      setSubmitLoader(true);

      const roles = data?.headers?.map((role: any) => {
        const permissionsObj: any = {};
        data?.rows?.forEach((row: any) => {
          permissionsObj[row.id] = row[role.id] || false;
        });
        return {
          roleId: role.id,
          permissions: permissionsObj,
        };
      });

      const body = {
        studyId: id,
        roles: roles,
        type: type,
      };

      let res: AxiosResponse;
      res = await http.put(`/roles/matrix`, body);
      toastMessage("success", res?.data?.messages);
      setSubmitLoader(false);
      handleCloseEditPermissions();
      dispatch(setStateToggle());
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };
  return (
    <>
      <StyledHeader margin={0}>
        {/* <Box sx={HeaderLeftContent}> */}
        <Box sx={{ ...HeaderLeftContent, gap: 1 }}>
          <Typography fontSize={20} fontWeight={600} color="text.primary">
            {editPermissions
              ? "Edit Permission"
              : type === "site"
              ? "Site Rights"
              : "Study Rights"}
          </Typography>
        </Box>

        {editPermissions ? (
          !submitLoader ? (
            <Box sx={HeaderRightContent}>
              <Button variant="outlined" onClick={handleCloseEditPermissions}>
                Cancel
              </Button>
              <Button variant="contained" onClick={saveData}>
                Save
              </Button>
            </Box>
          ) : (
            <CircularProgress size={25} />
          )
        ) : (
          canEdit && (
            <Box sx={HeaderRightContent}>
              <Button
                variant="contained"
                onClick={openModal}
                startIcon={<AddIcon />}
              >
                Add Role
              </Button>
              <Button
                variant="outlined"
                onClick={handleEditPermissions}
                startIcon={<EditIcon />}
              >
                Edit Permissions
              </Button>
            </Box>
          )
        )}
      </StyledHeader>
      <Box sx={{ height: "calc(100vh - 144px)", overflow: "auto", p: 2.5 }}>
        <Box sx={{ overflowX: "scroll" }}>
          <Table sx={TableBorderRadiusTopLeftRight}>
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{
                    minWidth: 230,
                    maxWidth: 250,
                    position: "sticky",
                    zIndex: 10,
                    left: 0,
                  }}
                ></StyledTableCell>
                {!loading &&
                  data?.headers?.length > 0 &&
                  data?.headers?.map((role: any) => (
                    <StyledTableCell key={role.id}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          maxWidth: "120px",
                        }}
                      >
                        <Typography
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                          fontWeight={"medium"}
                          title={role?.label}
                        >
                          {role?.label}{" "}
                        </Typography>
                        <Box mb={0.5}>
                          {!editPermissions && canEdit && (
                            <IconButton
                              size="small"
                              onClick={() => openModal(role)}
                            >
                              <Edit />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </StyledTableCell>
                  ))}
              </TableRow>
            </TableHead>
            {!loading && data?.rows?.length > 0 && (
              <TableBody>
                {data?.rows?.map((permission: any) => (
                  <TableRow key={permission.id}>
                    <StyledTableCell
                      sx={{ position: "sticky", zIndex: 10, left: 0 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          maxWidth: "160px",
                        }}
                      >
                        <Typography
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                          fontWeight={"medium"}
                          title={permission?.label}
                        >
                          {permission.label}
                        </Typography>
                        <Tooltip title={permission?.description} arrow>
                          <IconButton size="small" sx={{ cursor: "default" }}>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </StyledTableCell>
                    {data?.headers?.map((role: any) => (
                      <StyledTableCell
                        key={role.id}
                        sx={{ minWidth: "170px", maxWidth: "190px" }}
                      >
                        {!editPermissions ? (
                          permission?.[role?.id] ? (
                            <Box sx={{ display: "flex", ml: 0.5 }}>
                              <Check sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                            </Box>
                          ) : (
                            <Typography>—</Typography>
                          )
                        ) : (
                          <Checkbox
                            checked={permission?.[role?.id]}
                            icon={<CheckBoxOutlineBlank />}
                            onChange={() =>
                              handleCheckboxToggle(permission?.id, role?.id)
                            }
                            checkedIcon={<CheckBox />}
                          />
                        )}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Box>
        {!loading && data?.row?.length === 0 && (
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
      </Box>
      {showModal && (
        <AddRoleModal
          refreshPage={refreshPage}
          showModal={showModal}
          closeModal={closeModal}
          data={selectedRow}
        />
      )}
    </>
  );
};

export default RolesList;
