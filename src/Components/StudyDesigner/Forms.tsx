import React from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { Add, Menu, MoreVert } from "@mui/icons-material";
import { HeaderStyle, StudyCard, studyCardContent } from "./style";
import { NoDataContainer } from "../Common/styles/table";
import { MenuLabels } from "../../Redux/reducers/studySlice";
type Props = {
  formName: string;
  phaseData: any[];
  formsData: any[];
  selectedPhase: string;
  eventType?: string;
  openModal: (name: string) => void;
  handleMenuClick: (
    event: React.MouseEvent<HTMLElement>,
    menuData: any,
    name: string
  ) => void;
  type: any;
  canEdit: boolean;
  handlePreviewClick: Function;
  menuLabels?: MenuLabels;
};

const Forms = ({
  formName,
  phaseData,
  formsData,
  selectedPhase,
  eventType,
  openModal,
  handleMenuClick,
  type,
  canEdit,
  handlePreviewClick,
  menuLabels,
}: Props) => {
  const title = formName
    ? type?.val !== "surveyPackage"
      ? `Forms of ${formName}`
      : `${menuLabels?.survey || "Surveys"} of ${formName}`
    : type?.val !== "surveyPackage"
    ? "Forms"
    : `${menuLabels?.survey || "Surveys"}`;

  return (
    <Box sx={{ ...StudyCard, flex: 2 }}>
      <Box sx={HeaderStyle}>
        <Typography
          variant="subtitle2"
          fontWeight="medium"
          sx={{
            flex: 1,
            minWidth: "0px",
          }}
          noWrap
          title={title}
        >
          {title} ({formsData?.length})
        </Typography>

        {/* <Typography variant="subtitle2" fontWeight="medium">
          ({formsData?.length})
        </Typography> */}

        {phaseData?.length > 0 && selectedPhase && canEdit && (
          <Box sx={{ ml: "auto" }}>
            {formsData?.length > 1 && (
              <Button
                variant="outlined"
                startIcon={<Menu />}
                onClick={() => openModal("rearrangeForms")}
                sx={{ mr: 2 }}
              >
                Rearrange
              </Button>
            )}
            {eventType === "repeated_measure" && formsData?.length === 0 && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => openModal("form")}
              >
                Add Form
              </Button>
            )}
            {eventType !== "repeated_measure" && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => openModal("form")}
              >
                Add{" "}
                {type?.val !== "surveyPackage"
                  ? "Form"
                  : `${menuLabels?.survey || "Surveys"}`}
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "#E5E7EB" }} />

      <Box sx={studyCardContent}>
        {formsData?.length ? (
          formsData?.map((item: any) => {
            return (
              <Box
                key={item?.id}
                sx={{ paddingInline: 2, cursor: "pointer" }}
                onClick={() => {
                  handlePreviewClick(item.formId);
                }}
              >
                <Box sx={{ paddingBlock: "4px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: "52px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="regular"
                      sx={{
                        ml: "5px",
                        mr: "100px",
                        wordBreak: "break-word",

                        // Ellipsis
                        width: "80%",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item?.name || ""}
                    </Typography>
                    {/* <Typography variant="subtitle1" fontWeight="regular">
                      {item?.description || "-"}
                    </Typography> */}
                    {canEdit && (
                      <IconButton
                        sx={{ ml: "auto" }}
                        onClick={(e) => handleMenuClick(e, item, "form")}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Divider sx={{ borderColor: "#E5E7EB" }} />
              </Box>
            );
          })
        ) : (
          <NoDataContainer>
            <Typography variant="body1" color="gray">
              No Data
            </Typography>
          </NoDataContainer>
        )}
      </Box>
    </Box>
  );
};

export default Forms;
