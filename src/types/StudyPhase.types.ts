export interface StudyPhaseResponse {
  data: StudyPhase[];
  message: string;
}

export interface StudyPhase {
  id: string;
  name: string;
  category: string;
  type: any;
  description: any;
  duration: number;
  position: number;
  studyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  phaseForms: PhaseForm[];
}

export interface PhaseForm {
  id: string;
  position: number;
  form: Form;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  formAttempts: FormAttempt[];
}

export interface FormAttempt {
  id: string;
  status: string;
  participantId: string;
}
