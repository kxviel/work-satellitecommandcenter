export interface RepeatedDataPhaseRoot {
  data: RepeatedDataPhase;
  message: string;
}

export interface RepeatedDataPhase {
  id: string;
  name: string;
  status: string;
  participantId: string;
  actorId: string;
  studyId: string;
  phaseId: string;
  parentPhaseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  phase: Phase;
}

export interface Phase {
  id: string;
  name: string;
  type: string;
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
  isLocked: boolean;
  lockedBy?: {
    firstName: string;
    lastName: string;
  };
  lockedAt: string;
}
