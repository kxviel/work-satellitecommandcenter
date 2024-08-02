export interface RepeatedDataRoot {
  data: RepeatedData;
  message: string;
}

export interface RepeatedData {
  count: number;
  rows: RepeatedDataRow[];
}

export interface RepeatedDataRow {
  id: string;
  name: string;
  status: string;
  participantId: string;
  actorId: string;
  studyId: string;
  phaseId: string;
  parentPhaseId: string;
  createdAt: string;
  actor: any;
  updatedAt: string;
  deletedAt: any;
  phase: Phase;
  parentPhase: ParentPhase;
}

export interface Phase {
  id: string;
  name: string;
  type: string;
}

export interface ParentPhase {
  id: string;
  name: string;
}
