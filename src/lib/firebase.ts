import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { GoogleAuthProvider, signInWithPopup };

// Initialize Firestore with custom databaseId and forced long polling to prevent iframe connection drops
const databaseId = firebaseConfigJson.firestoreDatabaseId || '(default)';

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    databaseId
  );
} catch {
  firestoreInstance = getFirestore(app, databaseId);
}

export const db = firestoreInstance;

// Session & storage tracker to avoid aggressive retries while allowing manual user edits
let firestoreQuotaExhaustedUntil = 0;

export function isFirestoreQuotaExhausted(): boolean {
  return Date.now() < firestoreQuotaExhaustedUntil;
}

export function markFirestoreQuotaExhausted(): void {
  // Back off for 20 seconds, then allow new write attempts
  firestoreQuotaExhaustedUntil = Date.now() + 20 * 1000;
  try {
    localStorage.removeItem('titan_firestore_write_quota_reached');
  } catch {}
}

export function getFirebaseDatabaseConsoleUrl(): string {
  const pId = firebaseConfigJson.projectId || '';
  const dbId = firebaseConfigJson.firestoreDatabaseId || '(default)';
  return `https://console.firebase.google.com/project/${pId}/firestore/databases/${dbId}/data?openUpgradeDialog=true`;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errMessage = error instanceof Error ? error.message : String(error);
  if (
    errMessage.includes('Quota limit exceeded') ||
    errMessage.includes('resource-exhausted') ||
    (error as any)?.code === 'resource-exhausted'
  ) {
    markFirestoreQuotaExhausted();
  }
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Notice: ', JSON.stringify(errInfo));
}

/**
 * Quota-safe wrapper around Firestore setDoc.
 * Prevents queuing unfulfillable writes in the SDK that lead to continuous backoff loops.
 */
export async function safeSetDoc(docRef: any, data: any, options?: any): Promise<boolean> {
  if (isFirestoreQuotaExhausted()) {
    return false;
  }
  try {
    if (options) {
      await setDoc(docRef, data, options);
    } else {
      await setDoc(docRef, data);
    }
    return true;
  } catch (err: any) {
    if (
      err?.code === 'resource-exhausted' ||
      err?.message?.includes('Quota limit exceeded') ||
      err?.message?.includes('resource-exhausted')
    ) {
      markFirestoreQuotaExhausted();
      console.warn('[Firestore] Daily write quota reached. Seamlessly switched to server API & localStorage cache.');
      return false;
    }
    handleFirestoreError(err, OperationType.WRITE, docRef?.path || null);
    return false;
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
};
export type { User };
