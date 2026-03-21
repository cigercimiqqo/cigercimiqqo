'use client';

import { useEffect, useRef } from 'react';
import {
  getOrCreateVisitorId,
  storeVisitorId,
  getOrCreateSessionId,
  trackPageView,
  getSessionStartTime,
  getSessionPageViews,
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

    fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: visitorId || null,
        sessionId,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.visitorId) storeVisitorId(data.visitorId);
      })
      .catch(() => {});

    const handleUnload = () => {
      const duration = Math.round((Date.now() - getSessionStartTime()) / 1000);
      const pageViews = getSessionPageViews();
      navigator.sendBeacon(
        '/api/visitors',
        JSON.stringify({
          visitorId: getOrCreateVisitorId(),
          sessionId,
          action: 'end',
          duration,
          pageViews,
        })
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
}
