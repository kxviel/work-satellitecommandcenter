import { Backdrop } from "@mui/material";

type Props = {
  closeHandler: Function;
  image: string;
};
const ImagePreview = ({ closeHandler, image }: Props) => {
  const onClose = () => {
    closeHandler();
  };

  return (
    <Backdrop
      open={true}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      onClick={onClose}
    >
      <img src={image} alt={"preview"} />
    </Backdrop>
  );
};

export default ImagePreview;
