export interface ExternarlVarnameRoot {
  data: ExternarlVarname[];
  message: string;
}

export interface ExternarlVarname {
  id: string;
  isCleared: boolean;
  textValue: any;
  numberValue: any;
  questionChoiceId: any;
  questionChoice: any;
  questionId: string;
  question: Question;
}

export interface Question {
  id: string;
  varname: string;
  type: string;
}
