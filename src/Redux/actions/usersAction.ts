import { AxiosResponse } from "axios";

import { pageSize } from "../../Components/Common/styles/table";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import {
  setAdministratorsCount,
  setAdministratorsDetails,
  setAdministratorsLoader,
  setAdministratorsPage,
} from "../reducers/administratorsSlice";
import { AppThunk } from "../store";

export const fetchAdministratorsList =
  (
    page: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string,
    id: any
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAdministratorsLoader(true));
      let url = `/study/${id}/users/list?page=${page + 1}&size=${pageSize}`;

      if (sortColumn && sortOrder) {
        url += `&sortBy=${sortColumn}&orderBy=${sortOrder}`;
      }
      if (searchText) {
        url += `&search=${searchText}`;
      }
      const res: AxiosResponse = await http.get(url);
      const data = res.data?.data;
      if (data?.users?.length === 0 && data?.count > 0 && page > 0) {
        dispatch(
          setAdministratorsPage({
            page: 0,
            pageSize,
          })
        );
        return;
      }

      const administratorsList = data?.rows || [];

      administratorsList?.map((item: any) => {
        const siteRoles = item?.user?.siteRoles || [];
        const roleLabels: any[] = [];
        const siteLabels: any[] = [];

        siteRoles?.map((siteRole: any) => {
          const site = siteRole?.site || {};
          const role = siteRole?.role || {};
          const existingRole = roleLabels?.find((r) => r.id === role.id);
          if (!existingRole) {
            roleLabels.push({ id: role.id, label: role.label });
          }
          const existingSite = siteLabels.find((s) => s.id === site.id);
          if (!existingSite) {
            siteLabels.push({ id: site.id, name: site.name });
          }
          return siteRole;
        });

        item.user.roleLabels = roleLabels;
        item.user.siteLabels = siteLabels;
        return item;
      });

      dispatch(
        setAdministratorsDetails(
          administratorsList.map((item: any) => ({
            id: item?.id || "-",
            firstName: item?.user?.firstName || "-",
            lastName: item?.user?.lastName || "-",
            email: item?.user?.email || "-",
            status: item?.status || "-",
            studyAccessStatus: item?.studyAccessStatus || "-",
            roleSites: item?.user?.siteRoles || [],
            roleLabels: item?.user?.roleLabels || [],
            siteLabels: item?.user?.siteLabels || [],
            studyRole: item?.user?.studyRole || null,
            userId: item?.userId || "-",
          })) || []
        )
      );

      dispatch(setAdministratorsCount(data?.count));
      dispatch(setAdministratorsLoader(false));
    } catch (err) {
      errorToastMessage(err as Error);
      dispatch(setAdministratorsLoader(false));
    }
  };
