import React from "react";
import ThankYou from "../ThankYouPage";
import ThankyouLayout2 from "./ThankyouLayout2";

type Props = {
  data: any;
};

const ThankyouPanel = ({ data }: Props) => {
  const Component = (layout: string) => {
    switch (layout) {
      case "layout_1":
        return <ThankYou data={data} />;
      case "layout_2":
        return <ThankyouLayout2 data={data} />;
      default:
        return <ThankYou data={data} />;
    }
  };
  return <>{Component(data?.layoutKey)}</>;
};

export default ThankyouPanel;
