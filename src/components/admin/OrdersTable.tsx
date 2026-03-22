'use client';

import { useState } from 'react';
import { useAllOrders } from '@/hooks/useOrders';
import { updateOrderStatus } from '@/lib/firebase/firestore';
import { updateActiveOrderStatus, removeActiveOrder } from '@/lib/firebase/realtime';
import { addToBlacklist } from '@/lib/firebase/firestore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Search, Filter, Eye, Ban, ChevronDown } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { Timestamp } from 'firebase/firestore/lite';

const statusLabels: Record<OrderStatus, string> = {
  new: 'Yeni',
  confirmed: 'Onaylandı',
  preparing: 'Hazırlanıyor',
  on_the_way: 'Yolda',
  delivered: 'Teslim Edildi',
  rejected: 'Reddedildi',
};

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  on_the_way: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export function OrdersTable() {
  const { orders, isLoading } = useAllOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleStatusChange(order: Order, status: OrderStatus) {
    try {
      await updateOrderStatus(order.id, status);
      if (status === 'delivered' || status === 'rejected') {
        await removeActiveOrder(order.id);
      } else {
        await updateActiveOrderStatus(order.id, status);
      }
      toast.success(`Durum güncellendi: ${statusLabels[status]}`);
    } catch {
      toast.error('Durum güncellenemedi');
    }
  }

  async function handleBlacklist(order: Order) {
    try {
      await addToBlacklist('phone', order.customer.phone);
      await addToBlacklist('address', order.customer.address.fullText);
      toast.success('Müşteri kara listeye eklendi');
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  function formatTs(ts: Timestamp): string {
    return ts.toDate().toLocaleString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Sipariş no, müşteri adı, telefon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
        >
          <option value="all">Tüm Durumlar</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sipariş</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Müşteri</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tutar</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Durum</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tarih</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Yükleniyor...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Sipariş bulunamadı</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-700">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-gray-400 text-xs">{order.customer.phone}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-orange-500">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColors[order.status]}`}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{formatTs(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Detay"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleBlacklist(order)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Kara listeye ekle"
                        >
                          <Ban size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg mb-4">{selectedOrder.orderNumber}</h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Müşteri</p>
                <p>{selectedOrder.customer.name}</p>
                <p>{selectedOrder.customer.phone}</p>
                <p className="text-gray-500">{selectedOrder.customer.address.fullText}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Ürünler</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold">
                  <span>Toplam</span>
                  <span className="text-orange-500">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.note && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Not</p>
                  <p className="text-gray-600">{selectedOrder.note}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-700 mb-2">Durum Geçmişi</p>
                {selectedOrder.statusHistory.map((h, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-50">
                    <span className="font-medium">{statusLabels[h.status]}</span>
                    <span className="text-gray-400">{formatTs(h.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-5 w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
