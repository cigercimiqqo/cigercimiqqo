/**
 * Yüklenen görselleri takip eder (localStorage).
 * "Yüklü olanlardan seç" için kullanılır.
 */

const STORAGE_KEY = 'miqqo_recent_uploads';
const MAX_ITEMS = 80;

export interface StoredImage {
  url: string;
  ts: number;
  folder?: string;
}

export function addToRecentUploads(url: string, folder?: string): void {
  if (typeof window === 'undefined' || !url?.startsWith('http')) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: StoredImage[] = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter((x) => x.url !== url);
    const next = [{ url, ts: Date.now(), folder }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota or parse */
  }
}

export function getRecentUploads(): StoredImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
