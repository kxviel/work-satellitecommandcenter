import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { CloseRounded, Settings } from "@mui/icons-material";
import { Logo, MahaloIcon } from "../../../Common/assets/Sidebar";
import { ModalBaseStyles } from "../../../Common/styles/modal";
import { useState } from "react";

const ThankyouPreviewWrapperV2 = ({ data, closePreview, showModal }: any) => {
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
          minHeight: "90vh",
          overflow: "hidden",
          width: {
            xs: "96vw",
            md: "85vw",
          },
        }}
      >
        <Box sx={{ height: "80vh" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "60px",
            }}
          >
            <Box></Box>

            {/* User Info */}
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
              "& .header-logo": {
                p: "8px 48px",
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
          </Box>
          <Box
            sx={{
              height: "calc(80vh - 117px)",
              display: "flex",
              overflow: "auto",
              alignItems: "flex-start",
              p: 2,
            }}
          >
            {/* Content */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                width: "50%",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  fontSize: "2.125rem",
                  p: "8px 48px",
                }}
              >
                {data?.title || "Thank you!"}
              </Typography>
              <Box sx={{ p: "8px 48px" }}>
                {data?.subtext && (
                  <Typography
                    variant="subtitle2"
                    fontWeight="regular"
                    whiteSpace={"pre-line"}
                    sx={{ mb: 2, fontSize: "1rem" }}
                  >
                    {data?.subtext || ""}
                  </Typography>
                )}
                {data?.footer && (
                  <Typography
                    variant="subtitle2"
                    fontWeight="regular"
                    whiteSpace={"pre-line"}
                    sx={{
                      mt: 4,
                      mb: 2,
                      fontSize: "1rem",
                    }}
                  >
                    {data?.footer || ""}
                  </Typography>
                )}
              </Box>
            </Box>
            {/* Footer */}
            <Box
              sx={{
                position: "sticky",
                zIndex: 1,
                top: 0,
                width: "50%",
                "& .footer-logo": {
                  maxWidth: "600px",
                  maxHeight: "500px",
                  borderRadius: "40px",
                },
              }}
            >
              {data?.footerLogo?.url ? (
                <img
                  src={data?.footerLogo?.previewUrl}
                  alt="Logo 2"
                  loading="lazy"
                  className="footer-logo"
                />
              ) : (
                <Logo />
              )}
            </Box>
          </Box>
          {/* </Box> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default ThankyouPreviewWrapperV2;
