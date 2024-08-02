import { useState } from "react";
import { useAppDispatch } from "../../Redux/hooks";
import { resetState } from "../../Redux/actions/resetAction";
import { Avatar, Box, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import http from "../../utils/http";
import { AxiosResponse } from "axios";
import { toastMessage } from "../../utils/toast";

const LogoutContainer = () => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const firstName = localStorage.getItem("first-name");
  const lastName = localStorage.getItem("last-name");
  const [userName] = useState(
    `${firstName ? firstName : ""} ${lastName ? lastName : ""}`
  );
  const logout = async () => {
    try {
      let res: AxiosResponse;
      res = await http.post("user/auth/logout");
      toastMessage("success", res?.data?.message);
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.clear();
      dispatch(resetState());
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Typography variant="body1" color="text.secondary" fontWeight="regular">
          {userName}
        </Typography>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "lightgray",
            color: "#000",
            fontSize: 16,
          }}
        />
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => navigate("/profile/change-password")}>
          Change Password
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default LogoutContainer;
