import { useMemo, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { debounce } from "lodash";
import {
  HeaderLeftContent,
  HeaderRightContent,
  StyledHeader,
} from "../../Common/styles/header";
import { GridSearchIcon } from "@mui/x-data-grid";
import RepeatingDataList from "./RepeatingDataList";
import { useAppSelector } from "../../../Redux/hooks";
import RepeatedFormWrapper from "./RepeatedFormWrapper";
import { MenuLabels } from "../../../Redux/reducers/studySlice";

type Props = {
  menuLabels: MenuLabels;
};

const RepeatingResponses = ({ menuLabels }: Props) => {
  const repeatedAttemptId = useAppSelector(
    (state) => state.response.repeatedAttemptId
  );

  const editable = useAppSelector((state) => state.response.editable);

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const modifySearchTerm = useMemo(
    () =>
      debounce((val) => {
        setPage(0);
        setSearchText(val);
      }, 500),
    [setPage, setSearchText]
  );

  return (
    <Box>
      {repeatedAttemptId ? (
        <RepeatedFormWrapper />
      ) : (
        <>
          <StyledHeader
            sx={{
              padding: "20px",
              bgcolor: "#FFFFFF",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Box sx={{ ...HeaderLeftContent, width: "70%" }}>
              <Typography fontSize={20} fontWeight={600}>
                {menuLabels?.repeating_data || "Repeating Data"}
              </Typography>
              <TextField
                placeholder="Search"
                style={{ width: "40%" }}
                defaultValue={searchText}
                onChange={(e) => modifySearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GridSearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {editable && (
              <Box sx={HeaderRightContent}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowModal(true)}
                >
                  New {menuLabels?.repeating_data || "Repeating Data"}
                </Button>
              </Box>
            )}
          </StyledHeader>
          <RepeatingDataList
            page={page}
            showModal={showModal}
            searchText={searchText}
            setPage={setPage}
            setShowModal={setShowModal}
            menuLabels={menuLabels}
          />
        </>
      )}
    </Box>
  );
};

export default RepeatingResponses;
