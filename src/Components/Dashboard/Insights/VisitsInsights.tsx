import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../../Common/styles/table";
import { MoreVert } from "@mui/icons-material";

const VisitsInsights = ({ data, handleOptionsClick }: any) => {
  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px #0000001A",
        p: 2,
        minHeight: "170px",
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={24} fontWeight="700" color="text.primary">
          Visits Insights
        </Typography>
        <Box>
          <IconButton onClick={(e) => handleOptionsClick(e, data)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Visits</StyledTableCell>
            <StyledTableCell>Site 1</StyledTableCell>
            <StyledTableCell>Site 2</StyledTableCell>
            <StyledTableCell>Site 3</StyledTableCell>
            <StyledTableCell>Site 4</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((row: any) => (
            <TableRow key={row.site}>
              <StyledTableCell>{row.visit}</StyledTableCell>
              <StyledTableCell>{row.site1}</StyledTableCell>
              <StyledTableCell>{row.site2}</StyledTableCell>
              <StyledTableCell>{row.site3}</StyledTableCell>
              <StyledTableCell>{row.site4}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data?.data?.length === 0 && (
        <NoDataContainer>
          <Typography variant="body1" color="gray">
            No data
          </Typography>
        </NoDataContainer>
      )}
    </Box>
  );
};

export default VisitsInsights;
