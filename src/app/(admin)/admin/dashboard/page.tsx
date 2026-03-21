'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { StatsWidgets } from '@/components/admin/StatsWidgets';
import { LiveOrdersPanel } from '@/components/admin/LiveOrdersPanel';

export default function DashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="space-y-8">
        <StatsWidgets />
        <LiveOrdersPanel />
      </div>
    </AdminShell>
  );
}
