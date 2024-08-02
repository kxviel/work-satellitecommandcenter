import {
  Box,
  Pagination,
  styled,
  SxProps,
  TableCell,
  tableCellClasses,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: "#4B5563",
    padding: "0 15px",
    height: "52px",
    fontSize: "14px",
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#ffffff",
    padding: "0 15px",
    height: "65px",
    borderBottom: "1px solid",
    borderColor: "#E5E7EB",
    fontSize: "16px",
    fontWeight: 400,
  },
}));
export const TableBorderRadiusTopLeftRight: SxProps = {
  "& .MuiTableHead-root th:first-of-type": {
    borderTopLeftRadius: "8px",
  },
  "& .MuiTableHead-root th:last-of-type": {
    borderTopRightRadius: "8px",
  },
};

export const StyledSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "& .MuiTableSortLabel-icon": {
    opacity: 0.5,
    color: "text.secondary",
  },
}));

export const TablePaginationStyle: SxProps = {
  backgroundColor: "#ffffff",
  borderBottom: "none",
  "& 	.MuiTablePagination-toolbar": {
    height: "78px",
    paddingLeft: 2.5,
    "& 	.MuiTablePagination-spacer": {
      display: "flex",
      flex: "none",
      order: 3,
    },
    "& 	.MuiTablePagination-actions": {
      display: "flex",
      gap: 1,
      order: 1,
      marginLeft: 0,
      marginRight: 1,
      color: "text.tertiary",
      "& .MuiButtonBase-root": {
        padding: 0,
        "& .MuiSvgIcon-root": {
          width: "34px",
          height: "34px",
        },
      },
    },
    "& .MuiTablePagination-displayedRows": {
      display: "flex",
      order: 2,
    },
  },
};

export const paginationLabel = ({ from, to, count }: any) => {
  return (
    <Typography variant="body1" component="span" color="text.grey">
      Show{" "}
      <Typography component="span" fontWeight="regular" color="text.tertiary">
        {from}-{to}
      </Typography>{" "}
      of{" "}
      <Typography component="span" fontWeight="regular" color="text.tertiary">
        {count}
      </Typography>
    </Typography>
  );
};

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.secondary.main,
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    color: "#355962",
    fontSize: "14px",
    fontWeight: 600,
    borderBottom: "none",
    "& .MuiDataGrid-columnHeader": {
      "&:focus , &:focus-within": {
        outline: "none",
      },
    },
  },
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid ",
    borderColor: "#E5E7EB",
    // color: "text.primary",
    // fontSize: "14px",
    // fontWeight: 400,
    "&:focus , &:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-checkboxInput": {
    color: "#9CA3AF",
  },
  "& .MuiDataGrid-footerContainer": {
    flexDirection: "row-reverse",
    backgroundColor: "#ffffff",
    height: "76px",
  },
}));

export const CustomPagination = styled(Pagination)(() => ({
  "& .MuiPagination-ul": {
    "& .MuiButtonBase-root": {
      height: "35px",
      backgroundColor: "#ffffff",
      color: "text.secondary",
      fontWeight: 500,
      margin: 0,
      borderRadius: 0,
      border: "1px solid #D1D5DB",
    },
    "& .Mui-selected": {
      backgroundColor: "secondary.main",
      color: "primary.main",
      fontWeight: 600,
    },
    "& .MuiPaginationItem-previousNext": {
      padding: "0 1.25rem",
    },
    "& li:first-of-type": {
      "& .MuiButtonBase-root": {
        borderTopLeftRadius: "6px",
        borderBottomLeftRadius: "6px",
      },
    },
    "& li:last-child": {
      "& .MuiButtonBase-root": {
        borderTopRightRadius: "6px",
        borderBottomRightRadius: "6px",
      },
    },
  },
}));

export const NoDataContainer = styled(Box)(() => ({
  backgroundColor: "#fff",
  width: "100%",
  padding: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const pageSize: number = 15;

export const paddedPageSize: number = 16;
