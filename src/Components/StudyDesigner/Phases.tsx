import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Add,
  KeyboardArrowDown,
  Menu as MenuIcon,
  MoreVert,
  Print,
} from "@mui/icons-material";
import { HeaderStyle, StudyCard, studyCardContent } from "./style";
import { NoDataContainer } from "../Common/styles/table";
import { repeatedDataTypes } from "../../utils/question";
import { StudyTabsPhaseData } from "./StudyTab";

type Props = {
  phaseData: StudyTabsPhaseData[];
  type: any;
  openModal: any;
  handleSelectedPhase: any;
  selectedPhase: any;
  handleMenuClick: any;
  canEdit: boolean;
};

const Phases = ({
  phaseData,
  type,
  openModal,
  handleSelectedPhase,
  selectedPhase,
  handleMenuClick,
  canEdit,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<any>(null);

  const open = Boolean(anchorEl);
  return (
    <>
      <Box sx={{ ...StudyCard, flex: 1 }}>
        <Box sx={HeaderStyle}>
          <Typography variant="subtitle2" fontWeight="medium">
            {type?.headerLabel || "Phases"}
          </Typography>

          <Typography variant="subtitle2" fontWeight="medium">
            ({phaseData?.length})
          </Typography>

          {canEdit && (
            <Box sx={{ ml: "auto" }}>
              <Button
                variant="outlined"
                endIcon={<KeyboardArrowDown />}
                onClick={(e) => setAnchorEl(e?.currentTarget)}
              >
                Actions
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "#E5E7EB" }} />

        <Box sx={studyCardContent}>
          {phaseData?.length ? (
            phaseData?.map((item) => (
              <Box
                key={item?.id}
                onClick={() => handleSelectedPhase(item)}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ paddingBlock: "4px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // gap: 2,
                      minHeight: "52px",
                      bgcolor:
                        selectedPhase === item?.id
                          ? "secondary.main"
                          : "transparent",
                    }}
                  >
                    <Box
                      sx={{
                        width: "5px",
                        height: "52px",
                        bgcolor:
                          selectedPhase === item?.id
                            ? "primary.main"
                            : "transparent",
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                      }}
                    />
                    {item?.type ? (
                      <Box paddingY={1.5} ml={2}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="regular"
                          sx={{
                            color:
                              selectedPhase === item?.id
                                ? "primary.main"
                                : "text.primary",
                            flex: 1,
                            minWidth: "0px",
                          }}
                          title={item?.name}
                          noWrap
                        >
                          {item?.name}
                        </Typography>
                        <Chip
                          size="small"
                          sx={{
                            padding: "2px 8px",
                            backgroundColor: "#F3F4F6",
                            fontWeight: "regular",
                            mt: 1,
                            borderRadius: "8px",
                          }}
                          label={`
                        ${repeatedDataTypes[item?.type]}`}
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant="subtitle1"
                        fontWeight="regular"
                        sx={{
                          color:
                            selectedPhase === item?.id
                              ? "primary.main"
                              : "text.primary",
                          ml: 2,
                          flex: 1,
                          minWidth: "0px",
                        }}
                        title={item?.name}
                        noWrap
                      >
                        {item?.name}
                      </Typography>
                    )}
                    {canEdit && (
                      <IconButton
                        sx={{ ml: "auto" }}
                        onClick={(e) => handleMenuClick(e, item, "phase")}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Divider sx={{ borderColor: "#E5E7EB", marginInline: 2 }} />
              </Box>
            ))
          ) : (
            <NoDataContainer>
              <Typography variant="body1" color="gray">
                No Data
              </Typography>
            </NoDataContainer>
          )}
        </Box>
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            openModal("phase");
          }}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText> {type?.buttonLabel || "add"}</ListItemText>
        </MenuItem>
        {type.val !== "surveyPackage" && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              openModal("print");
            }}
          >
            <ListItemIcon>
              <Print />
            </ListItemIcon>
            <ListItemText> Print Forms</ListItemText>
          </MenuItem>
        )}
        {phaseData?.length > 1 && type.val !== "surveyPackage" && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              openModal("rearrangePhases");
            }}
          >
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText>Rearrange</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Phases;
