/**
 * Firestore Lite — Cloudflare Workers / edge bundle boyutu için (tam SDK yerine).
 * Gerçek zamanlı dinleyiciler için ./db (tam Firestore) kullanılır.
 */
import type { Firestore } from 'firebase/firestore/lite';
import { getFirestore } from 'firebase/firestore/lite';
import { getFirebaseApp } from './app';

let _db: Firestore | null = null;

export function getFirestoreLiteInstance(): Firestore {
  if (!_db) {
    _db = getFirestore(getFirebaseApp());
  }
  return _db;
}

export const db = new Proxy({} as Firestore, {
  get: (_, prop) => {
    const instance = getFirestoreLiteInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});
