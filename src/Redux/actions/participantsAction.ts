import { AxiosResponse } from "axios";

import { pageSize } from "../../Components/Common/styles/table";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import {
  setParticipantsLoader,
  setParticipantsCount,
  setParticipantsDetails,
  setParticipantsPage,
  setColumnData,
} from "../reducers/participantsSlice";
import { AppThunk } from "../store";
import { DateTime } from "luxon";
import { permissionAccess } from "../../Components/ParticipantRecords/RecordsList";
import { permissions } from "../../utils/roles";

export const fetchParticipantsList =
  (
    page: number,
    sortOrder: string,
    sortColumn: string,
    siteIds: string[],
    status: string,
    isLocked: string,
    id: any
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setParticipantsLoader(true));
      let url: string = `/participants?studyId=${id}&page=${
        page + 1
      }&size=${pageSize}`;

      if (sortOrder && sortColumn) {
        url += `&sortOrder=${sortOrder}&sortKey=${sortColumn}`;
      }

      if (siteIds && siteIds.length > 0) {
        const siteIdsParam = siteIds.join(",");
        url += `&sitesIds=${siteIdsParam}`;
      }
      if (status) {
        url += `&eligibilityStatus=${status}`;
      }
      if (isLocked) {
        url += `&isLocked=${isLocked === "yes"}`;
      }

      const res: AxiosResponse = await http.get(url);
      const data = res?.data?.data?.data;
      const columns = res?.data?.data?.customColumns;

      const newData = data?.map((item: any) => {
        const extraHeaders: any = {};
        columns.forEach((column: any) => {
          const value = item?.customColumns.find(
            (item: any) => item.columnName === column.varname
          )?.value;
          if (value !== undefined) {
            extraHeaders[column.varname] = value;
          }
        });
        return {
          id: item?.id,
          participantId: item?.subjectId,
          site: item?.site?.name,
          randomization: item?.randomizationGroup?.treatmentGroupName || "-",
          progress:
            item?.visitCompletions?.map((item: any) => ({
              id: item?.phaseId,
              phaseName: item?.phaseName || "-",
              status:
                item?.totalForms > 0 &&
                item?.completedForms === item?.totalForms
                  ? "completed"
                  : item?.completedForms > 0 || item?.inprogressForms > 0
                  ? "inprogress"
                  : "not_started",
            })) || "-",
          createdOn: DateTime.fromISO(item.createdAt).toFormat("LLL dd yyyy"),
          status: item?.eligibilityStatus || "-",
          isLocked: item?.isLocked || false,
          isArchived: item?.isArchived || false,
          canLock: permissionAccess(
            item?.site?.id,
            permissions.recordLockUnlock,
            getState().user.sitePermissions
          ),
          canArchive: permissionAccess(
            item?.site?.id,
            permissions.recordArchive,
            getState().user.sitePermissions
          ),
          ...extraHeaders,
        };
      });

      if (data?.length === 0 && res?.data?.data?.count > 0 && page > 0) {
        dispatch(
          setParticipantsPage({
            page: 0,
            pageSize,
          })
        );
        return;
      }
      dispatch(setColumnData(columns));
      dispatch(setParticipantsDetails(newData));
      dispatch(setParticipantsCount(res?.data?.data?.count));
      dispatch(setParticipantsLoader(false));
    } catch (err) {
      errorToastMessage(err as Error);
      dispatch(setParticipantsLoader(false));
    }
  };
