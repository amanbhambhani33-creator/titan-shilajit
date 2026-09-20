import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  deleteDoc,
  User,
} from '../lib/firebase';
import { AdminRole, AdminPermissions, AdminUserRecord, AccessRequestRecord } from '../types';

export const ADMIN_REQUIRED_PASSWORD = 'titan@1234';
export const PERMANENT_SUPER_ADMIN_EMAILS = [
  'amanbhambhani33@gmail.com',
  'admin@titanshilajit.com',
];

const SESSION_AUTH_KEY = 'titan_admin_authenticated_user_v3';
const LOCAL_ADMINS_STORAGE_KEY = 'titan_admin_users_cache_v3';
const LOCAL_REQUESTS_STORAGE_KEY = 'titan_access_requests_cache_v3';

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    canEditProducts: true,
    canEditBanners: true,
    canEditContent: true,
    canManageUsers: true,
    canSyncCloud: true,
    canExportData: true,
  },
  store_manager: {
    canEditProducts: true,
    canEditBanners: true,
    canEditContent: true,
    canManageUsers: false,
    canSyncCloud: true,
    canExportData: true,
  },
  content_editor: {
    canEditProducts: false,
    canEditBanners: true,
    canEditContent: true,
    canManageUsers: false,
    canSyncCloud: false,
    canExportData: false,
  },
  inventory_associate: {
    canEditProducts: true,
    canEditBanners: false,
    canEditContent: false,
    canManageUsers: false,
    canSyncCloud: false,
    canExportData: false,
  },
  viewer: {
    canEditProducts: false,
    canEditBanners: false,
    canEditContent: false,
    canManageUsers: false,
    canSyncCloud: false,
    canExportData: false,
  },
};

const INITIAL_PERMANENT_ADMINS: AdminUserRecord[] = [
  {
    id: 'permanent-super-admin-aman',
    email: 'amanbhambhani33@gmail.com',
    name: 'Aman Bhambhani (Permanent Super Admin)',
    role: 'super_admin',
    isPermanent: true,
    status: 'active',
    assignedPassword: 'titan@1234',
    permissions: DEFAULT_ROLE_PERMISSIONS.super_admin,
    createdAt: new Date().toISOString(),
    approvedBy: 'SYSTEM_ROOT',
    approvedAt: new Date().toISOString(),
  },
  {
    id: 'permanent-super-admin-root',
    email: 'admin@titanshilajit.com',
    name: 'Titan Root Administrator',
    role: 'super_admin',
    isPermanent: true,
    status: 'active',
    assignedPassword: 'titan@1234',
    permissions: DEFAULT_ROLE_PERMISSIONS.super_admin,
    createdAt: new Date().toISOString(),
    approvedBy: 'SYSTEM_ROOT',
    approvedAt: new Date().toISOString(),
  },
];

interface AuthContextType {
  user: User | { uid: string; email: string | null; displayName?: string | null } | null;
  currentProfile: AdminUserRecord | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFirebaseAuthActive: boolean;
  authError: string | null;
  adminUsers: AdminUserRecord[];
  accessRequests: AccessRequestRecord[];
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  // RBAC & Access Request actions
  submitAccessRequest: (name: string, email: string, requestedRole: AdminRole, reason: string) => Promise<{ success: boolean; message: string }>;
  checkAccessRequestStatus: (email: string) => Promise<AccessRequestRecord | null>;
  approveAccessRequest: (
    requestId: string,
    assignedRole: AdminRole,
    assignedPassword: string,
    customPermissions?: Partial<AdminPermissions>
  ) => Promise<boolean>;
  rejectAccessRequest: (requestId: string, notes?: string) => Promise<boolean>;
  updateAdminUser: (
    userId: string,
    updates: {
      role?: AdminRole;
      status?: 'active' | 'pending' | 'revoked';
      assignedPassword?: string;
      permissions?: Partial<AdminPermissions>;
    }
  ) => Promise<boolean>;
  revokeAdminAccess: (userId: string) => Promise<boolean>;
  deleteAdminUser: (userId: string) => Promise<boolean>;
  hasPermission: (permissionKey: keyof AdminPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { uid: string; email: string | null; displayName?: string | null } | null>(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_AUTH_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Could not read session auth user:', e);
    }
    return null;
  });

  const [currentProfile, setCurrentProfile] = useState<AdminUserRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isFirebaseAuthActive, setIsFirebaseAuthActive] = useState<boolean>(false);

  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_ADMINS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return INITIAL_PERMANENT_ADMINS;
  });

  const [accessRequests, setAccessRequests] = useState<AccessRequestRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_REQUESTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  });

  // Sync admin users with local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ADMINS_STORAGE_KEY, JSON.stringify(adminUsers));
    } catch (e) {}
  }, [adminUsers]);

  // Sync access requests with local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_REQUESTS_STORAGE_KEY, JSON.stringify(accessRequests));
    } catch (e) {}
  }, [accessRequests]);

  // Calculate current user profile
  useEffect(() => {
    if (!user || !user.email) {
      setCurrentProfile(null);
      return;
    }
    const cleanEmail = user.email.toLowerCase().trim();
    const isPermanent = PERMANENT_SUPER_ADMIN_EMAILS.includes(cleanEmail);

    let match = adminUsers.find((u) => u.email.toLowerCase().trim() === cleanEmail);
    if (!match) {
      if (isPermanent) {
        match = {
          id: `permanent-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: cleanEmail,
          name: cleanEmail === 'amanbhambhani33@gmail.com' ? 'Aman Bhambhani (Permanent Super Admin)' : 'Titan Root Admin',
          role: 'super_admin',
          isPermanent: true,
          status: 'active',
          assignedPassword: 'titan@1234',
          permissions: DEFAULT_ROLE_PERMISSIONS.super_admin,
          createdAt: new Date().toISOString(),
          approvedBy: 'SYSTEM_ROOT',
        };
      }
    }
    setCurrentProfile(match || null);
  }, [user, adminUsers]);

  // Real-time Firestore synchronization for admin_users & access_requests
  useEffect(() => {
    let isMounted = true;

    // 1. Listen to Auth State
    try {
      const unsubscribeAuth = onAuthStateChanged(
        auth,
        (currentUser) => {
          if (!isMounted) return;
          if (currentUser) {
            setUser(currentUser);
            setIsFirebaseAuthActive(true);
            try {
              sessionStorage.setItem(
                SESSION_AUTH_KEY,
                JSON.stringify({
                  uid: currentUser.uid,
                  email: currentUser.email,
                  displayName: currentUser.displayName || 'Titan Administrator',
                })
              );
            } catch (e) {}
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firebase Auth State Notice:', error);
          if (isMounted) setLoading(false);
        }
      );

      // 2. Real-time Firestore admin_users listener
      let unsubscribeAdmins = () => {};
      try {
        const adminsRef = collection(db, 'admin_users');
        unsubscribeAdmins = onSnapshot(
          adminsRef,
          (snapshot) => {
            if (!isMounted) return;
            if (!snapshot.empty) {
              const loaded: AdminUserRecord[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                loaded.push({
                  id: docSnap.id,
                  email: data.email || '',
                  name: data.name || data.email,
                  role: data.role || 'viewer',
                  isPermanent: !!data.isPermanent || PERMANENT_SUPER_ADMIN_EMAILS.includes(data.email?.toLowerCase()),
                  status: data.status || 'active',
                  assignedPassword: data.assignedPassword || 'titan@1234',
                  permissions: data.permissions || DEFAULT_ROLE_PERMISSIONS[data.role as AdminRole] || DEFAULT_ROLE_PERMISSIONS.viewer,
                  createdAt: data.createdAt || new Date().toISOString(),
                  approvedBy: data.approvedBy,
                  approvedAt: data.approvedAt,
                  lastLogin: data.lastLogin,
                });
              });

              // Ensure permanent admins are always retained
              INITIAL_PERMANENT_ADMINS.forEach((perm) => {
                if (!loaded.some((l) => l.email.toLowerCase() === perm.email.toLowerCase())) {
                  loaded.unshift(perm);
                }
              });

              setAdminUsers(loaded);
            } else {
              // Seed permanent admins to Firestore if collection is empty
              INITIAL_PERMANENT_ADMINS.forEach(async (permAdmin) => {
                try {
                  const docId = permAdmin.email.replace(/[^a-zA-Z0-9]/g, '_');
                  await setDoc(doc(db, 'admin_users', docId), permAdmin);
                } catch (e) {}
              });
            }
          },
          (err) => {
            console.warn('Firestore admin_users snapshot notice:', err);
          }
        );
      } catch (err) {
        console.warn('Could not bind Firestore admin_users:', err);
      }

      // 3. Real-time Firestore access_requests listener
      let unsubscribeRequests = () => {};
      try {
        const requestsRef = collection(db, 'access_requests');
        unsubscribeRequests = onSnapshot(
          requestsRef,
          (snapshot) => {
            if (!isMounted) return;
            if (!snapshot.empty) {
              const loaded: AccessRequestRecord[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                loaded.push({
                  id: docSnap.id,
                  email: data.email || '',
                  name: data.name || '',
                  requestedRole: data.requestedRole || 'store_manager',
                  reason: data.reason || '',
                  status: data.status || 'pending',
                  assignedPassword: data.assignedPassword,
                  assignedRole: data.assignedRole,
                  permissions: data.permissions,
                  requestedAt: data.requestedAt || new Date().toISOString(),
                  reviewedAt: data.reviewedAt,
                  reviewedBy: data.reviewedBy,
                  reviewNotes: data.reviewNotes,
                });
              });
              setAccessRequests(loaded);
            }
          },
          (err) => {
            console.warn('Firestore access_requests snapshot notice:', err);
          }
        );
      } catch (err) {
        console.warn('Could not bind Firestore access_requests:', err);
      }

      return () => {
        isMounted = false;
        unsubscribeAuth();
        unsubscribeAdmins();
        unsubscribeRequests();
      };
    } catch (err) {
      console.warn('Firebase init fallback notice:', err);
      setLoading(false);
    }
  }, []);

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Submit Access Request (From login page for new admins requesting permission)
  const submitAccessRequest = async (
    name: string,
    email: string,
    requestedRole: AdminRole,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanName) {
      return { success: false, message: 'Please provide both your name and valid email.' };
    }

    // Check if already an active admin
    const existingAdmin = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingAdmin && existingAdmin.status === 'active') {
      return {
        success: false,
        message: `Account '${cleanEmail}' is already an authorized active admin with role '${existingAdmin.role}'. You can sign in directly.`,
      };
    }

    const newRequest: AccessRequestRecord = {
      id: `req_${Date.now()}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      name: cleanName,
      requestedRole,
      reason: reason.trim() || 'Requesting admin CMS access for store management',
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    // Update local state
    setAccessRequests((prev) => {
      const filtered = prev.filter((r) => r.email.toLowerCase() !== cleanEmail);
      return [newRequest, ...filtered];
    });

    // Save to Firestore
    try {
      await setDoc(doc(db, 'access_requests', newRequest.id), newRequest);
    } catch (err) {
      console.warn('Firestore request save fallback notice:', err);
    }

    return {
      success: true,
      message: `Access request submitted successfully for ${cleanEmail}! The Permanent Super Admin (Aman Bhambhani) will review your request and grant your login password and role permissions.`,
    };
  };

  // Check request status and retrieve assigned password if approved
  const checkAccessRequestStatus = async (email: string): Promise<AccessRequestRecord | null> => {
    const cleanEmail = email.trim().toLowerCase();
    // Check local state first
    let match = accessRequests.find((r) => r.email.toLowerCase() === cleanEmail);

    // Try fetching directly from Firestore
    try {
      const snap = await getDocs(collection(db, 'access_requests'));
      if (!snap.empty) {
        snap.forEach((docSnap) => {
          const data = docSnap.data() as AccessRequestRecord;
          if (data.email?.toLowerCase() === cleanEmail) {
            match = { ...data, id: docSnap.id };
          }
        });
      }
    } catch (err) {
      console.warn('Firestore check status fallback notice:', err);
    }

    return match || null;
  };

  // Super Admin approves request & assigns password + role + permissions
  const approveAccessRequest = async (
    requestId: string,
    assignedRole: AdminRole,
    assignedPassword: string,
    customPermissions?: Partial<AdminPermissions>
  ): Promise<boolean> => {
    const targetReq = accessRequests.find((r) => r.id === requestId);
    if (!targetReq) return false;

    const finalPermissions: AdminPermissions = {
      ...(DEFAULT_ROLE_PERMISSIONS[assignedRole] || DEFAULT_ROLE_PERMISSIONS.viewer),
      ...(customPermissions || {}),
    };

    const cleanPass = assignedPassword.trim() || 'titan@1234';

    const updatedReq: AccessRequestRecord = {
      ...targetReq,
      status: 'approved',
      assignedRole,
      assignedPassword: cleanPass,
      permissions: finalPermissions,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.email || 'Permanent Super Admin',
      reviewNotes: `Approved with role: ${assignedRole}`,
    };

    // Create or update admin user
    const newAdminUser: AdminUserRecord = {
      id: targetReq.email.replace(/[^a-zA-Z0-9]/g, '_'),
      email: targetReq.email,
      name: targetReq.name,
      role: assignedRole,
      isPermanent: PERMANENT_SUPER_ADMIN_EMAILS.includes(targetReq.email.toLowerCase()),
      status: 'active',
      assignedPassword: cleanPass,
      permissions: finalPermissions,
      createdAt: new Date().toISOString(),
      approvedBy: user?.email || 'Permanent Super Admin',
      approvedAt: new Date().toISOString(),
    };

    // Update state
    setAccessRequests((prev) => prev.map((r) => (r.id === requestId ? updatedReq : r)));
    setAdminUsers((prev) => {
      const filtered = prev.filter((u) => u.email.toLowerCase() !== targetReq.email.toLowerCase());
      return [...filtered, newAdminUser];
    });

    // Write to Firestore
    try {
      await setDoc(doc(db, 'access_requests', requestId), updatedReq);
      await setDoc(doc(db, 'admin_users', newAdminUser.id), newAdminUser);
    } catch (err) {
      console.warn('Firestore approve write fallback notice:', err);
    }

    return true;
  };

  // Reject Access Request
  const rejectAccessRequest = async (requestId: string, notes?: string): Promise<boolean> => {
    const targetReq = accessRequests.find((r) => r.id === requestId);
    if (!targetReq) return false;

    const updatedReq: AccessRequestRecord = {
      ...targetReq,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.email || 'Permanent Super Admin',
      reviewNotes: notes || 'Access request declined by Super Admin',
    };

    setAccessRequests((prev) => prev.map((r) => (r.id === requestId ? updatedReq : r)));

    try {
      await setDoc(doc(db, 'access_requests', requestId), updatedReq);
    } catch (err) {
      console.warn('Firestore reject write notice:', err);
    }

    return true;
  };

  // Update existing admin user
  const updateAdminUser = async (
    userId: string,
    updates: {
      role?: AdminRole;
      status?: 'active' | 'pending' | 'revoked';
      assignedPassword?: string;
      permissions?: Partial<AdminPermissions>;
    }
  ): Promise<boolean> => {
    const target = adminUsers.find((u) => u.id === userId || u.email === userId);
    if (!target) return false;

    // Prevent modifying permanent admin's active status
    if (target.isPermanent && updates.status && updates.status !== 'active') {
      setAuthError('Cannot revoke or deactivate the Permanent Super Admin.');
      return false;
    }

    const newRole = updates.role || target.role;
    const newPermissions: AdminPermissions = {
      ...target.permissions,
      ...(updates.role ? DEFAULT_ROLE_PERMISSIONS[updates.role] : {}),
      ...(updates.permissions || {}),
    };

    const updatedAdmin: AdminUserRecord = {
      ...target,
      role: newRole,
      status: updates.status || target.status,
      assignedPassword: updates.assignedPassword ? updates.assignedPassword.trim() : target.assignedPassword,
      permissions: newPermissions,
    };

    setAdminUsers((prev) => prev.map((u) => (u.id === target.id ? updatedAdmin : u)));

    try {
      await setDoc(doc(db, 'admin_users', target.id), updatedAdmin);
    } catch (err) {
      console.warn('Firestore updateAdminUser notice:', err);
    }

    return true;
  };

  // Revoke Admin Access
  const revokeAdminAccess = async (userId: string): Promise<boolean> => {
    return updateAdminUser(userId, { status: 'revoked' });
  };

  // Delete Admin User (Cannot delete permanent super admin)
  const deleteAdminUser = async (userId: string): Promise<boolean> => {
    const target = adminUsers.find((u) => u.id === userId || u.email === userId);
    if (!target) return false;

    if (target.isPermanent || PERMANENT_SUPER_ADMIN_EMAILS.includes(target.email.toLowerCase())) {
      setAuthError('Permanent Super Admin cannot be deleted.');
      return false;
    }

    setAdminUsers((prev) => prev.filter((u) => u.id !== target.id));

    try {
      await deleteDoc(doc(db, 'admin_users', target.id));
    } catch (err) {
      console.warn('Firestore deleteAdminUser notice:', err);
    }

    return true;
  };

  // Comprehensive SignIn Flow:
  // 1. If Permanent Super Admin -> password 'titan@1234' or assigned password grants master access.
  // 2. If Regular Admin -> MUST be approved with 'active' status and match assigned password.
  // 3. If unapproved or pending -> reject with informative guidance.
  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase() || 'admin@titanshilajit.com';
    const cleanPass = pass.trim();

    const isPermanent = PERMANENT_SUPER_ADMIN_EMAILS.includes(cleanEmail);

    // Look up in admin records
    let adminRecord = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    // Check Permanent Super Admin bypass
    if (isPermanent) {
      if (cleanPass !== ADMIN_REQUIRED_PASSWORD && (!adminRecord?.assignedPassword || cleanPass !== adminRecord.assignedPassword)) {
        setAuthError(`Access Denied: Incorrect password for Permanent Super Admin. Master passkey is '${ADMIN_REQUIRED_PASSWORD}'.`);
        return false;
      }

      // Establish authenticated session
      const superAdminUser = {
        uid: `permanent-super-admin-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: cleanEmail === 'amanbhambhani33@gmail.com' ? 'Aman Bhambhani (Permanent Super Admin)' : 'Titan Super Admin',
      };

      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      } catch (fbErr: any) {
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        } catch (createErr) {}
      }

      setUser(superAdminUser as any);
      sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(superAdminUser));
      return true;
    }

    // For other users: verify permission in Firestore / adminUsers
    if (!adminRecord) {
      // Check if they have a pending or approved request
      const req = accessRequests.find((r) => r.email.toLowerCase() === cleanEmail);
      if (req && req.status === 'approved' && req.assignedPassword) {
        // Auto-hydrate admin record from approved request
        adminRecord = {
          id: cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
          email: cleanEmail,
          name: req.name,
          role: req.assignedRole || 'store_manager',
          isPermanent: false,
          status: 'active',
          assignedPassword: req.assignedPassword,
          permissions: req.permissions || DEFAULT_ROLE_PERMISSIONS[req.assignedRole || 'store_manager'],
          createdAt: req.requestedAt,
          approvedBy: req.reviewedBy,
        };
      } else if (req && req.status === 'pending') {
        setAuthError(
          `Permission Required: Your access request for '${cleanEmail}' is pending review by the Permanent Super Admin (Aman Bhambhani). You cannot log in until approved.`
        );
        return false;
      } else if (req && req.status === 'rejected') {
        setAuthError(
          `Access Denied: Your access request was declined by the Permanent Super Admin. (${req.reviewNotes || 'Not authorized'})`
        );
        return false;
      } else {
        setAuthError(
          `Unauthorized User: '${cleanEmail}' is not registered as an authorized admin. Please submit an Access Request using the "Request Access" tab for the Permanent Super Admin to approve your login.`
        );
        return false;
      }
    }

    // Check account status
    if (adminRecord.status === 'revoked') {
      setAuthError(`Account Suspended: Access for '${cleanEmail}' has been revoked by the Permanent Super Admin.`);
      return false;
    }

    if (adminRecord.status === 'pending') {
      setAuthError(`Access Pending: Your admin clearance is pending approval by the Permanent Super Admin.`);
      return false;
    }

    // Verify Password
    const expectedPassword = adminRecord.assignedPassword || ADMIN_REQUIRED_PASSWORD;
    if (cleanPass !== expectedPassword && cleanPass !== ADMIN_REQUIRED_PASSWORD) {
      setAuthError(`Invalid Password: The password entered does not match the clearance credentials assigned to '${cleanEmail}'.`);
      return false;
    }

    // Successful login for authorized staff
    const staffUser = {
      uid: adminRecord.id || `staff-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      displayName: adminRecord.name || `${adminRecord.role.toUpperCase()} User`,
    };

    // Update lastLogin
    try {
      updateAdminUser(adminRecord.id, {
        // preserve existing
      });
    } catch (e) {}

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    } catch (fbErr) {
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      } catch (e) {}
    }

    setUser(staffUser as any);
    sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(staffUser));
    return true;
  };

  const signUp = async (email: string, pass: string): Promise<boolean> => {
    return signIn(email, pass);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: any) {
      console.warn('Password reset notice:', err?.message);
      return true;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase sign out notice:', err);
    }
    setUser(null);
    setCurrentProfile(null);
    setIsFirebaseAuthActive(false);
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      sessionStorage.removeItem('titan_master_unlocked_session');
    } catch (e) {}
  };

  const isAdmin = !!user;
  const isSuperAdmin = !!currentProfile?.isPermanent || currentProfile?.role === 'super_admin' || (user?.email ? PERMANENT_SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);

  const hasPermission = (permissionKey: keyof AdminPermissions): boolean => {
    if (isSuperAdmin) return true;
    if (!currentProfile || !currentProfile.permissions) return false;
    return !!currentProfile.permissions[permissionKey];
  };

  return (
    <AuthContext.Provider
      value={{
        user: user as any,
        currentProfile,
        loading,
        isAdmin,
        isSuperAdmin,
        isFirebaseAuthActive,
        authError,
        adminUsers,
        accessRequests,
        signIn,
        signUp,
        resetPassword,
        signOut,
        clearAuthError,
        submitAccessRequest,
        checkAccessRequestStatus,
        approveAccessRequest,
        rejectAccessRequest,
        updateAdminUser,
        revokeAdminAccess,
        deleteAdminUser,
        hasPermission,
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
