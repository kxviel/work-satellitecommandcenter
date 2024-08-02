type Props = {
  currentQuestion: any;
};

const GridField = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;
  const gridConfig = properties?.gridConfig;

  return (
    <>
      {gridConfig?.fieldType === "row" && (
        <table style={{ maxWidth: "100%" }}>
          <thead>
            <tr>
              <td></td>
              {gridConfig?.columns.map((col: any, i: number) => (
                <td key={col.label + i}>{col.label || "Column " + (i + 1)}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridConfig?.rows.map((row: any, i: number) => (
              <tr key={row.label + i}>
                <td>{row.label || "Row " + (i + 1)}</td>

                {gridConfig?.columns.map((_: any, j: number) => (
                  <td key={i + j}>
                    <input style={{ width: "100px", height: "35px" }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {gridConfig?.fieldType === "column" && (
        <table style={{ maxWidth: "100%" }}>
          <thead>
            <tr>
              <td></td>
              {gridConfig?.columns.map((col: any, i: number) => (
                <td key={i}>{col.label || "Column " + (i + 1)}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridConfig?.rows.map((row: any, i: number) => (
              <tr key={i}>
                <td style={{ width: "100px" }}>
                  {row.label || "Row " + (i + 1)}
                </td>

                {gridConfig?.columns.map((col: any, j: number) => (
                  <td key={col.label + j}>
                    <input style={{ width: "100px", height: "35px" }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default GridField;
