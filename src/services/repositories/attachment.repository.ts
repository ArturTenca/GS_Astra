import { supabase } from '@/lib/supabase';
import type { IncidentAttachment, PendingAttachment } from '@/types/attachment.types';
import { BaseRepository } from './base.repository';

const BUCKET = 'incident-evidence';

type AttachmentRow = {
  id: string;
  incident_id: string;
  uploaded_by: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  created_at: string;
};

function mapAttachment(row: AttachmentRow): IncidentAttachment {
  return {
    id: row.id,
    incidentId: row.incident_id,
    uploadedBy: row.uploaded_by,
    storagePath: row.storage_path,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileSizeBytes: row.file_size_bytes,
    createdAt: row.created_at,
  };
}

async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Unable to read image file.');
  }
  return response.arrayBuffer();
}

function randomStorageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class AttachmentRepository extends BaseRepository {
  async listByIncident(incidentId: string): Promise<IncidentAttachment[]> {
    const { data, error } = await supabase
      .from('incident_attachments')
      .select(
        'id, incident_id, uploaded_by, storage_path, file_name, mime_type, file_size_bytes, created_at',
      )
      .eq('incident_id', incidentId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error);
    }

    const attachments = (data ?? []).map(mapAttachment);

    return Promise.all(
      attachments.map(async (attachment) => {
        const { data: signed, error: signError } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(attachment.storagePath, 3600);

        if (signError || !signed?.signedUrl) {
          return attachment;
        }

        return { ...attachment, signedUrl: signed.signedUrl };
      }),
    );
  }

  async upload(
    incidentId: string,
    userId: string,
    file: PendingAttachment,
  ): Promise<IncidentAttachment> {
    const ext = file.mimeType.split('/')[1] ?? 'jpg';
    const storagePath = `${incidentId}/${randomStorageId()}.${ext}`;

    const arrayBuffer = await uriToArrayBuffer(file.uri);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: file.mimeType,
        upsert: false,
      });

    if (uploadError) {
      this.handleError(uploadError);
    }

    const { data, error } = await supabase
      .from('incident_attachments')
      .insert({
        incident_id: incidentId,
        uploaded_by: userId,
        storage_path: storagePath,
        file_name: file.fileName,
        mime_type: file.mimeType,
        file_size_bytes: file.fileSizeBytes,
      })
      .select(
        'id, incident_id, uploaded_by, storage_path, file_name, mime_type, file_size_bytes, created_at',
      )
      .single();

    if (error) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      this.handleError(error);
    }

    return mapAttachment(data);
  }

  async uploadMany(
    incidentId: string,
    userId: string,
    files: PendingAttachment[],
  ): Promise<IncidentAttachment[]> {
    const results: IncidentAttachment[] = [];
    for (const file of files) {
      results.push(await this.upload(incidentId, userId, file));
    }
    return results;
  }
}

export const attachmentRepository = new AttachmentRepository();
