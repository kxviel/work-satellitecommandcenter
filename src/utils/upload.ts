import axios from "axios";
import http from "./http";
import { SignedUrlRoot } from "../types/SignedUrl.types";

export const uploadFile = async (file: any, type: string) => {
  const fileObj = {
    assets: [{ fileName: file.name, type }],
  };
  const res = await http.post("/assets/get_upload_urls", fileObj);
  await axios.put(res.data.data[0].presignedUploadUrl, file, {
    headers: { "Content-Type": res.data.data[0].mimeType },
  });
  return res.data.data[0].postUploadImageUrl;
};

export const builderGetUploadUrl = async (
  file: File,
  studyId: string,
  formId: string
) => {
  const fileObj = { fileName: file.name };

  const res = await http.post<SignedUrlRoot>(
    `/study/${studyId}/forms/${formId}/get_upload_url`,
    fileObj
  );

  await axios.put(res.data.data.presignedUploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return res.data.data;
};

export const themeUploadUrl = async (file: File, studyId: string) => {
  const obj = { studyId: studyId, fileName: file.name };
  const res = await http.post<SignedUrlRoot>(`/ui/get_upload_url`, obj);
  await axios.put(res?.data?.data?.presignedUploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return res.data.data;
};

export const responsesGetUploadUrl = async (
  file: File,
  studyId?: string,
  participantId?: string,
  surveySlug?: string,
  surveyAssignmentId?: string
) => {
  const fileObj = { fileName: file.name };
  let params: any = {};

  if (participantId) {
    params["participantId"] = participantId;
  }

  const res = await http.post<SignedUrlRoot>(
    surveySlug
      ? `/survey/${surveySlug}/get_upload_url`
      : surveyAssignmentId
      ? `/study/${studyId}/survey-responses/get_upload_url`
      : `/study/${studyId}/responses/get_upload_url`,
    fileObj,
    { params }
  );

  await axios.put(res.data.data.presignedUploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return res.data.data.postUploadImageUrl;
};
