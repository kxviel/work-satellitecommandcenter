import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";

type Props = {
  siteRoles: any[];
  showModal: boolean;
  closeModal: () => void;
  refreshPage: () => void;
};

const AddFormPermission = ({
  showModal,
  siteRoles,
  closeModal,
  refreshPage,
}: Props) => {
  const { id: studyId } = useParams();
  const [value, setValue] = useState<string>("");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [formData, setFormData] = useState<any>([]);
  const [checked, setChecked] = useState<any>({});

  const submitHandler = async () => {
    try {
      if (!value) {
        toastMessage("warning", "Please select a form");
        return;
      }
      const roleIds = Object.keys(checked)
        .map((key) => {
          if (checked[key]) {
            return key;
          } else {
            return null;
          }
        })
        .filter((r) => !!r);
      if (roleIds.length === 0) {
        toastMessage("warning", "Atleast one role should be blacklisted");
        return;
      }
      setSubmitLoader(true);
      const body = {
        formId: value,
        studyId,
        roleIds,
      };
      let res: AxiosResponse = await http.post(`/roles/form-matrix`, body);
      toastMessage("success", res.data.message);
      closeModal();
      refreshPage();
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };

  const handleChange = (id: string, checked: boolean) => {
    setChecked((prev: any) => {
      prev[id] = checked;
      return { ...prev };
    });
  };

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/forms?category=repeated_data,visit`
        );

        const formattedData = res.data?.data?.map((item: any) => ({
          phaseId: item?.id,
          name: item?.name || "",
        }));

        setFormData(formattedData || []);
      } catch (err) {
        errorToastMessage(err as Error);
      }
    };
    fetchPhaseData();
  }, [studyId]);

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <ModalHeader title={"Add Form"} onCloseClick={closeModal} />
        <FormControl sx={InputWrapper}>
          <FormLabel sx={LabelStyle} htmlFor="repeatingData">
            Form
          </FormLabel>
          <Select
            id="form"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          >
            {formData?.length ? (
              formData?.map((item: any) => (
                <MenuItem key={item.phaseId} value={item.phaseId}>
                  {item.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"None"} value={""} disabled>
                No Data available
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <FormLabel component="legend" sx={{ mt: 2 }}>
          Blacklisted roles
        </FormLabel>
        <FormGroup>
          {siteRoles.map((role) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked?.[role.id] || false}
                    onChange={(e) => handleChange(role.id, e.target.checked)}
                  />
                }
                label={role.label}
                key={role.id}
              />
            );
          })}
        </FormGroup>
        <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
          {!submitLoader ? (
            <>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={submitHandler} variant="contained">
                Add
              </Button>
            </>
          ) : (
            <CircularProgress size={25} />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AddFormPermission;
