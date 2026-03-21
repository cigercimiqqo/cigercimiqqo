'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export default function CategoriesPage() {
  return (
    <AdminShell title="Kategori Yönetimi">
      <CategoriesManager />
    </AdminShell>
  );
}
