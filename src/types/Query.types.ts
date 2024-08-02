export interface QueryRoot {
  data: QueryData;
  message: string;
}

export interface QueryData {
  count: number;
  rows: Query[];
}

export interface Query {
  id: string;
  status: string;
  remark: string;
  participantId: string;
  actorId: string;
  questionId: string;
  formId: string;
  formAttemptId: string;
  studyId: string;
  siteId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  site: Site;
  form: Form;
  actor: Actor;
  participant: Participant;
  formAttempt: FormAttempt;
  question: Question;
}

export interface Site {
  id: string;
  name: string;
}

export interface Form {
  id: string;
  name: string;
}

export interface Actor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Participant {
  id: string;
  subjectId: string;
  email: string;
}

export interface FormAttempt {
  id: string;
  status: string;
  phase: Phase;
  repeatedAttempt?: RepeatedAttempt;
}

export interface Phase {
  id: string;
  category: string;
  name: string;
}

export interface RepeatedAttempt {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  label: string;
  type: string;
}
