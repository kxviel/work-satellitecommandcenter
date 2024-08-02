import { ChevronLeft } from "@mui/icons-material";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { colFlexStyle, commonContainerWrapper } from "../Common/styles/flex";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../utils/http";
import { errorToastMessage } from "../../utils/toast";
import { responsesHeader } from "../Responses/FormHeader";

const ParticipantDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const { id: studyId, participantId } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let url = `/participants/${participantId}?studyId=${studyId}`;
        const res = await http.get(url);
        const userRes = res?.data?.data;
        let newData: any = {};
        newData = {
          firstName: userRes?.firstName,
          lastName: userRes?.lastName,
          email: userRes?.email || "-",
          siteName: userRes?.site?.name || "-",
          subjectId: userRes?.formattedSubjectId ?? userRes?.site?.abbreviation,
        };
        setData(newData);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [studyId, participantId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {loading ? (
        <Stack
          sx={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <>
          <Stack
            sx={responsesHeader}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={2}
          >
            <Stack
              direction={"row"}
              gap={1}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <ChevronLeft
                onClick={handleBack}
                sx={{ cursor: "pointer" }}
                fontSize="large"
              />
              <Box>
                <Typography fontWeight={600} fontSize={"20px"}>
                  Participant ID: {data?.subjectId} Details
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ p: 3 }}>
            <Box sx={commonContainerWrapper}>
              <Typography fontSize={20} fontWeight={600} color="text.primary">
                Participant Details
              </Typography>
              <Box sx={{ ...colFlexStyle, gap: 3, my: 3 }}>
                {data?.firstName && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                      <Typography
                        fontSize={16}
                        fontWeight={500}
                        color="text.primary"
                      >
                        First Name
                      </Typography>
                      <Typography
                        fontSize={16}
                        fontWeight={400}
                        color="text.primary"
                      >
                        {data?.firstName}
                      </Typography>
                    </Box>
                    <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                      <Typography
                        fontSize={16}
                        fontWeight={500}
                        color="text.primary"
                      >
                        Last Name
                      </Typography>
                      <Typography
                        fontSize={16}
                        fontWeight={400}
                        color="text.primary"
                      >
                        {data?.lastName}
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                  <Typography
                    fontSize={16}
                    fontWeight={500}
                    color="text.primary"
                  >
                    Email
                  </Typography>
                  <Typography
                    fontSize={16}
                    fontWeight={400}
                    color="text.primary"
                  >
                    {data?.email}
                  </Typography>
                </Box>
                <Box sx={{ ...colFlexStyle, gap: "10px" }}>
                  <Typography
                    fontSize={16}
                    fontWeight={500}
                    color="text.primary"
                  >
                    Site
                  </Typography>
                  <Typography
                    fontSize={16}
                    fontWeight={400}
                    color="text.primary"
                  >
                    {data?.siteName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ParticipantDetails;
