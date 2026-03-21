'use client';

import { useTodayOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, TrendingUp, Users, BarChart2, Loader2 } from 'lucide-react';

export function StatsWidgets() {
  const { orders, isLoading } = useTodayOrders();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center justify-center h-32">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        ))}
      </div>
    );
  }

  const activeOrders = orders.filter((o) => !['delivered', 'rejected'].includes(o.status));
  const totalRevenue = orders
    .filter((o) => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: 'Bugünkü Siparişler',
      value: orders.length,
      sub: `${activeOrders.length} aktif`,
      icon: ShoppingBag,
      color: 'bg-orange-50 text-orange-500',
    },
    {
      label: 'Bugünkü Gelir',
      value: formatPrice(totalRevenue),
      sub: 'Toplam ciro',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-500',
    },
    {
      label: 'Aktif Siparişler',
      value: activeOrders.length,
      sub: 'İşlemde',
      icon: BarChart2,
      color: 'bg-blue-50 text-blue-500',
    },
    {
      label: 'Tamamlanan',
      value: orders.filter((o) => o.status === 'delivered').length,
      sub: 'Teslim edildi',
      icon: Users,
      color: 'bg-purple-50 text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm font-medium text-gray-700">{stat.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}
