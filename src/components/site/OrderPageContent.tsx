'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderById } from '@/lib/firebase/firestore';
import { OrderTracker } from './OrderTracker';
import { Loader2, Search } from 'lucide-react';
import type { Order } from '@/types';

export function OrderPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    if (!orderId) return;
    setIsLoading(true);
    setError('');
    getOrderById(orderId)
      .then((o) => {
        if (o) setOrder(o);
        else setError('Sipariş bulunamadı');
      })
      .catch(() => setError('Sipariş yüklenemedi'))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (orderId && order) {
    return <OrderTracker orderId={orderId} initialOrder={order} />;
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Sipariş Takip</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <p className="text-gray-500 mb-6">Sipariş numaranızı girerek durumunu takip edebilirsiniz.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (manualId.trim()) {
            window.location.href = `/order?id=${manualId.trim()}`;
          }
        }}
        className="flex gap-2 max-w-sm mx-auto"
      >
        <input
          type="text"
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="Sipariş ID"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
}
