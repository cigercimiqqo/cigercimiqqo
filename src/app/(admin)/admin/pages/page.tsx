'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { PagesManager } from '@/components/admin/PagesManager';
export default function PagesPage() {
  return <AdminShell title="Sayfa Yönetimi"><PagesManager /></AdminShell>;
}
