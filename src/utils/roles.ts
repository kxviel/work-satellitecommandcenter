export const permissions = {
  userManagement: "user.manage",
  studySettings: "study.settings",
  studyDesigner: "form.manage",
  auditLogs: "audit.read",
  export: "export",

  viewParticipant: "participant.read",
  recordLockUnlock: "participant.lock_unlock",
  recordArchive: "participant.archive",
  addParticipant: "participant.create",
  editParticipant: "participant.edit",
  canAllocateRandomization: "participant.randomization_allocate",
  canViewRandomization: "participant.randomization_view",
  amendQueries: "query.manage",
  sendSurveys: "participant.send_survey",
  editSurveyResponse: "participant.edit_survey_response",
};

interface Permission {
  id: string;
  label: string;
  code: string;
  description: string;
  isPublished: boolean;
}

interface Role {
  id: string;
  label: string;
  code: string;
  studyId: string;
  description: string | null;
  permissions: Array<{
    id: string;
    roleId: string;
    permissionId: string;
    isEnabled: boolean;
  }>;
}

export const formatRolesAndPermissions = (
  roles: Role[],
  permissions: Permission[]
): any => {
  const headers = roles?.map((role) => ({
    id: role?.id,
    label: role?.label,
    code: role?.code,
  }));

  const rows = permissions?.map((permission) => {
    const rowData: any = {
      label: permission?.label,
      code: permission?.code,
      id: permission?.id,
      description: permission?.description,
    };

    roles?.forEach((role) => {
      const permissionForRole = role?.permissions?.find(
        (p) => p.permissionId === permission?.id
      );
      rowData[role?.id] = permissionForRole
        ? permissionForRole?.isEnabled
        : false;
    });

    return rowData;
  });

  return { headers, rows };
};

export const formatFormPermissions = (
  roles: Role[],
  forms: { id: string; name: string; roleIds: any[] }[]
): any => {
  const headers = roles?.map((role) => ({
    id: role?.id,
    label: role?.label,
    code: role?.code,
  }));

  const rows = forms?.map((form) => {
    const rowData: any = {
      id: form?.id,
      name: form?.name,
    };
    headers.forEach((role) => {
      rowData[role.id] = false;
    });
    form.roleIds?.forEach((role) => {
      rowData[role] = true;
    });

    return rowData;
  });

  return { headers, rows };
};
