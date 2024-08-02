import React from "react";
import WelcomePage from "../WelcomePage";
import WelcomeLayout2 from "./WelcomeLayout2";

type Props = {
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
};

const WelcomePanel = ({ setShowInfo, data }: Props) => {
  const Component = (layout: string) => {
    switch (layout) {
      case "layout_1":
        return <WelcomePage setShowInfo={setShowInfo} data={data} />;
      case "layout_2":
        return <WelcomeLayout2 setShowInfo={setShowInfo} data={data} />;
      default:
        return <WelcomePage setShowInfo={setShowInfo} data={data} />;
    }
  };
  return <>{Component(data?.layoutKey)}</>;
};

export default WelcomePanel;
