import { styled, Tabs, Tab, TabProps } from "@mui/material";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme }) => ({
  backgroundColor: "#ffffff",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiTabs-flexContainer": {
    height: "56px",
  },
}));

export const StyledTab = styled((props: TabProps) => <Tab {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    color: theme.palette.text.secondary,
    "&.Mui-selected": {
      color: theme.palette.primary.main,
      fontWeight: "600",
    },
  })
);

export const MainTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2.5 }}>{children}</Box>}
    </div>
  );
};

export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const ModalTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};
