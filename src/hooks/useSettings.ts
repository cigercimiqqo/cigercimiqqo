'use client';

import { useEffect } from 'react';
import { subscribeToSettings } from '@/lib/firebase/firestore';
import { useSettingsStore } from '@/store/settingsStore';
import type { SiteSettings } from '@/types';

export function useSettings() {
  const { settings, isLoading, setSettings } = useSettingsStore();

  useEffect(() => {
    const unsubscribe = subscribeToSettings((s) => {
      setSettings(s);
      applyThemeCssVariables(s);
      // Medya sağlayıcı tercihini localStorage ile senkronize et
      if (s?.integrations?.mediaProvider && typeof window !== 'undefined') {
        localStorage.setItem('miqqo_upload_provider', s.integrations.mediaProvider);
      }
    });
    return () => unsubscribe();
  }, [setSettings]);

  return { settings, isLoading };
}

const THEME_PRESETS: Record<string, { primary: string; secondary: string; accent: string; radius: string }> = {
  classic: { primary: '#c2410c', secondary: '#1c1917', accent: '#f59e0b', radius: '0.75rem' },
  modern: { primary: '#ea580c', secondary: '#0f172a', accent: '#38bdf8', radius: '1rem' },
  minimal: { primary: '#171717', secondary: '#525252', accent: '#a3a3a3', radius: '0.5rem' },
  luxury: { primary: '#78350f', secondary: '#1e1b4b', accent: '#d4af37', radius: '0.25rem' },
};

function applyThemeCssVariables(settings: SiteSettings) {
  if (typeof document === 'undefined' || !settings?.appearance) return;
  const root = document.documentElement;
  const { theme, primaryColor, secondaryColor, accentColor, fontFamily } = settings.appearance;
  const preset = THEME_PRESETS[theme || 'modern'] || THEME_PRESETS.modern;

  root.style.setProperty('--color-primary', primaryColor || preset.primary);
  root.style.setProperty('--color-secondary', secondaryColor || preset.secondary);
  root.style.setProperty('--color-accent', accentColor || preset.accent);
  root.style.setProperty('--radius-theme', preset.radius);
  root.setAttribute('data-theme', theme || 'modern');
  if (fontFamily) root.style.setProperty('--font-family', fontFamily);
}
