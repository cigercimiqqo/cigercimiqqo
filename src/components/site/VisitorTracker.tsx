'use client';

import { useVisitorTracking } from '@/hooks/useVisitor';

export function VisitorTracker() {
  useVisitorTracking();
  return null;
}
