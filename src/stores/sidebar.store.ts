import { create } from 'zustand';
import { getPreference, setPreference } from '@/lib/preference-storage';

const SIDEBAR_KEY = 'astra_sidebar_collapsed';

type SidebarState = {
  collapsed: boolean;
  isHydrated: boolean;
  toggleCollapsed: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: false,
  isHydrated: false,
  toggleCollapsed: async () => {
    const collapsed = !get().collapsed;
    await setPreference(SIDEBAR_KEY, collapsed ? '1' : '0');
    set({ collapsed });
  },
  hydrate: async () => {
    try {
      const stored = await getPreference(SIDEBAR_KEY);
      set({ collapsed: stored === '1', isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },
}));
