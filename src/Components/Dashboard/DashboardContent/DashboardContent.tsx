import {
  Backdrop,
  Box,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import { StudyProgressIcon } from "../../Common/assets/Icons";
// import StudyCard from "../Cards/StudyCard";
// import { CustomCircularProgressWithLabel } from "../../Common/UI/ProgressWithLabel";
import StatsCards from "../Cards/StatsCards";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import ParticipantInsights from "../Insights/ParticipantInsights";
// import VisitsInsights from "../Insights/VisitsInsights";
import NoContent from "./NoContent";
// import VisitStatusInsights from "../Insights/VisitStatusInsights";
import { Delete } from "@mui/icons-material";
import ParticipantsList from "../Insights/ParticipantsList";
import QueriesBySite from "../Insights/QueriesBySite";
import ParticipantBySite from "../Insights/ParticipantBySite";
import SurveyPackageCompletion from "../Insights/SurveyPackageCompletion";
import ParticipantCreationOverTime from "../Insights/ParticipantCreationOverTime";
import { DateTime } from "luxon";

type Props = {
  toggleLoader: boolean;
  openWidgetModal: () => void;
  refreshPage: () => void;
  setWidgetList: any;
};
const formatParticipantList = (data: any) => {
  let formattedData: any[] = [];
  const transformedData =
    data?.map((item: any) => ({
      id: item.id,
      subjectId: item.subject_id,
      textValue: item.text_value,
      diffDays: item.diff_days,
    })) || [];

  for (let i = 0; i < transformedData.length; i += 3) {
    let row = transformedData.slice(i, i + 3);
    while (row.length < 3) {
      row.push({
        id: "",
        subjectId: "",
        textValue: "",
        diffDays: "",
      });
    }

    formattedData.push(row);
  }
  return formattedData;
};

function formatParticipantGraph(data: any[]) {
  let formattedData: any[] = [
    {
      data: [],
      id: "",
    },
  ];
  let days: { [key: string]: number } = {};

  if (data?.length === 0) return formattedData;
  const start = DateTime.fromFormat(
    data?.[0]?.date_time?.split("T")?.[0],
    "yyyy-LL-dd"
  );
  let end = DateTime.now()?.startOf("month");

  data?.forEach((item: any) => {
    const date = item?.date_time?.split("T")?.[0];
    if (date) {
      days[date] = item?.count;
    }
  });

  const n = data?.length < 3 ? 3 : end.diff(start, "months").get("months");

  const newData = [];
  for (let i = 0; i <= n; i++) {
    const key = end.toFormat("yyyy-LL-dd");
    const count = days?.[key] ?? 0;

    newData.push({
      x: end.toFormat("yyyy-LL-dd"),
      y: count,
    });

    end = end.minus({ months: 1 });
  }

  formattedData = [
    {
      data: newData?.reverse(),
      id: "Participants",
    },
  ];
  return formattedData;
}

const formatData = (data: any) => {
  let formattedData: any = {
    stats: [
      {
        id: 1,
        value: data?.total_sites,
        widgetKey: "total_sites",
        title: "Sites",
        desc: "Total Sites",
        color: "#4A1D96",
      },
      {
        id: 2,
        value: data?.total_participants,
        widgetKey: "total_participants",
        title: "Participants",
        desc: "Total Participants",
        color: "#0694A2",
      },
      {
        id: 3,
        value: data?.total_adverse_events,
        widgetKey: "total_adverse_events",
        title: "Adverse Events",
        desc: "Total Adverse Events",
        color: "#0E9F6E",
      },
      {
        id: 4,
        value: data?.total_queries,
        widgetKey: "total_queries",
        title: "Queries",
        desc: "Total queries",
        color: "#F98080",
      },
      {
        id: 5,
        value: data?.total_locked_participants,
        widgetKey: "total_locked_participants",
        title: "Locked Participants",
        desc: "Total Locked Participants",
        color: "#3F83F8",
      },
      {
        id: 6,
        value: data?.total_locked_forms,
        widgetKey: "total_locked_forms",
        title: "Locked Forms",
        desc: "Total Locked Forms",
        color: "#9061F9",
      },
    ].filter((item) => item.value !== null && item.value !== undefined),
    participantInsights: data?.participant_insights?.map((item: any) => {
      return {
        siteId: item?.siteId ?? "-",
        siteName: item?.siteName ?? "-",
        total: item?.total_participants ?? "-",
        included: item?.total_included_participants ?? "-",
        excluded: item?.total_excluded_participants ?? "-",
        randomized: item?.total_randomized_participants ?? "-",
      };
    }),
    participantCreationOverTime: data?.participant_creation_over_time
      ? formatParticipantGraph(data?.participant_creation_over_time)
      : null,
    participantsBySite: data?.participants_by_site?.map((item: any) => {
      return {
        siteId: item?.siteId ?? "-",
        siteName: item?.siteName ?? "-",
        totalParticipants: item?.total_participants ?? "-",
      };
    }),
    queriesBySite: data?.queries_by_site?.map((item: any) => {
      return {
        siteId: item?.siteId ?? "-",
        siteName: item?.siteName ?? "-",
        totalQueries: item?.total_queries ?? "-",
      };
    }),
    randomizedParticipantsBySite: data?.randomized_participants_by_site?.map(
      (item: any) => {
        return {
          siteId: item?.siteId ?? "-",
          siteName: item?.siteName ?? "-",
          totalParticipants: item?.total_randomized_participants ?? "-",
        };
      }
    ),
    participantsList3Months: data?.participant_list_for_3month_view_reminders
      ? formatParticipantList(data?.participant_list_for_3month_view_reminders)
      : null,
    participantsList6Months: data?.participant_list_for_6month_view_reminders
      ? formatParticipantList(data?.participant_list_for_6month_view_reminders)
      : null,
    participantsList12Months: data?.participant_list_for_12month_view_reminders
      ? formatParticipantList(data?.participant_list_for_12month_view_reminders)
      : null,
    surveyPackages: data?.survey_package_completion?.map(
      (surveyPackage: any) => {
        return {
          id: surveyPackage?.package_id ?? "-",
          name: surveyPackage?.package_name ?? "-",
          completed: surveyPackage?.completed ?? "-",
          inProgress: surveyPackage?.in_progress ?? "-",
        };
      }
    ),
  };
  return formattedData;
};

const findMax = (data: any) => {
  const numbers = data?.[0]?.data;
  let max = 10;
  for (let i = 0; i < numbers?.length; i++) {
    if (numbers?.[i]?.y > max) {
      max = numbers?.[i]?.y;
    }
  }
  return max;
};

const DashboardContent = ({
  toggleLoader,
  openWidgetModal,
  refreshPage,
  setWidgetList,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<any>({});
  const { id: studyId } = useParams();
  const [selectedWidget, setSelectedWidget] = useState<any>({});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuLoader, setMenuLoader] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  async function deleteWidget() {
    try {
      setMenuLoader(true);
      let res: AxiosResponse;
      res = await http.delete(
        `/study/${studyId}/user-dashboard/widgets/${selectedWidget?.widgetKey}`
      );
      toastMessage("success", res.data.message);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      console.log(err);
    } finally {
      setMenuLoader(false);
      setAnchorEl(null);
    }
  }

  const handleOptionsClick = (
    event: React.MouseEvent<HTMLElement>,
    data: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWidget(data);
  };

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/dashboard`
        );
        const data = res.data.data;

        const newData = formatData(data);
        const widgets = Object.keys(data);
        setWidgetList(widgets);
        const statsObj = {
          // totalQueries: data?.totalQueries,
          // totalOpenQueries: data?.totalOpenQueries,
          // totalClosedQueries: data?.totalClosedQueries,
          // totalParticipants: data?.totalParticipants,
          // totalEnrolledParticipants: data?.totalEnrolledParticipants,
          // totalAdverseEvents: data?.totalAdverseEvents,
          // totalSites: data?.totalSites,
          stats: newData?.stats,
          participantInsights: newData?.participantInsights
            ? {
                data: newData?.participantInsights,
                title: "Participant Insights",
                widgetKey: "participant_insights",
              }
            : null,
          participantCreationOverTime: newData?.participantCreationOverTime
            ? {
                data: newData?.participantCreationOverTime,
                title: "Participant Creation Over Time",
                widgetKey: "participant_creation_over_time",
                yMax: findMax(newData?.participantCreationOverTime),
              }
            : null,
          participantsBySite: newData?.participantsBySite
            ? {
                data: newData?.participantsBySite,
                title: "Participants by site",
                widgetKey: "participants_by_site",
              }
            : null,
          randomizedParticipantsBySite: newData?.randomizedParticipantsBySite
            ? {
                data: newData?.randomizedParticipantsBySite,
                title: "Randomized participants by site",
                widgetKey: "randomized_participants_by_site",
              }
            : null,
          queriesBySite: newData?.queriesBySite
            ? {
                data: newData?.queriesBySite,
                title: "Queries by site",
                widgetKey: "queries_by_site",
              }
            : null,
          threeMonths: newData?.participantsList3Months
            ? {
                data: newData?.participantsList3Months,
                title: "Participants in 3 months",
                widgetKey: "participant_list_for_3month_view_reminders",
              }
            : null,
          sixMonths: newData?.participantsList6Months
            ? {
                data: newData?.participantsList6Months,
                title: "Participants in 6 months",
                widgetKey: "participant_list_for_6month_view_reminders",
              }
            : null,
          twelveMonths: newData?.participantsList12Months
            ? {
                data: newData?.participantsList12Months,
                title: "Participants in 12 months",
                widgetKey: "participant_list_for_12month_view_reminders",
              }
            : null,
          surveyPackages: newData?.surveyPackages
            ? {
                data: newData?.surveyPackages,
                title: "Survey packages",
                widgetKey: "survey_package_completion",
              }
            : null,
        };

        setStatsData(statsObj);

        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    fetchPhaseData();
  }, [studyId, toggleLoader, setWidgetList]);
  function handleNavigation(data: any) {
    if (data?.id) {
      navigate(
        `/studies/${studyId}/responses/${data?.id}?participant=${data?.subjectId}`
      );
    }
  }

  return (
    <>
      {loading ? (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : statsData?.stats?.length > 0 ||
        statsData?.participantsBySite ||
        statsData?.participantInsights ||
        statsData?.randomizedParticipantsBySite ||
        statsData?.queriesBySite ||
        statsData?.threeMonths ||
        statsData?.sixMonths ||
        statsData?.twelveMonths ||
        statsData?.participantCreationOverTime ||
        statsData?.surveyPackages ? (
        <>
          {statsData?.stats?.length > 0 && (
            <Box
              sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}
            >
              {/* <Box
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: 2,
                p: 3,
                width: "60%",
                boxShadow: "0px 1px 3px 0px #0000001A",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10%",
                  bgcolor: "primary.main",
                  borderRadius: 2,
                  height: "190px",
                  position: "relative",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <Box ml={"8%"} zIndex={1}>
                  <CustomCircularProgressWithLabel
                    value={31}
                    fontSize={30}
                    fontWeight={600}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Study Progress
                  </Typography>
                  <Box mt={"6px"}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#FFFFFF",
                      }}
                    >
                      {statsData?.totalEnrolledParticipants}
                      <span style={{ color: "#A4CAFE" }}>
                        / {statsData?.totalParticipants} Enrolled
                      </span>
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{ position: "absolute", right: "0px", bottom: "-6px" }}
                >
                  <StudyProgressIcon />
                </Box>
              </Box>
              <Box
                display={"grid"}
                gridTemplateColumns={"repeat(2, 1fr)"}
                gap={2}
              >
                {visitData?.map((item) => (
                  <Box key={item?.id}>
                    <StudyCard data={item} />
                  </Box>
                ))}
              </Box>
            </Box> */}
              {statsData?.stats?.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                    gridGap: "16px",
                    width: "100%",
                  }}
                >
                  {statsData?.stats?.map((item: any) => (
                    <Box key={item?.id}>
                      <StatsCards
                        data={item}
                        refreshPage={refreshPage}
                        handleOptionsClick={handleOptionsClick}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          {statsData?.participantCreationOverTime && (
            <Box mb={2}>
              <ParticipantCreationOverTime
                data={statsData?.participantCreationOverTime}
                handleOptionsClick={handleOptionsClick}
              />
            </Box>
          )}
          {statsData?.participantInsights && (
            <Box mb={2}>
              <ParticipantInsights
                data={statsData?.participantInsights}
                handleOptionsClick={handleOptionsClick}
              />
            </Box>
          )}
          {statsData?.threeMonths && (
            <Box mb={2}>
              <ParticipantsList
                data={statsData?.threeMonths}
                handleOptionsClick={handleOptionsClick}
                handleNavigation={handleNavigation}
              />
            </Box>
          )}
          {statsData?.sixMonths && (
            <Box mb={2}>
              <ParticipantsList
                data={statsData?.sixMonths}
                handleOptionsClick={handleOptionsClick}
                handleNavigation={handleNavigation}
              />
            </Box>
          )}
          {statsData?.twelveMonths && (
            <Box mb={2}>
              <ParticipantsList
                data={statsData?.twelveMonths}
                handleOptionsClick={handleOptionsClick}
                handleNavigation={handleNavigation}
              />
            </Box>
          )}
          {(statsData?.participantsBySite ||
            statsData?.randomizedParticipantsBySite ||
            statsData?.queriesBySite) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
              }}
            >
              {statsData?.queriesBySite && (
                <Box width={"49%"}>
                  <QueriesBySite
                    data={statsData?.queriesBySite}
                    handleOptionsClick={handleOptionsClick}
                  />
                </Box>
              )}
              {statsData?.participantsBySite && (
                <Box width={"49%"}>
                  <ParticipantBySite
                    data={statsData?.participantsBySite}
                    handleOptionsClick={handleOptionsClick}
                  />
                </Box>
              )}
              {statsData?.randomizedParticipantsBySite && (
                <Box width={"49%"}>
                  <ParticipantBySite
                    data={statsData?.randomizedParticipantsBySite}
                    handleOptionsClick={handleOptionsClick}
                  />
                </Box>
              )}
            </Box>
          )}
          {statsData?.surveyPackages && (
            <Box mb={2}>
              <SurveyPackageCompletion
                data={statsData?.surveyPackages}
                handleOptionsClick={handleOptionsClick}
              />
            </Box>
          )}
          {/* {visitsInsights?.data?.length > 0 && (
            <Box mt={2}>
              <VisitsInsights
                data={visitsInsights}
                setAnchorEl={setAnchorEl}
                setSelectedWidget={setSelectedWidget}
                handleOptionsClick={handleOptionsClick}
              />
            </Box>
          )}
          {visitStatusInsights?.data?.length > 0 && (
            <Box mt={2}>
              <VisitStatusInsights
                data={visitStatusInsights}
                setAnchorEl={setAnchorEl}
                setSelectedWidget={setSelectedWidget}
                handleOptionsClick={handleOptionsClick}
              />
            </Box>
          )} */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            sx={{
              "& .MuiPaper-root": {
                height: "50px",
                width: "150px",
              },
            }}
          >
            {!menuLoader ? (
              <MenuItem onClick={deleteWidget}>
                <ListItemIcon>
                  <Delete fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <CircularProgress size={18} />
              </Box>
            )}
          </Menu>
        </>
      ) : (
        <>
          <NoContent openWidgetModal={openWidgetModal} />
        </>
      )}
    </>
  );
};

export default DashboardContent;
