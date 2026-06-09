import type { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { signOut as authSignOut } from '@/features/auth/services/auth.service';
import {
  getAccessBlockMessage,
  mapSupabaseAuthError,
} from '@/lib/auth/map-auth-error';
import { NetworkError, isAppError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { profileRepository } from '@/services/repositories/profile.repository';
import { useSessionStore } from '@/stores/session.store';

type AuthProviderProps = {
  children: React.ReactNode;
};

const BOOTSTRAP_MAX_ATTEMPTS = 3;
const BOOTSTRAP_RETRY_MS = 400;

function isTransientBootstrapError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return true;
  }

  if (isAppError(error)) {
    return error.code === 'NETWORK';
  }

  const message = error instanceof Error ? error.message.toLowerCase() : '';
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('failed to fetch')
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const setSession = useSessionStore((s) => s.setSession);
  const setAccessBlock = useSessionStore((s) => s.setAccessBlock);
  const clearSession = useSessionStore((s) => s.clearSession);
  const setHydrated = useSessionStore((s) => s.setHydrated);
  const bootstrapped = useRef(false);

  useEffect(() => {
    let mounted = true;

    const invalidateSession = async (
      reason: Parameters<typeof setAccessBlock>[0],
    ) => {
      try {
        await authSignOut();
      } catch {
        // Session may already be invalid
      }
      if (mounted) {
        setAccessBlock(reason, getAccessBlockMessage(reason));
      }
      clearSession();
      queryClient.clear();
    };

    const applySession = async (user: User) => {
      let profile = await profileRepository.getByUserId(user.id);

      if (!profile) {
        await invalidateSession('no_profile');
        return;
      }

      if (profile.status === 'pending') {
        if (!user.email_confirmed_at) {
          await invalidateSession('email_unconfirmed');
          return;
        }

        try {
          await profileRepository.activateIfEmailConfirmed();
          profile = await profileRepository.getByUserId(user.id);
        } catch {
          logger.warn('profile_activation_failed');
        }

        if (!profile || profile.status === 'pending') {
          await invalidateSession('profile_pending');
          return;
        }
      }

      if (profile.status === 'suspended') {
        await invalidateSession('profile_suspended');
        return;
      }

      if (mounted) {
        setSession({
          userId: profile.id,
          role: profile.role,
          profileStatus: profile.status,
        });
      }
    };

    async function bootstrap() {
      let lastError: unknown = null;

      for (let attempt = 0; attempt < BOOTSTRAP_MAX_ATTEMPTS; attempt += 1) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            throw mapSupabaseAuthError(error, 'session');
          }

          if (data.session?.user && mounted) {
            await applySession(data.session.user);
          } else if (mounted) {
            clearSession();
          }
          return;
        } catch (error) {
          lastError = error;
          const canRetry =
            attempt < BOOTSTRAP_MAX_ATTEMPTS - 1 && isTransientBootstrapError(error);

          if (canRetry) {
            logger.warn('auth_bootstrap_retry', { attempt: attempt + 1 });
            await delay(BOOTSTRAP_RETRY_MS * (attempt + 1));
            continue;
          }

          logger.warn('auth_bootstrap_failed');
          if (mounted) {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
              clearSession();
            }
          }
          return;
        }
      }

      if (lastError) {
        logger.warn('auth_bootstrap_exhausted');
      }
    }

    void (async () => {
      await bootstrap();
      if (mounted) {
        setHydrated(true);
        bootstrapped.current = true;
      }
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!bootstrapped.current && event === 'INITIAL_SESSION') {
          return;
        }

        if (session?.user) {
          try {
            await applySession(session.user);
          } catch (error) {
            if (isTransientBootstrapError(error)) {
              logger.warn('auth_apply_session_transient_failure');
              return;
            }
            await invalidateSession('no_profile');
          }
        } else {
          clearSession();
          queryClient.clear();
        }
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [clearSession, queryClient, setAccessBlock, setHydrated, setSession]);

  return <>{children}</>;
};
