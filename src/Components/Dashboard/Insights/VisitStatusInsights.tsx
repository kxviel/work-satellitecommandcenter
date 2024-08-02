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
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../../Common/styles/table";
import { MoreVert } from "@mui/icons-material";

const VisitStatusInsights = ({ data, handleOptionsClick }: any) => {
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
            <StyledTableCell>Form Name</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((row: any) => (
            <TableRow key={row.site}>
              <StyledTableCell>{row.visit}</StyledTableCell>
              <StyledTableCell>{row.formName}</StyledTableCell>
              <StyledTableCell>{row.status}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default VisitStatusInsights;
