import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  off,
  push,
  increment,
  serverTimestamp,
} from 'firebase/database';
import { rtdb } from './rtdb';
import type { ActiveOrder, Notification, OrderStatus } from '@/types';

// ─── Active Orders ─────────────────────────────────────────────────────────

export function subscribeToActiveOrders(cb: (orders: Record<string, ActiveOrder>) => void) {
  const r = ref(rtdb, 'active_orders');
  onValue(r, (snap) => {
    cb(snap.val() || {});
  });
  return () => off(r);
}

export async function setActiveOrder(
  orderId: string,
  data: ActiveOrder
): Promise<void> {
  await set(ref(rtdb, `active_orders/${orderId}`), data);
}

export async function updateActiveOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await update(ref(rtdb, `active_orders/${orderId}`), {
    status,
    updatedAt: Date.now(),
  });
}

export async function removeActiveOrder(orderId: string): Promise<void> {
  await remove(ref(rtdb, `active_orders/${orderId}`));
}

export function subscribeToOrderStatus(
  orderId: string,
  cb: (data: ActiveOrder | null) => void
) {
  const r = ref(rtdb, `active_orders/${orderId}`);
  onValue(r, (snap) => {
    cb(snap.val() as ActiveOrder | null);
  });
  return () => off(r);
}

// ─── Notifications ────────────────────────────────────────────────────────

export async function pushNotification(
  visitorId: string,
  notification: Omit<Notification, 'createdAt'>
): Promise<void> {
  await push(ref(rtdb, `notifications/${visitorId}`), {
    ...notification,
    createdAt: Date.now(),
  });
}

export function subscribeToNotifications(
  visitorId: string,
  cb: (notifications: Record<string, Notification>) => void
) {
  const r = ref(rtdb, `notifications/${visitorId}`);
  onValue(r, (snap) => {
    cb(snap.val() || {});
  });
  return () => off(r);
}

export async function markNotificationRead(
  visitorId: string,
  notifId: string
): Promise<void> {
  await update(ref(rtdb, `notifications/${visitorId}/${notifId}`), {
    isRead: true,
  });
}

// ─── Visitor Counter ──────────────────────────────────────────────────────

export async function getNextVisitorId(): Promise<number> {
  const counterRef = ref(rtdb, 'counter/nextVisitorId');
  const snap = await get(counterRef);
  const current = snap.val() || 1000;
  await set(counterRef, current + 1);
  return current;
}
