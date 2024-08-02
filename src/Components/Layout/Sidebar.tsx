import {
  Box,
  //  IconButton,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  Logo,
  DashboardIcon,
  // StudyBuilderIcon,
} from "../Common/assets/Sidebar";
// import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  // useAppDispatch,
  useAppSelector,
} from "../../Redux/hooks";
import VersionWrapper from "../Common/UI/VersionWrapper";
// import { setCollapsed } from "../../Redux/reducers/appSlice";

const Sidebar = () => {
  const { collapsed } = useAppSelector((state) => state.app);
  // const dispatch = useAppDispatch();
  // const toggleCollapse = () => {
  //   dispatch(setCollapsed());
  // };

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
            // borderBottom: 1,
            // borderBottomColor: "#E0E3EB",
            paddingBottom: 2,
            margin: "10px 0px",
          }}
        >
          <Logo />
        </Box>
        <NavLink
          to="/app/studies"
          title="My Studies"
          className={({ isActive }) =>
            isActive ? "sider-menu active" : "sider-menu"
          }
        >
          <DashboardIcon />
          {!collapsed && (
            <Typography variant="subtitle1">My Studies</Typography>
          )}
        </NavLink>

        {/* <NavLink
          to="/app/users"
          title="Users"
          className={({ isActive }) =>
            isActive ? "sider-menu active" : "sider-menu"
          }
        >
          <StudyBuilderIcon />
          {!collapsed && <Typography variant="subtitle1">Users</Typography>}
        </NavLink> */}
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

export default Sidebar;
