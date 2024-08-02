import {
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
  description: string;
  onOk: () => void;
};

const DeleteConfirmModal = ({
  title,
  onOk,
  show,
  onClose,
  description,
}: Props) => {
  const handleDelete = () => {
    onClose();
    onOk();
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
