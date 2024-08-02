import React from "react";
import AuthPreviewWrapper from "./AuthPreviewWrapper";
import AuthPreviewWrapperV3 from "./AuthPreviewWrapperV3";
import { Box } from "@mui/material";
import AuthPreviewWrapperV2 from "./AuthPreviewWrapperV2";
import AuthPreviewWrapperV4 from "./AuthPreviewWrapperV4";
import AuthPreviewWrapperV5 from "./AuthPreviewWrapperV5";

const AuthPreviewPanel = ({ values, showPreview, closePreview }: any) => {
  const LayoutComponent = (layout: string) => {
    switch (layout) {
      case "layout_1": {
        return (
          <AuthPreviewWrapper
            data={values}
            showModal={showPreview}
            closeModal={closePreview}
          />
        );
      }
      case "layout_2": {
        return (
          <AuthPreviewWrapperV2
            data={values}
            showModal={showPreview}
            closeModal={closePreview}
          />
        );
      }
      case "layout_3": {
        return (
          <AuthPreviewWrapperV3
            data={values}
            showModal={showPreview}
            closeModal={closePreview}
          />
        );
      }
      case "layout_4": {
        return (
          <AuthPreviewWrapperV4
            data={values}
            showModal={showPreview}
            closeModal={closePreview}
          />
        );
      }
      case "layout_5": {
        return (
          <AuthPreviewWrapperV5
            data={values}
            showModal={showPreview}
            closeModal={closePreview}
          />
        );
      }
      default:
        return "Enter a proper layout";
    }
  };
  return (
    <Box>
      <Box>{LayoutComponent(values?.layout)}</Box>
    </Box>
  );
};

export default AuthPreviewPanel;
