import type { Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './app';

let _db: Firestore | null = null;

export function getFirestoreInstance(): Firestore {
  if (!_db) {
    const { getFirestore } = require('firebase/firestore');
    _db = getFirestore(getFirebaseApp());
  }
  return _db!;
}

export const db = new Proxy({} as Firestore, {
  get: (_, prop) => {
    const instance = getFirestoreInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});
