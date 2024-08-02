import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  SxProps,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpSurvey from "../../utils/httpSurvey";
import { errorToastMessage } from "../../utils/toast";
import { SurveyBySlugRoot } from "../../types/SurveyBySlug.types";
import { PhasesList } from "../Responses/types";
import { getFormData } from "../../Redux/actions/responseAction";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import {
  setPhaseList,
  setResponseIsEditable,
  setSelectedPhase,
} from "../../Redux/reducers/responseSlice";
import PhaseList from "../Responses/PhaseList";
import QuestionItemWrapper from "../Responses/QuestionItemWrapper";
import { Logo } from "../Common/assets/Sidebar";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import MobileDrawer from "./MobileDrawer";
import { handlePhaseStatus } from "../Responses/utils";
import ConfirmationModalWrapper from "../Responses/ConfirmationModalWrapper";

const rootResponses: SxProps = {
  height: "calc(100vh - 70px)",
  width: "100%",
  p: { xs: 0, md: 2 },
  overflow: "auto",
  position: "relative",
  alignItems: "flex-start",
};

const Survey = ({ logo, setError }: any) => {
  const { surveySlug } = useParams();
  const dispatch = useAppDispatch();

  const isFieldSubmitting = useAppSelector(
    (state) => state.response.fieldSubmitting
  );
  const { selectedPhase } = useAppSelector((state) => state.response);

  const [isLoading, setIsLoading] = useState(true);
  const [packageName, setPackageName] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchStudyPhases = useCallback(async () => {
    try {
      setIsLoading(true);

      if (surveySlug) {
        const { data } = await httpSurvey.get<SurveyBySlugRoot>(
          `/survey/${surveySlug}`
        );
        dispatch(setResponseIsEditable(true));
        setPackageName(data?.data.package.name);

        let phases: PhasesList[] = [];

        data?.data.package.surveyLinks.forEach((link) => {
          if (link.phase) {
            const phaseForms = link.phase.phaseForms
              .map((phaseForm) => ({
                position: phaseForm.position,
                id: phaseForm.form.id,
                name: phaseForm.form.name,
                attempt: phaseForm.form.formAttempts?.[0]?.id,
                status: phaseForm.form.formAttempts?.[0]?.status || "active",
                phaseName: link.phase.name,
                phaseId: link.phase.id,
                locked: false,
                lockedBy: "",
                lockedAt: "",
              }))
              .sort((a, b) => a.position - b.position);

            const phaseStatus = handlePhaseStatus(phaseForms);

            phases.push({
              id: link.phase.id,
              name: link.phase.name,
              position: link.position,
              phaseForms,
              phaseStatus,
            });
          }
        });

        phases.sort((a, b) => a.position - b.position);

        let selectedForm = null;
        if (phases.length > 0) {
          const formId = sessionStorage.getItem("response-visit-form");
          let selPhase = phases?.[0].id;

          if (formId) {
            phases.forEach((phase) => {
              const selForm = phase.phaseForms.find((pf) => pf.id === formId);
              if (selForm) {
                selPhase = phase.id;
                selectedForm = selForm;
              }
            });
          }
          if (selectedForm) {
            dispatch(getFormData({ surveySlug, selectedForm }));
          } else {
            phases.some((phase) => {
              const selForm = phase.phaseForms.find(
                (pf) => pf.status === "active" || pf.status === "inprogress"
              );
              if (selForm) {
                selPhase = phase.id;
                selectedForm = selForm;
              }
              return !!selForm;
            });
            if (!selectedForm) {
              selectedForm = phases?.[0]?.phaseForms?.[0];
            }
            if (selectedForm) {
              dispatch(getFormData({ surveySlug, selectedForm }));
            }
          }
          dispatch(setSelectedPhase({ phase: selPhase }));
        }

        dispatch(setPhaseList({ list: phases }));
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      errorToastMessage(error);

      if (error?.response.data?.metadata?.redirect === "error") {
        setError(true);
      }
    }
  }, [dispatch, surveySlug]);

  useEffect(() => {
    fetchStudyPhases();
  }, [fetchStudyPhases]);

  return (
    <Stack sx={{ height: "100vh" }}>
      {/* Navbar */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          height: "70px",
          px: 3,
          py: 2,
          border: { xs: "1px solid #E5E7EB", md: "none" },
          "& .header-logo": {
            maxWidth: "258px",
            maxHeight: "60px",
          },
          backgroundColor: "#FFF",
        }}
        gap={3}
      >
        {logo?.url ? (
          <img
            src={logo?.previewUrl}
            alt="Logo 1"
            className="header-logo"
            loading="lazy"
          />
        ) : (
          <Logo />
        )}
        <IconButton
          aria-label="menu"
          size="large"
          sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}
          onClick={() => setShowDrawer(true)}
        >
          <MenuIcon fontSize="inherit" />
        </IconButton>

        {isFieldSubmitting && (
          <CircularProgress sx={{ ml: "auto" }} color="primary" size={24} />
        )}
      </Stack>
      <Divider />

      {/* Body */}
      <Stack direction={"row"} gap={2} sx={rootResponses}>
        {/* Phases and Forms */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            height: "100%",
            position: "sticky",
            top: 0,
          }}
        >
          <PhaseList
            packageName={packageName}
            isLoading={isLoading}
            selectedPhaseId={selectedPhase}
            currentTab={"Surveys"}
          />
        </Box>

        {/* Question List */}
        <QuestionItemWrapper />

        {showDrawer && (
          <MobileDrawer
            showDrawer={showDrawer}
            onClose={() => setShowDrawer(false)}
            logo={logo}
          >
            <PhaseList
              packageName={packageName}
              isLoading={isLoading}
              selectedPhaseId={selectedPhase}
              closeMobileDrawer={() => setShowDrawer(false)}
              currentTab={"Surveys"}
            />
          </MobileDrawer>
        )}
      </Stack>

      <ConfirmationModalWrapper />
    </Stack>
  );
};

export default Survey;
