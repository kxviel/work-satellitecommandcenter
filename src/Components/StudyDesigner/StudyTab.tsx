import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import http from "../../utils/http";
import AddVisitModal from "./AddVisitModal";
import AddPhaseFormModal from "./AddPhaseFormModal";
import RearrangeModal from "./RearrangeModal";
import Phases from "./Phases";
import Forms from "./Forms";
import { useNavigate, useParams } from "react-router-dom";
import { StudyTabContent } from "./style";
import AddRepeatingModal from "./AddRepeatingModal";
import DeleteConfirmModal from "../Common/UI/DeleteConfirm";
import AddSurveyModal from "./AddSurveyModal";
import { repeatedDataTypes } from "../../utils/question";

type SelectedPhase = {
  id: string;
  type: string;
  eventType?: string;
  deleted: boolean;
};

export type StudyTabsPhaseData = {
  id: string;
  name: string;
  duration: string;
  position: number;
  description: string;
  type: string;
};

type Props = {
  type: {
    buttonLabel: string;
    headerLabel: string;
    val: string; // "repeated_data" | "visit" | "survey" | "surveyPackage"
  };
  canEdit: boolean;
  menuLabels: any;
};

const StudyTab = ({ type, canEdit, menuLabels }: Props) => {
  const messageMap: any = {
    visit: menuLabels?.visit || "Visit",
    repeated_data: menuLabels?.repeating_data || "Repeating data",
    survey: menuLabels?.survey || "Survey",
  };
  const { id: studyId } = useParams();
  const navigate = useNavigate();

  const [phaseData, setPhaseData] = useState<StudyTabsPhaseData[]>([]);
  const [formsData, setFormsData] = useState<any>([]);
  const [formName, setFormName] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<SelectedPhase>({
    id: "",
    type: "",
    eventType: "",
    deleted: false,
  });
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [showModal, setShowModal] = useState("");
  const [phaseToggleLoader, setPhaseToggleLoader] = useState(false);
  const [formToggleLoader, setFormToggleLoader] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [triggerEvent, setTriggerEvent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=${type.val}`
        );
        const data = res.data?.data;

        const formattedData = data
          ?.map((item: any) => ({
            id: item?.id,
            name: item?.name || "",
            duration: item?.duration ?? "",
            position: item?.position || 1,
            description: item?.description || "",
            introText: item?.introText || "",
            outroText: item?.outroText || "",
            remarks: item?.remarks || "",
            type: item?.type || "",
          }))
          .sort((a: any, b: any) => a.position - b.position);

        const session = sessionStorage?.getItem("selected-phase-id");
        let selected: any = null;
        if (session) {
          selected = formattedData.find((phase: any) => session === phase?.id);
        }
        sessionStorage.removeItem("selected-phase-id");

        setPhaseData(formattedData || []);
        setSelectedPhase((prev) =>
          prev.type === type.val
            ? { ...prev }
            : selected
            ? {
                id: selected?.id,
                name: selected?.name,
                type: selected?.id ? type.val : "",
                eventType: selected?.id ? selected?.type : "",
                deleted: !selected?.id,
              }
            : {
                id: formattedData?.[0]?.id,
                name: formattedData?.[0]?.name,
                type: formattedData?.[0]?.id ? type.val : "",
                eventType: formattedData?.[0]?.id
                  ? formattedData?.[0]?.type
                  : "",
                deleted: !formattedData?.[0]?.id,
              }
        );
        // setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    if (type.val) {
      fetchPhaseData();
    }
  }, [phaseToggleLoader, type.val, studyId]);

  useEffect(() => {
    const fetchFormsData = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase/${selectedPhase?.id}`
        );
        const data = res.data?.data;
        setFormName(data?.name || "");

        const newData = data?.phaseForms
          .map((item: any) => ({
            id: item?.id,
            name: item?.form?.name || "",
            description: item?.form?.description || "",
            position: item?.position || 1,
            formId: item?.form?.id || "",
          }))
          .sort((a: any, b: any) => a.position - b.position);

        setFormsData(newData || []);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    if (selectedPhase?.id) {
      fetchFormsData();
    } else if (selectedPhase?.deleted) {
      setFormsData([]);
      setFormName("");
      setLoading(false);
    }
  }, [setLoading, selectedPhase, formToggleLoader, studyId]);

  const handleSelectedPhase = (item: StudyTabsPhaseData) => {
    setSelectedPhase({
      id: item?.id,
      type: type.val,
      eventType: item?.type,
      deleted: false,
    });
  };

  const phaseRefresh = () => {
    setPhaseToggleLoader((prev) => !prev);
  };

  const formRefresh = () => {
    setFormToggleLoader((prev) => !prev);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    menuData: any,
    name: string
  ) => {
    event.stopPropagation();
    setTriggerEvent(name);
    if (name === "phase") {
      setDeleteConfirmation({
        title: `Delete ${
          type.val === "visit"
            ? menuLabels?.visit || "Visit"
            : type.val === "repeated_data"
            ? menuLabels?.repeating_data || "Repeating Data"
            : menuLabels?.survey || "Survey"
        } ?`,
        description: `Are you sure you want to delete ${menuData?.name} ?`,
      });
    } else if (name === "form") {
      setDeleteConfirmation({
        title: "Delete Form ?",
        description: `Are you sure you want to delete ${menuData?.name} ?`,
      });
    }
    setRowData(menuData);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setRowData(null);
  };

  const openModal = async (name: string) => {
    if (name !== "print") {
      setShowModal(name);
    } else {
      try {
        await http.post(`/study/${studyId}/print?type=${type?.val}`);
        window.open(`/print/study/${studyId}/phase/${type?.val}`, "_blank");
      } catch (err) {
        errorToastMessage(err as Error);
      }
    }
  };

  const closeModal = () => {
    setShowModal("");
    setRowData(null);
  };

  const handleDelete = async () => {
    try {
      handleMenuClose();
      setLoading(true);
      let url = `/study/${studyId}/study-phase`;
      let message: string = "";
      if (triggerEvent === "phase") {
        url += `/${rowData?.id}`;
      } else {
        url += `/${selectedPhase?.id}/phase_form/${rowData?.id}`;
      }

      await http.delete(url);
      if (triggerEvent === "phase") {
        phaseRefresh();
        if (selectedPhase?.id === rowData?.id) {
          setSelectedPhase({
            id: "",
            type: "",
            eventType: "",
            deleted: true,
          });
        }
        message = `${messageMap[type.val]} deleted successfully`;
      } else if (triggerEvent === "form") {
        formRefresh();
        message = "Form deleted successfully";
      }
      setShowDeleteModal(false);
      toastMessage("success", message);
    } catch (err) {
      errorToastMessage(err as Error);
      setLoading(false);
    }
  };
  const labelForOptions = (event: string, type: string) => {
    if (event === "phase") {
      if (type === "visit") {
        return menuLabels?.visit?.toLowerCase() || "visit";
      } else if (type === "repeated_data") {
        return menuLabels?.repeating_data?.toLowerCase() || "repeating data";
      } else {
        return menuLabels?.survey?.toLowerCase() || "survey";
      }
    } else {
      return "form";
    }
  };

  const handlePreviewClick = (formId: string) => {
    sessionStorage.setItem("selected-phase-id", selectedPhase?.id);
    navigate(`/studies/${studyId}/form/${formId}/preview`);
  };

  const printForm = async () => {
    try {
      setAnchorEl(null);
      const formId = rowData?.formId;
      setRowData(null);
      await http.post(`/study/${studyId}/print?type=form&formId=${formId}`);
      window.open(`/print/study/${studyId}/form/${formId}`, "_blank");
    } catch (err) {
      errorToastMessage(err as Error);
    }
  };

  return (
    <>
      {loading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box sx={StudyTabContent}>
        <Phases
          phaseData={phaseData}
          type={type}
          openModal={openModal}
          handleMenuClick={handleMenuClick}
          handleSelectedPhase={handleSelectedPhase}
          selectedPhase={selectedPhase?.id}
          canEdit={canEdit}
        />
        <Forms
          formName={formName}
          phaseData={phaseData}
          formsData={formsData}
          selectedPhase={selectedPhase?.id}
          eventType={selectedPhase?.eventType ?? ""}
          openModal={openModal}
          handleMenuClick={handleMenuClick}
          handlePreviewClick={handlePreviewClick}
          type={type}
          canEdit={canEdit}
          menuLabels={menuLabels}
        />
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            openModal(triggerEvent);
          }}
        >
          <ListItemText>
            Edit {labelForOptions(triggerEvent, type?.val)}
          </ListItemText>
        </MenuItem>
        {triggerEvent === "form" && (
          <MenuItem onClick={printForm}>
            <ListItemText>Print Form</ListItemText>
          </MenuItem>
        )}
        {triggerEvent === "form" && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              sessionStorage.setItem("selected-phase-id", selectedPhase?.id);
              navigate(`/studies/${studyId}/form/${rowData?.formId}/edit`);
            }}
          >
            <ListItemText>Open in form editor</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => setShowDeleteModal(true)}>
          <ListItemText sx={{ color: "#F05252" }}>
            Delete {labelForOptions(triggerEvent, type?.val)}
          </ListItemText>
        </MenuItem>
      </Menu>

      {showModal === "phase" && type?.val === "visit" && (
        <AddVisitModal
          showModal={showModal === "phase"}
          closeModal={closeModal}
          data={rowData}
          studyId={studyId}
          refreshPage={phaseRefresh}
          menuLabels={menuLabels}
        />
      )}
      {showModal === "phase" && type?.val === "repeated_data" && (
        <AddRepeatingModal
          showModal={showModal === "phase"}
          closeModal={closeModal}
          data={rowData}
          studyId={studyId}
          refreshPage={phaseRefresh}
          menuLabels={menuLabels}
        />
      )}
      {showModal === "phase" && type?.val === "survey" && (
        <AddSurveyModal
          showModal={showModal === "phase"}
          closeModal={closeModal}
          data={rowData}
          studyId={studyId}
          refreshPage={phaseRefresh}
          menuLabels={menuLabels}
        />
      )}
      {showModal === "form" && (
        <AddPhaseFormModal
          showModal={showModal === "form"}
          closeModal={closeModal}
          data={{
            ...rowData,
            phaseName:
              type?.val === "repeated_data" && selectedPhase?.eventType
                ? repeatedDataTypes?.[selectedPhase?.eventType]
                : formName,
          }}
          studyId={studyId}
          phaseId={selectedPhase?.id}
          formId={rowData?.formId}
          refreshPage={formRefresh}
        />
      )}
      {(showModal === "rearrangePhases" || showModal === "rearrangeForms") && (
        <RearrangeModal
          closeModal={closeModal}
          type={showModal}
          items={showModal === "rearrangePhases" ? phaseData : formsData}
          studyId={studyId}
          phaseId={selectedPhase?.id}
          refreshPage={
            showModal === "rearrangePhases" ? phaseRefresh : formRefresh
          }
          category={type.val}
          menuLabels={menuLabels}
        />
      )}
      <DeleteConfirmModal
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
        onOk={handleDelete}
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          handleMenuClose();
        }}
      />
    </>
  );
};

export default StudyTab;
