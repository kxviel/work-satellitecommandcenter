import {
  useState,
  // useState,
} from "react";
import { Box, Button, Typography } from "@mui/material";

import {
  HeaderLeftContent,
  HeaderRightContent,
  StyledHeader,
} from "../Common/styles/header";
import { Add } from "@mui/icons-material";
import AddRecordModal from "./Modals/AddRecordModal";

type Props = {
  addUser: boolean;
};

const RecordsHeader = ({ addUser }: Props) => {
  // const [loader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <StyledHeader>
      <Box sx={HeaderLeftContent}>
        <Typography fontSize={20} fontWeight={600} color="text.primary">
          Participants
        </Typography>
      </Box>

      {addUser && (
        <Box sx={HeaderRightContent}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowModal(true)}
          >
            New
          </Button>
        </Box>
      )}
      {showModal && (
        <AddRecordModal showModal={showModal} closeModal={closeModal} />
      )}
    </StyledHeader>
  );
};

export default RecordsHeader;
