import type { Metadata } from 'next';
import { SiteSettingsProvider } from '@/components/site/SiteSettingsProvider';
import { VisitorTracker } from '@/components/site/VisitorTracker';

export const metadata: Metadata = {
  title: {
    default: 'Restoran',
    template: '%s | Restoran',
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <VisitorTracker />
      {children}
    </SiteSettingsProvider>
  );
}
