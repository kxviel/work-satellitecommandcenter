import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  handleTabErrors,
  setQuestionModalDetails,
} from "../../../Redux/reducers/questionSlice";
import {
  QuestionLabelMap,
  choice_types,
  no_advanced_types,
  no_validation_types,
} from "../questionTypes";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  SxProps,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { a11yProps, ModalTabPanel } from "../../Common/UI/TabPanel";
import { ModalBaseStyles } from "../../Common/styles/modal";
import ChoiceTab from "./ChoiceTab";
import { BasicTab } from "./BasicTab";
import { saveQuestion } from "../../../Redux/actions/questionAction";
import { submitValidation } from "./utils";
import RepeatedConfigTab from "./RepeatedConfigTab";
import ValidationTab from "./ValidationTab";
import DependencyTab from "./DependencyTab";
import GridConfigTab from "./GridConfigTab";
import { AdvancedTab } from "./AdvancedTab";

export enum ValidationTypes {
  error = "error",
  warning = "warning",
  info = "info",
}

const QuestionPropertiesModal: React.FC = () => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(({ question }) => question.loading);
  const editable = useAppSelector(({ question }) => question.editable);
  const modalIsEdit = useAppSelector(({ question }) => question.modalIsEdit);
  const currentQuestion = useAppSelector(
    ({ question }) => question.modalQuestion
  );
  const isBasicError = useAppSelector(({ question }) => question.isBasicError);
  const isChoicesError = useAppSelector(
    ({ question }) => question.isChoicesError
  );
  const isRepeatedConfigError = useAppSelector(
    ({ question }) => question.isRepeatedConfigError
  );
  const isGridConfigError = useAppSelector(
    ({ question }) => question.isGridConfigError
  );
  const isValidationsError = useAppSelector(
    ({ question }) => question.isValidationsError
  );
  const isDependencyError = useAppSelector(
    ({ question }) => question.isDependencyError
  );

  const [tabIndex, setTabIndex] = useState("basic");
  // const [noLocalTabError, setNoLocalTabError] = useState(true);

  let indicatorColor = "primary.main";
  if (tabIndex === "basic" && isBasicError) {
    indicatorColor = "error.main";
  } else if (tabIndex === "choices" && isChoicesError) {
    indicatorColor = "error.main";
  } else if (tabIndex === "validations" && isValidationsError) {
    indicatorColor = "error.main";
  } else if (tabIndex === "dependency" && isDependencyError) {
    // } else if (tabIndex === "dependency" && isDependencyError && !noLocalTabError ) {
    indicatorColor = "error.main";
  } else {
    indicatorColor = "primary.main";
  }

  const closeModal = () => {
    dispatch(
      setQuestionModalDetails({
        show: false,
        question: null,
        currentIndex: null,
        parentIndex: null,
        modalIsEdit: false,
      })
    );
    dispatch(
      handleTabErrors({
        errorHandler: {
          basic: "",
          choices: "",
          repeatedConfig: "",
          gridConfig: "",
          validations: "",
          dependency: "",
        },
      })
    );
  };

  const submitHandler = () => {
    const validation = submitValidation(currentQuestion);
    dispatch(handleTabErrors({ errorHandler: validation }));

    if (validation.ok) {
      dispatch(saveQuestion(modalIsEdit));
    }
  };

  const changetabIndex = (_: any, oldValue: string) => {
    setTabIndex(oldValue);
  };

  const getTabSx = (isError: boolean): SxProps => ({
    textTransform: "capitalize",
    color: isError ? "error.main" : "primary.main",
    "&.Mui-selected": {
      color: isError ? "error.main" : "primary.main",
    },
  });

  return (
    <Modal open={true}>
      <Box
        sx={{
          ...ModalBaseStyles,
          width: "56vw",
          maxHeight: "90vh",
        }}
      >
        <Typography variant="h5" fontWeight="medium" mb={1}>
          {currentQuestion
            ? QuestionLabelMap[currentQuestion.type]
            : "Question"}
        </Typography>
        <Box sx={{ borderBottom: 1, borderBottomColor: "#E5E7EB" }}>
          <Tabs
            value={tabIndex}
            onChange={changetabIndex}
            aria-label="Modal Settings"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: indicatorColor,
              },
            }}
          >
            <Tab
              label="Basic"
              value="basic"
              {...a11yProps(0)}
              sx={getTabSx(!!isBasicError)}
            />
            {choice_types.includes(currentQuestion.type) && (
              <Tab
                label="Choices"
                value="choices"
                {...a11yProps(1)}
                sx={getTabSx(!!isChoicesError)}
              />
            )}
            {currentQuestion.type === "repeated_data" && (
              <Tab
                label="Repeated Config"
                value="repeatedConfig"
                {...a11yProps(2)}
                sx={getTabSx(!!isRepeatedConfigError)}
              />
            )}
            {currentQuestion.type === "grid" && (
              <Tab
                label="Grid Config"
                value="gridConfig"
                {...a11yProps(3)}
                sx={getTabSx(!!isGridConfigError)}
              />
            )}
            {!no_validation_types.includes(currentQuestion.type) && (
              <Tab
                label="Validation"
                value="validations"
                {...a11yProps(4)}
                sx={getTabSx(!!isValidationsError)}
              />
            )}

            <Tab
              label="Dependencies"
              value="dependency"
              {...a11yProps(5)}
              sx={getTabSx(!!isDependencyError)}
              // sx={getTabSx(!!isDependencyError || !noLocalTabError)}
            />
            {!no_advanced_types.includes(currentQuestion.type) && (
              <Tab
                label="Advanced"
                value="advanced"
                {...a11yProps(6)}
                sx={getTabSx(false)}
              />
            )}
          </Tabs>
        </Box>
        <ModalTabPanel value={tabIndex} index={"basic"}>
          <BasicTab isEdit={modalIsEdit} question={currentQuestion} />
        </ModalTabPanel>
        <ModalTabPanel value={tabIndex} index={"choices"}>
          <ChoiceTab question={currentQuestion} />
        </ModalTabPanel>
        <ModalTabPanel value={tabIndex} index={"repeatedConfig"}>
          <RepeatedConfigTab question={currentQuestion} />
        </ModalTabPanel>
        <ModalTabPanel value={tabIndex} index={"gridConfig"}>
          <GridConfigTab question={currentQuestion} />
        </ModalTabPanel>
        <ModalTabPanel value={tabIndex} index={"validations"}>
          <ValidationTab question={currentQuestion} />
        </ModalTabPanel>
        <ModalTabPanel value={tabIndex} index={"dependency"}>
          <DependencyTab
            question={currentQuestion}
            // setNoLocalTabError={setNoLocalTabError}
          />
        </ModalTabPanel>
        <ModalTabPanel value={tabIndex} index={"advanced"}>
          <AdvancedTab question={currentQuestion} />
        </ModalTabPanel>

        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={closeModal} disabled={isLoading}>
            {editable ? "Cancel" : "Close"}
          </Button>
          {editable && (
            <Button
              variant="contained"
              onClick={submitHandler}
              sx={{ ml: 2 }}
              disabled={isLoading}
              // disabled={isLoading || !noLocalTabError}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : modalIsEdit ? (
                "Save"
              ) : (
                "Add"
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default QuestionPropertiesModal;
