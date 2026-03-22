'use client';

import { Suspense } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { MenuPageContent } from '@/components/site/MenuPageContent';

export default function MenuPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Yükleniyor...</div>}>
          <MenuPageContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
