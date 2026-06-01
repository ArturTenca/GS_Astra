import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateIncidentFormValues } from '@/features/incidents/schemas/incident.schema';
import { logger } from '@/lib/logger';

const DRAFT_KEY = 'astra_incident_draft';

type IncidentDraft = CreateIncidentFormValues & {
  savedAt: string;
};

export function useIncidentDraft(form: UseFormReturn<CreateIncidentFormValues>) {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDraft = useCallback(async () => {
    try {
      const raw = await SecureStore.getItemAsync(DRAFT_KEY);
      if (!raw) return false;
      const draft = JSON.parse(raw) as IncidentDraft;
      form.reset({
        missionId: draft.missionId,
        colonyId: draft.colonyId ?? '',
        title: draft.title,
        description: draft.description,
        severity: draft.severity,
      });
      return true;
    } catch {
      logger.warn('incident_draft_load_failed');
      return false;
    }
  }, [form]);

  const clearDraft = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(DRAFT_KEY);
    } catch {
      logger.warn('incident_draft_clear_failed');
    }
  }, []);

  useEffect(() => {
    void loadDraft();
  }, [loadDraft]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!values.title?.trim() && !values.description?.trim()) return;

      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        const draft: IncidentDraft = {
          missionId: values.missionId ?? '',
          colonyId: values.colonyId ?? '',
          title: values.title ?? '',
          description: values.description ?? '',
          severity: values.severity ?? 'medium',
          savedAt: new Date().toISOString(),
        };
        void SecureStore.setItemAsync(DRAFT_KEY, JSON.stringify(draft)).catch(() => {
          logger.warn('incident_draft_save_failed');
        });
      }, 800);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [form]);

  return { clearDraft };
}
