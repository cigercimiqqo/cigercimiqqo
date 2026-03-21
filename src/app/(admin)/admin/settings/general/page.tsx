'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings';

export default function GeneralSettingsPage() {
  return (
    <AdminShell title="Genel Ayarlar">
      <GeneralSettings />
    </AdminShell>
  );
}
