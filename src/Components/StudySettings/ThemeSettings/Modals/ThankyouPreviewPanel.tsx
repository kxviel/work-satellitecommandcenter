import ThankyouPreviewWrapper from "./ThankyouPreviewWrapper";
import ThankyouPreviewWrapperV2 from "./ThankyouPreviewWrapperV2";

const ThankyouPreviewPanel = ({ values, showPreview, closePreview }: any) => {
  const LayoutComponent = (layout: string) => {
    switch (layout) {
      case "layout_1": {
        return (
          <ThankyouPreviewWrapper
            data={values}
            showModal={showPreview}
            closePreview={closePreview}
          />
        );
      }
      case "layout_2": {
        return (
          <ThankyouPreviewWrapperV2
            data={values}
            showModal={showPreview}
            closePreview={closePreview}
          />
        );
      }
      default:
        return "Enter a proper layout";
    }
  };
  return <>{LayoutComponent(values?.layout)}</>;
};

export default ThankyouPreviewPanel;
