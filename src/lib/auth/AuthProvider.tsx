import type { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { signOut as authSignOut } from '@/features/auth/services/auth.service';
import {
  getAccessBlockMessage,
  mapSupabaseAuthError,
} from '@/lib/auth/map-auth-error';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { profileRepository } from '@/services/repositories/profile.repository';
import { useSessionStore } from '@/stores/session.store';

type AuthProviderProps = {
  children: React.ReactNode;
};

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
      } catch {
        logger.warn('auth_bootstrap_failed');
        if (mounted) {
          clearSession();
        }
      } finally {
        if (mounted) {
          setHydrated(true);
          bootstrapped.current = true;
        }
      }
    }

    void bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!bootstrapped.current && event === 'INITIAL_SESSION') {
          return;
        }

        if (session?.user) {
          try {
            await applySession(session.user);
          } catch {
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
}
