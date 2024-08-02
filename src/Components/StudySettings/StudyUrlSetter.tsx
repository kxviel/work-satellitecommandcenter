import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  type: string;
};

const StudyUrlSetter = ({ type }: Props) => {
  let [, setSearchParams] = useSearchParams();
  useEffect(() => {
    const params = new URLSearchParams();

    if (type) {
      params.set("type", type);
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [setSearchParams, type]);

  return <></>;
};

export default StudyUrlSetter;
