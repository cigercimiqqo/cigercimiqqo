'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => setMounted(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {mounted && <Toaster position="top-right" toastOptions={{ duration: 4000 }} />}
    </QueryClientProvider>
  );
}
