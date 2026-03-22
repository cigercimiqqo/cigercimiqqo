import { getOrderById } from '@/lib/firebase/firestore';
import { OrderTracker } from '@/components/site/OrderTracker';
import { SiteHeader } from '@/components/site/SiteHeader';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sipariş Takip',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function OrderTrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id).catch(() => null);
  if (!order) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <OrderTracker orderId={id} initialOrder={order} />
        </div>
      </main>
    </>
  );
}
