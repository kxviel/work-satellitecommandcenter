import { useState } from "react";
// import { debounce } from "lodash";
import {
  Box,
  Button,
  // IconButton,
  // InputAdornment,
  // TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  HeaderLeftContent,
  HeaderRightContent,
  StyledHeader,
} from "../Common/styles/header";
// import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
// import { setAdministratorsSearchText } from "../../../Redux/reducers/administratorsSlice";
// import { setAdministratorsSearchText } from "../../Redux/reducers/administratorsSlice";
// import { GridSearchIcon } from "@mui/x-data-grid";
import NewUserModal from "./Modals/NewUserModal";
// import http from "../../utils/http";
// import { refreshAdministratorsPage } from "../../Redux/reducers/administratorsSlice";
// import { downloadDocSample } from "../../../utils/download";
type Props = {
  canEdit: boolean;
};

const UsersHeader = ({ canEdit }: Props) => {
  const [showModal, setShowModal] = useState(false);
  // const dispatch = useAppDispatch();
  // const { searchText } = useAppSelector((state) => state.administrators);

  // const modifySearchTerm = useMemo(
  //   () =>
  //     debounce((val) => {
  //       dispatch(setAdministratorsSearchText(val));
  //     }, 500),
  //   [dispatch]
  // );

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <StyledHeader>
      {/* <Box sx={HeaderLeftContent}> */}
      <Box sx={{ ...HeaderLeftContent, gap: 1 }}>
        <Typography fontSize={20} fontWeight={600} color="text.primary">
          Users
        </Typography>
        {/* <TextField
            onChange={(e) => modifySearchTerm(e.target.value)}
            style={{ width: "300px" }}
            placeholder="Search"
            defaultValue={searchText}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <GridSearchIcon />
                </InputAdornment>
              ),
            }}
          /> */}
      </Box>

      {canEdit && (
        <Box sx={HeaderRightContent}>
          <Button
            variant="contained"
            onClick={openModal}
            startIcon={<AddIcon />}
          >
            New User
          </Button>
        </Box>
      )}
      {showModal && (
        <NewUserModal
          showModal={showModal}
          closeModal={closeModal}
          data={null}
        />
      )}
    </StyledHeader>
  );
};

export default UsersHeader;
