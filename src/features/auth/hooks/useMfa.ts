import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { recordAuditEvent } from '@/services/audit/audit.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getUserFacingMessage } from '@/lib/errors';
import {
  mfaCodeSchema,
  type MfaCodeFormValues,
} from '@/features/auth/schemas/mfa.schema';
import {
  enrollTotpFactor,
  listTotpFactors,
  unenrollTotpFactor,
  verifyTotpEnrollment,
} from '../services/auth.service';

export function useTotpFactors() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['auth', 'totp-factors'],
    queryFn: listTotpFactors,
    enabled: isAuthenticated,
  });
}

export function useEnrollTotp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollTotpFactor,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'totp-factors'] });
    },
  });
}

export function useVerifyTotpEnrollment(factorId: string | null) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const form = useForm<MfaCodeFormValues>({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: { code: '' },
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: (code: string) => {
      if (!factorId) {
        throw new Error('MFA enrollment not started');
      }
      return verifyTotpEnrollment(factorId, code);
    },
    onSuccess: async () => {
      await recordAuditEvent(userId, { action: 'auth.mfa_enrolled' });
      await recordAuditEvent(userId, { action: 'auth.mfa_verified' });
      void queryClient.invalidateQueries({ queryKey: ['auth', 'totp-factors'] });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values.code));

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getUserFacingMessage(mutation.error) : null,
  };
}

export function useUnenrollTotp() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: unenrollTotpFactor,
    onSuccess: async () => {
      await recordAuditEvent(userId, { action: 'auth.mfa_removed' });
      void queryClient.invalidateQueries({ queryKey: ['auth', 'totp-factors'] });
    },
  });
}
