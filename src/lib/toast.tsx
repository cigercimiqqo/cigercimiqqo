'use client';

import { useCallback, useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'default';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let idCounter = 0;
let toastApi: { success: (m: string) => void; error: (m: string) => void; toast: (m: string) => void } | null = null;

/** react-hot-toast API uyumlu: toast(), toast.success(), toast.error() */
function toastFn(m: string) {
  toastApi?.toast(m);
}
toastFn.success = (m: string) => toastApi?.success(m);
toastFn.error = (m: string) => toastApi?.error(m);
export const toast = toastFn as {
  (m: string): void;
  success: (m: string) => void;
  error: (m: string) => void;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType) => {
    const id = ++idCounter;
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  useEffect(() => {
    toastApi = {
      success: (m) => add(m, 'success'),
      error: (m) => add(m, 'error'),
      toast: (m) => add(m, 'default'),
    };
    return () => { toastApi = null; };
  }, [add]);

  return (
    <>
      {children}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              item.type === 'success'
                ? 'bg-green-600 text-white'
                : item.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-white'
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </>
  );
}
