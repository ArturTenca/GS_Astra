import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getUserFacingMessage } from '@/lib/errors';
import { useSessionStore } from '@/stores/session.store';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { signInWithPassword } from '../services/auth.service';

export function useLogin() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const accessBlockMessage = useSessionStore((s) => s.accessBlockMessage);
  const clearAccessBlock = useSessionStore((s) => s.clearAccessBlock);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: signInWithPassword,
    onMutate: () => {
      clearAccessBlock();
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(app)');
    }
  }, [isAuthenticated]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  const errorMessage =
    mutation.error != null
      ? getUserFacingMessage(mutation.error)
      : accessBlockMessage;

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    errorMessage,
  };
}
