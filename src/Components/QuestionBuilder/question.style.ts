import { SxProps, styled } from "@mui/material/styles";
import { rowFlexStyle } from "../Common/styles/flex";

export const QBArea = styled("div")({
  height: "calc(100vh - 144px)",
  display: "flex",
  alignItems: "start",
  padding: "8px",
});

export const headerStyle: SxProps = {
  height: "80px",
  backgroundColor: "#ffffff",
  position: "sticky",
  top: 0,
  width: "100%",
  borderBottom: "1px solid",
  borderColor: "#E5E7EB",
  ...rowFlexStyle,
  alignItems: "center",
  px: 2.5,
};

export const QBMessageWrapper = styled("div")(() => ({
  height: "calc(100vh - 144px)",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const EmptyMessageWrapper = styled("div")(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const QuestionListStyle: SxProps = {
  flex: "1",
  height: "100%",
  px: 1,
  overflowY: "auto",
};

export const QuestionItemStyle: SxProps = {
  width: "100%",

  boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.08)",

  py: 2,
  px: 2,
  border: 1,

  borderColor: "#E7E7E7",
  borderRadius: "12px",
  backgroundColor: "#FFFFFF",

  "&:not(:last-child)": {
    marginBottom: 2.5,
  },
};

export const QuestionDescriptorStyle: SxProps = {
  background: "#ffffff",

  border: 1,
  borderColor: "#CFCFC9",
  borderRadius: 1,

  width: "76px",
  height: "40px",

  mr: 2,
  px: 1.5,
};

export const requiredStyles: SxProps = {
  display: "flex",
  "&::after": {
    content: '"*"',
    color: "red",
    marginLeft: "3px",
  },
};

export const previewIndexStyle: SxProps = {
  height: "44px",
  width: "44px",
  bgcolor: "primary.main",
  color: "#FFF",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  borderRadius: 0.5,
};
