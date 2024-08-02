import { useEffect, useState } from "react";
import { errorToastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import FormPrint from "./FormPrint";
import { AxiosResponse } from "axios";
import { Button } from "@mui/material";

export interface PrintForm {
  id?: string;
  name: string;
  formName: string;
  phase: string;
  phaseType?: string;
  questions: any[];
}

const messageMap: any = {
  visit: "Visit Forms",
  repeated_data: "Repeating data Forms",
  survey: "Survey Forms",
};

export const typeLabelMap: any = {
  visit: "Visit",
  repeated_data: "Repeating data",
  survey: "Survey",
};

const QuestionPrint = () => {
  const { id, type } = useParams();
  const [loading, setLoading] = useState(true);
  const [questionError, setQuestionError] = useState(false);
  const [forms, setForms] = useState<PrintForm[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: AxiosResponse = await http.get(
          `/study/${id}/study-phase?category=${type}`
        );
        const phaseData = res.data?.data;
        const formattedData = phaseData
          ?.map((item: any) => {
            const forms = item?.phaseForms.map((pf: any) => {
              return {
                position: pf.position,
                formId: pf.form.id,
              };
            });
            forms.sort((a: any, b: any) => a.position - b.position);
            return {
              id: item?.id,
              name: item?.name || "",
              position: item?.position || 1,
              forms: forms,
            };
          })
          .sort((a: any, b: any) => a.position - b.position);
        const result = [];
        let position = 1;
        for (let i = 0; i < formattedData.length; i++) {
          const phase = formattedData[i];
          for (let j = 0; j < phase.forms.length; j++) {
            const form = phase.forms[j];
            const { data } = await http.get(
              `/study/${id}/forms/${form.formId}`
            );
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
            result.push({
              id: form.formId,
              name: position++ + ". " + phase.name + " : " + data.data.name,
              questions,
              phase: phase.name,
              formName: data.data.name,
            });
          }
        }
        setForms(result);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
        setQuestionError(true);
      }
    };
    fetchData();
  }, [id, type]);

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
      <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
        {messageMap[type || ""]}
      </h1>
      <>
        {forms?.map((form, i) => (
          <FormPrint
            key={form.id}
            form={form}
            breakPage={i === 0 ? false : true}
          />
        ))}
      </>
      <div
        className="print-form-container"
        style={{ pageBreakBefore: "always" }}
      >
        <h1>List of {typeLabelMap[type || ""]} forms</h1>
        <div style={{ marginTop: "20px" }}>
          <table className="print-list-table">
            <thead>
              <tr>
                <td>{typeLabelMap[type || ""]} name</td>
                <td>Form Name</td>
              </tr>
            </thead>
            <tbody>
              {forms?.map((form) => (
                <tr key={form.id}>
                  <td>{form.phase}</td>
                  <td>{form.formName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionPrint;
