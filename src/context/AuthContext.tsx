import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  sendPasswordResetEmail,
  User,
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  authError: string | null;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => {
    setAuthError(null);
  };

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return true;
    } catch (err: any) {
      console.error('Firebase Auth SignIn Error:', err);
      let msg = 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. If you are creating your admin account for the first time, click "Create Admin Account".';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please wait a moment or reset your password.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      return false;
    }
  };

  const signUp = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      return true;
    } catch (err: any) {
      console.error('Firebase Auth SignUp Error:', err);
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email already has an admin account. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      return false;
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: any) {
      console.error('Firebase Auth Password Reset Error:', err);
      setAuthError(err.message || 'Unable to send password reset email.');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isAdmin = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        authError,
        signIn,
        signUp,
        sendPasswordReset,
        signOut,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
