import { AuthProvider } from '@/components/admin/AuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="admin-panel min-h-screen text-gray-900">
        {children}
      </div>
    </AuthProvider>
  );
}
