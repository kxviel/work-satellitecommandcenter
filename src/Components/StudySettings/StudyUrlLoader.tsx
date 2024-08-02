import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  setType: React.Dispatch<React.SetStateAction<string>>;
  setUrlLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const StudyUrlLoader = ({ setType, setUrlLoaded }: Props) => {
  let [searchParams] = useSearchParams();

  useEffect(() => {
    setType(searchParams.get("type") ?? "general");
    setUrlLoaded(true);
  }, [searchParams, setType, setUrlLoaded]);

  return <></>;
};

export default React.memo(StudyUrlLoader);
