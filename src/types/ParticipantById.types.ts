export interface ParticipantByIdRoot {
  data: ParticipantById;
  message: string;
}

export interface ParticipantById {
  id: string;
  subjectId: string;
  isLocked: boolean;
  isArchived: boolean;
  eligibilityStatus: string;
  archiveReason: any;
  site: Site;
  formattedSubjectId: string;
  email: string;
  hasEmail: boolean;
}

export interface Site {
  id: string;
  name: string;
}
