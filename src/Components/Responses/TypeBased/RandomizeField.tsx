import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useParams } from "react-router-dom";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { useEffect, useState } from "react";
import http from "../../../utils/http";
import { AxiosResponse } from "axios";
import ConfirmRandomization from "../Randomization/ConfirmRandomization";
import { toggleResponseState } from "../../../Redux/reducers/responseSlice";

const Randomize = () => {
  const { id: studyId, surveySlug, participantId } = useParams();

  // const [toggleLoader, setToggleLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState(false);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>({ error: false, data: {} });

  const { canRandomize, fieldSubmitting, viewRandomization } = useAppSelector(
    (state) => state.response
  );

  const refreshPage = () => {
    dispatch(toggleResponseState());
  };

  const closeModal = () => {
    setModal(false);
  };

  const randomizeParticipant = () => {
    if (!fieldSubmitting && canRandomize) {
      if (!data.data.canRandomize) {
        toastMessage(
          "error",
          "Randomization settings is unavailable. Please setup randomization in Study Settings before proceeding to randomizing the participant."
        );
        return;
      } else {
        setModal(true);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (viewRandomization && !surveySlug) {
          setLoading(true);
          let url = `/participants/${participantId}/randomization?studyId=${studyId}`;

          const res: AxiosResponse = await http.get(url);
          const resData = res?.data?.data;

          const newData = {
            id: resData?.id || "",
            randomizationGroupId: resData?.randomizationGroupId || "",
            randomizationGroup: resData?.randomizationGroup || "",
            canRandomize: resData?.isRandomizationAllowed || false,
          };
          setData({
            error: false,
            data: newData,
          });
          setLoading(false);
        }
      } catch (err) {
        setData({
          error: true,
          data: {},
        });
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [
    viewRandomization,
    setLoading,
    studyId,
    participantId,
    surveySlug,
    // toggleLoader,
  ]);

  if (surveySlug || !viewRandomization) {
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
      {loading ? (
        <CircularProgress />
      ) : data.error ? (
        <Typography>Unable to fetch Randomization details</Typography>
      ) : !data.data.randomizationGroup ? (
        <Box>
          <Button
            onClick={randomizeParticipant}
            disabled={!canRandomize}
            variant="contained"
          >
            Randomize
          </Button>
        </Box>
      ) : (
        <Typography>
          Participant is randomized in{" "}
          <Typography component={"span"} fontWeight={"bold"}>
            {data.data?.randomizationGroup?.treatmentGroupName}
          </Typography>{" "}
          Group
        </Typography>
      )}
      {showModal && (
        <ConfirmRandomization
          showModal={showModal}
          closeModal={closeModal}
          refreshPage={refreshPage}
        />
      )}
    </Stack>
  );
};
export default Randomize;
