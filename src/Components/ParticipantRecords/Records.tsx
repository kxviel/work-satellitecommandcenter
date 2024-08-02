import { Box } from "@mui/material";
import React, { useState } from "react";
import RecordsHeader from "./RecordsHeader";
import {
  MainTabPanel,
  // StyledTab,
  // StyledTabs,
  // a11yProps,
} from "../Common/UI/TabPanel";
import RecordsList from "./RecordsList";
// import { pageSize } from "../Common/styles/table";
import { useAppSelector } from "../../Redux/hooks";
import { permissions } from "../../utils/roles";
// import { setParticipantsPage } from "../../Redux/reducers/participantsSlice";

// const tabs = [
//   {
//     key: "list",
//     label: "List",
//   },
//   {
//     key: "visit",
//     label: "Visit",
//   },
//   {
//     key: "form",
//     label: "Form",
//   },
// ];

const Records = () => {
  // const dispatch = useAppDispatch();
  const [tab, setTab] = useState("list");
  const { studyPermissions } = useAppSelector((state) => state.user);
  // const tabChange = (event: React.ChangeEvent<{}>, newTab: string) => {
  //   setTab(newTab);
  //   dispatch(setParticipantsPage({ page: 0, pageSize: pageSize }));
  // };

  const [addUser] = useState(
    studyPermissions.includes(permissions.addParticipant)
  );
  return (
    <Box>
      <RecordsHeader addUser={addUser} />
      {/* <Box sx={{ borderTop: 1, borderColor: "#E5E7EB" }}>
        <StyledTabs value={tab} onChange={tabChange}>
          {tabs.map((tab, index) => (
            <StyledTab
              key={tab.key}
              label={tab.label}
              value={tab.key}
              {...a11yProps(index)}
            />
          ))}
        </StyledTabs>
      </Box> */}
      <Box sx={{ height: "calc(100vh - 144px)", overflow: "auto" }}>
        <MainTabPanel value={tab} index={tab}>
          <RecordsList
            // toggleLoader={toggleLoader}
            type={tab}
            // page={page}
            // setPage={setPage}
            // paginationModel={paginationModel}
            // setPaginationModel={setPaginationModel}
            // refreshPage={refreshPage}
          />
        </MainTabPanel>
      </Box>
    </Box>
  );
};

export default Records;
