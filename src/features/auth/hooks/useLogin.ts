import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getUserFacingMessage } from '@/lib/errors';
import { recordAuditEvent } from '@/services/audit/audit.service';
import { supabase } from '@/lib/supabase';
import { useSessionStore } from '@/stores/session.store';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { mfaCodeSchema, type MfaCodeFormValues } from '../schemas/mfa.schema';
import { signInWithPassword, verifyMfaLogin } from '../services/auth.service';

export function useLogin() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const accessBlockMessage = useSessionStore((s) => s.accessBlockMessage);
  const clearAccessBlock = useSessionStore((s) => s.clearAccessBlock);
  const [needsMfa, setNeedsMfa] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const mfaForm = useForm<MfaCodeFormValues>({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: { code: '' },
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: signInWithPassword,
    onMutate: () => {
      clearAccessBlock();
      setNeedsMfa(false);
    },
    onSuccess: async (result) => {
      if (result.needsMfa) {
        setNeedsMfa(true);
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await recordAuditEvent(data.user.id, { action: 'auth.login' });
      }
    },
  });

  const mfaMutation = useMutation({
    mutationFn: (code: string) => verifyMfaLogin(code),
    onSuccess: async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await recordAuditEvent(data.user.id, { action: 'auth.login' });
        await recordAuditEvent(data.user.id, { action: 'auth.mfa_verified' });
      }
      setNeedsMfa(false);
    },
  });

  useEffect(() => {
    if (isAuthenticated && !needsMfa) {
      router.replace('/(app)');
    }
  }, [isAuthenticated, needsMfa]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  const onMfaSubmit = mfaForm.handleSubmit((values) => {
    mfaMutation.mutate(values.code);
  });

  const errorMessage =
    mutation.error != null
      ? getUserFacingMessage(mutation.error)
      : mfaMutation.error != null
        ? getUserFacingMessage(mfaMutation.error)
        : accessBlockMessage;

  return {
    form,
    mfaForm,
    onSubmit,
    onMfaSubmit,
    needsMfa,
    isPending: mutation.isPending || mfaMutation.isPending,
    errorMessage,
  };
}
