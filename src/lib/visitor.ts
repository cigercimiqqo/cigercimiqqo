// Ziyaretçi tracking utility — KVKK uyumlu (IP hash'lenir)

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('miqqo_visitor_id');
  if (stored) return stored;
  return '';
}

export function storeVisitorId(visitorId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('miqqo_visitor_id', visitorId);
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const stored = sessionStorage.getItem('miqqo_session_id');
  if (stored) return stored;
  const newId = generateSessionId();
  sessionStorage.setItem('miqqo_session_id', newId);
  return newId;
}

export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  const count = parseInt(sessionStorage.getItem('miqqo_page_views') || '0') + 1;
  sessionStorage.setItem('miqqo_page_views', String(count));
}

export function getSessionPageViews(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(sessionStorage.getItem('miqqo_page_views') || '0');
}

export function getSessionStartTime(): number {
  if (typeof window === 'undefined') return Date.now();
  const stored = sessionStorage.getItem('miqqo_session_start');
  if (stored) return parseInt(stored);
  const now = Date.now();
  sessionStorage.setItem('miqqo_session_start', String(now));
  return now;
}
