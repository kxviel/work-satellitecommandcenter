import React, { useEffect, useState } from "react";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
  TablePaginationStyle,
  pageSize,
  paginationLabel,
} from "../Common/styles/table";
import { FilterAlt } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { setRepeatedAttemptId } from "../../Redux/reducers/responseSlice";
import { QueryRoot } from "../../types/Query.types";

type Props = {
  page: number;
  setPage: (value: number) => void;
  filter: string;
  setFilter: (value: string) => void;
};

const QueryList = ({ page, setPage, filter, setFilter }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { menuLabels } = useAppSelector((state) => state.study);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [dataCount, setDataCount] = useState(0);
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const openFilter = Boolean(filterEl);

  useEffect(() => {
    const fetchQueryData = async () => {
      try {
        setLoading(true);
        let url = `/study/${id}/queries?page=${page + 1}&size=${pageSize}`;
        if (filter) {
          url += `&status=${filter}`;
        }

        const res = await http.get<QueryRoot>(url);
        const data = res.data?.data;
        const newData = data?.rows?.map((item) => {
          const location =
            item?.formAttempt?.phase?.category === "visit"
              ? `${menuLabels?.visit || "Visit"}: ${
                  item?.formAttempt?.phase?.name
                } Form: ${item?.form?.name}`
              : item?.formAttempt?.phase?.category === "repeated_data"
              ? `${menuLabels?.repeating_data || "Repeating data"}: ${
                  item?.formAttempt?.phase?.name
                } Form: ${item?.form?.name}`
              : "-";
          return {
            id: item?.id ?? "-",
            createdDate: item?.createdAt,
            createdBy: item?.actor
              ? `${item?.actor?.firstName} ${item?.actor?.lastName}`
              : "-",
            user: item?.participant?.subjectId,
            location: location,
            participantId: item?.participantId,
            formId: item?.formId,
            remark: item?.remark ?? "",
            status: item?.status ?? "",
            category: item?.formAttempt?.phase?.category,
            questionId: item?.questionId,
            formAttemptId: item?.formAttempt?.repeatedAttempt?.id ?? "",
          };
        });

        setData(newData || []);
        setDataCount(data?.count || 0);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchQueryData();
  }, [page, id, filter]);

  const handleChangePage = (_1: any, newPage: number) => {
    setPage(newPage);
  };
  const openFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterEl(event.currentTarget);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setFilterEl(null);
    setPage(0);
  };
  const clearFilter = () => {
    setFilter("");
    setFilterEl(null);
  };

  const closeFilterMenu = () => {
    setFilterEl(null);
  };

  const checkColor = (status: string) => {
    if (status === "closed") {
      return "#7BC5AE";
    } else if (status === "resolved") {
      return "#EB7524";
    }
  };

  const handleNavigate = (row: any) => {
    if (row.category === "visit") {
      sessionStorage.setItem("response-visit-form", row.formId);
      sessionStorage.setItem("response-visit-question", row.questionId);
    } else if (row.category === "repeated_data") {
      console.log(row);

      dispatch(setRepeatedAttemptId({ repeatedAttemptId: row.formAttemptId }));
      sessionStorage.setItem("response-repeated-question", row.questionId);
      sessionStorage.setItem("response-repeated-form", row.formId);
    }

    sessionStorage.setItem("response-view", row.category);
    navigate(
      `/studies/${id}/responses/${row?.participantId}?participant=${row.user}`
    );
  };

  return (
    <Box sx={{ height: "calc(100vh - 144px)", overflow: "auto", p: 2.5 }}>
      <Box sx={{ overflowX: "scroll" }}>
        <Table sx={TableBorderRadiusTopLeftRight}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Creation Date</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              {/* <StyledTableCell>Substance Name</StyledTableCell> */}
              <StyledTableCell>Remark</StyledTableCell>
              {/* <StyledTableCell>Active Ingredients</StyledTableCell>
              <StyledTableCell>Active Numerator Strength</StyledTableCell> */}
              <StyledTableCell>Status</StyledTableCell>
              {/* <StyledTableCell>Display Name</StyledTableCell> */}
              <StyledTableCell align="right">
                <IconButton onClick={openFilterMenu}>
                  <FilterAlt color={filter === "" ? "disabled" : "primary"} />
                </IconButton>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {!loading && data?.length > 0 && (
            <>
              <TableBody>
                {data?.map((row: any) => (
                  <TableRow key={row?.id}>
                    <StyledTableCell
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {DateTime.fromISO(row?.createdDate).toFormat(
                        "dd'-'LL'-'yyyy hh:mm a"
                      )}
                    </StyledTableCell>
                    <StyledTableCell sx={{ maxWidth: "250px" }}>
                      <Typography noWrap fontWeight={600} fontSize="14px">
                        {row?.createdBy}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textTransform: "capitalize" }}>
                      {row?.user}
                    </StyledTableCell>
                    <StyledTableCell sx={{ maxWidth: "250px" }}>
                      <Typography noWrap fontWeight={600} fontSize="14px">
                        {row?.location}
                      </Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell>{row?.substanceName}</StyledTableCell> */}
                    <StyledTableCell sx={{ maxWidth: "250px" }}>
                      <Typography noWrap fontWeight={600} fontSize="14px">
                        {row?.remark}
                      </Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell>{row?.activeingredients}</StyledTableCell>
                    <StyledTableCell>
                      {row?.activenumeratorstrength}
                    </StyledTableCell> */}
                    <StyledTableCell sx={{ maxWidth: "250px" }}>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        {row?.status === "open" ? (
                          <HelpOutlineIcon sx={{ color: "red" }} />
                        ) : (
                          <CheckCircleOutlineIcon
                            sx={{
                              color: checkColor(row?.status),
                            }}
                          />
                        )}
                        <Typography
                          noWrap
                          fontWeight={600}
                          fontSize="14px"
                          textTransform={"capitalize"}
                        >
                          {row?.status}
                        </Typography>
                        <IconButton onClick={() => handleNavigate(row)}>
                          <RemoveRedEyeOutlinedIcon />
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                    {/* <StyledTableCell>{row?.displayName}</StyledTableCell> */}
                    <StyledTableCell align="right"></StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
              {dataCount > pageSize && (
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      sx={TablePaginationStyle}
                      count={dataCount}
                      page={page}
                      rowsPerPage={pageSize}
                      rowsPerPageOptions={[pageSize]}
                      onPageChange={handleChangePage}
                      labelDisplayedRows={paginationLabel}
                    />
                  </TableRow>
                </TableFooter>
              )}
            </>
          )}
        </Table>
      </Box>
      {!loading && data.length === 0 && (
        <NoDataContainer>
          <Typography variant="body1" color="gray">
            No Data
          </Typography>
        </NoDataContainer>
      )}
      {loading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Menu
        anchorEl={filterEl}
        open={openFilter}
        onClose={closeFilterMenu}
        sx={{
          "& .MuiPaper-root": {
            width: 200,
          },
        }}
      >
        {["open", "resolved", "closed"].map((item) => (
          <MenuItem key={item} onClick={() => handleFilter(item)}>
            <ListItemIcon>
              <Radio checked={filter === item} />
            </ListItemIcon>
            <ListItemText sx={{ textTransform: "capitalize" }}>
              {item}
            </ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={clearFilter}>Clear Filter</MenuItem>
      </Menu>
    </Box>
  );
};

export default QueryList;
