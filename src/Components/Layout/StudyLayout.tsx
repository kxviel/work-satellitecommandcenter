import {
  Backdrop,
  Box,
  CircularProgress,
  SxProps,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
// import "../../utils/firebaseInit";
import StudySidebar from "./StudySidebar";
import LogoutContainer from "./LogoutContainer";
import { useEffect, useMemo, useState } from "react";
import { errorToastMessage } from "../../utils/toast";
import http from "../../utils/http";
import { setRbacState } from "../../Redux/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { getCustomTheme } from "../../utils/theme";
import {
  reset,
  setStudyDetails,
  setStudyLabels,
} from "../../Redux/reducers/studySlice";

type Props = {
  name: string;
  status: string;
};

const statusSx: SxProps = {
  textTransform: "capitalize",
  color: "#FFFFFF",
  borderRadius: "4px",
  px: "5px",
  "&:before": {
    content: '"•"',
    display: "inline-block",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    mr: "5px",
  },
};

const formatRbacData = (rbac: any) => {
  let studyPermissions: string[] = [];
  let sitePermissions: { [key: string]: string[] } = {};
  let sitesList: any[] = [];
  Object.keys(rbac?.study).forEach((key: string) => {
    if (rbac?.study?.[key]?.permissions) {
      studyPermissions.push(...(rbac?.study?.[key]?.permissions || []));
    }
  });
  sitePermissions = rbac?.site;
  let createParticipant = false;
  let readParticipant = false;
  Object.keys(rbac?.site).forEach((key: string) => {
    const permissions = rbac?.site?.[key].permissions;
    if (permissions?.includes("participant.create")) {
      createParticipant = true;
      sitesList.push({
        id: key,
        name: rbac?.site?.[key]?.name,
        isMainSite: rbac?.site?.[key]?.isMainSite,
      });
    }
    if (permissions?.includes("participant.read")) {
      readParticipant = true;
    }
  });
  if (createParticipant) {
    studyPermissions.push("participant.create");
  }
  if (readParticipant) {
    studyPermissions.push("participant.read");
  }
  return {
    studyPermissions,
    sitePermissions,
    sitesList,
  };
};

const formatMenuLabels = (data: any[]) => {
  const obj: any = {};
  data?.forEach((item: any) => {
    obj[item.key] = item.label;
  });
  return obj;
};

const Header: React.FC<Props> = ({ name, status }) => {
  return (
    <Box
      sx={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        p: "0px 24px",
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="primary.main"
          >
            {name}
          </Typography>
          {status && (
            <Typography
              fontSize={12}
              fontWeight="regular"
              bgcolor={status === "not_live" ? "#FF7164" : "#70AE71"}
              sx={statusSx}
            >
              {status === "not_live" ? "Not Live" : status}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ ml: "auto" }}>
        <LogoutContainer />
      </Box>
    </Box>
  );
};

const StudyLayout = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toggleLoader } = useAppSelector((state) => state.user);
  const {
    name,
    primaryColor,
    secondaryColor,
    textColor,
    secondaryTextColor,
    backgroundColor,
    status,
  } = useAppSelector((state) => state.study);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/study/${id}/configurations`);
        const res2 = await http.get(`/roles/self-rights?studyId=${id}`);
        const { studyPermissions, sitePermissions, sitesList } = formatRbacData(
          res2?.data?.data
        );
        dispatch(
          setRbacState({ studyPermissions, sitePermissions, sitesList })
        );
        const { status, name, themeSettings, menuLabels } = res.data.data;
        const formattedLabels = formatMenuLabels(menuLabels);
        dispatch(
          setStudyDetails({
            status: status,
            primaryColor: themeSettings?.colorConfig?.primaryColor || "#327091",
            secondaryColor:
              themeSettings?.colorConfig?.secondaryColor || "#E3F1F4",
            textColor: themeSettings?.colorConfig?.textColor || "#111928",
            secondaryTextColor:
              themeSettings?.colorConfig?.secondaryTextColor || "#6B7280",
            backgroundColor:
              themeSettings?.colorConfig?.backgroundColor || "#FFF6EB",
            name: name,
          })
        );
        dispatch(
          setStudyLabels(
            formattedLabels || {
              visit: "Visit",
              repeating_data: "Repeating Data",
              survey: "Survey",
              survey_package: "Survey Package",
            }
          )
        );
        setLoading(false);
      } catch (err) {
        navigate("/app/studies");
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    fetchStudy();
  }, [setLoading, id, dispatch, toggleLoader]);

  useEffect(() => {
    return () => {
      dispatch(reset());
      dispatch(
        setRbacState({
          studyPermissions: [],
          sitePermissions: {},
          sitesList: [],
        })
      );
    };
  }, [dispatch]);

  const theme = useMemo(
    () =>
      getCustomTheme(
        primaryColor,
        secondaryColor,
        textColor,
        secondaryTextColor
      ),
    [primaryColor, secondaryColor, textColor, secondaryTextColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          "& .svgicon.stroke": {
            stroke: (theme) => theme.palette.text.secondary,
          },
          "& .svgicon.fill": {
            fill: (theme) => theme.palette.text.secondary,
          },
          "& .svgicon-primary.fill": {
            fill: (theme) => theme.palette.primary.main,
          },
          "& .svgicon-primary.stroke": {
            stroke: (theme) => theme.palette.primary.main,
          },
          "& .svgicon-tprimary.stroke": {
            stroke: (theme) => theme.palette.text.primary,
          },
          "& .svgicon-tprimary.fill": {
            fill: (theme) => theme.palette.text.primary,
          },
        }}
      >
        <StudySidebar />
        <Box
          sx={{
            flex: 1,
            minWidth: "1px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading && (
            <Backdrop
              open={true}
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          <Header name={name} status={status} />
          <Box
            sx={{
              flex: 1,
              minHeight: "1px",
              backgroundColor: backgroundColor,
            }}
          >
            {!loading && <Outlet />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudyLayout;
