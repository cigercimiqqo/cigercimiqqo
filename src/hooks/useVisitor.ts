'use client';

import { useEffect, useRef } from 'react';
import {
  getOrCreateVisitorId,
  storeVisitorId,
  getOrCreateSessionId,
  trackPageView,
  getSessionStartTime,
} from '@/lib/visitor';

export function useVisitorTracking() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    trackPageView();
    getSessionStartTime();

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();

    (async () => {
      try {
        const { createVisitor, updateVisitor } = await import('@/lib/firebase/firestore');
        const { Timestamp, collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase/client');

        if (visitorId) {
          const snap = await getDocs(
            query(collection(db, 'visitors'), where('visitorId', '==', visitorId))
          );
          if (!snap.empty) {
            const existingDoc = snap.docs[0];
            const data = existingDoc.data();
            await updateVisitor(existingDoc.id, {
              lastVisit: Timestamp.now(),
              totalVisits: (data.totalVisits || 0) + 1,
            });
          }
        } else {
          const newVisitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          await createVisitor({
            visitorId: newVisitorId,
            ip: 'client',
            userAgent: navigator.userAgent,
            sessions: [{
              sessionId,
              startTime: Timestamp.now(),
              endTime: Timestamp.now(),
              duration: 0,
              pageViews: 1,
              referrer: document.referrer,
            }],
            totalVisits: 1,
            lastVisit: Timestamp.now(),
            cartEvents: [],
            orders: [],
            isBlacklisted: false,
          });
          storeVisitorId(newVisitorId);
        }
      } catch {
        // Visitor tracking is non-critical
      }
    })();
  }, []);
}
