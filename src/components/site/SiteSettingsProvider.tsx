'use client';

import { useSettings } from '@/hooks/useSettings';

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  useSettings();
  return <>{children}</>;
}
