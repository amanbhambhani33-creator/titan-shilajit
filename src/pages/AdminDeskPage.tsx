import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Layers,
  Image as ImageIcon,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  Play,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Tag,
  DollarSign,
  Lock,
  Mail,
  LogOut,
  CloudCheck,
  Cloud,
  Sparkles,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { useStoreContent, HeroBannerConfig, LaunchBannerConfig, BrandStoryConfig } from '../context/StoreContentContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

export const AdminDeskPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();

  const {
    products,
    content,
    isFirebaseSynced,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    updateHeroBanner,
    updateLaunchBanner,
    updateAnnouncementBar,
    updateBrandStory,
    updateTrustStripItem,
    updatePageContent,
    saveAllToFirebase,
    resetAllContent,
    triggerSplash,
  } = useStoreContent();

  const [activeTab, setActiveTab] = useState<'products' | 'banners' | 'developer' | 'settings'>('products');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Authentication Form State
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Edit Product Modal / Drawer State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Product Template
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'resin',
    tagline: '',
    price: 1499,
    mrp: 1999,
    discount: '25% OFF',
    size: '20g Jar',
    servings: '40–50 Servings',
    rating: 5.0,
    reviewCount: 1,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
    ],
    shortDescription: '',
    description: '',
    origin: 'Himalayan Ranges (16,000+ ft)',
    elevation: '16,000+ ft',
    fulvicAcidContent: '> 75% Lab Verified Fulvic Acid',
    ingredients: ['100% Pure Himalayan Shilajit Resin'],
    benefits: [
      { title: 'Cellular Energy', description: 'Supports daily ATP and metabolic vitality.' },
    ],
    usage: [
      { step: 'Step 1: Measure', instruction: 'Take 300–500mg pea-sized portion in warm water.' },
    ],
    qualityNotes: ['Lab tested for heavy metals', '100% Pure'],
  });

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3500);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthSubmitting(true);

    try {
      if (authMode === 'signin') {
        if (!emailInput.trim() || !passwordInput) {
          throw new Error('Please enter both your email address and password.');
        }
        await signIn(emailInput.trim(), passwordInput);
        showToast(`Welcome back, ${emailInput.trim()}`);
      } else if (authMode === 'signup') {
        if (!emailInput.trim() || !passwordInput) {
          throw new Error('Please fill in all email and password fields.');
        }
        if (passwordInput !== confirmPasswordInput) {
          throw new Error('Passwords do not match. Please re-enter.');
        }
        if (passwordInput.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await signUp(emailInput.trim(), passwordInput);
        showToast('Admin account created successfully.');
      } else if (authMode === 'forgot') {
        if (!emailInput.trim()) {
          throw new Error('Please enter your admin email address.');
        }
        await resetPassword(emailInput.trim());
        setAuthSuccess('Password reset link dispatched to your email.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const fillDefaultAdminCredentials = () => {
    setEmailInput('admin@titanshilajit.com');
    setPasswordInput('TitanAdmin2026!');
    setAuthError(null);
  };

  const handleCloudSync = async () => {
    setIsCloudSyncing(true);
    const success = await saveAllToFirebase();
    setIsCloudSyncing(false);
    if (success) {
      showToast('All changes & catalog successfully synced to Firestore!');
    } else {
      showToast('Saved locally. (Cloud sync available with active Firebase connection)');
    }
  };

  // Handle saving product edits
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    showToast('Product updated successfully!');
  };

  // Handle adding new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      alert('Please fill out product name and price.');
      return;
    }

    const generatedSlug = (newProductForm.slug || newProductForm.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productToAdd: Product = {
      id: `titan-custom-${Date.now()}`,
      name: newProductForm.name || 'Titan Shilajit Product',
      slug: generatedSlug,
      category: (newProductForm.category as any) || 'resin',
      tagline: newProductForm.tagline || 'Pure Power of the Himalayas',
      price: Number(newProductForm.price) || 1499,
      mrp: Number(newProductForm.mrp) || 1999,
      discount: newProductForm.discount || '25% OFF',
      size: newProductForm.size || 'Standard Size',
      servings: newProductForm.servings || '30 Servings',
      rating: Number(newProductForm.rating) || 5.0,
      reviewCount: Number(newProductForm.reviewCount) || 1,
      inStock: newProductForm.inStock !== false,
      images: newProductForm.images?.length ? newProductForm.images : [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85'
      ],
      shortDescription: newProductForm.shortDescription || 'Pure Himalayan Shilajit formulation.',
      description: newProductForm.description || 'Harvested from extreme Himalayan altitudes and purified using traditional Ayurvedic methods.',
      origin: newProductForm.origin || 'Himalayan Range (16,000+ ft)',
      elevation: newProductForm.elevation || '16,000+ ft',
      fulvicAcidContent: newProductForm.fulvicAcidContent || '> 75% Fulvic Acid',
      ingredients: newProductForm.ingredients || ['100% Pure Shilajit Exudate'],
      benefits: newProductForm.benefits || [
        { title: 'Vitality Support', description: 'Supports daily physical stamina and focus.' }
      ],
      usage: newProductForm.usage || [
        { step: 'Morning Ritual', instruction: 'Dissolve in lukewarm water and consume daily.' }
      ],
      qualityNotes: newProductForm.qualityNotes || ['NABL Lab Tested', 'Pure Origin'],
      safetyNotes: newProductForm.safetyNotes || 'Store in a cool, dry place. Keep away from direct sunlight.',
    };

    addProduct(productToAdd);
    setIsAddingNew(false);
    showToast('New product added to catalog!');
  };

  // IF NOT AUTHENTICATED: SHOW ELEGANT FIREBASE AUTH LOGIN CARD
  if (!isAdmin && !authLoading) {
    return (
      <div id="admin-login-screen" className="min-h-screen pt-28 pb-20 bg-[#10110F] text-[#F7F3E8] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#183D27]/30 border border-[#B88A32]/40 rounded-sm p-8 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B88A32]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#183D27]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-12 h-12 mx-auto bg-[#183D27] border border-[#B88A32] rounded-xs flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-6 h-6 text-[#D4B66A]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4B66A] font-bold block mb-1">
              FIREBASE AUTHENTICATED PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F3E8] tracking-tight">
              TITAN ADMIN DESK
            </h1>
            <p className="text-xs text-[#EEE8D7]/70 font-sans mt-1">
              Secure merchant access for product catalogs, launch banners, and page copy.
            </p>
          </div>

          {/* Auth Mode Toggle Tabs */}
          <div className="flex border-b border-[#B88A32]/20 mb-6 relative z-10">
            <button
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                authMode === 'signin'
                  ? 'border-[#D4B66A] text-[#D4B66A]'
                  : 'border-transparent text-[#EEE8D7]/50 hover:text-[#EEE8D7]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                authMode === 'signup'
                  ? 'border-[#D4B66A] text-[#D4B66A]'
                  : 'border-transparent text-[#EEE8D7]/50 hover:text-[#EEE8D7]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xs bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-5 p-3.5 rounded-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@titanshilajit.com"
                className="w-full px-4 py-3 rounded-xs bg-[#10110F] border border-[#B88A32]/30 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none transition-colors"
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4B66A]" />
                    <span>Password</span>
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[10px] text-[#D4B66A] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xs bg-[#10110F] border border-[#B88A32]/30 text-[#F7F3E8] text-xs pr-10 focus:border-[#D4B66A] focus:outline-none transition-colors"
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
            )}

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]/90 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xs bg-[#10110F] border border-[#B88A32]/30 text-[#F7F3E8] text-xs focus:border-[#D4B66A] focus:outline-none transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthSubmitting}
              className="w-full py-3.5 mt-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {isAuthSubmitting ? (
                <span>Authenticating with Firebase...</span>
              ) : authMode === 'signin' ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Enter Titan Admin Desk</span>
                </>
              ) : authMode === 'signup' ? (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Admin Credentials</span>
                </>
              ) : (
                <span>Send Password Reset Link</span>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-[#B88A32]/20 text-center relative z-10">
            <button
              onClick={fillDefaultAdminCredentials}
              className="text-[11px] text-[#D4B66A] hover:text-[#FFFFFF] underline font-medium"
            >
              Autofill Default Admin Credentials
            </button>
            <div className="text-[10px] text-[#EEE8D7]/50 mt-1">
              (or create your own custom email/password above)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-desk-page" className="min-h-screen pt-24 pb-20 bg-[#F7F3E8] text-[#10110F]">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#183D27] text-[#F7F3E8] px-5 py-3 rounded-sm shadow-2xl border border-[#B88A32] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#D4B66A]" />
          <span className="text-xs font-bold font-sans tracking-wide">{successMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header with Firebase Auth & Cloud Sync status */}
        <div className="bg-[#10110F] text-[#F7F3E8] rounded-sm p-6 sm:p-8 border border-[#B88A32]/30 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[10px] font-bold tracking-widest uppercase border border-[#B88A32]/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>FIREBASE SECURE ADMIN DESK</span>
              </span>
              {isFirebaseSynced ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Firestore Synced</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-500/30">
                  Local Ready
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#F7F3E8]">
              TITAN STORE MANAGER
            </h1>
            <p className="text-xs text-[#EEE8D7]/75 font-sans mt-1">
              Logged in as <strong className="text-[#D4B66A]">{user?.email || 'admin@titanshilajit.com'}</strong> • Live catalog, launch banners, and copy control.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCloudSync}
              disabled={isCloudSyncing}
              className="px-4 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{isCloudSyncing ? 'Syncing...' : 'Sync to Cloud'}</span>
            </button>

            <button
              onClick={() => {
                triggerSplash();
                showToast('Triggered opening green screen bottle drop intro!');
              }}
              className="px-4 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#1f4e32] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-[#B88A32]/30 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Preview Intro Screen</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xs bg-white/10 hover:bg-white/20 text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                signOut();
                showToast('Signed out of admin desk.');
              }}
              className="px-3 py-2.5 rounded-xs bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-[#10110F]/10 pb-4 mb-8">
          {[
            { id: 'products', label: 'Product Inventory & Pricing', icon: Package },
            { id: 'banners', label: 'Banners & New Launch Banner', icon: ImageIcon },
            { id: 'developer', label: 'Developer Option: Page Text Editor', icon: FileText },
            { id: 'settings', label: 'Store Defaults & Backup', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-xs text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#183D27] text-[#F7F3E8] shadow-md border-b-2 border-[#B88A32]'
                    : 'bg-white/80 text-[#10110F] hover:bg-[#10110F] hover:text-[#F7F3E8] border border-[#10110F]/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4B66A]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCT INVENTORY & PRICING */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xs border border-[#10110F]/10 shadow-xs">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#10110F]">
                  Product Catalog ({products.length} Products)
                </h2>
                <p className="text-xs text-[#66704B]">
                  Change product images, prices, descriptions, or add new catalog items.
                </p>
              </div>

              <button
                onClick={() => setIsAddingNew(true)}
                className="px-5 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 text-[#D4B66A]" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Product List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xs border border-[#10110F]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image Preview */}
                    <div className="relative aspect-video w-full bg-[#10110F] overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-[9px] font-bold uppercase tracking-wider border border-[#B88A32]/30">
                        {p.category}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-xs bg-white text-[#10110F] text-[10px] font-bold">
                        {p.discount}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#66704B] font-semibold">
                          {p.size} • {p.servings}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-[#10110F] line-clamp-1">
                        {p.name}
                      </h3>

                      <p className="text-xs text-[#66704B] line-clamp-2">
                        {p.shortDescription || p.tagline}
                      </p>

                      <div className="flex items-baseline gap-2 pt-2 border-t border-[#10110F]/10">
                        <span className="font-serif text-xl font-bold text-[#183D27]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs line-through text-[#10110F]/40 font-sans">
                          ₹{p.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-[#F7F3E8]/60 border-t border-[#10110F]/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingProduct({ ...p })}
                      className="flex-1 px-3 py-2 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                          deleteProduct(p.id);
                          showToast('Product deleted.');
                        }
                      }}
                      className="p-2 rounded-xs border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BANNERS & NEW LAUNCH BANNER */}
        {/* ========================================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-8">
            {/* Top Announcement Bar Editor */}
            <div className="bg-white p-6 rounded-xs border border-[#10110F]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#10110F]">
                    Top Announcement Strip
                  </h3>
                  <p className="text-xs text-[#66704B]">
                    Top banner appearing across all pages of the website.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.announcement.enabled}
                    onChange={(e) => updateAnnouncementBar({ enabled: e.target.checked })}
                    className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
                  />
                  <span className="text-xs font-bold text-[#10110F]">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Banner Message
                  </label>
                  <input
                    type="text"
                    value={content.announcement.text}
                    onChange={(e) => updateAnnouncementBar({ text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Button / Link Text
                  </label>
                  <input
                    type="text"
                    value={content.announcement.linkText}
                    onChange={(e) => updateAnnouncementBar({ linkText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* NEW LAUNCH PRODUCT BANNER (Requested by User) */}
            <div className="bg-white p-6 sm:p-8 rounded-xs border-2 border-[#B88A32]/40 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#10110F]/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#B88A32]/20 text-[#B88A32] text-[10px] font-bold uppercase tracking-widest mb-1">
                    FRONT PAGE HIGHLIGHT
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                    New Launch Product Banner
                  </h3>
                  <p className="text-xs text-[#66704B]">
                    Dedicated front-page banner to showcase new product launches, special editions, and limited batches.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#F7F3E8] px-3.5 py-2 rounded-xs border border-[#10110F]/10">
                    <input
                      type="checkbox"
                      checked={content.launchBanner.enabled}
                      onChange={(e) => updateLaunchBanner({ enabled: e.target.checked })}
                      className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
                    />
                    <span className="text-xs font-bold text-[#10110F]">Show on Front Page</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={content.launchBanner.badge}
                      onChange={(e) => updateLaunchBanner({ badge: e.target.value })}
                      placeholder="e.g. NEW LAUNCH 2026"
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Offer Tag
                    </label>
                    <input
                      type="text"
                      value={content.launchBanner.offerTag}
                      onChange={(e) => updateLaunchBanner({ offerTag: e.target.value })}
                      placeholder="e.g. EXCLUSIVE INTRODUCTORY LAUNCH OFFER • 25% OFF"
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Launch Product Title
                    </label>
                    <input
                      type="text"
                      value={content.launchBanner.title}
                      onChange={(e) => updateLaunchBanner({ title: e.target.value })}
                      placeholder="e.g. Titan Shilajit Gold Resin Edition"
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={content.launchBanner.subtitle}
                      onChange={(e) => updateLaunchBanner({ subtitle: e.target.value })}
                      placeholder="e.g. Infused with 24K Edible Gold Bhasma"
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Full Description
                    </label>
                    <textarea
                      rows={3}
                      value={content.launchBanner.description}
                      onChange={(e) => updateLaunchBanner({ description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      New Launch Image URL
                    </label>
                    <input
                      type="text"
                      value={content.launchBanner.imageUrl}
                      onChange={(e) => updateLaunchBanner({ imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                    {content.launchBanner.imageUrl && (
                      <div className="mt-2 aspect-video w-full max-w-[240px] rounded-xs overflow-hidden border border-[#10110F]/10">
                        <img
                          src={content.launchBanner.imageUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Launch Price
                      </label>
                      <input
                        type="text"
                        value={content.launchBanner.priceText}
                        onChange={(e) => updateLaunchBanner({ priceText: e.target.value })}
                        placeholder="₹2,499"
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Original MRP
                      </label>
                      <input
                        type="text"
                        value={content.launchBanner.mrpText}
                        onChange={(e) => updateLaunchBanner({ mrpText: e.target.value })}
                        placeholder="₹3,299"
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={content.launchBanner.buttonText}
                      onChange={(e) => updateLaunchBanner({ buttonText: e.target.value })}
                      placeholder="Order New Launch on WhatsApp"
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
                <button
                  onClick={() => showToast('New Launch Banner updated successfully!')}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#10110F] transition-colors"
                >
                  <Save className="w-4 h-4 text-[#D4B66A]" />
                  <span>Save Launch Banner</span>
                </button>
              </div>
            </div>

            {/* HERO BANNER & FRONT PAGE HERO IMAGE */}
            <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
              <div className="border-b border-[#10110F]/10 pb-4">
                <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                  Front Page Hero Section Banner
                </h3>
                <p className="text-xs text-[#66704B]">
                  Change the main background image, hero titles, description, and product showcase image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Hero Kicker Tagline
                    </label>
                    <input
                      type="text"
                      value={content.hero.kicker}
                      onChange={(e) => updateHeroBanner({ kicker: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Line 1
                      </label>
                      <input
                        type="text"
                        value={content.hero.headlineLine1}
                        onChange={(e) => updateHeroBanner({ headlineLine1: e.target.value })}
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Line 2
                      </label>
                      <input
                        type="text"
                        value={content.hero.headlineLine2}
                        onChange={(e) => updateHeroBanner({ headlineLine2: e.target.value })}
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Line 3 (Gold)
                      </label>
                      <input
                        type="text"
                        value={content.hero.headlineLine3}
                        onChange={(e) => updateHeroBanner({ headlineLine3: e.target.value })}
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.description}
                      onChange={(e) => updateHeroBanner({ description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Hero Background Image URL
                    </label>
                    <input
                      type="text"
                      value={content.hero.bgImageUrl}
                      onChange={(e) => updateHeroBanner({ bgImageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Hero Product Card Image URL
                    </label>
                    <input
                      type="text"
                      value={content.hero.productCardImageUrl}
                      onChange={(e) => updateHeroBanner({ productCardImageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Purity Highlight
                      </label>
                      <input
                        type="text"
                        value={content.hero.purityPercent}
                        onChange={(e) => updateHeroBanner({ purityPercent: e.target.value })}
                        placeholder="98.2% Purity"
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Grade Badge
                      </label>
                      <input
                        type="text"
                        value={content.hero.gradeBadge}
                        onChange={(e) => updateHeroBanner({ gradeBadge: e.target.value })}
                        placeholder="GRADE-A RESIN"
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
                <button
                  onClick={() => showToast('Hero banner settings saved!')}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#10110F] transition-colors"
                >
                  <Save className="w-4 h-4 text-[#D4B66A]" />
                  <span>Save Hero Banner</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DEVELOPER OPTION - PAGE TEXT EDITOR */}
        {/* ========================================================================= */}
        {activeTab === 'developer' && (
          <div className="space-y-8">
            {/* Brand Story Section Texts */}
            <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
              <div className="border-b border-[#10110F]/10 pb-4">
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  DEVELOPER OPTION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                  Brand Story & Philosophy Text Editor
                </h3>
                <p className="text-xs text-[#66704B]">
                  Modify the story title, quote, paragraphs, and high-altitude sourcing image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Kicker
                    </label>
                    <input
                      type="text"
                      value={content.brandStory.kicker}
                      onChange={(e) => updateBrandStory({ kicker: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Main Story Title
                    </label>
                    <input
                      type="text"
                      value={content.brandStory.title}
                      onChange={(e) => updateBrandStory({ title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Featured Quote
                    </label>
                    <textarea
                      rows={2}
                      value={content.brandStory.quote}
                      onChange={(e) => updateBrandStory({ quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm italic"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Story Paragraph 1
                    </label>
                    <textarea
                      rows={2}
                      value={content.brandStory.paragraph1}
                      onChange={(e) => updateBrandStory({ paragraph1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Story Paragraph 2
                    </label>
                    <textarea
                      rows={2}
                      value={content.brandStory.paragraph2}
                      onChange={(e) => updateBrandStory({ paragraph2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Story Image URL
                    </label>
                    <input
                      type="text"
                      value={content.brandStory.imageUrl}
                      onChange={(e) => updateBrandStory({ imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
                <button
                  onClick={() => showToast('Brand Story texts updated successfully!')}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#10110F] transition-colors"
                >
                  <Save className="w-4 h-4 text-[#D4B66A]" />
                  <span>Save Story Texts</span>
                </button>
              </div>
            </div>

            {/* Trust Strip Text Customizer */}
            <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
              <div className="border-b border-[#10110F]/10 pb-4">
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  DEVELOPER OPTION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                  Trust Strip 4-Pillars Text Editor
                </h3>
                <p className="text-xs text-[#66704B]">
                  Update the 4 horizontal trust proofs displayed directly beneath the Hero.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.trustStrip.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xs bg-[#F7F3E8]/80 border border-[#10110F]/10 space-y-2">
                    <span className="text-[10px] font-mono text-[#183D27] font-bold">PILLAR 0{idx + 1}</span>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTrustStripItem(idx, e.target.value, item.subtitle)}
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                        Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={item.subtitle}
                        onChange={(e) => updateTrustStripItem(idx, item.title, e.target.value)}
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
                <button
                  onClick={() => showToast('Trust strip updated!')}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#10110F] transition-colors"
                >
                  <Save className="w-4 h-4 text-[#D4B66A]" />
                  <span>Save Trust Strip</span>
                </button>
              </div>
            </div>

            {/* Footer Text & Attribution Editor */}
            <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
              <div className="border-b border-[#10110F]/10 pb-4">
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  DEVELOPER OPTION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                  Footer & Attribution Settings
                </h3>
                <p className="text-xs text-[#66704B]">
                  Manage footer description, designer credit, location, and phone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Designer Credit Attribution
                    </label>
                    <input
                      type="text"
                      value={content.footer.creditText}
                      onChange={(e) =>
                        updatePageContent('footer', { creditText: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-bold text-[#183D27]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Footer Brand Summary
                    </label>
                    <textarea
                      rows={3}
                      value={content.footer.aboutText}
                      onChange={(e) =>
                        updatePageContent('footer', { aboutText: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Operating Location
                    </label>
                    <input
                      type="text"
                      value={content.footer.location}
                      onChange={(e) =>
                        updatePageContent('footer', { location: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Concierge WhatsApp Display
                    </label>
                    <input
                      type="text"
                      value={content.footer.phoneDisplay}
                      onChange={(e) =>
                        updatePageContent('footer', { phoneDisplay: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
                <button
                  onClick={() => showToast('Footer content saved!')}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#10110F] transition-colors"
                >
                  <Save className="w-4 h-4 text-[#D4B66A]" />
                  <span>Save Footer Texts</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SETTINGS, BACKUP & FACTORY RESTORE */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
              <div className="border-b border-[#10110F]/10 pb-4">
                <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                  Data Backup & Factory Restore
                </h3>
                <p className="text-xs text-[#66704B]">
                  Reset custom products or restore all pages to official brand defaults.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 space-y-3">
                  <h4 className="font-serif font-bold text-base text-[#10110F]">
                    Reset Products to Original
                  </h4>
                  <p className="text-xs text-[#66704B]">
                    Reverts all prices, images, and items to the standard 6 Titan Himalayan catalog products.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Revert all products to default catalog?')) {
                        resetProductsToDefault();
                        showToast('Products reset to defaults.');
                      }
                    }}
                    className="px-4 py-2 rounded-xs border border-amber-800/40 text-amber-900 hover:bg-amber-100 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Reset Products
                  </button>
                </div>

                <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 space-y-3">
                  <h4 className="font-serif font-bold text-base text-[#10110F]">
                    Reset All Page Texts & Banners
                  </h4>
                  <p className="text-xs text-[#66704B]">
                    Reverts all banner images, hero texts, brand story, and trust strips to factory defaults.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Revert all texts and banners to defaults?')) {
                        resetAllContent();
                        showToast('All page content restored to factory defaults.');
                      }
                    }}
                    className="px-4 py-2 rounded-xs border border-amber-800/40 text-amber-900 hover:bg-amber-100 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Reset All Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-[#B88A32]/40 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#10110F] text-[#F7F3E8] p-5 border-b border-[#B88A32]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4B66A] uppercase tracking-widest block">
                  EDIT PRODUCT
                </span>
                <h3 className="font-serif text-lg font-bold">{editingProduct.name}</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full hover:bg-white/10 text-[#EEE8D7]"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProductEdit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                  >
                    <option value="resin">Pure Resin</option>
                    <option value="honey-sticks">Honey Sticks</option>
                    <option value="bundles">Bundles & Ritual Boxes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Discount Tag
                  </label>
                  <input
                    type="text"
                    value={editingProduct.discount}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, discount: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Primary Image URL
                </label>
                <input
                  type="text"
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => {
                    const newImgs = [...editingProduct.images];
                    newImgs[0] = e.target.value;
                    setEditingProduct({ ...editingProduct, images: newImgs });
                  }}
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Size / Quantity
                  </label>
                  <input
                    type="text"
                    value={editingProduct.size}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, size: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Servings
                  </label>
                  <input
                    type="text"
                    value={editingProduct.servings}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, servings: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={editingProduct.tagline}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                    }
                    className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
                  />
                  <span className="text-xs font-bold text-[#10110F]">In Stock</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ========================================================================= */}
      {isAddingNew && (
        <div
          className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAddingNew(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-[#B88A32]/40 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#183D27] text-[#F7F3E8] p-5 border-b border-[#B88A32]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4B66A] uppercase tracking-widest block">
                  NEW INVENTORY ITEM
                </span>
                <h3 className="font-serif text-lg font-bold">Add New Titan Product</h3>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1 rounded-full hover:bg-white/10 text-[#EEE8D7]"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={newProductForm.name}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, name: e.target.value })
                    }
                    placeholder="e.g. Titan Gold Shilajit Resin (30g)"
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Category
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                  >
                    <option value="resin">Pure Resin</option>
                    <option value="honey-sticks">Honey Sticks</option>
                    <option value="bundles">Bundles & Ritual Boxes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newProductForm.price}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={newProductForm.mrp}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, mrp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Discount
                  </label>
                  <input
                    type="text"
                    value={newProductForm.discount}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, discount: e.target.value })
                    }
                    placeholder="25% OFF"
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Product Image URL *
                </label>
                <input
                  type="text"
                  value={newProductForm.images?.[0] || ''}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, images: [e.target.value] })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Size / Package
                  </label>
                  <input
                    type="text"
                    value={newProductForm.size}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, size: e.target.value })
                    }
                    placeholder="e.g. 20g Glass Jar"
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                    Servings Count
                  </label>
                  <input
                    type="text"
                    value={newProductForm.servings}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, servings: e.target.value })
                    }
                    placeholder="e.g. 40–50 Servings"
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newProductForm.tagline}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, tagline: e.target.value })
                  }
                  placeholder="100% Raw Grade-A Himalayan Shilajit"
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newProductForm.shortDescription}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, shortDescription: e.target.value })
                  }
                  placeholder="Brief 1-2 sentence overview for catalog cards..."
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                  Full Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, description: e.target.value })
                  }
                  placeholder="Detailed description for the product page..."
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#10110F]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
