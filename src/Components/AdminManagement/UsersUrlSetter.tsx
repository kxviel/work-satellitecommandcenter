import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../Redux/hooks";

const UsersUrlSetter = () => {
  let [, setSearchParams] = useSearchParams();
  const { searchText, paginationModel, sortOrder, sortColumn } = useAppSelector(
    (state) => state.administrators
  );

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", paginationModel.page.toString());
    if (searchText) {
      params.set("search", searchText);
    }
    if (sortOrder) {
      params.set("order", sortOrder);
    }
    if (sortColumn) {
      params.set("sort", sortColumn);
    }
    setSearchParams(params, {
      replace: true,
    });
  }, [setSearchParams, searchText, paginationModel, sortOrder, sortColumn]);

  return <></>;
};

export default UsersUrlSetter;
