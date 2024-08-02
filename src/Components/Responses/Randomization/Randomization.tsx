import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { commonContainerWrapper } from "../../Common/styles/flex";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import {
  errorToastMessage,
  //  toastMessage
} from "../../../utils/toast";
// import ConfirmRandomization from "./ConfirmRandomization";
import { DateTime } from "luxon";
import {
  useAppDispatch,
  //  useAppSelector
} from "../../../Redux/hooks";
import { setResponseLoader } from "../../../Redux/reducers/responseSlice";

const Randomization = () => {
  const { id: studyId } = useParams();
  const { participantId } = useParams();
  const dispatch = useAppDispatch();

  // const { canRandomize } = useAppSelector((state) => state.response);

  const [randomizationData, setRandomizationData] = useState<any>({});
  // const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [toggleLoader, setToggleLoader] = useState(false);
  // const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/participants/${participantId}/randomization?studyId=${studyId}`;

        const res: AxiosResponse = await http.get(url);
        const resData = res?.data?.data;

        const newData = {
          id: resData?.id || "",
          randomizationGroupId: resData?.randomizationGroupId || "",
          randomizedBy: resData?.randomizedBy?.firstName
            ? resData?.randomizedBy?.lastName
              ? `${resData?.randomizedBy?.firstName} ${resData?.randomizedBy?.lastName}`
              : resData?.randomizedBy?.firstName
            : "",
          randomizationNumber: resData?.randomizationNumber || "",
          randomizedOn: resData?.randomizedOn
            ? DateTime.fromISO(resData?.randomizedOn).toFormat(
                "dd'-'LL'-'yyyy hh:mm a"
              )
            : "",
          randomizationGroup: resData?.randomizationGroup || "",
          canRandomize: resData?.isRandomizationAllowed || false,
        };

        setRandomizationData(newData || {});
        dispatch(setResponseLoader(false));
        setLoading(false);
      } catch (err) {
        dispatch(setResponseLoader(false));
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [studyId, participantId, dispatch]);

  // const refreshPage = () => {
  //   setToggleLoader((prev) => !prev);
  // };

  // const openModal = () => {
  //   !randomizationData?.canRandomize
  //     ? toastMessage(
  //         "error",
  //         "Randomization settings is unavailable. Please setup randomization in Study Settings before proceeding to randomizing the participant."
  //       )
  //     : setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  // };

  return (
    <Box p={3}>
      <Box sx={commonContainerWrapper}>
        <Typography variant="h6" fontSize={"18px"} mb={2}>
          Participant Randomization details
        </Typography>
        {loading ? (
          <Backdrop
            open={true}
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Box>
            {!randomizationData?.randomizationGroup &&
            !randomizationData?.randomizationNumber ? (
              <Box>
                <Typography fontSize={"14px"}>
                  This participant is not yet randomized
                </Typography>
              </Box>
            ) : (
              <Box
                mt={2}
                display={"flex"}
                justifyContent={"space-between"}
                gap={2}
              >
                {/* <Box>
                  <Typography variant="h6" fontSize={"16px"} mb={1}>
                    Participant Randomization details
                  </Typography>

                  <Typography
                    fontWeight={"500"}
                    fontSize={"16px"}
                    mb={1}
                    color={"text.secondary"}
                  >
                    {randomizationData?.randomizationGroupId}
                  </Typography>
                </Box> */}
                <Box>
                  <Typography variant="h6" fontSize={"16px"} mb={1}>
                    Participant Randomized by
                  </Typography>

                  <Typography
                    fontWeight={"500"}
                    fontSize={"16px"}
                    mb={1}
                    color={"text.secondary"}
                  >
                    {randomizationData?.randomizedBy}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontSize={"16px"} mb={1}>
                    Randomization Number
                  </Typography>

                  <Typography
                    fontWeight={"500"}
                    fontSize={"16px"}
                    mb={1}
                    color={"text.secondary"}
                  >
                    {randomizationData?.randomizationNumber}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontSize={"16px"} mb={1}>
                    Participant Randomized on
                  </Typography>

                  <Typography
                    fontWeight={"500"}
                    fontSize={"16px"}
                    mb={1}
                    color={"text.secondary"}
                  >
                    {randomizationData?.randomizedOn}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontSize={"16px"} mb={1}>
                    Randomization Group
                  </Typography>

                  <Typography
                    fontWeight={"500"}
                    fontSize={"16px"}
                    mb={1}
                    color={"text.secondary"}
                  >
                    {randomizationData?.randomizationGroup?.treatmentGroupName}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
      {/* {showModal && (
        <ConfirmRandomization
          showModal={showModal}
          closeModal={closeModal}
          setShowError={setShowError}
          refreshPage={refreshPage}
        />
      )} */}
    </Box>
  );
};

export default Randomization;
