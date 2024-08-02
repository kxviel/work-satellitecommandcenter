import {
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { errorToastMessage } from "../../../utils/toast";
import {
  NoDataContainer,
  StyledTableCell,
  TableBorderRadiusTopLeftRight,
} from "../../Common/styles/table";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import http from "../../../utils/http";
import { Edit } from "@mui/icons-material";
import MenuLabelModal from "../Modals/MenuLabelModal";

type Props = {
  modalContent: string;
  setModalContent: Function;
  canEdit: boolean;
};

const MenuLabels = ({ modalContent, setModalContent, canEdit }: Props) => {
  const { id: studyId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleLoader, setToggleLoader] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<any>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/ui/menu-labels?studyId=${studyId}`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;

        const newData = data?.map((item: any) => ({
          id: item?.id,
          defaultLabel: item?.key || "-",
          displayLabel: item?.label || "-",
          data: item,
        }));

        setSiteData(newData || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [toggleLoader, studyId]);

  const closeModal = () => {
    setModalContent("");
    setSelectedRow(null);
  };
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const openModal = (row: any) => {
    setSelectedRow(row);
    setModalContent("menu_labels");
  };

  return (
    <Box>
      <Table sx={TableBorderRadiusTopLeftRight}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Default Label</StyledTableCell>
            <StyledTableCell>Display Label</StyledTableCell>
            {canEdit && <StyledTableCell />}
          </TableRow>
        </TableHead>
        {!loading && siteData?.length > 0 && (
          <>
            <TableBody>
              {siteData?.map((row: any) => (
                <TableRow key={row?.id}>
                  <StyledTableCell>{row?.defaultLabel}</StyledTableCell>
                  <StyledTableCell>{row?.displayLabel}</StyledTableCell>
                  {canEdit && (
                    <StyledTableCell align="right">
                      <IconButton onClick={() => openModal(row?.data)}>
                        <Edit />
                      </IconButton>
                    </StyledTableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
      {!loading && siteData.length === 0 && (
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
      {modalContent === "menu_labels" && (
        <MenuLabelModal
          data={selectedRow}
          showModal={modalContent === "menu_labels"}
          closeModal={closeModal}
          studyId={studyId}
          refreshPage={refreshPage}
        />
      )}
    </Box>
  );
};

export default MenuLabels;
