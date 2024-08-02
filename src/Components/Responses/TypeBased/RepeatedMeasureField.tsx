import { useEffect, useState } from "react";
import { QuestionSlice } from "../../../Redux/reducers/responseSlice";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../Redux/hooks";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  choice_types,
  displayTypes,
  number_types,
  textTypes,
} from "../../QuestionBuilder/questionTypes";
import { errorToastMessage } from "../../../utils/toast";
import { NoDataContainer, StyledTableCell } from "../../Common/styles/table";
type Props = {
  currentQuestion: QuestionSlice;
};
const RepeatedMeasureField: React.FC<Props> = ({ currentQuestion }) => {
  const { id: studyId, surveySlug } = useParams();
  const { selectedForm, participantId } = useAppSelector(
    (state) => state.response
  );
  const questionId = currentQuestion?.id;
  let phaseId: string = "";
  let formId: string = "";
  if (selectedForm) {
    formId = selectedForm.id;
    phaseId = selectedForm.phaseId;
  }

  const { properties } = currentQuestion;
  const showAll = properties?.showAll;

  const [data, setData] = useState<any[]>([]);
  const [headers, setHeader] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await http.get(
          `/study/${studyId}/responses/${formId}/repeated-measure/${questionId}?participantId=${participantId}&phaseId=${phaseId}`
        );
        const formattedHeader = res.data.data.form.questions
          .map((q: any) => {
            return {
              id: q.id,
              label: q.label,
              type: q.type,
              properties: q.properties,
              position: q.position,
            };
          })
          .filter(
            (q: any) => displayTypes.includes(q.type) && !q.properties.hidden
          )
          .map((q: any) => {
            const { properties, ...rest } = q;
            return {
              ...rest,
            };
          });
        formattedHeader.sort((a: any, b: any) => a.position - b.position);
        const formattedRespones = res.data.data.repeatedData.map((rd: any) => {
          const resObj: any = {};
          rd.repeatedAttempts.forEach((attempt: any) => {
            attempt?.responses.forEach((response: any) => {
              if (resObj[response.questionId]) {
                resObj[response.questionId].label =
                  resObj[response.questionId].label +
                  ", " +
                  response?.questionChoice?.label +
                  (response.textValue ? " - " + response.textValue : "");
              } else {
                resObj[response.questionId] = {
                  id: response.id,
                  qid: response.questionId,
                  textValue: response.textValue,
                  numberValue: response.numberValue,
                  label:
                    response?.questionChoice?.label +
                    (response.textValue ? " - " + response.textValue : ""),
                };
              }
            });
          });
          const obj: any = {};
          formattedHeader.forEach((q: any) => {
            const res = resObj[q.id];
            if (res) {
              if (textTypes.includes(q.type)) {
                obj[q.id] = res.textValue || "";
              } else if (number_types.includes(q.type)) {
                obj[q.id] =
                  typeof res.numberValue === "number" ? res.numberValue : "";
              } else if (choice_types.includes(q.type)) {
                obj[q.id] = res.label || "";
              }
            }
          });
          return {
            id: rd.id,
            name: rd.name,
            parentPhase: rd?.parentPhase?.name,
            ...obj,
          };
        });
        setHeader(formattedHeader);
        setData(formattedRespones);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    if (!surveySlug && formId && studyId && phaseId) {
      fetchData();
    }
  }, [surveySlug, studyId, phaseId, questionId, participantId, formId]);

  return (
    <Stack
      sx={{
        width: {
          xs: "100%",
          md: "80%",
        },
        pl: "60px",
      }}
      gap={1}
    >
      {!loading && (
        <>
          {headers.length > 0 ? (
            <Box sx={{ overflowX: "scroll" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      <Box display={"flex"} alignItems={"center"}>
                        Name
                      </Box>
                    </StyledTableCell>
                    {showAll && (
                      <StyledTableCell>
                        <Box display={"flex"} alignItems={"center"}>
                          Parent Visit
                        </Box>
                      </StyledTableCell>
                    )}
                    {headers.map((q: any) => {
                      return (
                        <StyledTableCell key={q.id}>
                          <Box display={"flex"} alignItems={"center"}>
                            {q.label}
                          </Box>
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row) => (
                    <TableRow key={row?.id}>
                      <StyledTableCell sx={{ minWidth: "250px" }}>
                        {row?.name || "-"}
                      </StyledTableCell>
                      {showAll && (
                        <StyledTableCell sx={{ minWidth: "150px" }}>
                          {row?.parentPhase || "-"}
                        </StyledTableCell>
                      )}
                      {headers.map((q: any) => {
                        return (
                          <StyledTableCell
                            key={q.id}
                            sx={{ minWidth: "150px" }}
                          >
                            {typeof row[q.id] === "undefined" ? "-" : row[q.id]}
                          </StyledTableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data.length === 0 && (
                <NoDataContainer>
                  <Typography variant="body1" color="gray">
                    No Data available
                  </Typography>
                </NoDataContainer>
              )}
            </Box>
          ) : (
            <Typography variant="body1" color="gray">
              No Data Available
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
};
export default RepeatedMeasureField;
