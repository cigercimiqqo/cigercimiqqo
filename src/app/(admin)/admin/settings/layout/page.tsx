'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { LayoutSettings } from '@/components/admin/settings/LayoutSettings';

export default function LayoutSettingsPage() {
  return (
    <AdminShell title="Düzen Ayarları">
      <LayoutSettings />
    </AdminShell>
  );
}
