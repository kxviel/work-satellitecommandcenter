import { Box } from "@mui/material";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import { useAppSelector } from "../../Redux/hooks";
import UsersUrlLoader from "./UsersUrlLoader";
import UsersUrlSetter from "./UsersUrlSetter";
import { useState } from "react";
import { permissions } from "../../utils/roles";

const Users = () => {
  const { urlLoaded } = useAppSelector((state) => state.administrators);
  const { studyPermissions } = useAppSelector((state) => state.user);
  const [canEdit] = useState(
    studyPermissions.includes(permissions.userManagement)
  );
  return urlLoaded ? (
    <>
      <UsersHeader canEdit={canEdit} />
      <Box sx={{ height: "calc(100vh - 144px)", overflow: "auto", p: 2.5 }}>
        <UsersList canEdit={canEdit} />
      </Box>
      <UsersUrlSetter />
    </>
  ) : (
    <UsersUrlLoader />
  );
};

export default Users;
