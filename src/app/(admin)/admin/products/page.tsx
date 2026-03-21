'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { ProductsManager } from '@/components/admin/ProductsManager';

export default function ProductsPage() {
  return (
    <AdminShell title="Ürün Yönetimi">
      <ProductsManager />
    </AdminShell>
  );
}
