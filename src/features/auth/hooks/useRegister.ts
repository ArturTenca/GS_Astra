import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getUserFacingMessage } from '@/lib/errors';
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/register.schema';
import { signUp } from '../services/auth.service';

export function useRegister() {
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      setRegistrationComplete(true);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getUserFacingMessage(mutation.error) : null,
    registrationComplete,
    resetError: mutation.reset,
  };
}
