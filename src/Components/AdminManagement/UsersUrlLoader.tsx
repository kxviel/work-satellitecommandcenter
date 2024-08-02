import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../Redux/hooks";
import { setAdministratorsDefaults } from "../../Redux/reducers/administratorsSlice";
import { pageSize } from "../Common/styles/table";

const UsersURLLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const page = parseInt(searchParams.get("page") ?? "0") || 0;
    const order = searchParams.get("order") ?? "";
    const sort = searchParams.get("sort") ?? "";
    dispatch(
      setAdministratorsDefaults({
        search,
        order,
        sort,
        pagination: {
          page,
          pageSize,
        },
      })
    );
  }, [searchParams, dispatch]);

  return <></>;
};

export default React.memo(UsersURLLoader);
