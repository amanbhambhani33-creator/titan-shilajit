import React, { useState } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Send,
  Search,
  Copy,
  Check,
  ShieldCheck,
  Crown,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth, ADMIN_REQUIRED_PASSWORD, PERMANENT_SUPER_ADMIN_EMAILS } from '../context/AuthContext';
import { AdminRole, AccessRequestRecord } from '../types';

interface AdminLoginGateProps {
  onSuccessToast: (msg: string) => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onSuccessToast }) => {
  const {
    signIn,
    submitAccessRequest,
    checkAccessRequestStatus,
    authError,
    clearAuthError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'request' | 'status'>('signin');

  // Sign In Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  // Request Access Form State
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqRole, setReqRole] = useState<AdminRole>('store_manager');
  const [reqReason, setReqReason] = useState('');
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);

  // Status Check Form State
  const [statusEmailInput, setStatusEmailInput] = useState('');
  const [statusResult, setStatusResult] = useState<AccessRequestRecord | null | undefined>(undefined);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [copiedStatusPass, setCopiedStatusPass] = useState(false);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();
    setIsSigningIn(true);

    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      const cleanPass = passwordInput.trim();

      if (!cleanEmail || !cleanPass) {
        setLocalError('Please enter your authorized email and password.');
        setIsSigningIn(false);
        return;
      }

      const success = await signIn(cleanEmail, cleanPass);
      if (success) {
        try {
          sessionStorage.setItem('titan_master_unlocked_session', 'true');
        } catch (e) {}
        onSuccessToast(`Welcome back, ${cleanEmail}`);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);
    setIsSubmittingReq(true);

    try {
      const res = await submitAccessRequest(reqName, reqEmail, reqRole, reqReason);
      if (res.success) {
        setLocalSuccess(res.message);
        setReqName('');
        setReqEmail('');
        setReqReason('');
      } else {
        setLocalError(res.message);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Could not submit access request.');
    } finally {
      setIsSubmittingReq(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsCheckingStatus(true);
    setStatusResult(undefined);

    try {
      if (!statusEmailInput.trim()) {
        setLocalError('Please enter your email to check approval status.');
        setIsCheckingStatus(false);
        return;
      }

      const result = await checkAccessRequestStatus(statusEmailInput.trim());
      setStatusResult(result);
    } catch (err: any) {
      setLocalError('Could not retrieve status. Please try again.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleUseApprovedPasswordToSignIn = (record: AccessRequestRecord) => {
    setEmailInput(record.email);
    setPasswordInput(record.assignedPassword || ADMIN_REQUIRED_PASSWORD);
    setActiveTab('signin');
    setLocalSuccess(`Credentials loaded for ${record.email}. Click "Sign In to Admin Desk" to enter.`);
  };

  const handleCopy = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedStatusPass(true);
      setTimeout(() => setCopiedStatusPass(false), 2000);
      onSuccessToast('Password copied to clipboard!');
    } catch (e) {}
  };

  return (
    <div id="admin-login-screen" className="min-h-screen pt-24 pb-20 bg-[#10110F] text-[#F7F3E8] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#183D27]/30 border border-[#B88A32]/50 rounded-sm p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Ambient Gold Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B88A32]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#183D27]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-12 h-12 mx-auto bg-[#183D27] border border-[#B88A32] rounded-xs flex items-center justify-center mb-3 shadow-lg">
            <Lock className="w-6 h-6 text-[#D4B66A]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4B66A] font-bold block mb-1">
            TITAN SHILAJIT CMS &amp; RBAC PORTAL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F3E8] tracking-tight">
            ADMIN DESK ACCESS
          </h1>
          <p className="text-xs text-[#EEE8D7]/75 font-sans mt-1">
            Governed by Permanent Super Admin with role clearance &amp; password issuance.
          </p>
        </div>

        {/* 3 Interactive Tabs */}
        <div className="flex border-b border-[#B88A32]/25 mb-6 relative z-10">
          <button
            onClick={() => {
              setActiveTab('signin');
              setLocalError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'signin'
                ? 'border-[#D4B66A] text-[#D4B66A]'
                : 'border-transparent text-[#EEE8D7]/50 hover:text-[#EEE8D7]'
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setActiveTab('request');
              setLocalError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'request'
                ? 'border-[#D4B66A] text-[#D4B66A]'
                : 'border-transparent text-[#EEE8D7]/50 hover:text-[#EEE8D7]'
            }`}
          >
            Request Access
          </button>

          <button
            onClick={() => {
              setActiveTab('status');
              setLocalError(null);
              clearAuthError();
            }}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'status'
                ? 'border-[#D4B66A] text-[#D4B66A]'
                : 'border-transparent text-[#EEE8D7]/50 hover:text-[#EEE8D7]'
            }`}
          >
            Check Status
          </button>
        </div>

        {/* Notifications & Error Alerts */}
        {(authError || localError) && (
          <div className="mb-5 p-3.5 rounded-xs bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authError || localError}</span>
          </div>
        )}

        {localSuccess && (
          <div className="mb-5 p-3.5 rounded-xs bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{localSuccess}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: SIGN IN */}
        {/* ========================================================================= */}
        {activeTab === 'signin' && (
          <div className="space-y-4 relative z-10">
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>Authorized Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. amanbhambhani33@gmail.com"
                  className="w-full px-4 py-3 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4B66A]" />
                    <span>Login Password</span>
                  </label>
                  <span className="text-[10px] text-[#D4B66A] font-mono">
                    Master / Assigned Pass
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password or master key (titan@1234)"
                    className="w-full px-4 py-3 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs pr-10 focus:border-[#D4B66A] focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EEE8D7]/60 hover:text-[#EEE8D7]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full py-3.5 mt-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSigningIn ? 'Authenticating Clearance...' : 'Sign In to Admin Desk'}</span>
              </button>
            </form>

            {/* Fast Autofill Credentials for Permanent Super Admin */}
            <div className="mt-5 pt-4 border-t border-[#B88A32]/20 text-center space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-[#EEE8D7]/50 font-semibold">
                Permanent Super Admin Quick Access
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput('amanbhambhani33@gmail.com');
                    setPasswordInput('titan@1234');
                    setLocalError(null);
                  }}
                  className="px-3 py-1.5 rounded-xs bg-[#183D27] hover:bg-[#205234] border border-[#B88A32]/40 text-[11px] text-[#D4B66A] font-semibold flex items-center gap-1.5"
                >
                  <Crown className="w-3 h-3 text-[#D4B66A]" />
                  <span>Aman Bhambhani (Permanent Admin)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailInput('admin@titanshilajit.com');
                    setPasswordInput('titan@1234');
                    setLocalError(null);
                  }}
                  className="px-3 py-1.5 rounded-xs bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-[#EEE8D7] font-medium"
                >
                  <span>Titan Root (titan@1234)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REQUEST ACCESS */}
        {/* ========================================================================= */}
        {activeTab === 'request' && (
          <div className="space-y-4 relative z-10">
            <div className="p-3 rounded-xs bg-[#183D27]/50 border border-[#B88A32]/30 text-xs text-[#EEE8D7]/80 leading-relaxed">
              <p>
                Staff members and store managers can request admin credentials. The <strong>Permanent Super Admin (Aman Bhambhani)</strong> will review your request, assign your role capabilities, and generate your login password.
              </p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  placeholder="ramesh@titanshilajit.com"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1">
                  Requested Role
                </label>
                <select
                  value={reqRole}
                  onChange={(e) => setReqRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none"
                >
                  <option value="store_manager">Store Manager (Products + Copy + Cloud)</option>
                  <option value="content_editor">Content Editor (Banners &amp; Copy)</option>
                  <option value="inventory_associate">Inventory Associate (Products &amp; Pricing)</option>
                  <option value="viewer">Viewer (Read-Only Preview)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1">
                  Reason for Access
                </label>
                <textarea
                  rows={2}
                  required
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="e.g. Updating holiday sale banner and inventory pricing..."
                  className="w-full px-3.5 py-2 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReq}
                className="w-full py-3 rounded-xs bg-[#183D27] hover:bg-[#205234] border border-[#B88A32] text-[#F7F3E8] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#D4B66A]" />
                <span>{isSubmittingReq ? 'Submitting to Super Admin...' : 'Submit Access Request'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CHECK STATUS & REVEAL PASSWORD */}
        {/* ========================================================================= */}
        {activeTab === 'status' && (
          <div className="space-y-4 relative z-10">
            <p className="text-xs text-[#EEE8D7]/75">
              Check if the Permanent Super Admin has approved your access and view your <strong>assigned login password</strong>.
            </p>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="email"
                required
                value={statusEmailInput}
                onChange={(e) => setStatusEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3.5 py-2.5 rounded-xs bg-[#10110F] border border-[#B88A32]/40 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isCheckingStatus}
                className="px-4 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isCheckingStatus ? 'Checking...' : 'Check'}</span>
              </button>
            </form>

            {/* Status Outcome Cards */}
            {statusResult !== undefined && (
              <div className="pt-2 animate-in fade-in duration-200">
                {!statusResult ? (
                  <div className="p-4 rounded-xs bg-black/40 border border-white/10 text-center">
                    <p className="text-xs text-[#EEE8D7]/70">
                      No request found for <strong>{statusEmailInput}</strong>. Please submit an access request using the "Request Access" tab.
                    </p>
                  </div>
                ) : statusResult.status === 'approved' ? (
                  <div className="p-5 rounded-xs bg-emerald-950/70 border-2 border-emerald-500/60 text-[#F7F3E8] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Clearance Approved!
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                        {statusResult.assignedRole || 'Store Manager'}
                      </span>
                    </div>

                    <div className="bg-[#10110F] p-3.5 rounded-xs border border-emerald-500/40">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#D4B66A] mb-1">
                        Your Assigned Login Password:
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#F7F3E8] tracking-wider">
                          {statusResult.assignedPassword || 'titan@1234'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(statusResult.assignedPassword || 'titan@1234')}
                          className="p-1.5 rounded-xs bg-white/10 hover:bg-white/20 text-[#D4B66A]"
                          title="Copy Password"
                        >
                          {copiedStatusPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#EEE8D7]/75">
                      Reviewed by: <strong>{statusResult.reviewedBy || 'Permanent Super Admin'}</strong>
                    </p>

                    <button
                      type="button"
                      onClick={() => handleUseApprovedPasswordToSignIn(statusResult)}
                      className="w-full py-2.5 rounded-xs bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Sign In with This Password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : statusResult.status === 'pending' ? (
                  <div className="p-4 rounded-xs bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <strong className="uppercase font-bold tracking-wide">
                        Pending Super Admin Review
                      </strong>
                    </div>
                    <p className="leading-relaxed text-[#EEE8D7]/80">
                      Your request submitted on {new Date(statusResult.requestedAt).toLocaleDateString()} is awaiting approval by the Permanent Super Admin (Aman Bhambhani). Check back shortly to view your assigned password.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xs bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-1">
                    <strong className="uppercase font-bold">Access Request Declined</strong>
                    <p className="text-[#EEE8D7]/70">
                      {statusResult.reviewNotes || 'Your access request was declined by the Super Admin.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
