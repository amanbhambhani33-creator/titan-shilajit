import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import {
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

// Initialize Firestore with custom databaseId if configured
const databaseId = firebaseConfigJson.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, databaseId);

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
