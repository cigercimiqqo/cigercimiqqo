'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { OrdersTable } from '@/components/admin/OrdersTable';

export default function OrdersPage() {
  return (
    <AdminShell title="Sipariş Yönetimi">
      <OrdersTable />
    </AdminShell>
  );
}
