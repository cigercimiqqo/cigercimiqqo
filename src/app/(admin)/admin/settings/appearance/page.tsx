'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { AppearanceSettings } from '@/components/admin/settings/AppearanceSettings';
export default function AppearancePage() {
  return <AdminShell title="Görünüm Ayarları"><AppearanceSettings /></AdminShell>;
}
