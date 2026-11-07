import React, { useState, useRef } from 'react';
import {
  Home,
  Image as ImageIcon,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  Save,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Upload,
  Eye,
  Search,
  Tag,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  X,
  Layers,
} from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { Product, HomepageProductImageConfig } from '../types';
import { normalizeImageUrl, handleImageError, DEFAULT_PRODUCT_FALLBACK } from '../utils/imageUrl';

interface AdminHomepageProductsSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminHomepageProductsSection: React.FC<AdminHomepageProductsSectionProps> = ({
  onSuccessToast,
}) => {
  const { products, updateHomepageProductImages } = useStoreContent();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'resin' | 'honey-sticks' | 'bundles'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Edit Drawer / Modal form state
  const [coverPic, setCoverPic] = useState('');
  const [trialPic, setTrialPic] = useState('');
  const [popularPic, setPopularPic] = useState('');
  const [customBadge, setCustomBadge] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // File upload input refs
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const trialFileInputRef = useRef<HTMLInputElement | null>(null);
  const popularFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Open editor drawer for product
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    const hp = product.homepageImages || {};
    setCoverPic(hp.coverImage || product.image || product.images?.[0] || '');
    setTrialPic(hp.trialImage || product.packs?.[0]?.image || '');
    setPopularPic(hp.popularImage || product.packs?.[1]?.image || product.packs?.find((pk) => pk.isPopular)?.image || '');
    setCustomBadge(hp.customBadge || '');
    setGalleryImages(Array.isArray(hp.galleryImages) ? [...hp.galleryImages] : []);
    setNewImageUrl('');
    setJustSaved(false);
  };

  // Compress image file to lightweight canvas JPEG data URL
  const compressFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 900;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve((e.target?.result as string) || '');
          }
        };
        img.onerror = () => resolve((e.target?.result as string) || '');
        img.src = (e.target?.result as string) || '';
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Handle file uploads for specific targets
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'trial' | 'popular' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressFile(file);
    if (!dataUrl) return;

    if (target === 'cover') setCoverPic(dataUrl);
    else if (target === 'trial') setTrialPic(dataUrl);
    else if (target === 'popular') setPopularPic(dataUrl);
    else if (target === 'gallery') {
      setGalleryImages((prev) => [...prev, dataUrl]);
    }
    // reset input
    e.target.value = '';
  };

  // Add new image URL to homepage gallery
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setGalleryImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save changes
  const handleSave = async () => {
    if (!editingProduct) return;
    setIsSaving(true);

    const config: HomepageProductImageConfig = {
      coverImage: coverPic.trim(),
      trialImage: trialPic.trim(),
      popularImage: popularPic.trim(),
      galleryImages: galleryImages.filter(Boolean),
      customBadge: customBadge.trim(),
    };

    const ok = await updateHomepageProductImages(editingProduct.id, config);
    setIsSaving(false);

    if (ok) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
      if (onSuccessToast) {
        onSuccessToast(`Homepage pictures for "${editingProduct.name}" saved and live-synced!`);
      }
    }
  };

  // Reset to store product defaults
  const handleResetToStoreDefaults = async () => {
    if (!editingProduct) return;
    if (confirm(`Reset homepage pictures for "${editingProduct.name}" back to the standard Store Product images?`)) {
      setCoverPic(editingProduct.image || editingProduct.images?.[0] || '');
      setTrialPic(editingProduct.packs?.[0]?.image || '');
      setPopularPic(editingProduct.packs?.[1]?.image || editingProduct.packs?.find((pk) => pk.isPopular)?.image || '');
      setCustomBadge('');
      setGalleryImages([]);

      await updateHomepageProductImages(editingProduct.id, {
        coverImage: '',
        trialImage: '',
        popularImage: '',
        galleryImages: [],
        customBadge: '',
      });

      if (onSuccessToast) {
        onSuccessToast(`Reset "${editingProduct.name}" to Store Product default images.`);
      }
    }
  };

  return (
    <div id="admin-homepage-products-manager" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Explanatory Notice */}
      <div className="bg-gradient-to-r from-[#183D27] via-[#10110F] to-[#183D27] text-[#F7F3E8] p-6 sm:p-8 rounded-xs border border-[#B88A32]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#D4B66A] text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Homepage Product Presentation</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F3E8]">
            Homepage Product Pictures Controller
          </h3>
          <p className="text-xs sm:text-sm text-[#EEE8D7]/80 leading-relaxed font-light">
            Configure custom <strong>Cover Pic</strong>, <strong>Trial Pic</strong>, <strong>Popular Picture Value</strong>, and additional <strong>Image URLs</strong> exclusively for the homepage showcase.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#D4B66A]">
            <span className="inline-flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xs border border-[#B88A32]/30 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Description, Pricing (₹) & Stock sync strictly with Store Product catalog</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xs border border-[#B88A32]/30 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live on Homepage Collection</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/#collection-showcase-section"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xs bg-[#B88A32]/20 hover:bg-[#B88A32] text-[#D4B66A] hover:text-[#10110F] border border-[#B88A32]/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span>View on Homepage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Strict Synchronization Guarantee Callout */}
      <div className="p-4 sm:p-5 rounded-xs bg-amber-50 border border-amber-200/80 text-amber-950 flex items-start gap-3.5 shadow-xs">
        <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
            Strict Store Product Synchronization Enforced
          </h4>
          <p className="leading-relaxed text-amber-900/90 font-light">
            The products shown on your homepage are <strong>strictly your store products</strong>. Their prices (₹), MRP discounts, full descriptions, and live inventory stock are permanently synchronized. Any changes you make in the <strong>Store Products</strong> tab or through your Hostinger host database immediately update the homepage. Here, you have complete creative freedom to customize the <strong>Cover Pic</strong>, <strong>Trial Pic</strong>, and <strong>Popular Picture Value</strong> without breaking pricing integrity.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#10110F]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'All Store Products' },
              { id: 'resin', label: 'Pure Resin' },
              { id: 'honey-sticks', label: 'Honey Sticks' },
              { id: 'bundles', label: 'Bundles & Rituals' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xs text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#183D27] text-[#F7F3E8] shadow-xs'
                  : 'bg-[#F7F3E8]/80 text-[#10110F]/70 hover:bg-[#EEE8D7] hover:text-[#10110F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#10110F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search homepage product..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27]"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const hp = product.homepageImages || {};
          const hasCustomCover = Boolean(hp.coverImage);
          const hasCustomTrial = Boolean(hp.trialImage);
          const hasCustomPopular = Boolean(hp.popularImage);
          const galleryCount = Array.isArray(hp.galleryImages) ? hp.galleryImages.length : 0;

          const activeCoverPreview =
            normalizeImageUrl(hp.coverImage) ||
            normalizeImageUrl(product.image) ||
            normalizeImageUrl(product.images?.[0]) ||
            DEFAULT_PRODUCT_FALLBACK;

          return (
            <div
              key={product.id}
              className="bg-white rounded-xs border border-[#10110F]/10 hover:border-[#B88A32]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Product Card Top */}
              <div>
                {/* Preview Box */}
                <div className="relative aspect-4/3 bg-[#F7F3E8] border-b border-[#10110F]/10 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={activeCoverPreview}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, DEFAULT_PRODUCT_FALLBACK)}
                  />

                  {/* Badge & Custom status */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      {product.category === 'resin' ? 'PURE RESIN' : product.category === 'honey-sticks' ? 'HONEY STICK' : 'BUNDLE'}
                    </span>
                    {hp.customBadge && (
                      <span className="px-2 py-0.5 rounded-xs bg-[#B88A32] text-[#10110F] text-[9px] font-black uppercase tracking-wider shadow-xs">
                        {hp.customBadge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {hasCustomCover || hasCustomTrial || hasCustomPopular ? (
                      <span className="px-2 py-0.5 rounded-xs bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>CUSTOM PICTURES</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-xs bg-[#10110F]/70 text-[#EEE8D7] text-[9px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                        STORE DEFAULT
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#10110F] line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#66704B] font-light line-clamp-2 mt-1">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Locked Store Product Attributes */}
                  <div className="p-2.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#66704B] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#183D27]" />
                        <span>STORE PRICE (₹)</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#10110F]">₹{product.price}</span>
                        {product.mrp && <span className="text-[#66704B] line-through text-[11px]">₹{product.mrp}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#66704B] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#183D27]" />
                        <span>STOCK STATUS</span>
                      </span>
                      <span className={`text-[11px] font-bold ${product.inStock ? 'text-emerald-700' : 'text-red-600'}`}>
                        {product.inStock ? `${product.stockQty !== undefined ? product.stockQty : 'In'} Stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Homepage Pictures Status Summary */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className={`p-2 rounded-xs border text-[10px] ${hasCustomCover ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      <span className="block font-sans uppercase tracking-tight">COVER PIC</span>
                      <span className="text-[9px]">{hasCustomCover ? '✓ Custom' : 'Default'}</span>
                    </div>

                    <div className={`p-2 rounded-xs border text-[10px] ${hasCustomTrial ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      <span className="block font-sans uppercase tracking-tight">TRIAL PIC</span>
                      <span className="text-[9px]">{hasCustomTrial ? '✓ Custom' : 'Default'}</span>
                    </div>

                    <div className={`p-2 rounded-xs border text-[10px] ${hasCustomPopular ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      <span className="block font-sans uppercase tracking-tight">POPULAR PIC</span>
                      <span className="text-[9px]">{hasCustomPopular ? '✓ Custom' : 'Default'}</span>
                    </div>
                  </div>

                  {galleryCount > 0 && (
                    <div className="text-[10px] text-[#66704B] font-mono text-center">
                      + {galleryCount} extra homepage image {galleryCount === 1 ? 'URL' : 'URLs'} configured
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(product)}
                  className="w-full py-2.5 px-4 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>CHANGE HOMEPAGE PICTURES</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: HOMEPAGE PRODUCT PICTURES EDITOR */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-xs shadow-2xl border border-[#B88A32]/40 overflow-hidden my-6 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#10110F] text-[#F7F3E8] p-5 border-b border-[#B88A32]/30 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4B66A] bg-[#183D27] px-2 py-0.5 rounded-xs">
                    HOMEPAGE PRODUCT PICTURES
                  </span>
                  <span className="text-xs text-[#EEE8D7]/60 font-mono">
                    ID: {editingProduct.id}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3E8]">
                  {editingProduct.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F3E8] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              {/* Notice of Locked Fields */}
              <div className="p-3.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#183D27] shrink-0" />
                  <span className="text-[#10110F] font-medium">
                    Store Price: <strong>₹{editingProduct.price}</strong> • Stock: <strong>{editingProduct.inStock ? `${editingProduct.stockQty ?? ''} Units` : 'Out of Stock'}</strong>
                  </span>
                </div>
                <span className="text-[10px] text-[#66704B] font-mono hidden sm:inline">
                  Description & Pricing sync automatically from Store Product
                </span>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 1. COVER PIC (cover pic) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-xs border border-[#10110F]/15 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#10110F]/10 pb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#183D27]" />
                      <span>1. Cover Pic (Homepage Primary Display)</span>
                    </span>
                    <span className="text-[11px] text-[#66704B] block font-light">
                      The main showcase photo displayed on the homepage product card.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                    />
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-xs bg-[#183D27]/10 hover:bg-[#183D27] text-[#183D27] hover:text-[#F7F3E8] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Thumbnail Preview */}
                  <div className="sm:col-span-3 aspect-square rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={normalizeImageUrl(coverPic) || DEFAULT_PRODUCT_FALLBACK}
                      alt="Cover pic preview"
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, DEFAULT_PRODUCT_FALLBACK)}
                    />
                  </div>

                  {/* Input & Presets */}
                  <div className="sm:col-span-9 space-y-2">
                    <label className="block text-[11px] font-bold text-[#10110F] uppercase tracking-wider">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={coverPic}
                      onChange={(e) => setCoverPic(e.target.value)}
                      placeholder="Paste cover pic URL (https://... or /uploads/...)"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono focus:border-[#183D27]"
                    />

                    {/* Presets from Store Product Packs */}
                    {editingProduct.packs && editingProduct.packs.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-[#66704B] uppercase font-bold block mb-1">
                          Or select from Store Product packs:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {editingProduct.packs.map((pack) => (
                            <button
                              key={pack.id}
                              type="button"
                              onClick={() => setCoverPic(pack.image)}
                              className="px-2 py-1 rounded-xs bg-[#F7F3E8] hover:bg-[#183D27] text-[#10110F] hover:text-[#F7F3E8] text-[10px] font-bold transition-all border border-[#10110F]/15 cursor-pointer"
                            >
                              {pack.name} ({pack.quantityText})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. TRIAL PIC (tria pic) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-xs border border-[#10110F]/15 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#10110F]/10 pb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#183D27]" />
                      <span>2. Trial Pic (tria pic - Starter / Hover Picture)</span>
                    </span>
                    <span className="text-[11px] text-[#66704B] block font-light">
                      Shown when customer views the trial/starter pack or on secondary hover on the homepage.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={trialFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'trial')}
                    />
                    <button
                      type="button"
                      onClick={() => trialFileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-xs bg-[#183D27]/10 hover:bg-[#183D27] text-[#183D27] hover:text-[#F7F3E8] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Thumbnail Preview */}
                  <div className="sm:col-span-3 aspect-square rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={normalizeImageUrl(trialPic) || DEFAULT_PRODUCT_FALLBACK}
                      alt="Trial pic preview"
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, DEFAULT_PRODUCT_FALLBACK)}
                    />
                  </div>

                  {/* Input */}
                  <div className="sm:col-span-9 space-y-2">
                    <label className="block text-[11px] font-bold text-[#10110F] uppercase tracking-wider">
                      Trial Pic Image URL
                    </label>
                    <input
                      type="text"
                      value={trialPic}
                      onChange={(e) => setTrialPic(e.target.value)}
                      placeholder="Paste trial pic URL (e.g. 20g single jar or starter pack)"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono focus:border-[#183D27]"
                    />
                    {editingProduct.packs?.[0] && (
                      <button
                        type="button"
                        onClick={() => setTrialPic(editingProduct.packs![0].image)}
                        className="text-[10px] text-[#183D27] hover:underline font-bold"
                      >
                        Use Store Trial Pack Image ({editingProduct.packs[0].name})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3. POPULAR PICTURE VALUE (popular picture value) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-xs border border-[#10110F]/15 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#10110F]/10 pb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B88A32]" />
                      <span>3. Popular Picture Value (Most Popular Pack Showcase)</span>
                    </span>
                    <span className="text-[11px] text-[#66704B] block font-light">
                      Picture highlighted for the Most Popular pack or flagship showcase on the homepage.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={popularFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'popular')}
                    />
                    <button
                      type="button"
                      onClick={() => popularFileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-xs bg-[#183D27]/10 hover:bg-[#183D27] text-[#183D27] hover:text-[#F7F3E8] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Thumbnail Preview */}
                  <div className="sm:col-span-3 aspect-square rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={normalizeImageUrl(popularPic) || DEFAULT_PRODUCT_FALLBACK}
                      alt="Popular pic preview"
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, DEFAULT_PRODUCT_FALLBACK)}
                    />
                  </div>

                  {/* Input */}
                  <div className="sm:col-span-9 space-y-2">
                    <label className="block text-[11px] font-bold text-[#10110F] uppercase tracking-wider">
                      Popular Picture URL
                    </label>
                    <input
                      type="text"
                      value={popularPic}
                      onChange={(e) => setPopularPic(e.target.value)}
                      placeholder="Paste popular picture URL (e.g. 2-pack bundle or gold jar)"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono focus:border-[#183D27]"
                    />
                    {editingProduct.packs?.[1] && (
                      <button
                        type="button"
                        onClick={() => setPopularPic(editingProduct.packs![1].image)}
                        className="text-[10px] text-[#183D27] hover:underline font-bold"
                      >
                        Use Store Popular Pack Image ({editingProduct.packs[1].name})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 4. ADD IMAGE URL OPTION (add image url option) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-xs border border-[#10110F]/15 bg-white space-y-4">
                <div className="border-b border-[#10110F]/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#183D27]" />
                    <span>4. Add Image URL Option (Additional Homepage Gallery)</span>
                  </span>
                  <span className="text-[11px] text-[#66704B] block font-light">
                    Add extra image URLs to be available in the homepage product details preview.
                  </span>
                </div>

                {/* Add Input Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    placeholder="https://... or /uploads/... (Paste image URL)"
                    className="flex-1 px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
                      <span>Add Image URL</span>
                    </button>

                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'gallery')}
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="px-3 py-2.5 rounded-xs border border-[#10110F]/20 hover:bg-[#F7F3E8] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      title="Upload from device"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Gallery List */}
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group/thumb aspect-square rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 overflow-hidden flex items-center justify-center p-1.5"
                      >
                        <img
                          src={normalizeImageUrl(imgUrl)}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => handleImageError(e, DEFAULT_PRODUCT_FALLBACK)}
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-xs bg-black/70 text-white text-[9px] font-mono">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all opacity-0 group-hover/thumb:opacity-100 cursor-pointer shadow-md"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-[#66704B] font-light border border-dashed border-[#10110F]/15 rounded-xs">
                    No additional homepage gallery images added yet. Paste a URL above and tap "Add Image URL".
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 5. HOMEPAGE BADGE TAG (Optional) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 rounded-xs border border-[#10110F]/15 bg-white space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F]">
                  Homepage Badge Tag (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: '', label: 'None (Store Default)' },
                    { id: 'hot_sell', label: '🔥 HOT SELLING' },
                    { id: 'bestseller', label: '⭐ BESTSELLER' },
                    { id: 'new_launch', label: '✨ NEW LAUNCH' },
                    { id: 'trending', label: '⚡ TRENDING' },
                  ].map((badge) => (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => setCustomBadge(badge.id)}
                      className={`px-3 py-1.5 rounded-xs text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        customBadge === badge.id
                          ? 'bg-[#183D27] text-[#D4B66A] border border-[#D4B66A]'
                          : 'bg-[#F7F3E8] text-[#10110F] border border-[#10110F]/10 hover:bg-[#EEE8D7]'
                      }`}
                    >
                      {badge.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-[#F7F3E8] p-4 sm:p-5 border-t border-[#10110F]/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleResetToStoreDefaults}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xs border border-[#10110F]/20 hover:bg-white text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#66704B]" />
                <span>Reset to Store Defaults</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xs border border-transparent hover:bg-black/5 text-[#10110F] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {justSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#183D27]" />
                      <span>SAVED & SYNCED!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'SAVING...' : 'SAVE HOMEPAGE PICTURES'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
