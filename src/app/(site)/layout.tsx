import type { Metadata } from 'next';
import { SiteSettingsProvider } from '@/components/site/SiteSettingsProvider';
import { FaviconUpdater } from '@/components/site/FaviconUpdater';
import { VisitorTracker } from '@/components/site/VisitorTracker';
import { VisitorPreferencesProvider } from '@/context/VisitorPreferencesContext';

export const metadata: Metadata = {
  title: {
    default: 'Restoran',
    template: '%s | Restoran',
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <FaviconUpdater />
      <VisitorPreferencesProvider>
        <VisitorTracker />
        {children}
      </VisitorPreferencesProvider>
    </SiteSettingsProvider>
  );
}
