type Props = {
  currentQuestion: any;
};
const RadioField = ({ currentQuestion }: Props) => {
  const { choices, type } = currentQuestion;

  return (
    <ul style={{ listStyle: "none" }}>
      {choices?.map((choice: any) => (
        <li key={choice.id} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input type={type === "checkbox" ? "checkbox" : "radio"} />
            <span style={{ marginLeft: "8px", marginRight: "8px" }}>
              {choice.label}
            </span>
          </div>

          {choice?.isOther && (
            <input
              style={{ width: "200px", height: "35px", marginTop: "5px" }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
export default RadioField;
