'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { VisitorsTable } from '@/components/admin/VisitorsTable';
export default function VisitorsPage() {
  return <AdminShell title="Ziyaretçi Yönetimi"><VisitorsTable /></AdminShell>;
}
