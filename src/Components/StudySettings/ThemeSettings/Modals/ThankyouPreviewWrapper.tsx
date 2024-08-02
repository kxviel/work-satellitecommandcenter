import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { CloseRounded, Settings } from "@mui/icons-material";
import { Logo, MahaloIcon } from "../../../Common/assets/Sidebar";
import { ModalBaseStyles } from "../../../Common/styles/modal";
import { useState } from "react";

const ThankyouPreviewWrapper = ({ data, closePreview, showModal }: any) => {
  const firstName = localStorage.getItem("first-name");
  const lastName = localStorage.getItem("last-name");
  const [userName] = useState(
    `${firstName ? firstName : ""} ${lastName ? lastName : ""}`
  );
  return (
    <Modal open={showModal} onClose={closePreview}>
      <Box
        sx={{
          ...ModalBaseStyles,
          minHeight: "95vh",
          width: {
            xs: "96vw",
            md: "85vw",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "80px",
            "& .header-logo": {
              maxWidth: "258px",
              maxHeight: "70px",
            },
          }}
        >
          {data?.headerLogo?.url ? (
            <img
              src={data?.headerLogo?.previewUrl}
              alt="Logo 1"
              className="header-logo"
            />
          ) : (
            <MahaloIcon />
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ mr: 2 }}>{userName}</Typography>
            <Avatar
              sx={{
                width: 25,
                height: 25,
                fontSize: 13,
                bgcolor: "lightgray",
                color: "#000",
              }}
            >
              {firstName?.charAt(0)}
              {lastName?.charAt(0)}
            </Avatar>
            <IconButton sx={{ ml: 1 }}>
              <Settings />
            </IconButton>
            <IconButton onClick={closePreview}>
              <CloseRounded sx={{ color: "text.secondary" }} />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#F8F9FB",
            height: "calc(95vh - 132px)",
            display: "flex",
            alignItems: "flex-start",
            overflow: "auto",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {data?.title || "Welcome to Study Manager!"}
            </Typography>
            <Box sx={{ p: "16px 48px" }}>
              {data?.subtext && (
                <Typography
                  variant="subtitle2"
                  fontWeight={"regular"}
                  sx={{ mt: 2, mb: 2 }}
                  whiteSpace={"pre-line"}
                >
                  {data?.subtext || ""}
                </Typography>
              )}
              <Button
                variant="contained"
                sx={{
                  mt: 4,
                  width: "400px",
                }}
              >
                Close
              </Button>
              <Box
                sx={{
                  mt: 4,
                  "& .footer-logo": {
                    maxWidth: "258px",
                    maxHeight: "70px",
                  },
                }}
              >
                {data?.footerLogo?.url ? (
                  <img
                    src={data?.footerLogo?.previewUrl}
                    alt="Logo 2"
                    className="footer-logo"
                  />
                ) : (
                  <Logo />
                )}
              </Box>
              {data?.footer && (
                <Typography
                  variant="subtitle2"
                  fontWeight={"regular"}
                  sx={{ mt: 2, mb: 2 }}
                  whiteSpace={"pre-line"}
                >
                  {data?.footer || ""}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ThankyouPreviewWrapper;
