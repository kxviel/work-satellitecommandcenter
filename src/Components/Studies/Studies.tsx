import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import StudiesList from "./StudiesList";
import { GridSearchIcon } from "@mui/x-data-grid";
import LogoutContainer from "../Layout/LogoutContainer";
import { HeaderStyle } from "../Common/styles/header";

const Studies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("query") ?? "");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchText) {
      params.set("query", searchText);
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [setSearchParams, searchText]);

  const modifySearchTerm = useMemo(
    () =>
      debounce((val) => {
        setSearchText(val);
      }, 500),
    [setSearchText]
  );

  return (
    <>
      <Box
        sx={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "0px 24px",
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <TextField
          placeholder="Search for Study"
          style={{ width: "30%" }}
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
        <Box sx={{ ml: "auto" }}>
          <LogoutContainer />
        </Box>
      </Box>
      <Box sx={HeaderStyle}>
        <Typography fontSize={20} fontWeight="medium" color="text.primary">
          My Studies
        </Typography>

        <Box sx={{ ml: "auto" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowModal(true)}
          >
            New Study
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 3, height: "calc(100vh - 144px)", overflow: "auto" }}>
        <StudiesList
          searchText={searchText}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </Box>
    </>
  );
};

export default Studies;
