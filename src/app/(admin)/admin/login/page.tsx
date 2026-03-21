import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50" />}>
      <LoginForm />
    </Suspense>
  );
}
