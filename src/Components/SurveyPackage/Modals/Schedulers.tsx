import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import { MoreVert, UnfoldMore } from "@mui/icons-material";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../../Common/styles/table";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import UpdateSchedule from "./UpdateSchedule";

const Schedulers = ({ values, errors, touched, getFieldProps }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [scheduleData, setScheduleData] = useState<any[]>([
    { scheduleName: "name", sendingPattern: "1, 2, 3" },
  ]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [menuLoader, setMenuLoader] = useState<boolean>(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/survey-package`;
        if (sortOrder && sortColumn) {
          url += `&sortDirection=${sortOrder}&sortKey=${sortColumn}`;
        }

        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;
        const newData = data?.map((item: any) => ({
          id: item?.id,
          scheduleName: item?.scheduleName || "-",
          sendingPattern: item?.sendingPattern || "-",
        }));
        setScheduleData(newData || []);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [toggleLoader, sortOrder, sortColumn]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      if (sortOrder === "ASC") {
        setSortOrder("DESC");
      } else {
        setSortOrder("");
        setSortColumn("");
      }
    } else {
      setSortColumn(column);
      setSortOrder("ASC");
    }
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };
  const openModal = () => {
    setShowModal(true);
    setAnchorEl(null);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const deleteSchedule = async () => {
    try {
      setMenuLoader(true);
      const res: AxiosResponse = await http.delete(
        `/survey-package/${selectedRow.id}`
      );
      toastMessage("success", res.data.message);
      setSelectedRow(null);
      setAnchorEl(null);
      setMenuLoader(false);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setMenuLoader(false);
    }
  };
  const addSchedule = async () => {
    try {
      setMenuLoader(true);
      const body = {
        scheduleName: values?.scheduleName,
        sendingPattern: values?.sendingPattern,
      };
      let res: AxiosResponse;
      res = await http.post(`/survey-package`, body);
      toastMessage("success", res.data.message);
      setSelectedRow(null);
      setAnchorEl(null);
      setMenuLoader(false);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setMenuLoader(false);
    }
  };
  return (
    <>
      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl sx={InputWrapper}>
          <FormLabel sx={LabelStyle} htmlFor="schedule-name">
            Schedule Name
          </FormLabel>
          <TextField
            placeholder="Schedule Name"
            id="schedule-name"
            {...getFieldProps("scheduleName")}
            error={touched?.scheduleName && errors?.scheduleName ? true : false}
            helperText={
              touched?.scheduleName && errors?.scheduleName
                ? (errors?.scheduleName as string)
                : " "
            }
          />
        </FormControl>
        <FormControl sx={InputWrapper}>
          <FormLabel sx={LabelStyle} htmlFor="sending-pattern">
            Sending Pattern
          </FormLabel>
          <TextField
            placeholder="Sending Pattern"
            id="sending-pattern"
            {...getFieldProps("sendingPattern")}
            error={
              touched?.sendingPattern && errors?.sendingPattern ? true : false
            }
            helperText={
              touched?.sendingPattern && errors?.sendingPattern
                ? (errors?.sendingPattern as string)
                : " "
            }
          />
        </FormControl>
        <Button
          variant="outlined"
          sx={{ mt: 4.25, height: "52px" }}
          onClick={addSchedule}
        >
          Add
        </Button>
      </Box>

      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Box display={"flex"} alignItems={"center"}>
                Schedule Name
                <IconButton onClick={() => handleSort("scheduleName")}>
                  <UnfoldMore sx={{ color: "text.secondary" }} />
                </IconButton>
              </Box>
            </StyledTableCell>
            <StyledTableCell>Sending Pattern</StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        {scheduleData?.length > 0 && (
          <TableBody>
            {scheduleData.map((schedule: any) => (
              <TableRow key={schedule?.id}>
                <StyledTableCell>{schedule?.scheduleName}</StyledTableCell>
                <StyledTableCell>{schedule?.sendingPattern}</StyledTableCell>

                <StyledTableCell align="right">
                  <IconButton onClick={(e) => handleMenuClick(e, schedule)}>
                    <MoreVert />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {scheduleData?.length === 0 && (
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
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: "400px",
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={openModal} disabled={menuLoader}>
          <ListItemText>Edit Schedule</ListItemText>
        </MenuItem>
        <MenuItem onClick={deleteSchedule} disabled={menuLoader}>
          <ListItemText sx={{ color: "#F05252" }}>Delete Schedule</ListItemText>
          {menuLoader && (
            <ListItemIcon>
              <CircularProgress size={18} sx={{ ml: 1 }} />
            </ListItemIcon>
          )}
        </MenuItem>
      </Menu>
      {showModal && (
        <UpdateSchedule
          showModal={showModal}
          closeModal={closeModal}
          data={selectedRow}
          refreshPage={refreshPage}
        />
      )}
    </>
  );
};

export default Schedulers;
