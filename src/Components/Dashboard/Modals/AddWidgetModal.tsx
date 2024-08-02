import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { NoDataContainer } from "../../Common/styles/table";
import { useParams } from "react-router-dom";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  refreshPage: () => void;
  widgets: string[];
};

const AddWidgetModal = ({
  showModal,
  closeModal,
  refreshPage,
  widgets,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [widgetList, setWidgetList] = useState<any[]>([]);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [selectedWidgets, setSelectedWidgets] = useState<any[]>([...widgets]);
  const { id: studyId } = useParams();

  useEffect(() => {
    async function getWidgetsData() {
      try {
        setLoading(true);
        // const res = await http.get("/api/widgets");
        const data = [
          {
            id: 128,
            widgetKey: "total_sites",
            title: "Number of sites",
            description: "Total number of sites",
            image: "/total_sites.jpg",
          },
          {
            id: 126,
            widgetKey: "total_participants",
            title: "Number of signed inclusions",
            description: "Total number of Active participants",
            image: "/signed_inclusions.jpg",
          },
          {
            id: 127,
            widgetKey: "total_adverse_events",
            title: "Number of adverse events",
            description: "Total number of adverse events",
            image: "/adverse_events.jpg",
          },
          {
            id: 124,
            widgetKey: "total_queries",
            title: "Number of open queries",
            description: "Total number of queries",
            image: "/open_queries.jpg",
          },
          {
            id: 111,
            widgetKey: "total_locked_participants",
            title: "Number of Locked Participants",
            description: "Total number of Locked Participants",
            image: "/locked_participants.jpg",
          },
          {
            id: 121324,
            widgetKey: "total_locked_forms",
            title: "Number of locked forms",
            description: "Total number of locked forms",
            image: "/locked_forms.jpg",
          },
          {
            id: 129234,
            widgetKey: "participant_creation_over_time",
            title: "Participant Creation Over Time",
            description: "Timeline of Participants Created Over Time",
            image: "/participant_creation_overtime.jpg",
          },
          {
            id: 129,
            widgetKey: "participant_insights",
            title: "Participant Insights",
            description: "Participant Insights",
            image: "/ParticipantInsights.jpg",
          },
          {
            id: 13,
            widgetKey: "participant_list_for_3month_view_reminders",
            title: "Participant List for 3 months reminder",
            description: "List of all participants for 3 months reminder",
            image: "/ParticipantsList.jpg",
          },
          {
            id: 12,
            widgetKey: "participant_list_for_6month_view_reminders",
            title: "Participant List for 6 months reminder",
            description: "List of all participants for 6 months reminder",
            image: "/ParticipantsList.jpg",
          },
          {
            id: 11,
            widgetKey: "participant_list_for_12month_view_reminders",
            title: "Participant List for 12 months reminder",
            description: "List of all participants for 12 months reminder",
            image: "/ParticipantsList.jpg",
          },
          {
            id: 131,
            widgetKey: "participants_by_site",
            title: "Participant By Site",
            description: "List of all participants by site",
            image: "/participants_bysite.jpg",
          },
          {
            id: 132,
            widgetKey: "randomized_participants_by_site",
            title: "Randomized Participant By Site",
            description: "List of all randomized participants by site",
            image: "/participants_bysite.jpg",
          },
          {
            id: 133,
            widgetKey: "queries_by_site",
            title: "Queries By Site",
            description: "List of all queries by site",
            image: "/queries_bysite.jpg",
          },
          {
            id: 134,
            widgetKey: "survey_package_completion",
            title: "Completed survey packages",
            description: "List of all completed survey packages",
            image: "/survey_packages.jpg",
          },
        ];
        // const filteredWidgets = data.filter(
        //   (widget) => !widgets.includes(widget.widgetKey)
        // );

        setWidgetList(data);
      } catch (error) {
        errorToastMessage(error as Error);
      } finally {
        setLoading(false);
      }
    }

    getWidgetsData();
  }, [widgets]);

  const handleCheckboxToggle = (key: string) => {
    if (selectedWidgets.includes(key)) {
      setSelectedWidgets(selectedWidgets.filter((item) => item !== key));
    } else {
      setSelectedWidgets([...selectedWidgets, key]);
    }
  };

  async function submitHandler() {
    try {
      setSubmitLoader(true);
      const body = {
        keys: [...selectedWidgets],
      };
      const res = await http.post(
        `/study/${studyId}/user-dashboard/widgets`,
        body
      );
      toastMessage("success", res?.data?.message);
      closeModal();
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
    } finally {
      setSubmitLoader(false);
    }
  }

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box
        sx={{
          ...ModalBaseStyles,
          maxHeight: "95vh",
          width: {
            xs: "96vw",
            md: "53vw",
          },
        }}
      >
        <ModalHeader title={"Add Widget"} onCloseClick={closeModal} />
        {!loading ? (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {widgetList?.map((item: any) => (
              <Box
                key={item.widgetKey}
                display="flex"
                alignItems="center"
                width={"100%"}
                height={"150px"}
              >
                <Checkbox
                  checked={selectedWidgets.includes(item?.widgetKey)}
                  icon={<CheckBoxOutlineBlank />}
                  onChange={() => handleCheckboxToggle(item?.widgetKey)}
                  checkedIcon={<CheckBox />}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Box
                    sx={{
                      height: "200px",
                      width: "300px",
                      display: "flex",
                      alignItems: "center",
                      "& .image": {
                        maxWidth: "300px",
                        maxHeight: "200px",
                      },
                      ml: 2,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="image"
                      style={{ objectFit: "contain" }}
                      loading="lazy"
                    />
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="subtitle1">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            {!loading && widgetList?.length === 0 && (
              <NoDataContainer>
                <Typography variant="body1" color="gray">
                  All widgets have been added!
                </Typography>
              </NoDataContainer>
            )}
            <Box sx={{ ...ModalActionButtonStyles, mt: 3 }}>
              {!submitLoader ? (
                <>
                  <Button onClick={closeModal} variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={selectedWidgets.length === 0}
                    onClick={submitHandler}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <CircularProgress size={25} />
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddWidgetModal;
