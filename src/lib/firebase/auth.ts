import type { Auth } from 'firebase/auth';
import { getFirebaseApp } from './app';

let _auth: Auth | null = null;

export function getAuthInstance(): Auth {
  if (!_auth) {
    const { getAuth } = require('firebase/auth');
    _auth = getAuth(getFirebaseApp());
  }
  return _auth!;
}

export const auth = new Proxy({} as Auth, {
  get: (_, prop) => {
    const instance = getAuthInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});
