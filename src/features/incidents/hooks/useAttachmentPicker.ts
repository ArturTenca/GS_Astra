import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import {
  ALLOWED_ATTACHMENT_MIMES,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_INCIDENT,
  type PendingAttachment,
} from '@/types/attachment.types';

export function useAttachmentPicker() {
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pickFromGallery = useCallback(async () => {
    setError(null);

    if (attachments.length >= MAX_ATTACHMENTS_PER_INCIDENT) {
      setError(`Maximum ${MAX_ATTACHMENTS_PER_INCIDENT} photos per incident.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Gallery permission denied.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';

    if (!ALLOWED_ATTACHMENT_MIMES.includes(mimeType as (typeof ALLOWED_ATTACHMENT_MIMES)[number])) {
      setError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    const fileSize = asset.fileSize ?? 0;
    if (fileSize > MAX_ATTACHMENT_BYTES) {
      setError('Image must be 5 MB or smaller.');
      return;
    }

    setAttachments((prev) => [
      ...prev,
      {
        uri: asset.uri,
        fileName: asset.fileName ?? `evidence-${Date.now()}.jpg`,
        mimeType,
        fileSizeBytes: fileSize || 1,
      },
    ]);
  }, [attachments.length]);

  const takePhoto = useCallback(async () => {
    setError(null);

    if (attachments.length >= MAX_ATTACHMENTS_PER_INCIDENT) {
      setError(`Maximum ${MAX_ATTACHMENTS_PER_INCIDENT} photos per incident.`);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera permission denied.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';

    if (!ALLOWED_ATTACHMENT_MIMES.includes(mimeType as (typeof ALLOWED_ATTACHMENT_MIMES)[number])) {
      setError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    const fileSize = asset.fileSize ?? 0;
    if (fileSize > MAX_ATTACHMENT_BYTES) {
      setError('Image must be 5 MB or smaller.');
      return;
    }

    setAttachments((prev) => [
      ...prev,
      {
        uri: asset.uri,
        fileName: asset.fileName ?? `photo-${Date.now()}.jpg`,
        mimeType,
        fileSizeBytes: fileSize || 1,
      },
    ]);
  }, [attachments.length]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
    setError(null);
  }, []);

  return {
    attachments,
    error,
    pickFromGallery,
    takePhoto,
    removeAttachment,
    clearAttachments,
  };
}
