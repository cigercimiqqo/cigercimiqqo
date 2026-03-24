'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, startTransition } from 'react';
import { ToastProvider } from '@/lib/toast';
import { useCartStore } from '@/store/cartStore';

function CartStoreHydrator() {
  useEffect(() => {
    // startTransition ile düşük öncelikli güncelleme olarak işaretle
    // React'ın hidrasyon işlemine müdahale etmesini önler
    startTransition(() => {
      useCartStore.persist.rehydrate();
    });
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CartStoreHydrator />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
