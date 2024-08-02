type Props = {
  currentQuestion: any;
};

const RepeatedField = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;
  const repeatedConfig = properties?.repeatedConfig.columns;

  const array = new Array(10).fill(0);
  return (
    <>
      <table>
        <thead>
          <tr>
            <td></td>
            {repeatedConfig?.map((col: any, i: number) => (
              <td key={i}>{col.label}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {array.map((id, i) => (
            <tr key={i}>
              <td style={{ width: "100px" }}>{i + 1}</td>
              {repeatedConfig?.map((col: any, j: number) => (
                <td key={j}>
                  <input style={{ width: "100px", height: "35px" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RepeatedField;
