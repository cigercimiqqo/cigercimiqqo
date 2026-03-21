'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { IntegrationSettings } from '@/components/admin/settings/IntegrationSettings';
export default function IntegrationsPage() {
  return <AdminShell title="Entegrasyonlar"><IntegrationSettings /></AdminShell>;
}
