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

const SurveyPackageCompletion = ({ data, handleOptionsClick }: any) => {
  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px #0000001A",
        p: 2,
        minHeight: "170px",
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
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
          {data?.title}
        </Typography>
        <Box>
          <IconButton onClick={(e) => handleOptionsClick(e, data)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          maxHeight: "calc(100vh - 317px)",
          overflow: "auto",
        }}
      >
        <Table sx={TableBorderRadiusTopLeftRight}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Survey Package</StyledTableCell>
              <StyledTableCell>In Progress</StyledTableCell>
              <StyledTableCell>Completed</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((row: any) => (
              <TableRow key={row?.id}>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell>{row.inProgress}</StyledTableCell>
                <StyledTableCell>{row.completed}</StyledTableCell>
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
    </Box>
  );
};

export default SurveyPackageCompletion;
