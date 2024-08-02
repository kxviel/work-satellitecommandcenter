export interface ErrorRoot {
  message: string[];
  error: string;
  metadata: ErrorMetadata;
}

export interface ErrorMetadata {
  redirect: string;
}

export interface SurveyBySlugRoot {
  data: SurveyBySlug;
  message: string;
}

export interface SurveyBySlug {
  id: string;
  status: string;
  invitationSubject: string;
  invitationBody: string;
  slug: string;
  scheduledAt: string;
  sentAt: string;
  participantId: string;
  actorId: string;
  packageId: string;
  studyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  package: Package;
}

export interface Package {
  id: string;
  name: string;
  introText: string;
  outroText: string;
  remarks: string;
  surveyLinks: SurveyLink[];
}

export interface SurveyLink {
  id: string;
  position: number;
  phaseId: string;
  phase: Phase;
}

export interface Phase {
  id: string;
  name: string;
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
  formAttempts: any[];
}
