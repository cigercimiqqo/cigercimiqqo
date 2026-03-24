'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, XCircle, ChefHat, Truck, Package, Clock } from 'lucide-react';
import { useActiveOrders } from '@/hooks/useOrders';
import { updateOrderStatus } from '@/lib/firebase/firestore';
import { updateActiveOrderStatus, removeActiveOrder } from '@/lib/firebase/realtime';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';

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

export function LiveOrdersPanel() {
  const activeOrders = useActiveOrders();
  const prevCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/new-order.mp3');
  }, []);

  useEffect(() => {
    const count = Object.keys(activeOrders).length;
    if (count > prevCount.current) {
      audioRef.current?.play().catch(() => {});
      if (Notification.permission === 'granted') {
        new Notification('Yeni Sipariş!', { body: 'Yeni bir sipariş geldi.' });
      }
    }
    prevCount.current = count;
  }, [activeOrders]);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  async function changeStatus(orderId: string, status: OrderStatus) {
    try {
      await updateOrderStatus(orderId, status);
      if (status === 'delivered' || status === 'rejected') {
        await removeActiveOrder(orderId);
      } else {
        await updateActiveOrderStatus(orderId, status);
      }
      toast.success(`Sipariş durumu: ${statusLabels[status]}`);
    } catch {
      toast.error('Durum güncellenemedi');
    }
  }

  const orders = Object.entries(activeOrders);

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <Bell size={16} className="text-orange-500" />
          </div>
          <h2 className="font-bold text-gray-900">Aktif Siparişler</h2>
          {orders.length > 0 && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
              {orders.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Canlı</span>
        </div>
      </div>

      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <Package size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aktif sipariş yok</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {orders.map(([orderId, order]) => (
                <motion.div
                  key={orderId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border border-gray-100 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400 font-mono">{orderId.slice(0, 8)}...</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'new' && (
                      <>
                        <button
                          onClick={() => changeStatus(orderId, 'confirmed')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                          Onayla
                        </button>
                        <button
                          onClick={() => changeStatus(orderId, 'rejected')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={12} />
                          Reddet
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => changeStatus(orderId, 'preparing')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors"
                      >
                        <ChefHat size={12} />
                        Hazırlanıyor
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => changeStatus(orderId, 'on_the_way')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-semibold hover:bg-purple-600 transition-colors"
                      >
                        <Truck size={12} />
                        Yola Çıktı
                      </button>
                    )}
                    {order.status === 'on_the_way' && (
                      <button
                        onClick={() => changeStatus(orderId, 'delivered')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                      >
                        <Package size={12} />
                        Teslim Edildi
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
