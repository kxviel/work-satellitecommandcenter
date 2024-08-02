import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Props = {
  show: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  onOk: () => void;
};

const DeleteConfirmModal = ({ title, onOk, show, data, onClose }: Props) => {
  const handleDelete = () => {
    onClose();
    onOk();
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">Delete "{title}" ?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this Question?
          {data.length > 0
            ? " This question has been used as a dependency and/or calculation in the following questions."
            : ""}
        </DialogContentText>
        <Box sx={{ mt: 2 }}>
          {data?.map((q: any) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <DialogContentText key={q.question?.id} sx={{ flexShrink: 0 }}>
                {q?.form?.name},
              </DialogContentText>
              &nbsp;
              <DialogContentText
                key={q.question?.id}
                sx={{
                  maxWidth: "50ch",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {q?.label}
              </DialogContentText>
            </div>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="outlined"
          onClick={handleDelete}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
