'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

const STORAGE_KEY = 'miqqo-visitor-config';

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
  updatePreferences: (updates: Partial<VisitorPreferences>) => void;
  resetPreferences: () => void;
}

const VisitorPreferencesContext = createContext<VisitorPreferencesContextType | undefined>(
  undefined
);

export function VisitorPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<VisitorPreferences>(DEFAULT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...DEFAULT, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    const root = document.documentElement;
    root.classList.toggle('light', preferences.theme === 'light');
    root.style.setProperty('--color-primary', preferences.primaryColor);
  }, [preferences, mounted]);

  const updatePreferences = useCallback((updates: Partial<VisitorPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <VisitorPreferencesContext.Provider
      value={{ preferences, updatePreferences, resetPreferences }}
    >
      {children}
    </VisitorPreferencesContext.Provider>
  );
}

export function useVisitorPreferences() {
  const ctx = useContext(VisitorPreferencesContext);
  if (!ctx) throw new Error('useVisitorPreferences must be used within VisitorPreferencesProvider');
  return ctx;
}
