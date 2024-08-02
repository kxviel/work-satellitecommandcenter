import {
  Box,
  Collapse,
  // IconButton,
  Typography,
} from "@mui/material";
import { NavLink, useMatch, useNavigate, useParams } from "react-router-dom";
import {
  AuditTrailIcon,
  AdminIcon,
  // AdminIcon,
  Logo,
  //   ParticipantIcon,
  // MessagesIcon,
  // HealthIcon,
  // ContentIcon,
  //   DashboardIcon,
  // ExerciseIcon,
  // MedicationIcon,
  // AppointmentsIcon,
  // QuestionIcon,
  // StudiesIcon,
  StudyBuilderIcon,
  // StudySettingsIcon,
  ParticipantIcon,
  QueryIcon,
  DashboardIcon,
  MahaloIcon,
  StudySettingsIcon,
} from "../Common/assets/Sidebar";
import {
  ArrowBack,
  // ChevronLeft,
  // ChevronRight,
  // ExpandLess,
  // ExpandMore,
} from "@mui/icons-material";
// import http from "../../utils/http";
// import { resetState } from "../../Redux/actions/resetAction";
import {
  // useAppDispatch,
  useAppSelector,
} from "../../Redux/hooks";
// import { setCollapsed } from "../../Redux/reducers/appSlice";
import { useState } from "react";
import { permissions } from "../../utils/roles";
import { ExportIcon } from "../Common/assets/Icons";
import VersionWrapper from "../Common/UI/VersionWrapper";

const StudySidebar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collapsed } = useAppSelector((state) => state.app);
  // const dispatch = useAppDispatch();
  // const toggleCollapse = () => {
  //   dispatch(setCollapsed());
  // };
  const { studyPermissions } = useAppSelector((state) => state.user);
  const matchFunctions: {
    users: any;
    siteRights: any;
    studyRights: any;
    formPermissions: any;
    studySettings: any;
    studyTheme: any;
    userDetails: any;
    participantsList: any;
    participantResponse: any;
    participantDetails: any;
  } = {
    users: useMatch("/studies/:id/user-management/users"),
    userDetails: useMatch("/studies/:id/user-management/users/:userId"),
    participantsList: useMatch("/studies/:id/records"),
    participantResponse: useMatch("/studies/:id/responses/:participantId"),
    participantDetails: useMatch(
      "/studies/:id/responses/:participantId/details"
    ),
    siteRights: useMatch(
      "/studies/:id/user-management/roles-and-permissions/site"
    ),
    studyRights: useMatch(
      "/studies/:id/user-management/roles-and-permissions/study"
    ),
    formPermissions: useMatch("studies/:id/user-management/forms"),
    studySettings: useMatch("/studies/:id/study-settings"),
    studyTheme: useMatch("/studies/:id/study-theme"),
  };
  const rbac = {
    participants: studyPermissions.includes(permissions.viewParticipant),
    queries: studyPermissions.includes(permissions.viewParticipant),
    usersManagement: studyPermissions.includes(permissions.userManagement),
    auditTrail: studyPermissions.includes(permissions.auditLogs),
    studySettings: studyPermissions.includes(permissions.studySettings),
    export: studyPermissions.includes(permissions.export),
  };

  const [userMgmtToggle, setUserMgmtToggle] = useState(false);
  const [settingsToggle, setSettingsToggle] = useState(false);
  const navigateToStudies = () => {
    navigate("/app/studies");
  };
  function userManageMentToggle() {
    if (collapsed) {
      navigate(`/studies/${id}/user-management/users`);
      setUserMgmtToggle(true);
    } else {
      setUserMgmtToggle((prev: boolean) => !prev);
    }
  }
  function studySettingsToggle() {
    if (collapsed) {
      navigate(`/studies/${id}/study-settings`);
      setSettingsToggle(true);
    } else {
      setSettingsToggle((prev: boolean) => !prev);
    }
  }
  return (
    <Box
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      sx={{
        "& .sider-menu": {
          color: "text.secondary",
        },
        "& .active.sider-menu": {
          backgroundColor: "secondary.main",
        },
        "& .user-management-menu": {
          color: "text.secondary",
        },
        "& .active.user-management-menu": {
          color: (theme) => theme.palette.primary.main,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 2,
            marginBlock: "10px",
          }}
        >
          {!collapsed ? <Logo /> : <MahaloIcon />}
        </Box>
        <Box className="sider-menu" sx={{ mb: 2 }} onClick={navigateToStudies}>
          <ArrowBack />
          {!collapsed && (
            <Typography variant="subtitle1">Back to studies</Typography>
          )}
        </Box>
        <NavLink
          to={`/studies/${id}/dashboard`}
          title="Dashboard"
          className={({ isActive }) =>
            isActive ? "sider-menu active" : "sider-menu"
          }
        >
          <DashboardIcon />
          {!collapsed && <Typography variant="subtitle1">Dashboard</Typography>}
        </NavLink>
        <NavLink
          title="Study Designer"
          to={`/studies/${id}/study-designer`}
          className={({ isActive }) =>
            isActive ? "sider-menu active" : "sider-menu"
          }
        >
          <StudyBuilderIcon />
          {!collapsed && (
            <Typography variant="subtitle1">Study Designer</Typography>
          )}
        </NavLink>
        {rbac.participants && (
          <NavLink
            title="Participants"
            to={`/studies/${id}/records`}
            className={
              matchFunctions.participantsList ||
              matchFunctions.participantResponse ||
              matchFunctions.participantDetails
                ? "sider-menu active"
                : "sider-menu"
            }
          >
            <ParticipantIcon />
            {!collapsed && (
              <Typography variant="subtitle1">Participants</Typography>
            )}
          </NavLink>
        )}
        {rbac.usersManagement && (
          <Box
            className={
              matchFunctions.siteRights ||
              matchFunctions.studyRights ||
              matchFunctions.users ||
              matchFunctions.userDetails ||
              matchFunctions.formPermissions
                ? "sider-menu active"
                : "sider-menu"
            }
            onClick={userManageMentToggle}
          >
            <AdminIcon />
            {!collapsed && (
              <Box display={"flex"} maxWidth={"125px"}>
                <Typography
                  variant="subtitle1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                  title="User Management"
                >
                  User Management
                </Typography>
                {/* {!userMgmtToggle ? <ExpandMore /> : <ExpandLess />} */}
              </Box>
            )}
          </Box>
        )}
        {!collapsed && (
          <Collapse
            in={userMgmtToggle && rbac.usersManagement}
            timeout={"auto"}
            unmountOnExit
            sx={{ p: "8px 24px" }}
          >
            <NavLink
              title="Users"
              to={`/studies/${id}/user-management/users`}
              className={({ isActive }) =>
                isActive
                  ? "user-management-menu active"
                  : "user-management-menu"
              }
            >
              {/* <AdminIcon /> */}
              {!collapsed && (
                <Typography
                  variant="body1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  Users
                </Typography>
              )}
            </NavLink>
            <NavLink
              title="Site Rights"
              to={`/studies/${id}/user-management/roles-and-permissions/site`}
              className={({ isActive }) =>
                isActive
                  ? "user-management-menu active"
                  : "user-management-menu"
              }
            >
              {/* <AdminIcon /> */}
              {!collapsed && (
                <Typography
                  variant="body1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  Site Rights
                </Typography>
              )}
            </NavLink>
            <NavLink
              title="Study Rights"
              to={`/studies/${id}/user-management/roles-and-permissions/study`}
              className={({ isActive }) =>
                isActive
                  ? "user-management-menu active"
                  : "user-management-menu"
              }
            >
              {/* <AdminIcon /> */}
              {!collapsed && (
                <Typography
                  variant="body1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  Study Rights
                </Typography>
              )}
            </NavLink>
            <NavLink
              title="Form Permissions"
              to={`/studies/${id}/user-management/forms`}
              className={({ isActive }) =>
                isActive
                  ? "user-management-menu active"
                  : "user-management-menu"
              }
            >
              {/* <AdminIcon /> */}
              {!collapsed && (
                <Typography
                  variant="body1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  Form Permissions
                </Typography>
              )}
            </NavLink>
          </Collapse>
        )}
        {rbac.auditTrail && (
          <NavLink
            to={`/studies/${id}/audit-trail`}
            title="Audit trail"
            className={({ isActive }) =>
              isActive ? "sider-menu active" : "sider-menu"
            }
          >
            <AuditTrailIcon />
            {!collapsed && (
              <Typography variant="subtitle1">Audit trail</Typography>
            )}
          </NavLink>
        )}
        {rbac.export && (
          <NavLink
            to={`/studies/${id}/export`}
            title="Export"
            className={({ isActive }) =>
              isActive ? "sider-menu active" : "sider-menu"
            }
          >
            <ExportIcon />
            {!collapsed && <Typography variant="subtitle1">Export</Typography>}
          </NavLink>
        )}
        {rbac.queries && (
          <NavLink
            to={`/studies/${id}/queries`}
            title="Queries"
            className={({ isActive }) =>
              isActive ? "sider-menu active" : "sider-menu"
            }
          >
            <QueryIcon />
            {!collapsed && <Typography variant="subtitle1">Queries</Typography>}
          </NavLink>
        )}
        {/* {rbac.studySettings && (
          <NavLink
            to={`/studies/${id}/study-settings`}
            title="Settings"
            className={({ isActive }) =>
              isActive ? "sider-menu active" : "sider-menu"
            }
          >
            <StudySettingsIcon />
            {!collapsed && (
              <Typography variant="subtitle1">Settings</Typography>
            )}
          </NavLink>
        )} */}
        {rbac.studySettings && (
          <Box
            className={
              matchFunctions.studySettings || matchFunctions.studyTheme
                ? "sider-menu active"
                : "sider-menu"
            }
            onClick={studySettingsToggle}
          >
            <StudySettingsIcon />
            {!collapsed && (
              <Box display={"flex"} maxWidth={"125px"}>
                <Typography
                  variant="subtitle1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                  title="Settings"
                >
                  Settings
                </Typography>
                {/* {!userMgmtToggle ? <ExpandMore /> : <ExpandLess />} */}
              </Box>
            )}
          </Box>
        )}
        {!collapsed && (
          <Collapse
            in={settingsToggle && rbac.studySettings}
            timeout={"auto"}
            unmountOnExit
            sx={{ p: "8px 24px" }}
          >
            <NavLink
              title="Study Settings"
              to={`/studies/${id}/study-settings`}
              className={({ isActive }) =>
                isActive
                  ? "user-management-menu active"
                  : "user-management-menu"
              }
            >
              {/* <AdminIcon /> */}
              {!collapsed && (
                <Typography
                  variant="body1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  Study Settings
                </Typography>
              )}
            </NavLink>
            <NavLink
              title="Study Theme"
              to={`/studies/${id}/study-theme`}
              className={({ isActive }) =>
                isActive
                  ? "user-management-menu active"
                  : "user-management-menu"
              }
            >
              {/* <AdminIcon /> */}
              {!collapsed && (
                <Typography
                  variant="body1"
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  Study Theme
                </Typography>
              )}
            </NavLink>
          </Collapse>
        )}
      </Box>

      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={toggleCollapse}>
          {collapsed ? (
            <ChevronRight fontSize="large" />
          ) : (
            <ChevronLeft fontSize="large" />
          )}
        </IconButton>
      </Box> */}
      {!collapsed && <VersionWrapper />}
    </Box>
  );
};

export default StudySidebar;
