export interface SurveyRoot {
  data: SurveyData;
  message: string;
}

export interface SurveyData {
  count: number;
  rows: Survey[];
}

export interface Survey {
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
  package: SurveyPackage;
  progress?: any;
  totalForms: number;
  completedForms: number;
}

export interface SurveyPackage {
  id: string;
  name: string;
}
