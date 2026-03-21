import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { Database } from 'firebase/database';
import type { FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _rtdb: Database | null = null;
let _storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return _app;
}

export function getFirestoreInstance(): Firestore {
  if (!_db) {
    const { getFirestore } = require('firebase/firestore');
    _db = getFirestore(getFirebaseApp());
  }
  return _db!;
}

export function getAuthInstance(): Auth {
  if (!_auth) {
    const { getAuth } = require('firebase/auth');
    _auth = getAuth(getFirebaseApp());
  }
  return _auth!;
}

export function getRtdbInstance(): Database {
  if (!_rtdb) {
    const { getDatabase } = require('firebase/database');
    _rtdb = getDatabase(getFirebaseApp());
  }
  return _rtdb!;
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) {
    const { getStorage } = require('firebase/storage');
    _storage = getStorage(getFirebaseApp());
  }
  return _storage!;
}

// Convenience getters — call on demand
export const db = new Proxy({} as Firestore, {
  get: (_, prop) => {
    const instance = getFirestoreInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});

export const auth = new Proxy({} as Auth, {
  get: (_, prop) => {
    const instance = getAuthInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});

export const rtdb = new Proxy({} as Database, {
  get: (_, prop) => {
    const instance = getRtdbInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});

export const storage = new Proxy({} as FirebaseStorage, {
  get: (_, prop) => {
    const instance = getStorageInstance();
    const val = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  },
});

export default getFirebaseApp;
