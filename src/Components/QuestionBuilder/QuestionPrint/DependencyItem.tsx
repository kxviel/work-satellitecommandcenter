const symbolMap: Record<string, string> = {
  eq: "is equal to",
  not_eq: "is not",
  gt: "is greater than",
  lt: "is less than",
  gte: "is greater than or equal to",
  lte: "is less than or equal to",
  is_checked: "is checked",
  is_not_checked: "is not checked",
};

const keyMap: Record<string, string> = {
  text: "textValue",
  date: "textValue",
  number: "numberValue",
  slider: "numberValue",
  calculated_field: "numberValue",
  radio: "questionChoice",
  dropdown: "questionChoice",
  checkbox: "questionChoice",
  randomize: "textValue",
};

const DependencyItem = ({ dep }: { dep: any }) => {
  const dependent = dep?.parentQuestion?.varname;
  const operator = symbolMap[dep?.operator];
  const type = dep?.parentQuestion?.type;
  const label = ["radio", "dropdown", "checkbox"].includes(type)
    ? dep?.[keyMap[type]]?.label
    : dep?.[keyMap[type]];

  return (
    <span>
      Dependency: Answer if{" "}
      {type === "checkbox" ? (
        <span>
          "{label}" in "{dependent}" {operator}
        </span>
      ) : (
        <span>
          "{dependent}" {operator} {label}
        </span>
      )}
    </span>
  );
};

export default DependencyItem;
