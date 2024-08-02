import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import StudyUrlLoader from "./StudyUrlLoader";
import StudyUrlSetter from "./StudyUrlSetter";
import {
  CustomTabPanel,
  StyledTab,
  StyledTabs,
  a11yProps,
} from "../Common/UI/TabPanel";
import General from "./Tabs/General";
// import StudyProperties from "./Tabs/StudyProperties";
import Sites from "./Tabs/Sites";
import { Add } from "@mui/icons-material";
// import Randomization from "./Tabs/Randomization";
import { HeaderStyle } from "../Common/styles/header";
import { useAppSelector } from "../../Redux/hooks";
import { permissions } from "../../utils/roles";
import RandomizationList from "./Tabs/RandomizationList";
import OptionGroup from "./Tabs/OptionGroup";
import MenuLabels from "./Tabs/MenuLabels";

const StudySettings = () => {
  const [type, setType] = useState("general");
  const [urlLoaded, setUrlLoaded] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const { studyPermissions } = useAppSelector((state) => state.user);
  const status = useAppSelector((state) => state.study.status);

  const handleChange = (_: any, newValue: string) => {
    setType(newValue);
  };

  const [hasAccess] = useState(
    studyPermissions.includes(permissions.studySettings)
  );

  const [canEdit] = useState(
    status === "not_live" &&
      studyPermissions.includes(permissions.studySettings)
  );

  return urlLoaded ? (
    <>
      <Box sx={HeaderStyle}>
        <Typography fontSize={20} fontWeight={600} color="text.primary">
          Study Settings
        </Typography>
        {type === "sites" && hasAccess && (
          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setShowModal(true)}
              startIcon={<Add />}
            >
              Add Sites
            </Button>
            {/* <Button variant="outlined">Import Sites</Button> */}
          </Box>
        )}
        {type === "randomization" && hasAccess && (
          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalContent("upload")}
              startIcon={<Add />}
            >
              Upload File
            </Button>

            {/* <Button
              variant="contained"
              onClick={() => setModalContent("randomization")}
              startIcon={<Add />}
            >
              Create Randomization
            </Button> */}
          </Box>
        )}
        {type === "option_group" && canEdit && (
          <Box sx={{ ml: "auto" }}>
            <Button
              variant="contained"
              onClick={() => setModalContent("optiongroup")}
              startIcon={<Add />}
            >
              Add Choice Value
            </Button>
          </Box>
        )}
      </Box>
      <>
        <Box sx={{ borderTop: 1, borderColor: "#E5E7EB" }}>
          <StyledTabs value={type} onChange={handleChange}>
            <StyledTab label="General" value="general" {...a11yProps(0)} />
            {/* <StyledTab
              label="Study Properties"
              value="study_properties"
              {...a11yProps(1)}
            /> */}
            <StyledTab label="Sites" value="sites" {...a11yProps(2)} />
            <StyledTab
              label="Randomization"
              value="randomization"
              {...a11yProps(3)}
            />
            <StyledTab
              label="Choice Values"
              value="option_group"
              {...a11yProps(4)}
            />
            <StyledTab
              label="Menu Labels"
              value="menu_labels"
              {...a11yProps(5)}
            />
          </StyledTabs>
        </Box>
        <Box sx={{ p: 3, overflow: "auto", height: "calc(100vh - 201px)" }}>
          <CustomTabPanel value={type} index={"general"}>
            <General canEdit={canEdit} />
          </CustomTabPanel>
          {/* <CustomTabPanel value={type} index={"study_properties"}>
            <StudyProperties canEdit={canEdit} />
          </CustomTabPanel> */}
          <CustomTabPanel value={type} index={"sites"}>
            <Sites
              showModal={showModal}
              setShowModal={setShowModal}
              canEdit={hasAccess}
            />
          </CustomTabPanel>
          {/* <CustomTabPanel value={type} index={"randomization"}>
            <Randomization canEdit={canEditSettings} />
          </CustomTabPanel> */}
          <CustomTabPanel value={type} index={"randomization"}>
            <RandomizationList
              modalContent={modalContent}
              setModalContent={setModalContent}
              canEdit={hasAccess}
            />
          </CustomTabPanel>
          <CustomTabPanel value={type} index={"option_group"}>
            <OptionGroup
              modalContent={modalContent}
              setModalContent={setModalContent}
              canEdit={canEdit}
            />
          </CustomTabPanel>
          <CustomTabPanel value={type} index={"menu_labels"}>
            <MenuLabels
              modalContent={modalContent}
              setModalContent={setModalContent}
              canEdit={canEdit}
            />
          </CustomTabPanel>
        </Box>
      </>
      <StudyUrlSetter type={type} />
    </>
  ) : (
    <StudyUrlLoader setType={setType} setUrlLoaded={setUrlLoaded} />
  );
};

export default StudySettings;
