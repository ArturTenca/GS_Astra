import type { Session, User } from '@supabase/supabase-js';
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

const RESTORE_TIMEOUT_MS = 8_000;

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

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const setSession = useSessionStore((s) => s.setSession);
  const setAccessBlock = useSessionStore((s) => s.setAccessBlock);
  const clearSession = useSessionStore((s) => s.clearSession);
  const setHydrated = useSessionStore((s) => s.setHydrated);
  const setRestoringSession = useSessionStore((s) => s.setRestoringSession);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let mounted = true;
    let restoreTimeout: ReturnType<typeof setTimeout> | null = null;

    const finishHydration = () => {
      if (!hasHydrated.current) {
        hasHydrated.current = true;
        setHydrated(true);
      }
    };

    const stopRestoring = () => {
      if (restoreTimeout) {
        clearTimeout(restoreTimeout);
        restoreTimeout = null;
      }
      if (mounted) {
        setRestoringSession(false);
      }
    };

    const startRestoring = () => {
      if (!mounted) return;
      setRestoringSession(true);
      if (restoreTimeout) {
        clearTimeout(restoreTimeout);
      }
      restoreTimeout = setTimeout(() => {
        logger.warn('auth_restore_timeout');
        stopRestoring();
      }, RESTORE_TIMEOUT_MS);
    };

    const invalidateSession = (reason: Parameters<typeof setAccessBlock>[0]) => {
      void authSignOut().catch(() => {
        // Session may already be invalid
      });
      if (mounted) {
        setAccessBlock(reason, getAccessBlockMessage(reason));
      }
      clearSession();
      queryClient.clear();
    };

    const applySession = async (user: User) => {
      let profile = await profileRepository.getByUserId(user.id);

      if (!profile) {
        invalidateSession('no_profile');
        return;
      }

      if (profile.status === 'pending') {
        if (!user.email_confirmed_at) {
          invalidateSession('email_unconfirmed');
          return;
        }

        try {
          await profileRepository.activateIfEmailConfirmed();
          profile = await profileRepository.getByUserId(user.id);
        } catch {
          logger.warn('profile_activation_failed');
        }

        if (!profile || profile.status === 'pending') {
          invalidateSession('profile_pending');
          return;
        }
      }

      if (profile.status === 'suspended') {
        invalidateSession('profile_suspended');
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

    const restoreSession = async (session: Session | null) => {
      if (!session?.user) {
        if (mounted) {
          clearSession();
        }
        return;
      }

      startRestoring();
      try {
        await applySession(session.user);
      } catch (error) {
        if (isTransientBootstrapError(error)) {
          logger.warn('auth_restore_transient_failure');
          return;
        }
        invalidateSession('no_profile');
      } finally {
        stopRestoring();
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          finishHydration();
          void restoreSession(session);
          return;
        }

        if (!hasHydrated.current) {
          return;
        }

        if (event === 'SIGNED_OUT') {
          stopRestoring();
          clearSession();
          queryClient.clear();
          return;
        }

        if (session?.user) {
          startRestoring();
          try {
            await applySession(session.user);
          } catch (error) {
            if (!isTransientBootstrapError(error)) {
              invalidateSession('no_profile');
            }
          } finally {
            stopRestoring();
          }
          return;
        }

        stopRestoring();
        clearSession();
        queryClient.clear();
      },
    );

    const fallbackTimer = setTimeout(() => {
      if (!hasHydrated.current && mounted) {
        logger.warn('auth_initial_session_fallback');
        void (async () => {
          try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
              throw mapSupabaseAuthError(error, 'session');
            }
            await restoreSession(data.session);
          } catch {
            if (mounted) {
              clearSession();
            }
          } finally {
            finishHydration();
          }
        })();
      }
    }, 3_000);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      if (restoreTimeout) {
        clearTimeout(restoreTimeout);
      }
      subscription.subscription.unsubscribe();
    };
  }, [clearSession, queryClient, setAccessBlock, setHydrated, setRestoringSession, setSession]);

  return <>{children}</>;
}
