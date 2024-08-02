export type PhasesList = {
  id: string;
  name: string;
  position: number;
  category?: string; // Exclusive to Repeated Data
  phaseStatus: string;
  phaseForms: PhaseListForms[];
};

export type PhaseListForms = {
  position: number;
  id: string;
  name: string;
  attempt: string;
  status: string;
  phaseName: string;
  phaseId: string;
  locked: boolean;
  lockedBy: string;
  lockedAt: string;
};
