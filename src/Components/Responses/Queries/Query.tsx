import { useState } from "react";
import { useAppSelector } from "../../../Redux/hooks";
import AddQueryModal from "./AddQueryModal";
import ViewQueryComments from "./ViewComments";
import ViewQueryModal from "./ViewQueryModal";

const Query = () => {
  const queryModal = useAppSelector((state) => state.response.queryModal);
  const { canAmendQueries } = useAppSelector((state) => state.response);
  const [canEdit] = useState(canAmendQueries);
  return (
    <>
      {queryModal.type === "new-query" && <AddQueryModal showModal={true} />}
      {queryModal.type === "query-comments" && (
        <ViewQueryComments showModal={true} canEdit={canEdit} />
      )}
      {queryModal.type === "show-query" && (
        <ViewQueryModal showModal={true} canEdit={canEdit} />
      )}
    </>
  );
};

export default Query;
