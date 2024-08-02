import QuestionItem from "./QuestionItem";
import { PrintForm } from "./QuestionPrintPhase";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";
import React from "react";
import DependencyItem from "./DependencyItem";
type Props = {
  form: PrintForm;
  breakPage?: boolean;
};

const FormPrint = ({ form, breakPage }: Props) => {
  return (
    <div
      className="print-form-container"
      style={{
        pageBreakBefore: breakPage ? "always" : "auto",
      }}
    >
      <h2 style={{ marginBottom: "20px", lineHeight: "150%" }}>{form.name}</h2>
      <table className="print-crf-table">
        <thead>
          <tr className="crf-table-header">
            <th style={{ width: "3%" }}>#</th>
            <th style={{ width: "52%" }}>Question</th>
            <th style={{ width: "45%" }}>Answers</th>
          </tr>
        </thead>
        <tbody>
          {form.questions.map((q: any, index: number) => {
            return (
              <React.Fragment key={q.id}>
                <tr key={q.id + "-main"} className="crf-table-row">
                  {![
                    "statement",
                    "summary",
                    "calculated_field",
                    "repeated_measure",
                  ].includes(q.type) ? (
                    <td>{index + 1}</td>
                  ) : (
                    <td></td>
                  )}
                  <td
                    colSpan={
                      [
                        "statement",
                        "summary",
                        "repeated_measure",
                        "grid",
                        "repeated_data",
                      ].includes(q.type)
                        ? 2
                        : 1
                    }
                  >
                    <MDEditor.Markdown
                      wrapperElement={{
                        "data-color-mode": "light",
                      }}
                      source={q.labelMarkdown}
                      rehypePlugins={[rehypeSanitize]}
                      style={{ fontWeight: "400" }}
                    />
                    <i style={{ fontSize: "14px" }}>
                      Variable: {q.varname}
                      {q.dependency && (
                        <>
                          {" "}
                          | <DependencyItem dep={q.dependency} />
                        </>
                      )}
                    </i>
                  </td>
                  {![
                    "statement",
                    "summary",
                    "repeated_measure",
                    "grid",
                    "repeated_data",
                  ].includes(q.type) && (
                    <td>
                      <QuestionItem question={q} />
                    </td>
                  )}
                </tr>
                {["grid", "repeated_data"].includes(q.type) && (
                  <tr key={q.id + "table"} className="crf-table-row">
                    <td></td>
                    <td colSpan={2}>
                      <QuestionItem question={q} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {form.questions.length === 0 && (
        <h3 style={{ marginTop: "20px", textAlign: "center" }}>
          No questions in this form
        </h3>
      )}
    </div>
  );
};

export default FormPrint;
