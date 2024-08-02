export interface SignedUrlRoot {
  data: SignedUrl;
  message: string;
}

export interface SignedUrl {
  presignedUploadUrl: string;
  postUploadImageUrl: string;
  previewUrl?: string;
  expiresAt: string;
}
