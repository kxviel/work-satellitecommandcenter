import { Drawer, IconButton, Stack } from "@mui/material";
import { Logo } from "../Common/assets/Sidebar";
import CloseIcon from "@mui/icons-material/Close";

const MobileDrawer = ({
  showDrawer,
  onClose,
  children,
  logo,
}: {
  showDrawer: boolean;
  onClose: () => void;
  children: React.ReactNode;
  logo: any;
}) => {
  return (
    <Drawer
      open={showDrawer}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: "100%" },
      }}
    >
      <Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            height: "70px",
            p: 2,
            "& .header-logo": {
              maxWidth: "258px",
              maxHeight: "60px",
            },
          }}
          gap={3}
        >
          {logo?.url ? (
            <img
              src={logo?.previewUrl}
              alt="Logo 1"
              className="header-logo"
              loading="lazy"
            />
          ) : (
            <Logo />
          )}

          <IconButton aria-label="menu" size="large" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Stack>

        {children}
      </Stack>
    </Drawer>
  );
};
export default MobileDrawer;
