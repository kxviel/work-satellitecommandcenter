import {
  ExternalResponsesDict,
  QuestionSlice,
} from "../../Redux/reducers/responseSlice";
import {
  ExternarlVarname,
  ExternarlVarnameRoot,
} from "../../types/ExternalVarname.types";
import {
  FormDataObject,
  FormQuestion,
  FormResponse,
  GridConfig,
  RepeatConfig,
} from "../../types/FormData.types";
import {
  UpdateResponse,
  UpdateResponseData,
} from "../../types/UpdateResponse.types";
import http from "../../utils/http";
import httpSurvey from "../../utils/httpSurvey";
import { textTypes } from "../QuestionBuilder/questionTypes";
import { PhaseListForms } from "./types";

export const createGridResSkeleton = (config: GridConfig) => {
  let gridData: any[] = [];

  config.rows.forEach((row) => {
    // Initialize rowValues array
    let rowValues: any[] = [];

    // Loop through columns
    config.columns.forEach(() => {
      rowValues.push({});
    });

    // Push rowValues to gridData array
    gridData.push(rowValues);
  });

  return [{ gridData, notSaved: true }];
};

export const createRepeatedDataResSkeleton = (config: RepeatConfig) => {
  let repeatedData: any[] = []; // Outer Array
  let rowArray: any[] = []; // Inner Array

  config.columns.forEach(() => {
    rowArray.push({});
  });
  repeatedData.push(rowArray);

  return [{ repeatedData, notSaved: true }];
};

const responseSkeletonModifier = (
  res: Record<string, UpdateResponse[] | FormResponse[]>,
  q: FormQuestion | QuestionSlice
) => {
  const currentResponse = res[q.id] || [];
  const isCleared = currentResponse?.[0]?.isCleared;

  if (currentResponse.length) {
    if (isCleared) {
      if (q.type === "grid") {
        // Create Skeleton for grid
        let returnObject: any = createGridResSkeleton(
          q?.properties?.gridConfig!
        );

        if (currentResponse[0].remarkValue) {
          returnObject[0].remarkValue = currentResponse[0].remarkValue;
        }

        return returnObject;
      } else if (q.type === "repeated_data") {
        // Create Skeleton for repeated
        let returnObject: any = createRepeatedDataResSkeleton(
          q?.properties?.repeatedConfig!
        );

        if (currentResponse[0].remarkValue) {
          returnObject[0].remarkValue = currentResponse[0].remarkValue;
        }

        return returnObject;
      } else {
        if (currentResponse[0].remarkValue) {
          return [
            { remarkValue: currentResponse[0].remarkValue, notSaved: true },
          ];
        } else {
          return [{ notSaved: true }];
        }
      }
    } else if (q.type === "grid") {
      const newRes = currentResponse.map((r) => {
        const { gridValue, ...rest } = r;

        return {
          ...rest,
          gridData: gridValue,
        };
      });

      return newRes;
    } else if (q.type === "repeated_data") {
      const newRes = currentResponse.map((r) => {
        const { gridValue, ...rest } = r;

        return {
          ...rest,
          repeatedData: gridValue,
        };
      });
      return newRes;
    } else {
      return currentResponse;
    }
  }

  return [{ notSaved: true }];
};

const createStarterTemplate = (question: QuestionSlice | FormQuestion) => {
  if (question.type === "grid" && question?.properties?.gridConfig) {
    return createGridResSkeleton(question.properties.gridConfig);
  } else if (
    question.type === "repeated_data" &&
    question?.properties?.repeatedConfig
  ) {
    return createRepeatedDataResSkeleton(question.properties.repeatedConfig);
  } else {
    return [
      {
        notSaved: true,
      },
    ];
  }
};

export const createResponseSkeleton = (
  responseData: FormDataObject
): QuestionSlice[] => {
  const { form, questionVisibilities, responses } = responseData;

  let responseDict: Record<string, FormResponse[]> = {};
  responses.forEach((res) => {
    if (responseDict[res.questionId]) {
      responseDict[res.questionId].push(res);
    } else {
      responseDict[res.questionId] = [res];
    }
  });

  const modifiedSlice = form.questions.map((q) => {
    const isVisible = questionVisibilities?.[q.id] || false;
    let res: any[] = [];

    if (isVisible && responseDict[q.id]) {
      res = responseSkeletonModifier(responseDict, q);
      res = JSON.parse(JSON.stringify(res));
    } else {
      res = createStarterTemplate(q);
    }
    const updatedLabel = q.label.replace(/(?:\r\n|\r|\n)/g, "<br>");
    const labelTemplate = q.type === "summary" ? updatedLabel : undefined;

    return {
      ...q,
      labelTemplate,
      label: updatedLabel,
      labelCopy: q.label,
      isVisible,
      responses: res,
      responsesBackup: res,
    };
  });

  return modifiedSlice;
};

export const updateResponseSkeleton = (
  questions: QuestionSlice[],
  currentQuestionId: string,
  responseData: UpdateResponseData
): QuestionSlice[] => {
  const { questionVisibilities, responses } = responseData;

  let responseDict: Record<string, UpdateResponse[]> = {};
  responses.forEach((res) => {
    if (responseDict[res.questionId]) {
      responseDict[res.questionId].push(res);
    } else {
      responseDict[res.questionId] = [res];
    }
  });

  const newQuestions = questions.map((q) => {
    const isVisible = questionVisibilities?.[q.id] || false;
    let res;

    if (q.id === currentQuestionId) {
      res = responseSkeletonModifier(responseDict, q);
      res = JSON.parse(JSON.stringify(res));
      return {
        ...q,
        isVisible,
        responses: res,
        responsesBackup: res,
      };
    }

    if (!isVisible && q.isVisible) {
      res = createStarterTemplate(q);
    }

    return {
      ...q,
      isVisible,
      responses: res ? res : q.responses,
      responsesBackup: res ? res : q.responsesBackup,
    };
  });

  return newQuestions;
};

const hasKeyValuePair = (arrayOfArrays: any[][]) => {
  // Iterate over each inner array
  for (let i = 0; i < arrayOfArrays.length; i++) {
    const innerArray = arrayOfArrays[i];
    // Iterate over each object in the inner array
    for (let j = 0; j < innerArray.length; j++) {
      const obj = innerArray[j];
      // Check if the object has any key-value pair
      if (Object.keys(obj).length > 0) {
        return true; // Found at least one key-value pair
      }
    }
  }

  return false; // No key-value pair found in any object
};

export type SanitizedRequest = {
  isCleared?: boolean;
  textValue?: string;
  numberValue?: number;
  choices?: {
    id: string;
    textValue?: string;
  }[];
  gridData?: {
    gridData: any;
  };
  repeatedData?: {
    repeatedData: any;
  };
  files?: any;
  remarkValue?: string;
  isConfirmed?: boolean;
};

export const santizeResponsesMiddleware = (
  currentQuestion: QuestionSlice
): SanitizedRequest => {
  const currentResponse = currentQuestion?.responses;

  switch (currentQuestion.type) {
    case "date":
    case "text": {
      if (!currentResponse?.[0]?.textValue) {
        return {
          isCleared: true,
        };
      }

      return {
        textValue: currentResponse?.[0]?.textValue || "",
      };
    }
    case "slider":
    case "calculated_field":
    case "number": {
      if (
        typeof currentResponse?.[0]?.numberValue !== "number" ||
        isNaN(currentResponse?.[0]?.numberValue)
      ) {
        return {
          isCleared: true,
        };
      }

      return {
        numberValue: currentResponse?.[0]?.numberValue,
      };
    }
    case "radio":
    case "dropdown": {
      if (!currentResponse?.[0]?.questionChoiceId) {
        return {
          isCleared: true,
        };
      }

      let choiceObject: any = {
        id: currentResponse?.[0]?.questionChoiceId,
      };

      if (currentResponse?.[0]?.textValue) {
        choiceObject = {
          ...choiceObject,
          textValue: currentResponse?.[0]?.textValue,
        };
      } else if (
        currentQuestion?.choices?.find(
          (choice) => choice?.id === currentResponse?.[0]?.questionChoiceId
        )?.isOther &&
        !currentResponse?.[0]?.textValue
      ) {
        return {
          isCleared: true,
        };
      }

      return {
        choices: [choiceObject],
      };
    }
    case "checkbox": {
      if (!currentResponse?.some((obj) => obj?.questionChoiceId)) {
        return {
          isCleared: true,
        };
      }

      let choiceArray: any[] = [];

      currentResponse.forEach((response) => {
        if (!response?.questionChoiceId) {
          return;
        }

        let choiceObject: any = {
          id: response?.questionChoiceId,
          textValue: response?.textValue,
        };

        if (!response?.textValue) {
          delete choiceObject.textValue;

          // Check if the checkbox is "isOther===true"
          if (
            currentQuestion?.choices.find(
              (c) => c.id === response?.questionChoiceId
            )?.isOther
          ) {
            return {
              isCleared: true,
            };
          }
        }

        choiceArray.push(choiceObject);
      });

      return {
        choices: choiceArray,
      };
    }
    case "grid": {
      const gridData = { gridData: currentResponse?.[0]?.gridData };
      // atleast one item exists send, else is clear

      if (hasKeyValuePair(currentResponse?.[0]?.gridData)) {
        return gridData;
      } else {
        return {
          isCleared: true,
        };
      }
    }
    case "repeated_data": {
      const repeatedData = { repeatedData: currentResponse?.[0]?.repeatedData };

      if (hasKeyValuePair(currentResponse?.[0]?.repeatedData)) {
        return repeatedData;
      } else {
        return {
          isCleared: true,
        };
      }
    }
    case "upload_file": {
      const res = currentResponse?.[0];

      if (!res.files || res.files.length === 0) {
        return {
          isCleared: true,
        };
      }

      return JSON.parse(JSON.stringify(res));
    }
    default:
      return {};
  }
};

export const handlePhaseStatus = (phaseForms: PhaseListForms[]) => {
  let isEveryFormCompleted = true;
  let isEveryFormNotStarted = true;

  for (const pf of phaseForms) {
    if (pf.status !== "completed") {
      isEveryFormCompleted = false;
    }
    if (pf.status !== "active") {
      isEveryFormNotStarted = false;
    }
    if (!isEveryFormCompleted && !isEveryFormNotStarted) {
      // If both conditions are already false, exit loop early
      break;
    }
  }

  return isEveryFormCompleted
    ? "completed"
    : isEveryFormNotStarted
    ? "notstarted"
    : "inprogress";
};

export const checkIfDirty = (
  requestBody: SanitizedRequest,
  currQues: QuestionSlice
) => {
  let isDirty = false;
  const responses = requestBody;
  const responsesBackup = currQues.responsesBackup;

  const otherTypes = ["text", "number", "date", "slider"];

  const remarkDirtied = () => {
    // is remark dirtied
    if (typeof requestBody?.remarkValue === "string") {
      if (!responsesBackup?.[0]?.remarkValue && requestBody.remarkValue) {
        // remark never existed, now has remark
        return true;
      } else if (
        responsesBackup?.[0]?.remarkValue &&
        responsesBackup?.[0]?.remarkValue !== requestBody.remarkValue
      ) {
        // remark existed, has new remark
        return true;
      } else if (
        responsesBackup?.[0]?.remarkValue &&
        typeof requestBody.remarkValue === "string" &&
        !requestBody.remarkValue
      ) {
        // remark existed, now cleared

        return true;
      }
    }

    return false;
  };

  if (currQues.type === "radio" || currQues.type === "dropdown") {
    //radio||dropdown => checkbox => other types
    const currRes = responses?.choices?.[0];
    const backupRes = responsesBackup?.[0];

    if (backupRes?.questionChoiceId !== currRes?.id) {
      isDirty = true;
    }

    // if (backupRes?.textValue) {
    if (!backupRes.textValue && currRes?.textValue) {
      // never had textValue, now has textValue
      isDirty = true;
    } else if (
      backupRes.textValue &&
      backupRes.textValue !== currRes?.textValue
    ) {
      // had textValue, has new textValue
      isDirty = true;
    }
    // }

    return isDirty || remarkDirtied();
  } else if (currQues.type === "checkbox") {
    responses.choices?.forEach((res, i) => {
      const found = responsesBackup.find(
        (ch) => res.id === ch.questionChoiceId
      );

      if (!found) {
        isDirty = true;
      }

      // if (responsesBackup?.[i]?.textValue) {
      if (!responsesBackup?.[i]?.textValue && res.textValue) {
        // never had textValue, now has textValue
        isDirty = true;
      } else if (
        responsesBackup?.[i]?.textValue &&
        responsesBackup?.[i]?.textValue !== res.textValue
      ) {
        // had textValue, has new textValue
        isDirty = true;
      }
      // }
    });

    // if new responses are added
    if (responsesBackup.length !== responses.choices?.length) {
      isDirty = true;
    }

    return isDirty || remarkDirtied();
  } else if (otherTypes.includes(currQues.type)) {
    const otherTypeBackupValue = textTypes.includes(currQues.type)
      ? responsesBackup?.[0]?.textValue
      : responsesBackup?.[0]?.numberValue;
    const otherTypeValue = textTypes.includes(currQues.type)
      ? responses?.textValue
      : responses?.numberValue;

    return otherTypeBackupValue !== otherTypeValue || remarkDirtied();
  }

  return true;
};

export const handleExternalVariables = async (
  finalExternalVarnames: string[],
  participantId?: string,
  surveySlug?: string,
  studyId?: string,
  formId?: string,
  repeatedAttemptId?: string,
  surveyAssignmentId?: string
) => {
  let extVarRes: ExternarlVarname[] = [];

  const params: any = { participantId };
  const body = {
    varnames: finalExternalVarnames,
  };

  if (surveySlug && formId) {
    const extVarsResponse = await httpSurvey.post<ExternarlVarnameRoot>(
      `/survey/${surveySlug}/${formId}/get-responses-by-varnames`,
      body,
      { params }
    );
    extVarRes = extVarsResponse.data.data;
  } else if (repeatedAttemptId && formId && studyId) {
    params.repeatedAttemptId = repeatedAttemptId;
    const extVarsResponse = await http.post<ExternarlVarnameRoot>(
      `/study/${studyId}/repeated-responses/${formId}/get-responses-by-varnames`,
      body,
      { params }
    );
    extVarRes = extVarsResponse.data.data;
  } else if (surveyAssignmentId && formId && studyId) {
    params.surveyAssignmentId = surveyAssignmentId;
    const extVarsResponse = await http.post<ExternarlVarnameRoot>(
      `/study/${studyId}/survey-responses/${formId}/get-responses-by-varnames`,
      body,
      { params }
    );
    extVarRes = extVarsResponse.data.data;
  } else if (formId && studyId) {
    const extVarsResponse = await http.post<ExternarlVarnameRoot>(
      `/study/${studyId}/responses/${formId}/get-responses-by-varnames`,
      body,
      { params }
    );
    extVarRes = extVarsResponse.data.data;
  }

  let resObj = {} as ExternalResponsesDict;
  extVarRes.forEach((r) => {
    const varname = r.question.varname;
    const type = r.question.type;

    if (resObj[varname] && type === "checkbox") {
      resObj[varname] = {
        ...resObj[varname],
        numberValue: r.numberValue + resObj[varname].numberValue,
        choiceLabel:
          (resObj[varname].choiceLabel || "") + ", " + r?.questionChoice?.label,
      };
    } else {
      resObj[varname] = {
        textValue: r.textValue,
        numberValue: r.numberValue,
        type: type,
        calculationOperands: [],
        choiceLabel: r?.questionChoice?.label,
      };
    }
  });

  return resObj;
};
