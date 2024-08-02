import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  MainTabPanel,
  StyledTab,
  StyledTabs,
  a11yProps,
} from "../Common/UI/TabPanel";
import StudyTab from "./StudyTab";
import { useParams, useSearchParams } from "react-router-dom";
import { HeaderRightContent, StyledHeader } from "../Common/styles/header";
import SurveyPackage from "../SurveyPackage/SurveyPackage";
import { useAppSelector } from "../../Redux/hooks";
import { permissions } from "../../utils/roles";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import ExportAllModal from "./ExportAllModal";
import ConfirmStudyLiveModal from "../StudySettings/Modals/ConfirmStudyLiveModal";

const StudyDesigner = () => {
  const { id: studyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { studyPermissions } = useAppSelector((state) => state.user);
  const { menuLabels } = useAppSelector((state) => state.study);
  const status = useAppSelector((state) => state.study.status);
  const [canEdit] = useState(
    status === "not_live" &&
      studyPermissions.includes(permissions.studyDesigner)
  );
  const [canStudyMakeLive] = useState(
    status === "not_live" &&
      studyPermissions.includes(permissions.studySettings)
  );
  const [canExport] = useState(studyPermissions.includes(permissions.export));
  const [type, setType] = useState(searchParams.get("type") ?? "visit");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<string>("");

  const phasesMap: any = {
    visit: {
      val: "visit",
      headerLabel: menuLabels?.visit || "Visit",
      buttonLabel: `Add ${menuLabels?.visit || "Visit"}`,
    },
    repeatingData: {
      val: "repeated_data",
      headerLabel: menuLabels?.repeating_data || "Repeating Data",
      buttonLabel: `Add ${menuLabels?.repeating_data || "Repeating Data"}`,
    },
    surveys: {
      val: "survey",
      headerLabel: menuLabels?.survey || "Surveys",
      buttonLabel: `Add ${menuLabels?.survey || "Surveys"}`,
    },
    surveyPackage: {
      val: "surveyPackage",
      headerLabel: menuLabels?.survey_package || "Survey Package",
      buttonLabel: `Add ${menuLabels?.survey_package || "Survey Package"}`,
    },
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (type) {
      params.set("type", type);
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [setSearchParams, type]);

  const handleChange = (_1: any, val: string) => {
    setType(val);
  };
  const handleExport = async () => {
    try {
      setLoading(true);
      const body = { studyId: studyId };
      let res;
      res = await http.post(`/exports`, body);
      toastMessage("success", res.data.message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      errorToastMessage(err as Error);
    }
  };
  const closeModal = () => {
    setShowModal("");
  };

  return (
    <>
      <StyledHeader>
        <Typography fontSize={20} fontWeight={600} color="text.primary">
          Study Designer
        </Typography>
        <Box sx={HeaderRightContent}>
          {canExport && (
            <>
              {!loading ? (
                <Button variant="contained" onClick={handleExport}>
                  Export Data
                </Button>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size={25} />
                </Box>
              )}
            </>
          )}
          {/* {canExport && (
            <>
              <Button
                variant="outlined"
                onClick={() => setShowModal("export_all")}
              >
                Export All
              </Button>
            </>
          )} */}
          {canStudyMakeLive && (
            <>
              <Button
                variant="outlined"
                onClick={() => setShowModal("go_live")}
              >
                Go Live
              </Button>
            </>
          )}
        </Box>
      </StyledHeader>
      <Box sx={{ borderTop: 1, borderColor: "#E5E7EB" }}>
        <StyledTabs value={type} onChange={handleChange}>
          <StyledTab
            label={menuLabels?.visit || "Visit"}
            value="visit"
            {...a11yProps(0)}
          />
          <StyledTab
            label={menuLabels?.repeating_data || "Repeating Data"}
            value="repeatingData"
            {...a11yProps(1)}
          />
          <StyledTab
            label={menuLabels?.survey || "Survey"}
            value="surveys"
            {...a11yProps(2)}
          />
          <StyledTab
            label={menuLabels?.survey_package || "Survey Package"}
            value="surveyPackage"
            {...a11yProps(3)}
          />
        </StyledTabs>
      </Box>
      <Box sx={{ height: "calc(100vh - 201px)", overflow: "hidden" }}>
        <MainTabPanel value={type} index={type}>
          {phasesMap[type]?.val !== "surveyPackage" ? (
            <StudyTab
              type={phasesMap[type]}
              canEdit={canEdit}
              menuLabels={menuLabels}
            />
          ) : (
            <SurveyPackage
              type={phasesMap[type]}
              canEdit={canEdit}
              menuLabels={menuLabels}
            />
          )}
        </MainTabPanel>
      </Box>
      {showModal === "export_all" && (
        <ExportAllModal
          showModal={showModal === "export_all"}
          closeModal={closeModal}
        />
      )}
      {showModal === "go_live" && (
        <ConfirmStudyLiveModal
          showModal={showModal === "go_live"}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default StudyDesigner;
