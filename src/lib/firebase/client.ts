/**
 * Barrel export — mümkünse doğrudan ./db, ./auth, ./rtdb kullan (edge bundle için).
 */
import { getFirebaseApp } from './app';

export { getFirebaseApp };
export default getFirebaseApp;

/** Edge/public sayfalar için Lite Firestore (bundle küçük). */
export { db, getFirestoreLiteInstance } from './db-lite';
/** Tam SDK (onSnapshot vb.) — çoğu projede doğrudan gerekmez. */
export { getFirestoreInstance, db as dbFull } from './db';
export { auth, getAuthInstance } from './auth';
export { rtdb, getRtdbInstance } from './rtdb';
export { storage, getStorageInstance } from './storage';
