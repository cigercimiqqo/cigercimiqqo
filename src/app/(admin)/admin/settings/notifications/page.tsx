'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings';
export default function NotificationsPage() {
  return <AdminShell title="Bildirim Ayarları"><NotificationSettings /></AdminShell>;
}
