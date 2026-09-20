import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  Lock,
  RefreshCw,
  Sparkles,
  Sliders,
  Mail,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth, DEFAULT_ROLE_PERMISSIONS, PERMANENT_SUPER_ADMIN_EMAILS } from '../context/AuthContext';
import { AdminRole, AdminPermissions, AdminUserRecord, AccessRequestRecord } from '../types';

interface AdminRBACSectionProps {
  onToast: (msg: string) => void;
}

export const AdminRBACSection: React.FC<AdminRBACSectionProps> = ({ onToast }) => {
  const {
    user,
    currentProfile,
    isSuperAdmin,
    adminUsers,
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    updateAdminUser,
    revokeAdminAccess,
    deleteAdminUser,
    hasPermission,
  } = useAuth();

  // Selected Tab inside RBAC Section
  const [subTab, setSubTab] = useState<'requests' | 'admins' | 'add_manual'>('requests');

  // Approval Modal / Drawer State
  const [approvingRequest, setApprovingRequest] = useState<AccessRequestRecord | null>(null);
  const [approvalRole, setApprovalRole] = useState<AdminRole>('store_manager');
  const [approvalPassword, setApprovalPassword] = useState<string>('');
  const [approvalPermissions, setApprovalPermissions] = useState<AdminPermissions>(DEFAULT_ROLE_PERMISSIONS.store_manager);
  const [showApprovalPassword, setShowApprovalPassword] = useState<boolean>(true);

  // Manual User Creation State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('store_manager');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermissions>(DEFAULT_ROLE_PERMISSIONS.store_manager);

  // Password Visibility toggles for existing admins in table
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filter state
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const pendingRequests = accessRequests.filter((r) => r.status === 'pending');
  const approvedRequests = accessRequests.filter((r) => r.status === 'approved');

  // Generate a clean secure random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pass = 'Titan@';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!';
    return pass;
  };

  const handleOpenApproveModal = (req: AccessRequestRecord) => {
    setApprovingRequest(req);
    const targetRole = req.requestedRole || 'store_manager';
    setApprovalRole(targetRole);
    setApprovalPassword(generateRandomPassword());
    setApprovalPermissions(DEFAULT_ROLE_PERMISSIONS[targetRole] || DEFAULT_ROLE_PERMISSIONS.viewer);
  };

  const handleRoleChangeInApproval = (role: AdminRole) => {
    setApprovalRole(role);
    setApprovalPermissions(DEFAULT_ROLE_PERMISSIONS[role]);
  };

  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingRequest) return;

    if (!approvalPassword.trim()) {
      alert('Please provide or generate a login password for the approved admin.');
      return;
    }

    const success = await approveAccessRequest(
      approvingRequest.id,
      approvalRole,
      approvalPassword.trim(),
      approvalPermissions
    );

    if (success) {
      onToast(`Approved ${approvingRequest.email}! Generated password: ${approvalPassword}`);
      setApprovingRequest(null);
    } else {
      alert('Could not approve request. Please try again.');
    }
  };

  const handleReject = async (reqId: string, email: string) => {
    if (confirm(`Are you sure you want to decline the access request for ${email}?`)) {
      await rejectAccessRequest(reqId, 'Declined by Super Admin');
      onToast(`Declined request for ${email}`);
    }
  };

  const handleTogglePasswordVisibility = (adminId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
    }));
  };

  const handleCopyPassword = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
      onToast('Password copied to clipboard!');
    } catch (e) {
      onToast(`Password: ${text}`);
    }
  };

  const handleTogglePermission = async (admin: AdminUserRecord, key: keyof AdminPermissions) => {
    if (admin.isPermanent) {
      onToast('Permanent Super Admin always possesses full unrestricted permissions.');
      return;
    }

    const newPerms = {
      ...admin.permissions,
      [key]: !admin.permissions[key],
    };

    await updateAdminUser(admin.id, {
      permissions: newPerms,
    });
    onToast(`Updated ${key} for ${admin.email}`);
  };

  const handleCreateManualAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim() || !newAdminPassword.trim()) {
      alert('Please fill in Name, Email, and Password.');
      return;
    }

    const cleanEmail = newAdminEmail.trim().toLowerCase();
    const newAdmin: AdminUserRecord = {
      id: cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      email: cleanEmail,
      name: newAdminName.trim(),
      role: newAdminRole,
      isPermanent: PERMANENT_SUPER_ADMIN_EMAILS.includes(cleanEmail),
      status: 'active',
      assignedPassword: newAdminPassword.trim(),
      permissions: newAdminPermissions,
      createdAt: new Date().toISOString(),
      approvedBy: user?.email || 'Super Admin',
      approvedAt: new Date().toISOString(),
    };

    // Update in context
    await updateAdminUser(newAdmin.id, {
      role: newAdminRole,
      status: 'active',
      assignedPassword: newAdminPassword.trim(),
      permissions: newAdminPermissions,
    });

    onToast(`Created admin account for ${cleanEmail}! Password: ${newAdminPassword}`);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPassword('');
    setSubTab('admins');
  };

  const filteredAdmins = adminUsers.filter((a) => {
    if (roleFilter === 'all') return true;
    return a.role === roleFilter;
  });

  return (
    <div id="admin-rbac-section" className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Permanent Super Admin */}
        <div className="bg-[#10110F] text-[#F7F3E8] p-5 rounded-sm border border-[#B88A32]/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#B88A32]/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4B66A]">
              PERMANENT ROOT
            </span>
            <Crown className="w-4 h-4 text-[#D4B66A]" />
          </div>
          <div className="text-base font-serif font-bold text-[#F7F3E8] truncate">
            Aman Bhambhani
          </div>
          <p className="text-[11px] text-[#EEE8D7]/60 mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#25D366]" />
            <span>Root Super Admin (Protected)</span>
          </p>
        </div>

        {/* Metric 2: Total Admins */}
        <div className="bg-white p-5 rounded-sm border border-[#10110F]/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10110F]/60">
              Authorized Admins
            </span>
            <Users className="w-4 h-4 text-[#183D27]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#10110F]">
            {adminUsers.filter((u) => u.status === 'active').length}
          </div>
          <p className="text-[11px] text-[#10110F]/60 mt-1">
            Active staff with configured clearance
          </p>
        </div>

        {/* Metric 3: Pending Access Requests */}
        <div className={`p-5 rounded-sm border shadow-sm ${
          pendingRequests.length > 0
            ? 'bg-amber-950/20 border-amber-500/50 text-amber-900'
            : 'bg-white border-[#10110F]/10'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Pending Requests
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#10110F] flex items-center gap-2">
            <span>{pendingRequests.length}</span>
            {pendingRequests.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold uppercase">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#10110F]/60 mt-1">
            Awaiting Super Admin permission
          </p>
        </div>

        {/* Metric 4: Access Governance */}
        <div className="bg-white p-5 rounded-sm border border-[#10110F]/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10110F]/60">
              Security Protocol
            </span>
            <ShieldCheck className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-sm font-bold text-[#183D27] uppercase">
            Master Pass + RBAC
          </div>
          <p className="text-[11px] text-[#10110F]/60 mt-1">
            Full Firestore permission sync
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#10110F]/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('requests')}
            className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              subTab === 'requests'
                ? 'bg-[#183D27] text-[#F7F3E8]'
                : 'bg-white text-[#10110F] border border-[#10110F]/15 hover:bg-[#183D27]/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Access Requests</span>
            {pendingRequests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('admins')}
            className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              subTab === 'admins'
                ? 'bg-[#183D27] text-[#F7F3E8]'
                : 'bg-white text-[#10110F] border border-[#10110F]/15 hover:bg-[#183D27]/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff &amp; Admins Directory ({adminUsers.length})</span>
          </button>

          <button
            onClick={() => setSubTab('add_manual')}
            className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              subTab === 'add_manual'
                ? 'bg-[#183D27] text-[#F7F3E8]'
                : 'bg-white text-[#10110F] border border-[#10110F]/15 hover:bg-[#183D27]/10'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Admin Directly</span>
          </button>
        </div>

        {subTab === 'admins' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#10110F]/60 uppercase font-bold">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xs border border-[#10110F]/20 text-xs bg-white font-medium"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="store_manager">Store Manager</option>
              <option value="content_editor">Content Editor</option>
              <option value="inventory_associate">Inventory Associate</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: PENDING ACCESS REQUESTS */}
      {/* ========================================================================= */}
      {subTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#10110F]">
                Pending Staff Access Requests
              </h2>
              <p className="text-xs text-[#10110F]/70">
                When new users request admin access from the login screen, they appear here. The Permanent Super Admin can review, approve, set their login password, and toggle feature permissions.
              </p>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-sm border border-[#10110F]/10 p-10 text-center shadow-sm">
              <UserCheck className="w-10 h-10 text-[#183D27]/40 mx-auto mb-3" />
              <h3 className="font-serif text-base font-bold text-[#10110F]">
                No Pending Access Requests
              </h3>
              <p className="text-xs text-[#10110F]/60 max-w-md mx-auto mt-1">
                All team access requests have been reviewed. New staff members can submit access requests from the Admin Desk login page under the "Request Access" tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-sm border-2 border-amber-500/40 p-5 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {req.requestedRole.replace('_', ' ')}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#10110F] mt-1">
                          {req.name}
                        </h3>
                        <div className="text-xs text-[#183D27] font-mono flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-[#10110F]/40" />
                          <span>{req.email}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#10110F]/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 text-xs text-[#10110F]/80 my-3 italic">
                      "{req.reason}"
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#10110F]/10 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => handleReject(req.id, req.email)}
                      className="px-3 py-2 rounded-xs border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold uppercase transition-colors"
                    >
                      Decline
                    </button>

                    <button
                      onClick={() => handleOpenApproveModal(req)}
                      className="px-4 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#D4B66A]" />
                      <span>Approve &amp; Assign Password</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Reviewed Requests Section */}
          {approvedRequests.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#10110F]/10">
              <h3 className="font-serif text-sm font-bold text-[#10110F] mb-3 uppercase tracking-wider text-[#10110F]/60">
                Recently Approved Access ({approvedRequests.length})
              </h3>
              <div className="bg-white rounded-sm border border-[#10110F]/10 divide-y divide-[#10110F]/5">
                {approvedRequests.map((req) => (
                  <div key={req.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-[#10110F] font-semibold">{req.name}</strong> ({req.email})
                      <span className="ml-2 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Approved as {req.assignedRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#10110F]/60 font-mono">
                        Password: <strong className="text-[#183D27]">{req.assignedPassword}</strong>
                      </span>
                      <button
                        onClick={() => handleCopyPassword(req.assignedPassword || '', req.id)}
                        className="p-1 rounded-xs bg-[#F7F3E8] hover:bg-[#183D27] hover:text-[#D4B66A] text-[#10110F] border border-[#10110F]/20"
                        title="Copy Password"
                      >
                        {copiedKey === req.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: STAFF & ADMINS DIRECTORY */}
      {/* ========================================================================= */}
      {subTab === 'admins' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#10110F]">
                Authorized Admin &amp; Staff Directory
              </h2>
              <p className="text-xs text-[#10110F]/70">
                View clearance records, reveal/copy assigned login passwords, and toggle specific feature capabilities in real time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAdmins.map((admin) => {
              const isPermanent = admin.isPermanent || PERMANENT_SUPER_ADMIN_EMAILS.includes(admin.email.toLowerCase());
              const isPasswordVisible = visiblePasswords[admin.id] || false;
              const displayPassword = admin.assignedPassword || 'titan@1234';

              return (
                <div
                  key={admin.id}
                  className={`bg-white rounded-sm border p-5 shadow-sm transition-all ${
                    isPermanent
                      ? 'border-[#B88A32] bg-gradient-to-r from-white via-[#F7F3E8] to-white shadow-md'
                      : admin.status === 'revoked'
                      ? 'border-red-300 opacity-60 bg-red-50/20'
                      : 'border-[#10110F]/10'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#10110F]/10">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#10110F] flex items-center gap-2">
                          <span>{admin.name}</span>
                          {isPermanent && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[9px] font-bold tracking-widest uppercase border border-[#B88A32] flex items-center gap-1 shadow-xs">
                              <Crown className="w-3 h-3 text-[#D4B66A]" />
                              <span>ROOT PERMANENT ADMIN</span>
                            </span>
                          )}
                        </h3>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          admin.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-red-100 text-red-900 border border-red-300'
                        }`}>
                          {admin.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#183D27] font-mono mt-0.5">
                        {admin.email} • Role: <strong className="uppercase font-bold text-[#10110F]">{admin.role.replace('_', ' ')}</strong>
                      </div>
                    </div>

                    {/* Password Clearance Box */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#F7F3E8] p-2.5 rounded-xs border border-[#10110F]/15">
                      <KeyRound className="w-4 h-4 text-[#B88A32]" />
                      <span className="text-[11px] font-bold uppercase text-[#10110F]/70">Login Password:</span>
                      <span className="font-mono text-xs font-bold text-[#183D27] px-2 py-0.5 bg-white rounded-xs border border-[#10110F]/10">
                        {isPasswordVisible ? displayPassword : '••••••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTogglePasswordVisibility(admin.id)}
                        className="p-1 text-[#10110F]/60 hover:text-[#10110F]"
                        title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                      >
                        {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(displayPassword, admin.id)}
                        className="p-1 text-[#10110F]/60 hover:text-[#183D27]"
                        title="Copy Password"
                      >
                        {copiedKey === admin.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Feature Permissions Grid */}
                  <div className="pt-4">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#10110F]/60 mb-2.5 flex items-center justify-between">
                      <span>Feature Permissions &amp; Capabilities</span>
                      {isPermanent && (
                        <span className="text-[#B88A32] font-semibold">
                          All permissions permanent &amp; unlocked
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {[
                        { key: 'canEditProducts', label: 'Products & Pricing' },
                        { key: 'canEditBanners', label: 'Hero & Launches' },
                        { key: 'canEditContent', label: 'Developer Copy' },
                        { key: 'canSyncCloud', label: 'Firestore Sync' },
                        { key: 'canExportData', label: 'Backup & Export' },
                        { key: 'canManageUsers', label: 'RBAC Team Admin' },
                      ].map((item) => {
                        const isGranted = isPermanent || !!admin.permissions?.[item.key as keyof AdminPermissions];

                        return (
                          <button
                            key={item.key}
                            disabled={isPermanent}
                            onClick={() => handleTogglePermission(admin, item.key as keyof AdminPermissions)}
                            className={`p-2 rounded-xs border text-left text-[11px] font-medium transition-all flex items-center justify-between ${
                              isGranted
                                ? 'bg-[#183D27]/10 border-[#183D27]/40 text-[#183D27]'
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                            }`}
                          >
                            <span className="truncate pr-1">{item.label}</span>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-[9px] ${
                              isGranted ? 'bg-[#183D27] text-[#D4B66A]' : 'bg-gray-300 text-white'
                            }`}>
                              {isGranted ? '✓' : '✕'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Bar */}
                  {!isPermanent && (
                    <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-[#10110F]/50">
                        Approved on {new Date(admin.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        {admin.status === 'active' ? (
                          <button
                            onClick={() => revokeAdminAccess(admin.id)}
                            className="px-2.5 py-1 rounded-xs border border-amber-300 text-amber-800 hover:bg-amber-50 text-[11px] font-bold uppercase transition-colors"
                          >
                            Revoke Access
                          </button>
                        ) : (
                          <button
                            onClick={() => updateAdminUser(admin.id, { status: 'active' })}
                            className="px-2.5 py-1 rounded-xs bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase transition-colors"
                          >
                            Restore Access
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to completely delete admin record for ${admin.email}?`)) {
                              deleteAdminUser(admin.id);
                              onToast(`Deleted admin ${admin.email}`);
                            }
                          }}
                          className="p-1.5 rounded-xs border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                          title="Delete Admin Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: DIRECTLY ADD ADMIN (NO REQUEST NEEDED) */}
      {/* ========================================================================= */}
      {subTab === 'add_manual' && (
        <div className="max-w-2xl bg-white rounded-sm border border-[#10110F]/15 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-bold text-[#10110F]">
              Directly Grant Staff Admin Clearance
            </h2>
            <p className="text-xs text-[#10110F]/70 mt-1">
              Add a trusted team member directly without requiring them to submit an access request form.
            </p>
          </div>

          <form onSubmit={handleCreateManualAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs focus:border-[#183D27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="vikram@titanshilajit.com"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs focus:border-[#183D27] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Assigned Role
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => {
                    const role = e.target.value as AdminRole;
                    setNewAdminRole(role);
                    setNewAdminPermissions(DEFAULT_ROLE_PERMISSIONS[role]);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs bg-white focus:border-[#183D27] focus:outline-none font-medium"
                >
                  <option value="store_manager">Store Manager (Products + Content + Cloud)</option>
                  <option value="content_editor">Content Editor (Banners + Copy Only)</option>
                  <option value="inventory_associate">Inventory Associate (Products &amp; Pricing)</option>
                  <option value="viewer">Viewer (Read-Only Preview)</option>
                  <option value="super_admin">Super Admin (Full Authority)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-[#10110F]">
                    Assigned Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewAdminPassword(generateRandomPassword())}
                    className="text-[10px] text-[#183D27] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#B88A32]" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="e.g. Titan#2026!"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs font-mono focus:border-[#183D27] focus:outline-none"
                />
              </div>
            </div>

            {/* Custom Permissions Checklist */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-2">
                Granular Permissions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: 'canEditProducts', label: 'Catalog & Pricing' },
                  { key: 'canEditBanners', label: 'Hero & Launches' },
                  { key: 'canEditContent', label: 'Developer Text' },
                  { key: 'canSyncCloud', label: 'Firestore Sync' },
                  { key: 'canExportData', label: 'Export Backup' },
                  { key: 'canManageUsers', label: 'RBAC Team Admin' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 p-2 rounded-xs border border-[#10110F]/10 text-xs bg-[#F7F3E8] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!newAdminPermissions[item.key as keyof AdminPermissions]}
                      onChange={(e) =>
                        setNewAdminPermissions({
                          ...newAdminPermissions,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
              >
                <UserCheck className="w-4 h-4 text-[#D4B66A]" />
                <span>Save &amp; Grant Access</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPROVAL MODAL / DIALOG */}
      {/* ========================================================================= */}
      {approvingRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-[#10110F]/20 max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#183D27] px-2 py-0.5 rounded-full bg-[#183D27]/10">
                  CLEARANCE APPROVAL
                </span>
                <h3 className="font-serif text-xl font-bold text-[#10110F] mt-1">
                  Approve {approvingRequest.name}
                </h3>
                <p className="text-xs text-[#10110F]/60 font-mono mt-0.5">
                  {approvingRequest.email}
                </p>
              </div>
              <button
                onClick={() => setApprovingRequest(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Assigned Staff Role
                </label>
                <select
                  value={approvalRole}
                  onChange={(e) => handleRoleChangeInApproval(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-medium"
                >
                  <option value="store_manager">Store Manager (Products, Banners, Copy, Cloud)</option>
                  <option value="content_editor">Content Editor (Banners &amp; Copy)</option>
                  <option value="inventory_associate">Inventory Associate (Products &amp; Pricing)</option>
                  <option value="viewer">Viewer (Preview Only)</option>
                  <option value="super_admin">Super Admin (Full Authority)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-[#10110F]">
                    Assigned Login Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setApprovalPassword(generateRandomPassword())}
                    className="text-[10px] text-[#183D27] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#B88A32]" />
                    <span>Generate New</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showApprovalPassword ? 'text' : 'password'}
                    required
                    value={approvalPassword}
                    onChange={(e) => setApprovalPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApprovalPassword(!showApprovalPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#10110F]/50 hover:text-[#10110F]"
                  >
                    {showApprovalPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-[10px] text-[#10110F]/60 mt-1">
                  The applicant will see this password when checking their status on the login screen.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1.5">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'canEditProducts', label: 'Products & Pricing' },
                    { key: 'canEditBanners', label: 'Banners & Launches' },
                    { key: 'canEditContent', label: 'Developer Copy' },
                    { key: 'canSyncCloud', label: 'Firestore Sync' },
                    { key: 'canExportData', label: 'Backup & Export' },
                    { key: 'canManageUsers', label: 'RBAC Team Admin' },
                  ].map((perm) => (
                    <label key={perm.key} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!approvalPermissions[perm.key as keyof AdminPermissions]}
                        onChange={(e) =>
                          setApprovalPermissions({
                            ...approvalPermissions,
                            [perm.key]: e.target.checked,
                          })
                        }
                        className="rounded-xs text-[#183D27]"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#10110F]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApprovingRequest(null)}
                  className="px-4 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4B66A]" />
                  <span>Grant Permission</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
