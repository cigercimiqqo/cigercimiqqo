'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { BlogManager } from '@/components/admin/BlogManager';

export default function BlogPage() {
  return (
    <AdminShell title="Blog Yönetimi">
      <BlogManager />
    </AdminShell>
  );
}
