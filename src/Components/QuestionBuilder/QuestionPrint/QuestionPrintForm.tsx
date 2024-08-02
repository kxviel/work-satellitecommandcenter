import { useEffect, useState } from "react";
import { errorToastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import FormPrint from "./FormPrint";
import { Button } from "@mui/material";
import { PrintForm, typeLabelMap } from "./QuestionPrintPhase";

const QuestionPrint = () => {
  const { id, formId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questionError, setQuestionError] = useState(false);
  const [form, setForm] = useState<PrintForm>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get(`/study/${id}/forms/${formId}`);
        let questions = data.data.questions
          ?.slice()
          .sort(
            (a: { position: number }, b: { position: number }) =>
              a.position - b.position
          );

        questions = questions.map((q: any) => {
          if (q.choices) {
            q.choices = q.choices.sort(
              (a: { position: number }, b: { position: number }) =>
                a.position - b.position
            );
          }
          q.labelMarkdown = q.label.replace(/(?:\r\n|\r|\n)/g, "<br>");
          return {
            ...q,
          };
        });
        setForm({
          name: data.data.name,
          questions,
          phase: data?.data?.phaseForm?.phase?.name,
          phaseType: data?.data?.phaseForm?.phase?.category,
          formName: data.data.name,
        });
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
        setQuestionError(true);
      }
    };
    fetchData();
  }, [id, formId]);

  const startPrint = () => {
    window.print();
  };

  return loading ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      Please wait while we generate the forms...
    </div>
  ) : questionError ? (
    <div>Something went wrong. please try again sometime later.</div>
  ) : (
    <div className="study-print-container">
      <div className="print-button">
        <Button variant="contained" onClick={startPrint}>
          Print
        </Button>
      </div>
      {form && <FormPrint form={form} />}
      {form && (
        <div
          className="print-form-container"
          style={{ pageBreakBefore: "always" }}
        >
          <h1>List of {typeLabelMap[form.phaseType || ""]} forms</h1>
          <div style={{ marginTop: "20px" }}>
            <table className="print-list-table">
              <thead>
                <tr>
                  <td>{typeLabelMap[form.phaseType || ""]} name</td>
                  <td>Form Name</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{form.phase}</td>
                  <td>{form.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPrint;
