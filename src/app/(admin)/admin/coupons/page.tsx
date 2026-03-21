'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { CouponsManager } from '@/components/admin/CouponsManager';
export default function CouponsPage() {
  return <AdminShell title="Kupon Yönetimi"><CouponsManager /></AdminShell>;
}
