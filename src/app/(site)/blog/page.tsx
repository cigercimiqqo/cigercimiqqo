'use client';

import { Suspense } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { BlogPageContent } from '@/components/site/BlogPageContent';

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-surface-950">
        <Suspense fallback={<div className="py-20 text-center text-surface-400">Yükleniyor...</div>}>
          <BlogPageContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
