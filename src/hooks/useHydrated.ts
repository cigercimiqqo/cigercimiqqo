'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use to avoid hydration mismatch when rendering differs between server (e.g. no localStorage)
 * and client (e.g. persisted Zustand state from localStorage).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
