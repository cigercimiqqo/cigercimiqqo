'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

/** Admin'den yönetilir, ziyaretçi paneli kaldırıldı */
export interface VisitorPreferences {
  theme: 'dark' | 'light';
  primaryColor: string;
  heroStyle: 'full' | 'split';
  menuLayout: 'grid' | 'list';
  showFeatures: boolean;
  showStats: boolean;
  showTestimonials: boolean;
  showGallery: boolean;
}

const DEFAULT: VisitorPreferences = {
  theme: 'light',
  primaryColor: '#c8102e',
  heroStyle: 'full',
  menuLayout: 'grid',
  showFeatures: true,
  showStats: true,
  showTestimonials: true,
  showGallery: true,
};

interface VisitorPreferencesContextType {
  preferences: VisitorPreferences;
}

const VisitorPreferencesContext = createContext<VisitorPreferencesContextType | undefined>(
  undefined
);

export function VisitorPreferencesProvider({ children }: { children: ReactNode }) {
  const settings = useSettingsStore((s) => s.settings);
  const app = settings?.appearance;

  const preferences: VisitorPreferences = {
    theme: (app?.siteTheme as 'light' | 'dark') ?? 'light',
    primaryColor: app?.sitePrimaryColor ?? app?.primaryColor ?? DEFAULT.primaryColor,
    heroStyle: app?.heroStyle ?? 'full',
    menuLayout: app?.menuLayout ?? 'grid',
    showFeatures: app?.showFeatures ?? true,
    showStats: app?.showStats ?? true,
    showTestimonials: app?.showTestimonials ?? true,
    showGallery: app?.showGallery ?? true,
  };

  return (
    <VisitorPreferencesContext.Provider value={{ preferences }}>
      {children}
    </VisitorPreferencesContext.Provider>
  );
}

export function useVisitorPreferences() {
  const ctx = useContext(VisitorPreferencesContext);
  if (!ctx) throw new Error('useVisitorPreferences must be used within VisitorPreferencesProvider');
  return ctx;
}
