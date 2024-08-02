import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { colFlexStyle, commonContainerWrapper } from "../Common/styles/flex";
import { useAppSelector } from "../../Redux/hooks";
import { permissions } from "../../utils/roles";
import {
  HeaderLeftContent,
  HeaderRightContent,
  StyledHeader,
} from "../Common/styles/header";
import NewUserModal from "./Modals/NewUserModal";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../Common/styles/table";
import { ArrowBack } from "@mui/icons-material";

const UserDetail = () => {
  const navigate = useNavigate();
  const { studyPermissions } = useAppSelector((state) => state.user);
  const { toggleLoader } = useAppSelector((state) => state.administrators);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const { id: studyId, userId } = useParams();
  const [canEdit] = useState(
    studyPermissions.includes(permissions.userManagement)
  );

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let url = `/study/${studyId}/users/${userId}`;
        const res = await http.get(url);
        const userRes = res?.data?.data;
        let newData: any = {};
        newData = {
          firstName: userRes?.user?.firstName || "-",
          lastName: userRes?.user?.lastName || "-",
          email: userRes?.user?.email || "-",
          studyRole: userRes?.user?.studyRole?.role?.label || "-",
          modalData: {
            userId: userRes?.userId,
            email: userRes?.user?.email,
            roleSites: userRes?.user?.siteRoles,
            studyRole: {
              role: {
                id: userRes?.user?.studyRole?.role?.id,
              },
            },
          },
        };
        const tData = userRes?.user?.siteRoles?.map((item: any) => ({
          id: item?.id,
          role: item?.role?.label || "-",
          site: item?.site?.name || "-",
        }));
        setData(newData);
        setTableData(tData);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [studyId, userId, toggleLoader]);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      {loading ? (
        <Stack
          sx={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <>
          <StyledHeader>
            <Box sx={{ ...HeaderLeftContent, gap: 1 }}>
              <IconButton onClick={handleBack} sx={{ color: "text.primary" }}>
                <ArrowBack />
              </IconButton>
              <Typography fontSize={20} fontWeight={600} color="text.primary">
                User Details
              </Typography>
            </Box>

            {canEdit && (
              <Box sx={HeaderRightContent}>
                <Button variant="contained" onClick={openModal}>
                  Edit
                </Button>
              </Box>
            )}
          </StyledHeader>
          <Box sx={{ p: 3, overflow: "auto", height: "calc(100vh - 190px)" }}>
            <Box sx={commonContainerWrapper}>
              <Typography fontSize={20} fontWeight={600} color="text.primary">
                User Details
              </Typography>
              <Box sx={{ ...colFlexStyle, gap: 3, my: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                    <Typography
                      fontSize={16}
                      fontWeight={500}
                      color="text.primary"
                    >
                      First Name
                    </Typography>
                    <Typography
                      fontSize={16}
                      fontWeight={400}
                      color="text.primary"
                    >
                      {data?.firstName}
                    </Typography>
                  </Box>
                  <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                    <Typography
                      fontSize={16}
                      fontWeight={500}
                      color="text.primary"
                    >
                      Last Name
                    </Typography>
                    <Typography
                      fontSize={16}
                      fontWeight={400}
                      color="text.primary"
                    >
                      {data?.lastName}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                  <Typography
                    fontSize={16}
                    fontWeight={500}
                    color="text.primary"
                  >
                    Email
                  </Typography>
                  <Typography
                    fontSize={16}
                    fontWeight={400}
                    color="text.primary"
                  >
                    {data?.email}
                  </Typography>
                </Box>
                <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                  <Typography
                    fontSize={16}
                    fontWeight={500}
                    color="text.primary"
                  >
                    Study Role
                  </Typography>
                  <Typography
                    fontSize={16}
                    fontWeight={400}
                    color="text.primary"
                  >
                    {data?.studyRole}
                  </Typography>
                </Box>
              </Box>

              <Typography fontSize={20} fontWeight={600} color="text.primary">
                Role and Site Details
              </Typography>
              <Box sx={{ width: "40%", mt: 2 }}>
                <Table sx={TableBorderRadiusTopLeftRight}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Role</StyledTableCell>
                      <StyledTableCell>Site</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {tableData?.length > 0 && (
                    <>
                      <TableBody>
                        {tableData?.map((row: any) => (
                          <TableRow key={row?.id}>
                            <StyledTableCell>{row?.role}</StyledTableCell>
                            <StyledTableCell>{row?.site}</StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </>
                  )}
                </Table>
                {tableData.length === 0 && (
                  <NoDataContainer>
                    <Typography variant="body1" color="gray">
                      No Data
                    </Typography>
                  </NoDataContainer>
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}
      {showModal && (
        <NewUserModal
          showModal={showModal}
          closeModal={closeModal}
          data={data?.modalData}
        />
      )}
    </>
  );
};

export default UserDetail;
