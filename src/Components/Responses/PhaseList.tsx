import {
  Box,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
  Stack,
  SxProps,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { getFormData } from "../../Redux/actions/responseAction";
import { useParams } from "react-router-dom";
import { AmberIcon, GreenIcon, GreyIcon } from "./StatusIcons";
import { Lock, MoreVert } from "@mui/icons-material";
import { useState } from "react";
import { setSelectedPhase } from "../../Redux/reducers/responseSlice";
import { PhaseListForms } from "./types";
import LockModal from "./Modals/LockModal";

const wrapper: SxProps = {
  width: "400px",
  maxWidth: "100%",
  height: "100%",
  top: "0px",
  position: "sticky",
  p: 2,

  overflowY: "hidden",

  "&:hover": {
    overflow: "auto",
  },
};

const wrapperCentered: SxProps = {
  ...wrapper,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const phaseStyle: SxProps = {
  width: "100%",
  p: 2,
  border: "1px solid",
  borderColor: "divider",

  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",

  "&:hover": {
    cursor: "pointer",
    bgcolor: "#f6f6f6",
  },
};

const phaseFormStyle: SxProps = {
  width: "100%",
  py: 2,
  pr: 2,
  pl: 4,
  border: "1px solid",
  borderColor: "divider",

  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",

  "&:last-child": {
    borderRadius: "0px 0px 8px 8px",
  },

  "&:hover": {
    cursor: "pointer",
    bgcolor: "secondary.main",
  },
};

const phaseFormActiveStyle: SxProps = {
  ...phaseFormStyle,

  position: "relative",
  bgcolor: "secondary.main",
};

const phaseFormActiveBarStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: 0,
  transform: "translateY(-50%)",

  height: "54px",
  width: "4px",
  bgcolor: "primary.main",
};

const phaseStatus = (status: string) => {
  switch (status) {
    case "active":
      return {
        label: "Not Started",
        color: "text.primary",
        bgColor: "#F3F4F6",
      };
    case "inprogress":
      return {
        label: "In Progress",
        color: "#723B13",
        bgColor: "#FDF6B2",
      };
    case "completed":
      return {
        label: "Completed",
        color: "#0E9F6E",
        bgColor: "#DEF7EC",
      };
    default:
      return {
        label: "Not Started",
        color: "text.primary",
        bgColor: "#F3F4F6",
      };
  }
};

const progressStatus = (status: string) => {
  switch (status) {
    case "active":
      return {
        label: "Not Started",
        color: "#9CA3AF",
        icon: <GreyIcon />,
      };
    case "inprogress":
      return {
        label: "In Progress",
        color: "#FACA15",
        icon: <AmberIcon />,
      };
    case "completed":
      return {
        label: "Completed",
        color: "#31C48D",
        icon: <GreenIcon />,
      };

    default:
      return {
        label: "Not Started",
        color: "#9CA3AF",
        icon: <GreyIcon />,
      };
  }
};

type Props = {
  isLoading: boolean;
  selectedPhaseId: string;
  packageName?: string; // Only for Survey
  closeMobileDrawer?: () => void; // Only for Survey
  currentTab?: string;
};

const PhaseList = ({
  isLoading,
  selectedPhaseId,
  packageName,
  closeMobileDrawer,
  currentTab,
}: Props) => {
  const dispatch = useAppDispatch();
  const { id: studyId, participantId, surveySlug } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedItem, setSelectedItem] = useState<PhaseListForms | null>(null);
  const [showLockModal, setLockModal] = useState(false);

  const {
    selectedForm,
    phaseList,
    canLock,
    fieldSubmitting: isResponseSubmitting,
    isLoading: isResponseLoading,
    surveyAssignmentId,
  } = useAppSelector((state) => state.response);

  const handlePhaseSelect = (phaseId: string) => {
    dispatch(setSelectedPhase({ phase: phaseId, toggle: true }));
  };

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    form: PhaseListForms
  ) => {
    event.stopPropagation();
    if (isResponseSubmitting || isResponseLoading) return;

    setSelectedItem(form);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const closeModal = () => {
    setLockModal(false);
    setSelectedItem(null);
  };

  const lockForm = () => {
    setLockModal(true);
    handleCloseMenu();
  };

  return (
    <Paper sx={phaseList?.length === 0 ? wrapperCentered : wrapper}>
      {isLoading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {phaseList?.length !== 0 && packageName && (
        <Typography sx={{ my: 2, fontWeight: 600, fontSize: 20 }}>
          {packageName}
        </Typography>
      )}

      {phaseList?.length > 0 &&
        phaseList.map((phase) => (
          <Stack key={phase.id}>
            <Stack
              direction={"row"}
              sx={{
                ...phaseStyle,
                borderRadius:
                  phase.id !== selectedPhaseId ? "8px" : "8px 8px 0px 0px",
                borderBottom:
                  phase.phaseForms.length > 0 && selectedPhaseId === phase.id
                    ? "none"
                    : "",
              }}
              marginBottom={phase.id !== selectedPhaseId ? 2 : 0}
              onClick={() => {
                if (isResponseSubmitting || isResponseLoading) return;

                handlePhaseSelect(phase.id);
              }}
            >
              <Stack>
                <Typography
                  fontSize={"18px"}
                  fontWeight={600}
                  color={"primary.main"}
                >
                  {phase?.name}
                </Typography>
                {phase.phaseStatus && (
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <Typography
                      fontWeight={"500"}
                      fontSize={"12px"}
                      bgcolor={phaseStatus(phase.phaseStatus)?.bgColor}
                      color={phaseStatus(phase.phaseStatus)?.color}
                      sx={{
                        p: "2px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      {phaseStatus(phase.phaseStatus)?.label}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              {/* <IconButton>
                <MoreVert />
              </IconButton> */}
            </Stack>

            {phase.id === selectedPhaseId &&
              phase.phaseForms?.length > 0 &&
              phase.phaseForms.map((form, i) => (
                <Stack
                  key={form.id}
                  direction={"row"}
                  sx={
                    form.id === selectedForm?.id
                      ? phaseFormActiveStyle
                      : phaseFormStyle
                  }
                  marginBottom={
                    i === phase.phaseForms?.length - 1 && form ? 2 : 0
                  }
                  onClick={() => {
                    if (isResponseSubmitting || isResponseLoading) return;

                    if (closeMobileDrawer) {
                      closeMobileDrawer();
                    }
                    if (form.id !== selectedForm?.id) {
                      dispatch(
                        getFormData({
                          studyId,
                          selectedForm: form,
                          participantId,
                          surveySlug,
                        })
                      );
                    }
                  }}
                >
                  {form.id === selectedForm?.id && (
                    <Box sx={phaseFormActiveBarStyle} />
                  )}

                  <Stack gap={1}>
                    <Typography
                      fontWeight={600}
                      color={
                        form.id === selectedForm?.id
                          ? "primary.main"
                          : "text.secondary"
                      }
                      fontSize={"16px"}
                    >
                      {form?.name}
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                      {progressStatus(form.status)?.icon}
                      <Typography
                        fontWeight={"500"}
                        fontSize={"12px"}
                        color={progressStatus(form.status)?.color}
                      >
                        {progressStatus(form.status)?.label}
                      </Typography>
                      {form.locked && (
                        <Lock sx={{ fontSize: "16px" }} color="primary" />
                      )}
                    </Stack>
                  </Stack>

                  {canLock && !surveySlug && !surveyAssignmentId && (
                    <IconButton onClick={(e) => handleClick(e, form)}>
                      <MoreVert />
                    </IconButton>
                  )}
                </Stack>
              ))}
          </Stack>
        ))}

      <Menu
        id="Phase-Item-Menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={lockForm}>
          {selectedItem?.locked ? "Unlock Form" : "Lock Form"}
        </MenuItem>
      </Menu>

      {showLockModal && selectedItem && (
        <LockModal
          form={selectedItem}
          show={showLockModal}
          onClose={closeModal}
        />
      )}
      {phaseList?.length === 0 && (
        <Typography sx={{ fontWeight: 600 }} color={"primary.main"}>
          No {currentTab} found
        </Typography>
      )}
    </Paper>
  );
};
export default PhaseList;
