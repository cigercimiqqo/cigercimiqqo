'use client';

import { Suspense } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { OrderPageContent } from '@/components/site/OrderPageContent';

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Suspense fallback={<div className="py-20 text-center text-gray-400">Yükleniyor...</div>}>
            <OrderPageContent />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
