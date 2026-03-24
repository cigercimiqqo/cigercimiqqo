import { getSettings, getSettingsMeta } from '@/lib/firebase/firestore';
import { mergeContentWithDefaults } from '@/lib/defaultContent';
import { mergeLayoutWithDefaults } from '@/lib/defaultLayout';
import { mergeOrderingWithDefaults } from '@/lib/defaultOrdering';
import type { SiteSettings } from '@/types';

const CACHE_KEY = 'miqqo_settings_cache';
const CACHE_VERSION_KEY = 'miqqo_settings_version';

interface CachedSettings {
  data: SiteSettings;
  version: number;
}

function readCache(): CachedSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const ver = localStorage.getItem(CACHE_VERSION_KEY);
    if (!raw || !ver) return null;
    const data = JSON.parse(raw) as SiteSettings;
    const version = parseInt(ver, 10);
    if (Number.isNaN(version)) return null;
    return { data, version };
  } catch {
    return null;
  }
}

export { readCache };

function writeCache(data: SiteSettings, version: number): void {
  if (typeof window === 'undefined') return;
  try {
    const { _version, ...clean } = data as SiteSettings & { _version?: number };
    localStorage.setItem(CACHE_KEY, JSON.stringify(clean));
    localStorage.setItem(CACHE_VERSION_KEY, String(version));
  } catch {
    // quota exceeded vs
  }
}

export function normalizeSettings(raw: SiteSettings | null): SiteSettings | null {
  if (!raw) return null;
  const { _version, ...rest } = raw as SiteSettings & { _version?: number };
  const merged = {
    ...rest,
    content: mergeContentWithDefaults(rest.content, rest.general?.siteName),
    layout: mergeLayoutWithDefaults(rest.layout),
    ordering: mergeOrderingWithDefaults(rest.ordering),
  };
  return merged as SiteSettings;
}

/**
 * Versiyon tabanlı cache: önce meta okunur (1 read).
 * Cache.version === meta.version ise cache kullanılır.
 * Farklıysa full settings çekilir, cache güncellenir.
 * v5 -> v48: tek seferde full settings alınır, tam v48 state cache'e yazılır.
 */
export async function loadSettingsForSite(): Promise<SiteSettings | null> {
  const cached = readCache();

  const meta = await getSettingsMeta();
  const serverVersion = meta?.version ?? 0;

  if (cached && cached.version === serverVersion && serverVersion > 0) {
    return normalizeSettings(cached.data);
  }

  const full = await getSettings();
  const normalized = normalizeSettings(full);

  if (normalized && meta) {
    writeCache(normalized, meta.version);
  }

  return normalized;
}

/** Admin paneli – cache kullanmaz, her zaman güncel veri */
export async function loadSettingsForAdmin(): Promise<SiteSettings | null> {
  const full = await getSettings();
  return normalizeSettings(full);
}

/** Cache'i temizler (admin güncellemesi sonrası veya test) */
export function clearSettingsCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_VERSION_KEY);
  } catch {
    // ignore
  }
}
