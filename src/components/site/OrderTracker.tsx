'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Package, Truck, XCircle, ChefHat } from 'lucide-react';
import { useOrderStatus } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const statusSteps: { status: OrderStatus; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { status: 'new', label: 'Alındı', icon: Clock },
  { status: 'confirmed', label: 'Onaylandı', icon: CheckCircle2 },
  { status: 'preparing', label: 'Hazırlanıyor', icon: ChefHat },
  { status: 'on_the_way', label: 'Yolda', icon: Truck },
  { status: 'delivered', label: 'Teslim Edildi', icon: Package },
];

const statusIndex: Record<OrderStatus, number> = {
  new: 0, confirmed: 1, preparing: 2, on_the_way: 3, delivered: 4, rejected: -1,
};

interface OrderTrackerProps {
  orderId: string;
  initialOrder: Order;
}

export function OrderTracker({ orderId, initialOrder }: OrderTrackerProps) {
  const [order, setOrder] = useState(initialOrder);
  const activeOrder = useOrderStatus(orderId);

  const currentStatus = (activeOrder?.status || order.status) as OrderStatus;
  const currentIndex = statusIndex[currentStatus] ?? 0;
  const isRejected = currentStatus === 'rejected';

  return (
    <div className="space-y-6">
      {/* Order number */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-1">Sipariş Numaranız</p>
        <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
      </div>

      {/* Status tracker */}
      {isRejected ? (
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
          <XCircle size={48} className="text-red-400 mx-auto mb-3" />
          <p className="font-bold text-red-700 text-lg">Sipariş İptal Edildi</p>
          <p className="text-red-500 text-sm mt-1">Lütfen restoranı arayın.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 text-center">Sipariş Durumu</h3>
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
              <motion.div
                className="h-full bg-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <div className="relative flex justify-between">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={step.status} className="flex flex-col items-center gap-2">
                    <motion.div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 relative z-10',
                        isCompleted || isCurrent
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-white border-gray-200 text-gray-400'
                      )}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <step.icon size={18} />
                    </motion.div>
                    <span className={cn(
                      'text-xs font-medium text-center',
                      isCurrent ? 'text-orange-500' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                    )}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Sipariş Detayı</h3>
        <div className="space-y-2 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} x{item.quantity}</span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
          <span>Toplam</span>
          <span className="text-orange-500">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">Teslimat Bilgileri</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{order.customer.name}</p>
          <p>{order.customer.phone}</p>
          <p>{order.customer.address.fullText}</p>
        </div>
      </div>
    </div>
  );
}
