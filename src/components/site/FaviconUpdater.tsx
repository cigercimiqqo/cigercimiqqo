'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

/** Admin ayarlarındaki favicon URL'ini document.head'e yazar. */
export function FaviconUpdater() {
  const favicon = useSettingsStore((s) => s.settings?.general?.favicon);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.setAttribute('data-miqqo-dynamic', 'true');
        document.head.appendChild(link);
      }
      if (link.href !== favicon) link.href = favicon;
    } else if (link?.getAttribute('data-miqqo-dynamic') === 'true') {
      link.remove();
    }
  }, [favicon]);

  return null;
}
