'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadSettingsForSite, readCache } from '@/lib/settingsLoader';

/** Admin ayarlarındaki favicon URL'ini document.head'e yazar. Tüm sayfalarda çalışır. */
function applyFavicon(url: string | undefined) {
  if (typeof document === 'undefined') return;

  document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((el) => el.remove());

  if (!url || !url.startsWith('http')) return;

  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = url;
  link.setAttribute('data-miqqo-favicon', 'true');
  document.head.insertBefore(link, document.head.firstChild);
}

export function FaviconUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const cached = readCache();
    if (cached?.data?.general?.favicon) {
      applyFavicon(cached.data.general.favicon);
    }
    loadSettingsForSite().then((s) => {
      if (s?.general?.favicon) applyFavicon(s.general.favicon);
    });
  }, [pathname]);

  return null;
}
