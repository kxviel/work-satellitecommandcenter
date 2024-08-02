import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledHeader, HeaderLeftContent } from "../Common/styles/header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "@mui/icons-material";
import QueryList from "./QueryList";

const Queries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") ?? "0") || 0
  );
  const [filter, setFilter] = useState(searchParams.get("status") ?? "");

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (filter) {
      params.set("status", filter);
    }
    setSearchParams(params, {
      replace: true,
    });
  }, [setSearchParams, page, filter]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <StyledHeader>
        <Box sx={{ ...HeaderLeftContent, gap: 1 }}>
          <IconButton onClick={handleBack}>
            <ChevronLeft fontSize="large" sx={{ color: "text.primary" }} />
          </IconButton>
          <Typography fontSize={24} fontWeight="bold">
            Queries
          </Typography>
        </Box>
      </StyledHeader>
      <QueryList
        page={page}
        setPage={setPage}
        filter={filter}
        setFilter={setFilter}
      />
    </Box>
  );
};

export default Queries;
