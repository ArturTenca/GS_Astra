export type IncidentAttachment = {
  id: string;
  incidentId: string;
  uploadedBy: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: string;
  signedUrl?: string;
};

export type PendingAttachment = {
  uri: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
};

export const ALLOWED_ATTACHMENT_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_INCIDENT = 3;
