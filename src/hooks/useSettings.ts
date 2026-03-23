'use client';

import { useEffect, useLayoutEffect } from 'react';
import { loadSettingsForSite, readCache, normalizeSettings } from '@/lib/settingsLoader';
import { useSettingsStore } from '@/store/settingsStore';
import type { SiteSettings } from '@/types';

export function useSettings() {
  const { settings, isLoading, setSettings } = useSettingsStore();

  // Cache'ten sync hydrate – ilk paint öncesi, default flash önlenir
  useLayoutEffect(() => {
    const cached = readCache();
    if (cached?.data) {
      const normalized = normalizeSettings(cached.data);
      if (normalized) {
        setSettings(normalized);
        applyThemeCssVariables(normalized);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const { setLoading } = useSettingsStore.getState();
    loadSettingsForSite().then((s) => {
      if (!mounted) return;
      if (s) {
        setSettings(s);
        applyThemeCssVariables(s);
        if (s.integrations?.mediaProvider && typeof window !== 'undefined') {
          localStorage.setItem('miqqo_upload_provider', s.integrations.mediaProvider);
        }
      } else {
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [setSettings]);

  return { settings, isLoading };
}

const THEME_PRESETS: Record<string, { primary: string; secondary: string; accent: string; radius: string }> = {
  classic: { primary: '#c8102e', secondary: '#111111', accent: '#b8944a', radius: '0.75rem' },
  modern: { primary: '#ea580c', secondary: '#0f172a', accent: '#38bdf8', radius: '1rem' },
  minimal: { primary: '#171717', secondary: '#525252', accent: '#a3a3a3', radius: '0.5rem' },
  luxury: { primary: '#78350f', secondary: '#1e1b4b', accent: '#d4af37', radius: '0.25rem' },
};

function applyThemeCssVariables(settings: SiteSettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!settings?.appearance) {
    root.classList.add('light');
    return;
  }
  const { theme, primaryColor, secondaryColor, accentColor, fontFamily, siteTheme, sitePrimaryColor } = settings.appearance;
  const preset = THEME_PRESETS[theme || 'modern'] || THEME_PRESETS.modern;

  root.style.setProperty('--color-primary', sitePrimaryColor || primaryColor || preset.primary);
  root.style.setProperty('--color-secondary', secondaryColor || preset.secondary);
  root.style.setProperty('--color-accent', accentColor || preset.accent);
  root.style.setProperty('--radius-theme', preset.radius);
  root.setAttribute('data-theme', theme || 'modern');
  if (fontFamily) root.style.setProperty('--font-family', fontFamily);
  root.classList.toggle('light', (siteTheme ?? 'light') === 'light');
}
