import { create } from 'zustand';
import type { AppRole, ProfileStatus } from '@/types/domain';
import type { AccessBlockReason } from '@/lib/auth/map-auth-error';

type SessionState = {
  userId: string | null;
  role: AppRole | null;
  profileStatus: ProfileStatus | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  accessBlockReason: AccessBlockReason | null;
  accessBlockMessage: string | null;
  setSession: (payload: {
    userId: string;
    role: AppRole;
    profileStatus: ProfileStatus;
  }) => void;
  setAccessBlock: (reason: AccessBlockReason, message: string) => void;
  clearAccessBlock: () => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  userId: null,
  role: null,
  profileStatus: null,
  isAuthenticated: false,
  isHydrated: false,
  accessBlockReason: null,
  accessBlockMessage: null,
  setSession: ({ userId, role, profileStatus }) =>
    set({
      userId,
      role,
      profileStatus,
      isAuthenticated: true,
      accessBlockReason: null,
      accessBlockMessage: null,
    }),
  setAccessBlock: (accessBlockReason, accessBlockMessage) =>
    set({
      accessBlockReason,
      accessBlockMessage,
      isAuthenticated: false,
      userId: null,
      role: null,
      profileStatus: null,
    }),
  clearAccessBlock: () =>
    set({
      accessBlockReason: null,
      accessBlockMessage: null,
    }),
  clearSession: () =>
    set({
      userId: null,
      role: null,
      profileStatus: null,
      isAuthenticated: false,
    }),
  setHydrated: (isHydrated) => set({ isHydrated }),
}));
