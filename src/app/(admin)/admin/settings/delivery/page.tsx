'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { DeliverySettings } from '@/components/admin/settings/DeliverySettings';
export default function DeliveryPage() {
  return <AdminShell title="Teslimat Ayarları"><DeliverySettings /></AdminShell>;
}
