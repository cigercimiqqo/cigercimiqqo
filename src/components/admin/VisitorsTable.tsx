'use client';

import { useState, useEffect } from 'react';
import { getVisitors } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { Visitor } from '@/types';
import type { Timestamp } from 'firebase/firestore/lite';

function formatTs(ts: Timestamp): string {
  return ts.toDate().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function VisitorsTable() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getVisitors().then((v) => { setVisitors(v); setIsLoading(false); });
  }, []);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Ziyaretçi ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Toplam Ziyaret</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Siparişler</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Son Ziyaret</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visitors.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400 text-sm">Ziyaretçi yok</td></tr>
            ) : visitors.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-mono text-xs text-gray-700">{v.visitorId}</td>
                <td className="px-5 py-4">{v.totalVisits}</td>
                <td className="px-5 py-4">{v.orders?.length || 0}</td>
                <td className="px-5 py-4 text-xs text-gray-400">{v.lastVisit ? formatTs(v.lastVisit) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
