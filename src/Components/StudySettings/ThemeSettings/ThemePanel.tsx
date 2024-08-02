import { useState } from "react";
import { useAppSelector } from "../../../Redux/hooks";
import { permissions } from "../../../utils/roles";
import { Box, Typography } from "@mui/material";
import { HeaderStyle } from "../../Common/styles/header";
import {
  CustomTabPanel,
  StyledTab,
  StyledTabs,
  a11yProps,
} from "../../Common/UI/TabPanel";
import AuthPage from "./AuthPage";
import WelcomePage from "./WelcomePage";
import ThankyouPage from "./ThankyouPage";
import StudyUrlSetter from "../StudyUrlSetter";
import StudyUrlLoader from "../StudyUrlLoader";
import ThemeGeneral from "./ThemeGeneral";
import WelcomeEmail from "./WelcomeEmail";

const ThemePanel = () => {
  const [type, setType] = useState("general");
  const [urlLoaded, setUrlLoaded] = useState<boolean>(false);
  const { studyPermissions } = useAppSelector((state) => state.user);
  const handleChange = (_: any, newValue: string) => {
    setType(newValue);
  };
  const [canEditSettings] = useState(
    studyPermissions.includes(permissions.studySettings)
  );
  return urlLoaded ? (
    <>
      <Box sx={HeaderStyle}>
        <Typography fontSize={20} fontWeight={600} color="text.primary">
          Theme Settings
        </Typography>
      </Box>
      <>
        <Box sx={{ borderTop: 1, borderColor: "#E5E7EB" }}>
          <StyledTabs value={type} onChange={handleChange}>
            <StyledTab label="General" value="general" {...a11yProps(0)} />
            <StyledTab
              label="Login Page"
              value="login_page"
              {...a11yProps(1)}
            />
            <StyledTab
              label="Welcome Page"
              value="welcome_page"
              {...a11yProps(2)}
            />
            <StyledTab
              label="Thank You Page"
              value="thank_you_page"
              {...a11yProps(3)}
            />
            <StyledTab
              label="Welcome Email"
              value="welcome_email"
              {...a11yProps(4)}
            />
          </StyledTabs>
        </Box>
        <Box sx={{ p: 3, overflow: "auto", height: "calc(100vh - 201px)" }}>
          <CustomTabPanel value={type} index={"general"}>
            <ThemeGeneral canEdit={canEditSettings} />
          </CustomTabPanel>
          <CustomTabPanel value={type} index={"login_page"}>
            <AuthPage canEdit={canEditSettings} />
          </CustomTabPanel>
          <CustomTabPanel value={type} index={"welcome_page"}>
            <WelcomePage canEdit={canEditSettings} />
          </CustomTabPanel>
          <CustomTabPanel value={type} index={"thank_you_page"}>
            <ThankyouPage canEdit={canEditSettings} />
          </CustomTabPanel>
          <CustomTabPanel value={type} index={"welcome_email"}>
            <WelcomeEmail canEdit={canEditSettings} />
          </CustomTabPanel>
        </Box>
      </>
      <StudyUrlSetter type={type} />
    </>
  ) : (
    <StudyUrlLoader setType={setType} setUrlLoaded={setUrlLoaded} />
  );
};

export default ThemePanel;
