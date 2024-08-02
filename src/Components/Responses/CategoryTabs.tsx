import { SxProps } from "@mui/material/styles";
import { Stack, Tab, Tabs } from "@mui/material";
import { a11yProps } from "../Common/UI/TabPanel";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { resetResponseFormState } from "../../Redux/reducers/responseSlice";
import { computeEditablePermission } from "../../Redux/actions/responseAction";
import { MenuLabels } from "../../Redux/reducers/studySlice";

type Props = {
  currentCategory: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
  menuLabels: MenuLabels;
};

const responsesSubheader: SxProps = {
  bgcolor: "background.paper",

  border: "1px solid",
  borderColor: "divider",
  borderLeft: "none",
  borderRight: "none",
};

const CategoryTabs = ({
  currentCategory,
  setCurrentCategory,
  menuLabels,
}: Props) => {
  const dispatch = useAppDispatch();

  const {
    viewRandomization,
    fieldSubmitting: isResponseSubmitting,
    isLoading: isResponseLoading,
  } = useAppSelector((state) => state.response);

  const resetSliceStates = () => {
    dispatch(resetResponseFormState());
  };

  const changetabIndex = (_: any, value: string) => {
    if (isResponseSubmitting || isResponseLoading) return;

    resetSliceStates();

    dispatch(computeEditablePermission(value));
    setCurrentCategory(value);
    sessionStorage.setItem("response-view", value);
  };

  return (
    <Stack sx={responsesSubheader}>
      <Tabs
        value={currentCategory}
        onChange={changetabIndex}
        aria-label="Response Category Tabs"
        sx={{ height: "56px" }}
      >
        <Tab
          label={menuLabels?.visit || "Visit"}
          value="visit"
          {...a11yProps(0)}
          sx={{ textTransform: "capitalize" }}
        />
        <Tab
          label={menuLabels?.repeating_data || "Repeating Data"}
          value="repeated_data"
          {...a11yProps(1)}
          sx={{ textTransform: "capitalize" }}
        />
        {viewRandomization && (
          <Tab
            label="Randomization"
            value="randomization"
            {...a11yProps(2)}
            sx={{ textTransform: "capitalize" }}
          />
        )}
        <Tab
          label={menuLabels?.survey || "Surveys"}
          value="surveys"
          {...a11yProps(3)}
          sx={{ textTransform: "capitalize" }}
        />
      </Tabs>
    </Stack>
  );
};
export default CategoryTabs;
