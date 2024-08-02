import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  TextField,
} from "@mui/material";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../../Common/styles/modal";
import { toastMessage } from "../../../../utils/toast";
import { LabelStyle } from "../../../Common/styles/form";

const CustomTextModal = ({
  showModal,
  closeModal,
  setTheme,
  selectedTheme,
}: any) => {
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);

  const [name, setName] = useState<string>(selectedTheme?.name);
  const [description, setDescription] = useState<string>(
    selectedTheme?.description
  );
  const submitHandler = async () => {
    if (!name.trim()) {
      toastMessage("error", "Name must be a valid value");
      return;
    }
    setSubmitLoader(true);

    setTheme((prev: any[]) =>
      prev.map((theme: any) =>
        theme.id === selectedTheme?.id
          ? { ...theme, name: name, description: description }
          : theme
      )
    );
    setSubmitLoader(false);

    closeModal();
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader title={"Edit Theme"} onCloseClick={closeModal} />

        <FormControl sx={{ width: "100%" }}>
          <FormLabel
            sx={{ ...LabelStyle, textTransform: "capitalize" }}
            htmlFor="name"
          >
            Name <span style={{ color: "red" }}>*</span>
          </FormLabel>
          <TextField
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: "100%", mt: 2 }}>
          <FormLabel
            sx={{ ...LabelStyle, textTransform: "capitalize" }}
            htmlFor="name"
          >
            Description
          </FormLabel>
          <TextField
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <Box sx={{ ...ModalActionButtonStyles, mt: 4 }}>
          {!submitLoader ? (
            <>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" onClick={submitHandler}>
                Save
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

export default CustomTextModal;
