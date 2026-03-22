'use client';

import { Suspense } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { DynamicPageContent } from '@/components/site/DynamicPageContent';

export default function DynamicPagesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Yükleniyor...</div>}>
          <DynamicPageContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
