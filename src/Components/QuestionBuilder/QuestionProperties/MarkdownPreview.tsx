import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";
import { useAppSelector } from "../../../Redux/hooks";
import { Backdrop, Box, Button, Modal, Typography } from "@mui/material";
import { ModalBaseStyles } from "../../Common/styles/modal";
import { useEffect, useState } from "react";

type Props = {
  field: string;
  isProp?: boolean;
  isPreview: boolean;
  close: Function;
};
const MarkdownPreview = ({ field, close }: Props) => {
  const [source, setSource] = useState("");

  const question = useAppSelector(({ question }) => question.modalQuestion);

  const closeHandler = () => {
    close();
  };

  useEffect(() => {
    let value = question[field];

    value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
    setSource(value);
  }, [question, setSource, field]);

  return (
    <Modal
      open={true}
      onClose={closeHandler}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      <Box sx={{ ...ModalBaseStyles, width: "60vw" }}>
        <Typography variant="h6" fontWeight="medium" mb={2}>
          Preview
        </Typography>
        <MDEditor.Markdown
          wrapperElement={{
            "data-color-mode": "light",
          }}
          source={source}
          rehypePlugins={[rehypeSanitize]}
          style={{ fontWeight: "400" }}
        />
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={closeHandler}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MarkdownPreview;
