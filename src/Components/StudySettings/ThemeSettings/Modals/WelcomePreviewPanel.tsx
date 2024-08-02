import WelcomePreviewWrapper from "./WelcomePreviewWrapper";
import WelcomePreviewWrapperV2 from "./WelcomePreviewWrapperV2";

const WelcomePreviewPanel = ({ values, showPreview, closePreview }: any) => {
  const LayoutComponent = (layout: string) => {
    switch (layout) {
      case "layout_1": {
        return (
          <WelcomePreviewWrapper
            data={values}
            showModal={showPreview}
            closePreview={closePreview}
          />
        );
      }
      case "layout_2": {
        return (
          <WelcomePreviewWrapperV2
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

export default WelcomePreviewPanel;
