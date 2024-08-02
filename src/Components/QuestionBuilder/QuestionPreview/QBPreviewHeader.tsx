import { Box, Button, Typography } from "@mui/material";
import { headerStyle } from "../question.style";
import { ChevronLeft, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Redux/hooks";
import { useState } from "react";
import { permissions } from "../../../utils/roles";

const QbPreviewHeader: React.FC = () => {
  const { questionName } = useAppSelector((state) => state.question);
  const permissionsArray = useAppSelector(
    (state) => state.user.studyPermissions
  );
  const [editable] = useState(
    permissionsArray?.includes(permissions.studyDesigner)
  );

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`../edit`, { relative: "path" });
  };

  return (
    <Box sx={headerStyle}>
      <ChevronLeft
        onClick={handleBack}
        sx={{ cursor: "pointer", mr: 1 }}
        fontSize="large"
      />
      <Typography
        fontSize={30}
        fontWeight="bold"
        sx={{
          flex: 1,
          minWidth: "0px",
        }}
        noWrap
      >
        {questionName || "Form Preview"}
      </Typography>
      <span style={{ marginLeft: "auto" }}></span>
      {editable && (
        <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
          Edit
        </Button>
      )}
    </Box>
  );
};

export default QbPreviewHeader;
