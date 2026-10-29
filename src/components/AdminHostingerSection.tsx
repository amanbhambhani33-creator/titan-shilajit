import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Download,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  AlertCircle,
  FileJson,
  Layers,
  Key,
} from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';

interface AdminHostingerSectionProps {
  onToast: (msg: string) => void;
}

export const AdminHostingerSection: React.FC<AdminHostingerSectionProps> = ({ onToast }) => {
  const { products, reviews, orders, content, pullFromHostinger } = useStoreContent();

  const [status, setStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  // 1-Click Sync States
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Remote Hostinger Website URL (e.g. https://yourdomain.com)
  const [remoteHostingerUrl, setRemoteHostingerUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('titan_remote_hostinger_url') || '';
    } catch {
      return '';
    }
  });

  // MySQL Test state
  const [mysqlHost, setMysqlHost] = useState<string>('');
  const [mysqlPort, setMysqlPort] = useState<string>('3306');
  const [mysqlUser, setMysqlUser] = useState<string>('');
  const [mysqlPassword, setMysqlPassword] = useState<string>('');
  const [mysqlDatabase, setMysqlDatabase] = useState<string>('');
  const [isTestingMysql, setIsTestingMysql] = useState<boolean>(false);
  const [mysqlTestResult, setMysqlTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await fetch('/api/hostinger/status');
      const data = await res.json();
      if (data && data.success) {
        setStatus(data);
      }
    } catch {
      // Ignored
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // 1-Click Pull all changes from Hostinger to AI Studio
  const handlePullFromHostinger = async (useRemoteUrl: boolean = false) => {
    setIsPulling(true);
    setSyncResult(null);

    try {
      const urlToUse = useRemoteUrl ? remoteHostingerUrl : undefined;
      const res = await pullFromHostinger(urlToUse);
      if (res.success) {
        setSyncResult(res.message);
        onToast('Changes from Hostinger successfully imported and applied!');
        fetchStatus();
      } else {
        setSyncResult(res.message || 'Notice: Could not pull changes from Hostinger.');
      }
    } catch (err: any) {
      setSyncResult(err?.message || 'Pull sync failed.');
    } finally {
      setIsPulling(false);
    }
  };

  // Import from uploaded Hostinger JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        const res = await fetch('/api/hostinger/import-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });
        const data = await res.json();
        if (data.success) {
          onToast('Backup JSON imported successfully! Pulling into active store...');
          await pullFromHostinger();
          fetchStatus();
        } else {
          onToast(data.message || 'Import failed.');
        }
      } catch (err: any) {
        onToast('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // 1-Click Sync all data to Hostinger
  const handleSyncToHostinger = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const payload = {
        orders,
        products,
        reviews,
        content,
      };

      const res = await fetch('/api/hostinger/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.success) {
        setSyncResult(
          `Synced ${data.importedOrders || orders.length} orders, ${data.importedProducts || products.length} products, and ${data.importedReviews || reviews.length} reviews directly to Hostinger storage!`
        );
        onToast('Store data successfully mirrored to Hostinger database!');
        fetchStatus();
      } else {
        setSyncResult('Notice: Could not sync some records.');
      }
    } catch (err: any) {
      setSyncResult(err?.message || 'Sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Test Hostinger MySQL
  const handleTestMysql = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingMysql(true);
    setMysqlTestResult(null);

    try {
      const res = await fetch('/api/hostinger/test-mysql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: mysqlHost,
          port: Number(mysqlPort) || 3306,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDatabase,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMysqlTestResult({ success: true, message: data.message });
        onToast('Hostinger MySQL credentials verified successfully!');
      } else {
        setMysqlTestResult({ success: false, message: data.error || 'Connection failed' });
      }
    } catch (err: any) {
      setMysqlTestResult({ success: false, message: err?.message || 'Connection error' });
    } finally {
      setIsTestingMysql(false);
    }
  };

  return (
    <div id="admin-hostinger-section" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#10110F] text-[#F7F3E8] p-6 sm:p-8 rounded-sm border border-[#B88A32]/30 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#B88A32]/40">
              <Server className="w-3.5 h-3.5 text-[#25D366]" />
              <span>SELF-CONTAINED HOSTINGER STORAGE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Hostinger Database &amp; Data Center
            </h2>
            <p className="text-xs text-[#EEE8D7]/75 font-sans mt-1 max-w-2xl leading-relaxed">
              Store 100% of your store orders, products, reviews, customer details, and brand identity directly on your Hostinger server with zero third-party dependencies and zero broken checkout flows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handlePullFromHostinger(false)}
              disabled={isPulling}
              className="px-4 py-2.5 rounded-xs bg-[#25D366] hover:bg-[#20ba5a] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Pull changes from Hostinger database into AI Studio"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
              <span>{isPulling ? 'Pulling Changes...' : 'Pull Changes from Hostinger'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncToHostinger}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Push current products, reviews, and content to Hostinger database"
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5" />
              )}
              <span>{isSyncing ? 'Syncing...' : 'Sync All to Hostinger'}</span>
            </button>

            <a
              href="/api/hostinger/backup-download"
              download
              className="px-4 py-2.5 rounded-xs bg-white/10 hover:bg-white/20 text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Download Backup</span>
            </a>
          </div>
        </div>

        {/* Live Hostinger Remote Website URL Sync */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-[#D4B66A] tracking-wider block mb-1">
              Hostinger Live Website Domain / URL (For Remote Sync):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={remoteHostingerUrl}
                onChange={(e) => {
                  setRemoteHostingerUrl(e.target.value);
                  try { localStorage.setItem('titan_remote_hostinger_url', e.target.value); } catch {}
                }}
                placeholder="https://yourdomain.com (Your Live Hostinger Site)"
                className="flex-1 px-3 py-2 rounded-xs bg-white/10 border border-white/20 text-[#F7F3E8] text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#D4B66A]"
              />
              <button
                type="button"
                onClick={() => handlePullFromHostinger(true)}
                disabled={isPulling || !remoteHostingerUrl.trim()}
                className="px-3.5 py-2 rounded-xs bg-[#183D27] hover:bg-[#205234] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#D4B66A]/40 transition-all cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D4B66A] ${isPulling ? 'animate-spin' : ''}`} />
                <span>Pull from Domain</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <label className="px-3 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-white/20 cursor-pointer">
              <FileJson className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Restore from JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {syncResult && (
          <div className="mt-4 p-3 rounded-xs bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncResult}</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status */}
        <div className="bg-white p-5 rounded-xs border border-[#10110F]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66704B]">Storage Engine</span>
            <Database className="w-4 h-4 text-[#183D27]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-base text-[#10110F] font-serif">
              {loadingStatus ? 'Checking...' : status?.activeDriver || 'Hostinger Engine Active'}
            </strong>
          </div>
          <p className="text-[10px] text-[#66704B] mt-1">
            Running locally on your Hostinger Node.js server
          </p>
        </div>

        {/* Orders Count */}
        <div className="bg-white p-5 rounded-xs border border-[#10110F]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66704B]">Stored Orders</span>
            <HardDrive className="w-4 h-4 text-[#B88A32]" />
          </div>
          <strong className="text-2xl font-serif font-bold text-[#10110F]">
            {loadingStatus ? '...' : status?.orderCount ?? orders.length}
          </strong>
          <p className="text-[10px] text-[#66704B] mt-1">
            Persisted on Hostinger disk
          </p>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-xs border border-[#10110F]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66704B]">Catalog Products</span>
            <Layers className="w-4 h-4 text-[#183D27]" />
          </div>
          <strong className="text-2xl font-serif font-bold text-[#10110F]">
            {loadingStatus ? '...' : status?.productCount ?? products.length}
          </strong>
          <p className="text-[10px] text-[#66704B] mt-1">
            SKUs &amp; Pricing cached on server
          </p>
        </div>

        {/* Reviews & Content */}
        <div className="bg-white p-5 rounded-xs border border-[#10110F]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66704B]">Reviews &amp; Copy</span>
            <FileJson className="w-4 h-4 text-[#B88A32]" />
          </div>
          <strong className="text-2xl font-serif font-bold text-[#10110F]">
            {loadingStatus ? '...' : status?.reviewCount ?? reviews.length} Reviews
          </strong>
          <p className="text-[10px] text-[#66704B] mt-1">
            Logo &amp; banners synced locally
          </p>
        </div>
      </div>

      {/* Dual Persistence Guarantee Card */}
      <div className="bg-[#F7F3E8] p-6 rounded-xs border border-[#10110F]/15 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#183D27]" />
          <h3 className="font-serif text-lg font-bold text-[#10110F]">
            Dual-Storage &amp; Zero-Break Flow Guarantee
          </h3>
        </div>
        <p className="text-xs text-[#66704B] leading-relaxed">
          Your Titan Shilajit store operates with an active <strong>Dual-Write Pattern</strong>. When a customer places an order via COD or (upi/card/netbankin), the order is simultaneously saved to:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xs bg-white border border-[#10110F]/10 space-y-1">
            <strong className="text-[#183D27] block font-serif text-sm">1. Hostinger Local Database</strong>
            <p className="text-[#66704B] text-[11px]">
              Stored inside your Hostinger server filesystem at <code className="font-mono text-[#10110F]">/data/hostinger_store.json</code>. Works with 0ms internet roundtrip and requires no third-party database bills.
            </p>
          </div>
          <div className="p-3.5 rounded-xs bg-white border border-[#10110F]/10 space-y-1">
            <strong className="text-[#B88A32] block font-serif text-sm">2. Google Cloud Firestore (Backup)</strong>
            <p className="text-[#66704B] text-[11px]">
              Acts as a mirrored cloud backup. If you ever migrate between hosts or rebuild your app, both sources remain 100% in sync without losing a single customer.
            </p>
          </div>
        </div>
      </div>

      {/* Hostinger MySQL Connection Configurator (Optional) */}
      <div className="bg-white p-6 sm:p-7 rounded-xs border border-[#10110F]/15 shadow-xs space-y-4">
        <div className="border-b border-[#10110F]/10 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#10110F] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#B88A32]" />
              <span>Connect Hostinger MySQL / phpMyAdmin (Optional)</span>
            </h3>
            <p className="text-xs text-[#66704B]">
              If you created a MySQL database in Hostinger hPanel and want orders visible in phpMyAdmin, enter your credentials below.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#66704B] bg-[#F7F3E8] px-2.5 py-1 rounded-full border border-[#10110F]/10">
            Advanced
          </span>
        </div>

        <form onSubmit={handleTestMysql} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Database Host (Usually localhost on Hostinger)
              </label>
              <input
                type="text"
                value={mysqlHost}
                onChange={(e) => setMysqlHost(e.target.value)}
                placeholder="localhost or sqlXXX.hostinger.com"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Port
              </label>
              <input
                type="text"
                value={mysqlPort}
                onChange={(e) => setMysqlPort(e.target.value)}
                placeholder="3306"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={mysqlDatabase}
                onChange={(e) => setMysqlDatabase(e.target.value)}
                placeholder="u123456789_titan"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Database Username
              </label>
              <input
                type="text"
                value={mysqlUser}
                onChange={(e) => setMysqlUser(e.target.value)}
                placeholder="u123456789_admin"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Database Password
              </label>
              <input
                type="password"
                value={mysqlPassword}
                onChange={(e) => setMysqlPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27] outline-none"
              />
            </div>
          </div>

          {mysqlTestResult && (
            <div
              className={`p-3 rounded-xs text-xs flex items-center gap-2 ${
                mysqlTestResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-red-50 text-red-800 border border-red-300'
              }`}
            >
              {mysqlTestResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{mysqlTestResult.message}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isTestingMysql}
              className="px-4 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isTestingMysql ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-[#D4B66A]" />}
              <span>{isTestingMysql ? 'Testing Connection...' : 'Test Hostinger MySQL Connection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
