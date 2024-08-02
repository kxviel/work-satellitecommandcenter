import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import QuestionItem from "./QuestionItem";
import { useAppSelector } from "../../Redux/hooks";
import { useParams } from "react-router-dom";
import SurveyActions from "./Survey/SurveyActions";

const responseContainer: SxProps = {
  flex: "1",
  minWidth: "1px",
};

const responseWrapper: SxProps = {
  width: "100%",
  px: 1,
  pb: 2,
  display: "flex",
  flexDirection: "column",
};

const responseWrapperHeader: SxProps = {
  p: 2,
  borderBottom: "1px solid",
  borderColor: "divider",
  mb: 2,
};

const QuestionItemWrapper = () => {
  const { surveySlug } = useParams();
  // const scrollToRef = useRef<HTMLDivElement>(null);
  const selectedForm = useAppSelector((state) => state.response.selectedForm);
  const isFormLoading = useAppSelector((state) => state.response.isLoading);
  const questionList = useAppSelector((state) => state.response.questionList);

  // const [idFromQueries, setIdFromQueries] = useState<string>(
  //   sessionStorage.getItem("response-visit-question") || ""
  // );

  // useEffect(() => {
  //   if (idFromQueries && questionList?.length > 0) {
  //     setIdFromQueries("");
  //     scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [questionList, idFromQueries]);

  return (
    <>
      {isFormLoading ? (
        <Stack
          sx={{ flex: 1, height: "100%" }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <>
          {questionList?.length > 0 && (
            <Box sx={responseContainer}>
              <Paper sx={responseWrapper}>
                <Stack sx={responseWrapperHeader}>
                  <Typography fontWeight={600} variant="subtitle2">
                    {selectedForm?.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    {selectedForm?.phaseName}
                  </Typography>
                  {selectedForm?.locked && (
                    <Typography variant="body1" color="text.secondary">
                      This Form was locked by{" "}
                      <strong>{selectedForm?.lockedBy}</strong> at{" "}
                      {selectedForm?.lockedAt}
                    </Typography>
                  )}
                </Stack>

                {questionList
                  .filter(
                    (question) =>
                      question.isVisible && !question.properties.isHidden
                  )
                  .map((question, index) => (
                    <QuestionItem
                      // scrollToRef={
                      //   idFromQueries === question.id ? scrollToRef : null
                      // }
                      key={question.id}
                      index={index}
                      question={question}
                    />
                  ))}
              </Paper>

              {surveySlug && <SurveyActions />}
            </Box>
          )}

          {questionList?.length === 0 && (
            <Stack
              sx={{ flex: 1, height: "100%" }}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography sx={{ fontWeight: 600 }} color={"primary.main"}>
                No Questions Found
              </Typography>
            </Stack>
          )}
        </>
      )}
    </>
  );
};
export default QuestionItemWrapper;
