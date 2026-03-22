/**
 * onSnapshot yalnızca tam firebase/firestore ile — Lite’da yok.
 * Bu modül yalnızca istemci hook’ları tarafından import edilmeli.
 */
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QueryConstraint,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db } from './db';
import type { Order, SiteSettings } from '@/types';

export function subscribeToSettings(cb: (settings: SiteSettings) => void) {
  return onSnapshot(doc(db, 'settings', 'config'), (snap) => {
    if (snap.exists()) cb(snap.data() as SiteSettings);
  });
}

export function subscribeToOrders(
  cb: (orders: Order[]) => void,
  constraints: QueryConstraint[] = []
) {
  return onSnapshot(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'), ...constraints),
    (snap: QuerySnapshot<DocumentData>) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
    }
  );
}
