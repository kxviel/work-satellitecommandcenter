import { useState, useEffect } from "react";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import {
  HeaderLeftContent,
  HeaderRightContent,
  StyledHeader,
} from "../Common/styles/header";
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
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../Common/styles/table";
import {
  Edit,
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
  Add,
  Delete,
  Close,
} from "@mui/icons-material";

import { formatFormPermissions, permissions } from "../../utils/roles";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../Redux/hooks";
import AddFormPermission from "./Modals/AddFormPermission";

const FormPermissions = () => {
  const { id: studyId } = useParams();

  const [siteRoles, setSiteRoles] = useState([]);
  const [data, setData] = useState<any>({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState("");
  const [toggleLoader, setToggleLoader] = useState(false);

  const { studyPermissions } = useAppSelector((state) => state.user);
  const [canEdit] = useState(
    studyPermissions.includes(permissions.userManagement)
  );

  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const [editPermissions, setEditPermissions] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<any>({});

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleEditPermissions = (row: any) => {
    setSelectedRow(JSON.parse(JSON.stringify(row)));
    setEditPermissions(row.id);
  };

  const handleDeletePermissions = async (row: any) => {
    try {
      setSubmitLoader(row.id);
      const res: AxiosResponse = await http.delete(
        `/roles/form-matrix/${row.id}?studyId=${studyId}`
      );
      toastMessage("success", res.data.message);
      setSubmitLoader("");
      refreshPage();
    } catch (err) {
      setSubmitLoader("");
      errorToastMessage(err as Error);
    }
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const res1: AxiosResponse = await http.get(
          `/roles/matrix?studyId=${studyId}&type=site`
        );
        const res2: AxiosResponse = await http.get(
          `/roles/form-matrix?studyId=${studyId}`
        );
        const rolesData = res1?.data?.data;
        const formData = res2?.data.data;
        const formattedData = formatFormPermissions(rolesData, formData);
        console.log(formattedData);
        setSiteRoles(rolesData);
        setData(formattedData || { headers: [], rows: [] });
        setLoading(false);
      } catch (err) {
        setData({ headers: [], rows: [] });
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchUsersData();
  }, [toggleLoader, studyId, setLoading]);

  const handleCheckboxToggle = (roleId: string) => {
    setSelectedRow((prevData: any) => {
      return { ...prevData, [roleId]: !prevData[roleId] };
    });
  };

  const saveData = async () => {
    try {
      setSubmitLoader(selectedRow.id);
      console.log(selectedRow);
      const { id, name, ...rest } = selectedRow;
      console.log(rest);
      const roleIds = Object.keys(rest)
        .map((key) => {
          if (rest[key]) {
            return key;
          } else {
            return null;
          }
        })
        .filter((k) => !!k);
      let res: AxiosResponse;
      if (roleIds.length === 0) {
        res = await http.delete(`/roles/form-matrix/${id}?studyId=${studyId}`);
      } else {
        res = await http.post(`/roles/form-matrix`, {
          formId: id,
          studyId,
          roleIds,
        });
      }
      toastMessage("success", res?.data?.message);
      setSelectedRow(null);
      setEditPermissions("");
      setSubmitLoader("");
      refreshPage();
    } catch (err) {
      setSubmitLoader("");
      errorToastMessage(err as Error);
    }
  };

  const cancelEdit = () => {
    setSelectedRow(null);
    setEditPermissions("");
  };

  return (
    <>
      <StyledHeader margin={0}>
        <Box sx={{ ...HeaderLeftContent, gap: 1 }}>
          <Typography fontSize={20} fontWeight={600} color="text.primary">
            Form Permissions
          </Typography>
        </Box>
        <Box sx={{ ...HeaderRightContent, gap: 1 }}>
          {submitLoader ? (
            <CircularProgress size={25} />
          ) : editPermissions ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button onClick={saveData} variant="contained">
                Save
              </Button>
              <Button onClick={cancelEdit} variant="outlined">
                Cancel
              </Button>
            </Box>
          ) : null}
          {canEdit && (
            <Button variant="outlined" onClick={openModal} startIcon={<Add />}>
              Add Form
            </Button>
          )}
        </Box>
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
                >
                  Forms
                </StyledTableCell>
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
                          {role?.label}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                  ))}
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            {!loading && data?.rows?.length > 0 && (
              <TableBody>
                {data?.rows?.map((form: any) => (
                  <TableRow key={form.id}>
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
                          title={form?.name}
                        >
                          {form.name}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    {data?.headers?.map((role: any) => (
                      <StyledTableCell
                        key={role.id}
                        sx={{ minWidth: "170px", maxWidth: "190px" }}
                      >
                        {editPermissions === form.id ? (
                          <Checkbox
                            checked={selectedRow?.[role?.id]}
                            icon={<CheckBoxOutlineBlank />}
                            onChange={(e) => handleCheckboxToggle(role?.id)}
                            checkedIcon={<CheckBox />}
                          />
                        ) : (
                          <Box sx={{ display: "flex", ml: 0.5 }}>
                            {form?.[role?.id] ? (
                              <Close sx={{ color: "red" }} />
                            ) : (
                              <Check sx={{ color: "green" }} />
                            )}
                          </Box>
                        )}
                      </StyledTableCell>
                    ))}
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => handleEditPermissions(form)}
                          disabled={!!editPermissions || !!submitLoader}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color={"error"}
                          onClick={() => handleDeletePermissions(form)}
                          disabled={!!editPermissions || !!submitLoader}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Box>
        {!loading && data?.rows?.length === 0 && (
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
        <AddFormPermission
          siteRoles={siteRoles}
          refreshPage={refreshPage}
          showModal={showModal}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default FormPermissions;
