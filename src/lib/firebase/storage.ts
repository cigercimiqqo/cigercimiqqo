import type { FirebaseStorage } from 'firebase/storage';
import { getFirebaseApp } from './app';

let _storage: FirebaseStorage | null = null;

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) {
    const { getStorage } = require('firebase/storage');
    _storage = getStorage(getFirebaseApp());
  }
  return _storage!;
}

export const storage = new Proxy({} as FirebaseStorage, {
  get: (_, prop) => {
    const instance = getStorageInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});
