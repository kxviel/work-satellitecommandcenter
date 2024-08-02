import { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { errorToastMessage } from "../../utils/toast";
import http from "../../utils/http";
import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { setStudyDetails } from "../../Redux/reducers/studySlice";
import { getCustomTheme } from "../../utils/theme";
import Survey from "./Survey";
import Error404 from "../Layout/404";
import WelcomePanel from "./WelcomePage/WelcomePanel";

const formatDetailsData = (data: any) => {
  const formattedData: any = {
    themeSettings: data?.themeSettings,
    title: data?.pages?.[0]?.content?.title,
    subtext: data?.pages?.[0]?.content?.subtext,
    layoutKey: data?.pages?.[0]?.layoutKey,
    footer: data?.pages?.[0]?.content?.footer,
    headerLogo: data?.pages?.[0]?.logos?.find(
      (logo: any) => logo?.key === "header"
    ),
    footerLogo: data?.pages?.[0]?.logos?.find(
      (logo: any) => logo?.key === "footer"
    ),
  };
  return formattedData;
};

const SurveyWrapper = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { surveySlug } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [showInfo, setShowInfo] = useState(true);
  const {
    primaryColor,
    secondaryColor,
    textColor,
    secondaryTextColor,
    backgroundColor,
  } = useAppSelector((state) => state.study);

  useEffect(() => {
    async function getSurveyData() {
      try {
        setLoading(true);
        let res: AxiosResponse;
        res = await http.get(`/survey/${surveySlug}/basic-details`);
        const data = res?.data?.data?.study;
        const formattedData = formatDetailsData(data);
        setData(formattedData);
        dispatch(
          setStudyDetails({
            name: formattedData?.name || "",
            primaryColor:
              formattedData?.themeSettings?.colorConfig?.primaryColor ||
              "#327091",
            secondaryColor:
              formattedData?.themeSettings?.colorConfig?.secondaryColor ||
              "#E3F1F4",
            textColor:
              formattedData?.themeSettings?.colorConfig?.textColor || "#111928",
            secondaryTextColor:
              formattedData?.themeSettings?.colorConfig?.secondaryTextColor ||
              "#6B7280",
            backgroundColor:
              formattedData?.themeSettings?.colorConfig?.backgroundColor ||
              "#FFF6EB",
            status: formattedData?.status || "",
          })
        );
      } catch (err: any) {
        errorToastMessage(err as Error);
        if (err?.response?.data?.metadata?.redirect === "error") {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }
    if (surveySlug) {
      getSurveyData();
    }
  }, [surveySlug, dispatch]);

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
      <Box sx={{ backgroundColor: backgroundColor }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Error404 />
        ) : showInfo ? (
          <WelcomePanel setShowInfo={setShowInfo} data={data} />
        ) : (
          <Survey logo={data?.headerLogo} setError={setError} />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SurveyWrapper;
