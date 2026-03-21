import { create } from 'zustand';
import type { SiteSettings } from '@/types';

interface SettingsStore {
  settings: SiteSettings | null;
  isLoading: boolean;
  setSettings: (settings: SiteSettings) => void;
  setLoading: (loading: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  settings: null,
  isLoading: true,
  setSettings: (settings) => set({ settings, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
