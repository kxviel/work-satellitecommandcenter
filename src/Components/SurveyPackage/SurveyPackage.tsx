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
import { useParams } from "react-router-dom";
import DeleteConfirmModal from "../Common/UI/DeleteConfirm";
import SurveyPackageModal from "../SurveyPackage/SurveyPackageModal";
import { StudyTabContent } from "../StudyDesigner/style";
import Phases from "../StudyDesigner/Phases";
import Forms from "../StudyDesigner/Forms";
import RearrangeModal from "./RearrangeModal";
import Survey from "./Modals/Survey";
import { MenuLabels } from "../../Redux/reducers/studySlice";
type Props = {
  type: {
    buttonLabel: string;
    headerLabel: string;
    val: string; // "repeated_data" | "visit" | "survey" | "surveyPackage"
  };
  canEdit: boolean;
  menuLabels: MenuLabels;
};

const SurveyPackage = ({ type, canEdit, menuLabels }: Props) => {
  const { id: studyId } = useParams();

  const [phaseData, setPhaseData] = useState<any>([]);
  const [formsData, setFormsData] = useState<any>([]);

  const [formName, setFormName] = useState("");
  const [selectedPhase, setSelectedPhase] = useState({
    id: "",
    type: "",
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
          `/study/${studyId}/survey-package`
        );
        const data = res.data?.data;

        const formattedData = data?.map((item: any) => ({
          id: item?.id,
          name: item?.name || "",
          introText: item?.introText || "",
          outroText: item?.outroText || "",
          remarks: item?.remarks || "",
          invitationSubject: item?.invitationSubject || "",
          invitationBody: item?.invitationBody || "",
          isReminder: !!item?.surveyReminder,
          surveyReminder: item?.surveyReminder || null,
        }));

        setPhaseData(formattedData || []);
        setSelectedPhase((prev) =>
          prev?.id
            ? { ...prev }
            : {
                id: formattedData?.[0]?.id,
                type: formattedData?.[0]?.id ? type.val : "",
                deleted: !formattedData?.[0]?.id,
              }
        );
        // setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    if (type?.val) {
      fetchPhaseData();
    }
  }, [phaseToggleLoader, type, studyId]);

  useEffect(() => {
    const fetchFormsData = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/survey-package/${selectedPhase?.id}`
        );
        const data = res.data?.data;
        setFormName(data?.name || "");

        const newData = data?.surveyLinks
          .map((item: any) => ({
            id: item?.id,
            name: item?.phase?.name || "",
            position: item?.position || 1,
            phaseId: item?.phase?.id || "",
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

  const handleSelectedPhase = (item: any) => {
    setSelectedPhase({
      id: item?.id,
      type: type.val,
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
        title: `Delete ${menuLabels?.survey_package || "Survey Package"} ?`,
        description: `Are you sure you want to delete ${menuData?.name} ?`,
      });
    } else if (name === "form") {
      setDeleteConfirmation({
        title: `Remove ${menuLabels?.survey_package || "Survey Package"} ?`,
        description: `Are you sure you want to remove ${menuData?.name} ?`,
      });
    }
    setRowData(menuData);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setRowData(null);
  };

  const openModal = (name: string) => {
    setShowModal(name);
  };

  const closeModal = () => {
    setShowModal("");
    setRowData(null);
  };

  const handleDelete = async () => {
    try {
      handleMenuClose();
      setLoading(true);
      let url = `/study/${studyId}/survey-package`;
      if (triggerEvent === "phase") {
        url += `/${rowData?.id}`;
      } else {
        url += `/${selectedPhase?.id}/package_link/${rowData?.id}`;
      }

      const res: AxiosResponse = await http.delete(url);
      if (triggerEvent === "phase") {
        phaseRefresh();
        if (selectedPhase?.id === rowData?.id) {
          setSelectedPhase({
            id: "",
            type: "",
            deleted: true,
          });
        }
      } else if (triggerEvent === "form") {
        formRefresh();
      }
      setShowDeleteModal(false);
      toastMessage("success", res.data?.message);
    } catch (err) {
      errorToastMessage(err as Error);
      setLoading(false);
    }
  };

  const handlePreviewClick = () => {};

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
          openModal={openModal}
          handleMenuClick={handleMenuClick}
          handlePreviewClick={handlePreviewClick}
          type={type}
          canEdit={canEdit}
          menuLabels={menuLabels}
        />
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {triggerEvent === "phase" && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              openModal(triggerEvent);
            }}
          >
            <ListItemText>Edit package</ListItemText>
          </MenuItem>
        )}
        {triggerEvent === "phase" ? (
          <MenuItem onClick={() => setShowDeleteModal(true)}>
            <ListItemText sx={{ color: "#F05252" }}>
              Delete package
            </ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => setShowDeleteModal(true)}>
            <ListItemText sx={{ color: "#F05252" }}>{`Remove ${
              menuLabels?.survey?.toLowerCase() || "survey"
            }`}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {showModal === "phase" && (
        <SurveyPackageModal
          showModal={showModal === "phase"}
          closeModal={closeModal}
          data={rowData}
          studyId={studyId}
          refreshPage={phaseRefresh}
          menuLabels={menuLabels}
        />
      )}
      {showModal === "form" && (
        <Survey
          showModal={showModal === "form"}
          closeModal={closeModal}
          studyId={studyId}
          packageId={selectedPhase?.id}
          refreshPage={formRefresh}
          menuLabels={menuLabels}
        />
      )}
      {showModal === "rearrangeForms" && (
        <RearrangeModal
          closeModal={closeModal}
          type={showModal}
          items={formsData}
          studyId={studyId}
          packageId={selectedPhase?.id}
          refreshPage={formRefresh}
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

export default SurveyPackage;
