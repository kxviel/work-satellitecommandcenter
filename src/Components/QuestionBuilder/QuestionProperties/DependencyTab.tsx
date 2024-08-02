import {
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  handleDependencyChange,
  handleDependencySwitch,
} from "../../../Redux/reducers/questionSlice";
import { useCallback, useEffect, useState } from "react";
import { errorToastMessage } from "../../../utils/toast";
import DependencyDatePickers from "./DependencyDatePickers";
import { requiredStyles } from "./BasicTab";
import { conditionOptionMap } from "./ValidationTab";
import { noValueTypes } from "../questionTypes";
import http from "../../../utils/http";
import { Question } from "../../../types/StudyFormById.types";

type Props = {
  question: any;
  // setNoLocalTabError: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormList = {
  phaseId: string;
  formId: string;
  label: string;
  position: number;
};

const DependencyTab = ({ question /*setNoLocalTabError*/ }: Props) => {
  const { dependency }: { dependency: any } = question || {};

  const dispatch = useAppDispatch();

  const studyId = useAppSelector(({ question }) => question.studyId);
  const formCategory = useAppSelector(({ question }) => question.formCategory);
  const isPreview = useAppSelector(({ question }) => !question.editable);
  const isDependencyError = useAppSelector(
    ({ question }) => question.isDependencyError
  );

  const [isLoading, setIsLoading] = useState(false);
  const [formList, setFormList] = useState<FormList[]>([]);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  // const [error, setError] = useState<string>("");

  const fetchFormList = useCallback(async () => {
    if (studyId && formCategory === "visit") {
      setIsLoading(true);
      let params: any = {
        category: formCategory,
      };

      http
        .get(`/study/${studyId}/study-phase`, {
          params,
        })
        .then(({ data }) => {
          let newObjectsArray: FormList[] = [];
          const phases = data.data;
          phases.sort(
            (a: { position: number }, b: { position: number }) =>
              a.position - b.position
          );
          phases.forEach((phase: any) => {
            let parentId = phase.id;
            const forms: FormList[] = [];
            phase.phaseForms.forEach((phaseForm: any) => {
              let label = `${phase.name} - ${phaseForm.form.name}`;

              let newObj: FormList = {
                phaseId: parentId,
                formId: phaseForm.form.id,
                label: label,
                position: phaseForm.position,
              };
              forms.push(newObj);
            });
            forms.sort(
              (a: { position: number }, b: { position: number }) =>
                a.position - b.position
            );
            newObjectsArray = newObjectsArray.concat(forms);
          });

          setFormList(newObjectsArray);
          setIsLoading(false);
        })
        .catch((err) => {
          errorToastMessage(err as Error);
          setIsLoading(false);
        });
    }
  }, [studyId, formCategory]);

  const fetchQuestionList = useCallback(async () => {
    const formId = dependency?.parentFormId;

    if (studyId && formId) {
      await http
        .get(`/study/${studyId}/forms/${formId}`)
        .then(({ data }) => {
          const filteredQuestions = data.data?.questions
            ?.filter(
              (q: any) =>
                q.id !== question?.id && !noValueTypes.includes(q.type)
            )
            .sort(
              (a: { position: number }, b: { position: number }) =>
                a.position - b.position
            );
          setQuestionList(filteredQuestions);
        })
        .catch((err) => {
          errorToastMessage(err as Error);
        });
    }
  }, [dependency?.parentFormId, question?.id, studyId]);

  useEffect(() => {
    fetchFormList();
  }, [fetchFormList]);

  useEffect(() => {
    fetchQuestionList();
  }, [fetchQuestionList]);

  useEffect(() => {
    if (questionList && dependency?.parentQuestionId) {
      setSelectedQuestion(
        questionList.find((q) => q.id === dependency?.parentQuestionId)
      );
    }
  }, [questionList, dependency?.parentQuestionId]);

  const onChange = (key: string, event: any, convertToNum = false) => {
    dispatch(
      handleDependencyChange({ key, value: event.target.value, convertToNum })
    );
  };

  // const numberFieldValidator = useCallback(
  //   (value: string) => {
  //     const valueAsNumber = parseFloat(value);

  //     if (selectedQuestion) {
  //       const properties = selectedQuestion.properties;
  //       if (
  //         typeof properties?.min === "number" &&
  //         typeof properties?.max === "number" &&
  //         (valueAsNumber < properties.min || valueAsNumber > properties.max)
  //       ) {
  //         setError(
  //           `Value must be between ${properties?.min} and ${properties?.max}`
  //         );
  //         setNoLocalTabError(false);
  //       } else if (
  //         typeof properties?.min === "number" &&
  //         valueAsNumber < properties.min
  //       ) {
  //         setError(`Value must be greater than ${properties?.min}`);
  //         setNoLocalTabError(false);
  //       } else if (
  //         typeof properties?.max === "number" &&
  //         valueAsNumber > properties.max
  //       ) {
  //         setError(`Value must be less than ${properties?.max}`);
  //         setNoLocalTabError(false);
  //       } else if (isNaN(valueAsNumber)) {
  //         setError("Value is Required");
  //         setNoLocalTabError(false);
  //       } else {
  //         setError("");
  //         setNoLocalTabError(true);
  //       }
  //     }
  //   },
  //   [selectedQuestion, setNoLocalTabError]
  // );

  // useEffect(() => {
  //   if (
  //     selectedQuestion &&
  //     ["number", "slider"].includes(selectedQuestion.type)
  //   ) {
  //     numberFieldValidator(dependency?.numberValue);
  //   }
  // }, [dependency?.numberValue, numberFieldValidator, selectedQuestion]);

  return (
    <Stack gap={2} py={1} sx={{ width: "100%" }}>
      {isDependencyError && (
        <Typography variant="caption" fontWeight="medium" color={"red"}>
          {isDependencyError}
        </Typography>
      )}

      <Stack gap={1}>
        <FormControlLabel
          disabled={isPreview}
          control={
            <Switch
              checked={!!dependency}
              onChange={(e) =>
                dispatch(handleDependencySwitch({ value: e.target.checked }))
              }
            />
          }
          label={
            <Typography variant="subtitle1" fontWeight="medium">
              Is this field dependent?
            </Typography>
          }
        />
      </Stack>

      {dependency && isLoading && (
        <Stack
          gap={1}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ width: "100%" }}
        >
          <CircularProgress />
        </Stack>
      )}

      {dependency && !isLoading && (
        <Stack gap={2}>
          <Stack
            gap={1}
            direction={"row"}
            alignItems={"center"}
            sx={{ width: "100%" }}
          >
            {formCategory === "visit" && (
              <Stack gap={1} sx={{ width: "50%" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={requiredStyles}
                >
                  Form
                </Typography>

                <Select
                  readOnly={isPreview}
                  fullWidth
                  id="parentFormId"
                  value={dependency?.parentFormId || ""}
                  onChange={(e) => onChange("parentFormId", e)}
                >
                  {formList?.length ? (
                    formList.map((item) => (
                      <MenuItem key={item.formId} value={item.formId}>
                        {item.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={"None"} value={""} disabled>
                      {"No Forms available"}
                    </MenuItem>
                  )}
                </Select>
              </Stack>
            )}

            <Stack gap={1} sx={{ width: "50%" }}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={requiredStyles}
              >
                Question
              </Typography>

              <Select
                readOnly={isPreview}
                fullWidth
                id="parentQuestionId"
                value={dependency?.parentQuestionId || ""}
                onChange={(e) => onChange("parentQuestionId", e)}
              >
                {questionList.length ? (
                  questionList.map((item, i) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                      disabled={item.id === question?.id}
                      onClick={() => setSelectedQuestion(item)}
                    >
                      {item.varname} -{" "}
                      {item.label.length > 50
                        ? item.label.slice(0, 50) + "..."
                        : item.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem key={"None"} value={""} disabled>
                    {"No Questions available"}
                  </MenuItem>
                )}
              </Select>
            </Stack>
          </Stack>

          {selectedQuestion && (
            <Stack
              gap={1}
              direction={"row"}
              alignItems={"flex-start"}
              sx={{ width: "100%", height: "110px" }}
            >
              <Stack gap={1} sx={{ width: "50%" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={requiredStyles}
                >
                  If Question
                </Typography>

                <Select
                  readOnly={isPreview}
                  fullWidth
                  id={"operator"}
                  placeholder="Select"
                  inputProps={{ "aria-label": "Without label" }}
                  value={dependency?.operator || ""}
                  onChange={(e) => onChange("operator", e)}
                >
                  {conditionOptionMap[selectedQuestion.type]?.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Stack gap={1} sx={{ width: "50%" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={requiredStyles}
                >
                  Value
                </Typography>

                {["text", "randomize"].includes(selectedQuestion.type) && (
                  <TextField
                    fullWidth
                    id={"textValue"}
                    placeholder="Value"
                    value={dependency?.textValue || ""}
                    onChange={(e) => onChange("textValue", e)}
                    name={"textValue"}
                    InputProps={{
                      readOnly: isPreview,
                    }}
                  />
                )}

                {/* Date and Time Pickers */}
                {["date"].includes(selectedQuestion.type) && (
                  <DependencyDatePickers
                    question={selectedQuestion}
                    curr={dependency}
                  />
                )}

                {["number", "slider", "calculated_field"].includes(
                  selectedQuestion.type
                ) && (
                  // <Stack>
                  <TextField
                    type="number"
                    fullWidth
                    id={"numberValue"}
                    placeholder="Value"
                    value={
                      typeof dependency?.numberValue === "number"
                        ? dependency?.numberValue
                        : ""
                    }
                    onChange={(e) => {
                      // numberFieldValidator(e.target.value);
                      onChange("numberValue", e, true);
                    }}
                    name={"numberValue"}
                    InputProps={{
                      readOnly: isPreview,
                    }}
                    // error={!!error}
                  />
                  //   {error && (
                  //     <span
                  //       style={{
                  //         color: "red",
                  //         fontSize: "12px",
                  //         fontWeight: "500",
                  //       }}
                  //     >
                  //       {error}
                  //     </span>
                  //   )}
                  // </Stack>
                )}

                {["radio", "dropdown", "checkbox"].includes(
                  selectedQuestion.type
                ) && (
                  <Select
                    readOnly={isPreview}
                    fullWidth
                    id={"questionChoiceId"}
                    placeholder="Select"
                    inputProps={{ "aria-label": "Without label" }}
                    value={dependency?.questionChoiceId || ""}
                    onChange={(e) => onChange("questionChoiceId", e)}
                  >
                    {selectedQuestion?.choices?.map((c) => (
                      <MenuItem key={c.ref} value={c.ref}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};
export default DependencyTab;
