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
    });
    return () => unsubscribe();
  }, [setSettings]);

  return { settings, isLoading };
}

function applyThemeCssVariables(settings: SiteSettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const { primaryColor, secondaryColor, accentColor, fontFamily } = settings.appearance;
  root.style.setProperty('--color-primary', primaryColor || '#e85d04');
  root.style.setProperty('--color-secondary', secondaryColor || '#1a1a2e');
  root.style.setProperty('--color-accent', accentColor || '#ffd60a');
  if (fontFamily) root.style.setProperty('--font-family', fontFamily);
}
