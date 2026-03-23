'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { ContentSettingsPanel } from '@/components/admin/settings/ContentSettings';

export default function ContentSettingsPage() {
  return (
    <AdminShell title="İçerik Ayarları">
      <ContentSettingsPanel />
    </AdminShell>
  );
}
