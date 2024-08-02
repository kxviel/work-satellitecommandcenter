import { useEffect, useState } from "react";
import { CircularProgress, Stack } from "@mui/material";
import VisitsResponses from "./Visits/VisitsResponses";
import CategoryTabs from "./CategoryTabs";
import { useParams } from "react-router-dom";
import Query from "./Queries/Query";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { resetResponseState } from "../../Redux/reducers/responseSlice";
import RepeatingResponses from "./RepeatingData/RepeatedResponses";
import Randomization from "./Randomization/Randomization";
import Survey from "./Survey/Survey";
import { fetchParticipantById } from "../../Redux/actions/responseAction";
import FormHeader from "./FormHeader";
import ConfirmationModalWrapper from "./ConfirmationModalWrapper";
import { toggleSidebarCollapse } from "../../Redux/reducers/appSlice";

const Responses = () => {
  const dispatch = useAppDispatch();
  const { id: studyId, participantId } = useParams();
  const { menuLabels } = useAppSelector((state) => state.study);
  const { checkingPermissions, viewRandomization, toggleLoader } =
    useAppSelector((state) => state.response);

  const [currentCategory, setCurrentCategory] = useState<string>(
    sessionStorage?.getItem("response-view") ?? "visit"
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (studyId && participantId)
      dispatch(fetchParticipantById(studyId, participantId));
  }, [dispatch, studyId, participantId, toggleLoader]);

  useEffect(() => {
    dispatch(toggleSidebarCollapse(true));

    return () => {
      sessionStorage.removeItem("response-view");
      sessionStorage.removeItem("response-visit-form");
      sessionStorage.removeItem("response-repeated-form");
      sessionStorage.removeItem("response-visit-question");
      sessionStorage.removeItem("response-repeated-question");
      dispatch(toggleSidebarCollapse(false));
      dispatch(resetResponseState());
    };
  }, [dispatch]);

  return (
    <>
      {checkingPermissions ? (
        <Stack
          sx={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            color: "red",
          }}
        >
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <Stack>
          <FormHeader
            currentCategory={currentCategory}
            setShowModal={setShowModal}
            menuLabels={menuLabels}
          />

          <CategoryTabs
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            menuLabels={menuLabels}
          />

          {currentCategory === "visit" && (
            <VisitsResponses menuLabels={menuLabels} />
          )}
          {currentCategory === "repeated_data" && (
            <RepeatingResponses menuLabels={menuLabels} />
          )}
          {currentCategory === "randomization" && viewRandomization && (
            <Randomization />
          )}
          {currentCategory === "surveys" && (
            <Survey
              showModal={showModal}
              setShowModal={setShowModal}
              menuLabels={menuLabels}
            />
          )}

          <Query />
          <ConfirmationModalWrapper />
        </Stack>
      )}
    </>
  );
};

export default Responses;
