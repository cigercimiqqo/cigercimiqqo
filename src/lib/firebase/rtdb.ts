import type { Database } from 'firebase/database';
import { getFirebaseApp } from './app';

let _rtdb: Database | null = null;

export function getRtdbInstance(): Database {
  if (!_rtdb) {
    const { getDatabase } = require('firebase/database');
    _rtdb = getDatabase(getFirebaseApp());
  }
  return _rtdb!;
}

export const rtdb = new Proxy({} as Database, {
  get: (_, prop) => {
    const instance = getRtdbInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});
