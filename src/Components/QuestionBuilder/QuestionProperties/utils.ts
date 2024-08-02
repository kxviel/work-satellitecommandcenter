import { choice_types } from "../questionTypes";
import { v4 as uuid } from "uuid";

export const submitValidation = (question: any) => {
  let errorHandler = {
    basic: "",
    choices: "",
    repeatedConfig: "",
    gridConfig: "",
    validations: "",
    dependency: "",
    ok: true,
  };

  const basicError = () => {
    errorHandler.ok = false;
    errorHandler.basic = "Fill all the required fields";
  };

  // Common Validation
  if (!question?.label?.trim() || !question?.varname?.trim()) {
    basicError();
  }

  // Question Specific Validation
  const { properties } = question;

  if (question.type === "repeated_measure") {
    if (!properties.phaseId) {
      basicError();
    }
  }
  if (question?.type === "upload_file") {
    if (typeof properties?.max !== "number") {
      basicError();
    }
  } else if (question?.type === "calculated_field") {
    if (!question?.calculationTemplate) {
      basicError();
    }
  } else if (question?.type === "slider") {
    if (!properties?.minLabel) {
      basicError();
    } else if (!properties?.maxLabel) {
      basicError();
    } else if (typeof properties?.min !== "number") {
      basicError();
    } else if (typeof properties?.max !== "number") {
      basicError();
    } else if (typeof properties?.step !== "number" || properties?.step <= 0) {
      basicError();
    } else if (properties?.min > properties?.max) {
      errorHandler.ok = false;
      errorHandler.basic = "Min cannot be greater than Max";
    }
  } else if (question?.type === "number") {
    if (properties?.min > properties?.max) {
      errorHandler.ok = false;
      errorHandler.basic = "Min cannot be greater than Max";
    }
    if (properties?.fieldWidth > 20 || properties?.fieldWidth < 5) {
      errorHandler.ok = false;
      errorHandler.basic = "Field width has to be between 5 and 20";
    }
  }

  // Choices Validation
  const { choices } = question;

  if (choices && choice_types.includes(question?.type)) {
    if (choices?.length < 2) {
      errorHandler = {
        ...errorHandler,
        ok: false,
        choices: "Atleast two choices are required",
      };
    } else {
      let label = false;
      let value = false;

      for (let i = 0; i < choices?.length; i++) {
        const choice = question?.choices[i];

        if (!choice?.label) {
          label = true;
        }

        if (typeof choice?.value !== "number") {
          value = true;
        }
      }

      if (label || value) {
        errorHandler = {
          ...errorHandler,
          ok: false,
          choices:
            label && value
              ? `Choices need labels and values`
              : `Choices need ${label ? "labels" : "values"}`,
        };
      }
    }
  }

  // Validations Validation
  const { validations } = question;

  if (validations) {
    let operator = false;
    let value = false;
    let message = false;

    for (let i = 0; i < validations?.length; i++) {
      const val = validations[i];

      if (!val.operator) {
        operator = true;
      }

      if (!val.message) {
        message = true;
      }

      if (
        ["radio", "dropdown", "checkbox"].includes(question.type) &&
        !val?.questionChoiceId
      ) {
        value = true;
      } else if (
        ["number", "slider", "calculated_field"].includes(question.type) &&
        typeof val?.numberValue !== "number"
      ) {
        value = true;
      } else if (["text", "date"].includes(question.type) && !val?.textValue) {
        value = true;
      }
    }

    if (operator || value || message) {
      errorHandler = {
        ...errorHandler,
        ok: false,
        validations: `Validations need operator, value and message`,
      };
    }
  }

  // Dependency Validation
  const { dependency } = question;

  if (dependency) {
    const dependencyError = () => {
      errorHandler.ok = false;
      errorHandler.dependency = "Fill all the required fields";
    };

    if (!dependency?.parentQuestionId || !dependency?.parentFormId) {
      dependencyError();
    } else if (!dependency?.operator) {
      dependencyError();
    } else if (
      !dependency?.questionChoiceId &&
      !dependency?.textValue &&
      typeof dependency?.numberValue !== "number"
    ) {
      dependencyError();
    }
  }

  if (question?.type === "repeated_data") {
    const repeatedConfigError = () => {
      errorHandler.ok = false;
      errorHandler.repeatedConfig = "Fill all the required fields";
    };

    const config = question.properties.repeatedConfig.columns;

    config.forEach((col: any) => {
      if (!col.label) {
        repeatedConfigError();
      }
      if (col?.type === "dropdown") {
        col?.options.forEach((opt: string) => {
          if (!opt) {
            repeatedConfigError();
          }
        });
      }
    });
  }

  if (question?.type === "grid") {
    const gridConfigError = () => {
      errorHandler.ok = false;
      errorHandler.gridConfig = "Fill all the required fields";
    };

    const config = question.properties.gridConfig;

    config?.columns.forEach((col: any) => {
      if (!col.label) {
        gridConfigError();
      }
      if (config.fieldType === "column" && col?.type === "dropdown") {
        col?.options.forEach((opt: string) => {
          if (!opt) {
            gridConfigError();
          }
        });
      }
    });

    config?.rows.forEach((row: any) => {
      if (!row.label) {
        gridConfigError();
      }
      if (config.fieldType === "row" && row?.type === "dropdown") {
        row?.options.forEach((opt: string) => {
          if (!opt) {
            gridConfigError();
          }
        });
      }
    });
  }
  return errorHandler;
};

export const copyQuestionMiddleware = (originalQuestion: any) => {
  let newQuestion = JSON.parse(JSON.stringify(originalQuestion));

  // Remove unique attributes
  delete newQuestion.id;
  delete newQuestion.varname;

  // Increment position
  newQuestion.position = originalQuestion.position + 1;

  // re-init choice obj
  if (newQuestion.choices && newQuestion.choices.length > 0) {
    let newArray: any[] = [];

    for (let i = 0; i < newQuestion.choices.length; i++) {
      const newRefId = uuid();
      const oldRefId = newQuestion.choices[i].ref;

      newQuestion.validations.forEach((val: any) => {
        if (val.questionChoiceId === oldRefId) {
          val.questionChoiceId = newRefId;
        }
      });

      let body = {
        ref: newRefId,
        isOther: newQuestion.choices[i].isOther,
        label: newQuestion.choices[i].label,
        value: newQuestion.choices[i].value,
        position: newQuestion.choices[i].position,
      };

      newArray.push(body);
    }

    newQuestion.choices = newArray;
  }

  const dict: Record<string, string> = {
    text: "textValue",
    date: "textValue",
    number: "numberValue",
    slider: "numberValue",
    calculated_field: "numberValue",
    checkbox: "questionChoiceId",
    dropdown: "questionChoiceId",
    radio: "questionChoiceId",
  };

  // re-init validations obj
  if (newQuestion.validations && newQuestion.validations.length > 0) {
    const { validations, type } = newQuestion;
    let newArray: any[] = [];

    for (let i = 0; i < validations.length; i++) {
      let body = {
        message: validations[i].message,
        type: validations[i].type,
        operator: validations[i].operator,
        [dict[type]]: validations[i][dict[type]],
      };

      newArray.push(body);
    }

    newQuestion.validations = newArray;
  }

  // re-init depenediencies
  if (newQuestion?.dependency) {
    const { dependency } = newQuestion;
    let newBody: any = {
      parentFormId: dependency.parentFormId,
      parentQuestionId: dependency.parentQuestionId,
      operator: dependency.operator,
    };

    if (dependency.textValue) {
      newBody.textValue = dependency.textValue;
    } else if (typeof dependency.numberValue === "number") {
      newBody.numberValue = dependency.numberValue;
    } else if (dependency.questionChoiceId) {
      newBody.questionChoiceId = dependency.questionChoiceId;
    }

    newQuestion.dependency = newBody;
  }

  return newQuestion;
};
