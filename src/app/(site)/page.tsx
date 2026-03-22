'use client';

import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { HomeSections } from '@/components/site/HomeSections';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeSections />
      </main>
      <SiteFooter />
    </>
  );
}
