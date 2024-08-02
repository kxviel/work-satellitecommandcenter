import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { errorToastMessage } from "../../utils/toast";
import http from "../../utils/http";
import SignInLayout1 from "./SignInLayout1";
import SignInLayout2 from "./SignInLayout2";
import { getCustomTheme } from "../../utils/theme";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { setStudyDetails } from "../../Redux/reducers/studySlice";
import SignInLayout3 from "./SignInLayout3";
import SignInLayout4 from "./SigninLayout4";
import SignInLayout5 from "./SignInLayout5";
import { useQuery } from "../../utils/hooks";
import { setUserAuth } from "../../Redux/reducers/userSlice";

const formatThemeData = (data: any) => {
  const formattedData: any = {
    id: data?.id,
    content: {
      title: data?.pages?.[0]?.content?.title,
      subtext: data?.pages?.[0]?.content?.subtext,
    },
    layout: data?.pages?.[0]?.layoutKey,
    images: {
      topRight: data?.pages?.[0]?.images?.find(
        (img: any) => img.key === "topRight"
      ),
      bottomLeft: data?.pages?.[0]?.images?.find(
        (img: any) => img.key === "bottomLeft"
      ),
    },
    logos: [
      data?.pages?.[0]?.logos?.find((img: any) => img.key === "logo_1") || {
        key: "logo_1",
        url: "",
        previewUrl: "",
      },
      data?.pages?.[0]?.logos?.find((img: any) => img.key === "logo_2") || {
        key: "logo_2",
        url: "",
        previewUrl: "",
      },
    ],
    themeSettings: data?.themeSettings,
    name: data?.name,
    status: data?.status,
  };
  return formattedData;
};

const getLogos = (logos: any) => {
  let formattedLogos: any = {};
  if (logos) {
    formattedLogos = {
      logo1: logos?.find((img: any) => img?.key === "logo_1"),
      logo2: logos?.find((img: any) => img?.key === "logo_2"),
    };
  }
  return formattedLogos;
};

const CustomSignIn = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authData, setAuthData] = useState<any>(null);
  const dispatch = useAppDispatch();

  const { slug } = useParams();
  const {
    primaryColor,
    secondaryColor,
    textColor,
    secondaryTextColor,
    backgroundColor,
  } = useAppSelector((state) => state.study);
  const [logos, setLogos] = useState<any>(null);
  const emailverified = useQuery().get("email_invite");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [studyId, setStudyId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [logoutData, setLogoutData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = (data: any) => {
    setLogoutData(data);
    setShowModal(true);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (data: any) => {
    try {
      setSubmitLoader(true);
      const body: any = {
        username: data.email,
        password: data.password,
        userAgent: window.navigator.userAgent,
        strategy: "email",
      };
      let url = "user/auth/login";
      const res = await http.post(url, body);
      setSubmitLoader(true);
      const token = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;
      const userId = res.data.data.id;
      const firstName = res?.data?.data?.firstName;
      const lastName = res?.data?.data?.lastName;
      localStorage.setItem("sm-access-token", token);
      localStorage.setItem("sm-refresh-token", refreshToken);
      localStorage.setItem("user-id", userId);
      localStorage.setItem("first-name", firstName);
      localStorage.setItem("last-name", lastName);
      dispatch(setUserAuth({ authenticated: true, role: "", userId }));
      navigate(`/studies/${studyId}/study-designer`);
    } catch (err) {
      setSubmitLoader(false);
      if (axios.isAxiosError(err) && err?.response?.status === 409) {
        openModal(data);
      } else {
        errorToastMessage(err as Error);
      }
    }
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(
          `/study/configuration-by-slug?pageKey=admin_login&studySlug=${slug}`
        );
        const data = res?.data?.data;
        const formattedData = formatThemeData(data);
        setAuthData(formattedData);
        const logosObject = getLogos(formattedData?.logos);
        setLogos(logosObject);
        setStudyId(formattedData?.id);
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
      } catch (err) {
        errorToastMessage(err as Error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchAuthData();
    }
  }, [slug, dispatch]);
  const LayoutComponent = (layout: string) => {
    switch (layout) {
      case "layout_1": {
        return (
          <SignInLayout1
            images={authData?.images}
            logos={logos}
            content={authData?.content}
            emailverified={emailverified}
            submitLoader={submitLoader}
            showModal={showModal}
            logoutData={logoutData}
            showPassword={showPassword}
            closeModal={closeModal}
            handleClickShowPassword={handleClickShowPassword}
            handleSubmit={handleSubmit}
          />
        );
      }
      case "layout_2": {
        return (
          <SignInLayout2
            images={authData?.images}
            logos={logos}
            content={authData?.content}
            emailverified={emailverified}
            submitLoader={submitLoader}
            showModal={showModal}
            logoutData={logoutData}
            showPassword={showPassword}
            closeModal={closeModal}
            handleClickShowPassword={handleClickShowPassword}
            handleSubmit={handleSubmit}
          />
        );
      }
      case "layout_3": {
        return (
          <SignInLayout3
            images={authData?.images}
            logos={logos}
            content={authData?.content}
            emailverified={emailverified}
            submitLoader={submitLoader}
            showModal={showModal}
            logoutData={logoutData}
            showPassword={showPassword}
            closeModal={closeModal}
            handleClickShowPassword={handleClickShowPassword}
            handleSubmit={handleSubmit}
          />
        );
      }
      case "layout_4": {
        return (
          <SignInLayout4
            images={authData?.images}
            logos={logos}
            content={authData?.content}
            emailverified={emailverified}
            submitLoader={submitLoader}
            showModal={showModal}
            logoutData={logoutData}
            showPassword={showPassword}
            closeModal={closeModal}
            handleClickShowPassword={handleClickShowPassword}
            handleSubmit={handleSubmit}
          />
        );
      }
      case "layout_5": {
        return (
          <SignInLayout5
            images={authData?.images}
            logos={logos}
            content={authData?.content}
            emailverified={emailverified}
            submitLoader={submitLoader}
            showModal={showModal}
            logoutData={logoutData}
            showPassword={showPassword}
            closeModal={closeModal}
            handleClickShowPassword={handleClickShowPassword}
            handleSubmit={handleSubmit}
          />
        );
      }
      default:
        return (
          <SignInLayout1
            images={authData?.images}
            logos={logos}
            content={authData?.content}
            emailverified={emailverified}
            submitLoader={submitLoader}
            showModal={showModal}
            logoutData={logoutData}
            showPassword={showPassword}
            closeModal={closeModal}
            handleClickShowPassword={handleClickShowPassword}
            handleSubmit={handleSubmit}
          />
        );
    }
  };
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
          height: "100vh",
          width: "100%",
          overflow: "auto",
          backgroundColor: backgroundColor,
        }}
      >
        {!loading ? (
          <Box>{LayoutComponent(authData?.layout)}</Box>
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CustomSignIn;
