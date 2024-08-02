import { Box, Button, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ConfirmExclusion from "../Exclusion/ConfirmExclusion";
import { toggleResponseState } from "../../../Redux/reducers/responseSlice";

const ExcludeField = () => {
  const dispatch = useAppDispatch();
  const { surveySlug } = useParams();

  const [showModal, setModal] = useState(false);

  const {
    fieldSubmitting,
    isExcluded,
    formEditable: editable,
  } = useAppSelector((state) => state.response);

  const refreshPage = () => {
    dispatch(toggleResponseState());
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleClick = () => {
    if (!fieldSubmitting) {
      setModal(true);
    }
  };

  if (surveySlug) {
    return null;
  }

  return (
    <Stack
      sx={{
        width: {
          xs: "100%",
          md: "80%",
        },
        pl: "60px",
      }}
      gap={1}
    >
      {!isExcluded ? (
        <Box>
          <Button
            onClick={handleClick}
            variant="contained"
            disabled={!editable}
          >
            Exclude Participant
          </Button>
        </Box>
      ) : (
        <Typography>Participant Excluded from the Study</Typography>
      )}
      {showModal && (
        <ConfirmExclusion
          showModal={showModal}
          closeModal={closeModal}
          refreshPage={refreshPage}
        />
      )}
    </Stack>
  );
};
export default ExcludeField;
