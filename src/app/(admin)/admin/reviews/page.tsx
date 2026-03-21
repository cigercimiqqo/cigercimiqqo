'use client';
import { AdminShell } from '@/components/admin/AdminShell';
import { ReviewsManager } from '@/components/admin/ReviewsManager';
export default function ReviewsPage() {
  return <AdminShell title="Yorum Yönetimi"><ReviewsManager /></AdminShell>;
}
