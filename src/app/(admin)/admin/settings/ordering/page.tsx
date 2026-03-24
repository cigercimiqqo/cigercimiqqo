'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { OrderingSettings } from '@/components/admin/settings/OrderingSettings';

export default function OrderingSettingsPage() {
  return (
    <AdminShell title="Sipariş & Çalışma Saatleri">
      <OrderingSettings />
    </AdminShell>
  );
}
