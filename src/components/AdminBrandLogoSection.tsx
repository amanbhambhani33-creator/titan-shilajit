import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Check,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Eye,
  Sliders,
  Type,
  ShieldCheck,
} from 'lucide-react';
import { useStoreContent, DEFAULT_BRAND_LOGO } from '../context/StoreContentContext';
import { BrandLogoConfig } from '../types';

interface AdminBrandLogoSectionProps {
  onToast: (msg: string) => void;
}

const ATTACHMENT_LOGO_PATH = '/assets/aistudio/image_29351190.png';
const CLEAN_CROPPED_LOGO_PATH = '/assets/aistudio/titan_logo_clean.png';

export const AdminBrandLogoSection: React.FC<AdminBrandLogoSectionProps> = ({ onToast }) => {
  const { content, updateBrandLogo } = useStoreContent();
  const currentLogo = content.logo || DEFAULT_BRAND_LOGO;

  const [imageUrl, setImageUrl] = useState<string>(currentLogo.imageUrl || ATTACHMENT_LOGO_PATH);
  const [useCustomImage, setUseCustomImage] = useState<boolean>(currentLogo.useCustomImage ?? true);
  const [heightPx, setHeightPx] = useState<number>(currentLogo.heightPx || 44);
  const [symbolText, setSymbolText] = useState<string>(currentLogo.symbolText || 'T');
  const [titlePrefix, setTitlePrefix] = useState<string>(currentLogo.titlePrefix || 'TITAN ');
  const [titleSuffix, setTitleSuffix] = useState<string>(currentLogo.titleSuffix || 'SHILAJIT');
  const [tagline, setTagline] = useState<string>(currentLogo.tagline || 'Himalayan Apothecary');

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync local form state when content changes externally
  useEffect(() => {
    if (content.logo) {
      setImageUrl(content.logo.imageUrl || ATTACHMENT_LOGO_PATH);
      setUseCustomImage(content.logo.useCustomImage ?? true);
      setHeightPx(content.logo.heightPx || 44);
      setSymbolText(content.logo.symbolText || 'T');
      setTitlePrefix(content.logo.titlePrefix || 'TITAN ');
      setTitleSuffix(content.logo.titleSuffix || 'SHILAJIT');
      setTagline(content.logo.tagline || 'Himalayan Apothecary');
    }
  }, [content.logo]);

  // Handle local file selection and upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64Data = uploadEvent.target?.result as string;
        if (!base64Data) {
          setIsUploading(false);
          return;
        }

        try {
          // Upload to persistent server storage
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dataUrl: base64Data,
              filename: file.name,
              prefix: 'brand-logo',
            }),
          });

          const data = await response.json();
          if (data.success && data.url) {
            setImageUrl(data.url);
            setUseCustomImage(true);
            onToast('New logo uploaded and saved to server storage!');
          } else {
            // Fallback to base64 if server endpoint has issues
            setImageUrl(base64Data);
            setUseCustomImage(true);
            onToast('New logo applied to preview!');
          }
        } catch {
          setImageUrl(base64Data);
          setUseCustomImage(true);
          onToast('New logo applied to preview!');
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to read image file');
      setIsUploading(false);
    }
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http') || text.startsWith('/') || text.startsWith('data:image'))) {
        setImageUrl(text.trim());
        setUseCustomImage(true);
        onToast('Logo URL pasted from clipboard!');
      } else {
        onToast('Clipboard does not contain a valid image URL');
      }
    } catch {
      onToast('Please paste the logo URL directly into the input');
    }
  };

  // Save changes
  const handleSaveLogo = () => {
    const updates: Partial<BrandLogoConfig> = {
      imageUrl: imageUrl.trim(),
      useCustomImage,
      heightPx: Number(heightPx) || 44,
      symbolText: symbolText.trim() || 'T',
      titlePrefix: titlePrefix || 'TITAN ',
      titleSuffix: titleSuffix || 'SHILAJIT',
      tagline: tagline.trim() || 'Himalayan Apothecary',
    };

    updateBrandLogo(updates);
    onToast('Brand logo & identity updated across Header and Footer!');
  };

  // Reset to default attachment
  const handleResetToAttachment = () => {
    setImageUrl(ATTACHMENT_LOGO_PATH);
    setUseCustomImage(true);
    setHeightPx(44);
    setSymbolText('T');
    setTitlePrefix('TITAN ');
    setTitleSuffix('SHILAJIT');
    setTagline('Himalayan Apothecary');

    updateBrandLogo({
      imageUrl: ATTACHMENT_LOGO_PATH,
      useCustomImage: true,
      heightPx: 44,
      symbolText: 'T',
      titlePrefix: 'TITAN ',
      titleSuffix: 'SHILAJIT',
      tagline: 'Himalayan Apothecary',
    });
    onToast('Restored to official attachment logo!');
  };

  // Use clean cropped version
  const handleSelectCleanCropped = () => {
    setImageUrl(CLEAN_CROPPED_LOGO_PATH);
    setUseCustomImage(true);
    setHeightPx(44);
    updateBrandLogo({
      imageUrl: CLEAN_CROPPED_LOGO_PATH,
      useCustomImage: true,
      heightPx: 44,
    });
    onToast('Switched to clean cropped logo badge!');
  };

  return (
    <div id="admin-brand-logo-section" className="bg-white p-6 sm:p-8 rounded-xs border-2 border-[#B88A32]/40 shadow-sm space-y-6">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#10110F]/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[10px] font-bold uppercase tracking-widest mb-1.5 border border-[#B88A32]/30">
            <Sparkles className="w-3 h-3 text-[#D4B66A]" />
            <span>BRAND VISUAL IDENTITY</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#10110F] flex items-center gap-2">
            <span>Storefront Brand Logo</span>
          </h3>
          <p className="text-xs text-[#66704B]">
            Configure the logo image that appears in the top navigation header and footer across your website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveLogo}
            className="px-5 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#D4B66A]" />
            <span>Save Logo</span>
          </button>
        </div>
      </div>

      {/* Live Dual Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#183D27]" />
            <span>Live Logo Appearance Preview</span>
          </label>
          <span className="text-[10px] text-[#66704B] font-semibold">
            Height: {heightPx}px • Mode: {useCustomImage ? 'Custom Image' : 'Vector Typography'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Header Preview */}
          <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#10110F]/60 mb-2 block">
              Light Background (Storefront Header)
            </span>
            <div className="flex items-center py-2">
              {useCustomImage && imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Logo Preview"
                  style={{ height: `${heightPx}px` }}
                  className="w-auto max-w-[280px] object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if broken link
                    (e.target as HTMLImageElement).src = ATTACHMENT_LOGO_PATH;
                  }}
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#183D27] border border-[#B88A32]/40 flex items-center justify-center rounded-sm">
                    <span className="text-[#D4B66A] font-serif text-lg font-bold">{symbolText || 'T'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold tracking-tight uppercase leading-none">
                      <span className="text-[#10110F]">{titlePrefix || 'TITAN '}</span>
                      <span className="text-[#B88A32]">{titleSuffix || 'SHILAJIT'}</span>
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#183D27] font-semibold mt-0.5 opacity-80">
                      {tagline || 'Himalayan Apothecary'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dark Footer Preview */}
          <div className="p-4 rounded-xs bg-[#10110F] text-[#F7F3E8] border border-white/10 flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#EEE8D7]/60 mb-2 block">
              Dark Background (Footer &amp; Admin Header)
            </span>
            <div className="flex items-center py-2">
              {useCustomImage && imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Logo Preview"
                  style={{ height: `${heightPx}px` }}
                  className="w-auto max-w-[280px] object-contain brightness-110"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-sm bg-[#183D27] text-[#B88A32] border border-[#B88A32]/40 flex items-center justify-center font-serif font-bold text-lg">
                    {symbolText || 'T'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif tracking-tight font-bold text-lg text-[#F7F3E8] uppercase">
                      {(titlePrefix || 'Titan ') + (titleSuffix || 'Shilajit')}
                    </span>
                    <span className="text-[8px] tracking-[0.3em] uppercase text-[#D4B66A] font-medium font-sans">
                      {tagline || 'Pure Power of the Himalayas'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preset 1-Click Buttons */}
      <div className="bg-[#F7F3E8] p-4 rounded-xs border border-[#10110F]/10 space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#10110F] block">
          One-Click Logo Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetToAttachment}
            className={`px-3 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              imageUrl === ATTACHMENT_LOGO_PATH && useCustomImage
                ? 'bg-[#183D27] text-[#D4B66A] font-bold shadow-xs'
                : 'bg-white hover:bg-[#10110F] hover:text-[#F7F3E8] text-[#10110F] border border-[#10110F]/15'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Attachment Logo (Official)</span>
          </button>

          <button
            type="button"
            onClick={handleSelectCleanCropped}
            className={`px-3 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              imageUrl === CLEAN_CROPPED_LOGO_PATH && useCustomImage
                ? 'bg-[#183D27] text-[#D4B66A] font-bold shadow-xs'
                : 'bg-white hover:bg-[#10110F] hover:text-[#F7F3E8] text-[#10110F] border border-[#10110F]/15'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clean Cropped Badge</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUseCustomImage(false);
              updateBrandLogo({ useCustomImage: false });
              onToast('Switched to vector typography logo!');
            }}
            className={`px-3 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              !useCustomImage
                ? 'bg-[#183D27] text-[#D4B66A] font-bold shadow-xs'
                : 'bg-white hover:bg-[#10110F] hover:text-[#F7F3E8] text-[#10110F] border border-[#10110F]/15'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Vector Typography (No Image)</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Column: Image Controls & Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#10110F]">
              Display Custom Logo Image
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomImage}
                onChange={(e) => setUseCustomImage(e.target.checked)}
                className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
              />
              <span className="text-xs font-semibold text-[#10110F]">Enabled</span>
            </label>
          </div>

          {/* Logo URL Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
              Logo Image URL / Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setUseCustomImage(true);
                }}
                placeholder="e.g. /assets/aistudio/image_29351190.png"
                className="flex-1 px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-mono"
              />
              <button
                type="button"
                onClick={handlePasteClipboard}
                title="Paste image URL from clipboard"
                className="px-3 py-2 bg-[#F7F3E8] hover:bg-[#10110F] hover:text-[#F7F3E8] text-[#10110F] border border-[#10110F]/20 rounded-xs text-xs font-bold transition-colors cursor-pointer"
              >
                Paste
              </button>
            </div>
            <p className="text-[11px] text-[#66704B] mt-1">
              Supports local attachment paths (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded">{ATTACHMENT_LOGO_PATH}</code>) or external image URLs (Cloudinary, Imgur, S3).
            </p>
          </div>

          {/* Upload New Logo Button */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
              Upload New Logo Image
            </label>
            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-[#183D27]/40 hover:border-[#183D27] rounded-xs bg-[#F7F3E8]/60 hover:bg-[#F7F3E8] transition-colors cursor-pointer text-xs font-bold text-[#183D27]">
              <Upload className="w-4 h-4 text-[#D4B66A]" />
              <span>{isUploading ? 'Uploading Image to Server...' : 'Choose Logo Image File (PNG / SVG / JPG)'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            {uploadError && (
              <p className="text-xs text-red-600 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Logo Height Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#183D27]" />
                <span>Logo Display Height: {heightPx}px</span>
              </label>
              <span className="text-[10px] text-[#66704B]">Recommended: 40px – 52px</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="28"
                max="72"
                step="2"
                value={heightPx}
                onChange={(e) => setHeightPx(Number(e.target.value))}
                className="flex-1 accent-[#183D27]"
              />
              <input
                type="number"
                min="28"
                max="72"
                value={heightPx}
                onChange={(e) => setHeightPx(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs border border-[#10110F]/20 rounded-xs text-center font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Typography & Text Fallbacks */}
        <div className="space-y-4 bg-[#F7F3E8]/40 p-5 rounded-xs border border-[#10110F]/10">
          <div className="border-b border-[#10110F]/10 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#183D27]" />
              <span>Brand Text &amp; Accessibility Metadata</span>
            </h4>
            <p className="text-[11px] text-[#66704B]">
              Used for image alt-text, screen readers, and when vector typography mode is active.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Symbol / Monogram
              </label>
              <input
                type="text"
                maxLength={4}
                value={symbolText}
                onChange={(e) => setSymbolText(e.target.value)}
                placeholder="T"
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-serif font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Title Prefix
              </label>
              <input
                type="text"
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value)}
                placeholder="TITAN "
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Title Suffix
              </label>
              <input
                type="text"
                value={titleSuffix}
                onChange={(e) => setTitleSuffix(e.target.value)}
                placeholder="SHILAJIT"
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Sub-Headline / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Himalayan Apothecary"
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-[#10110F]/10">
            <button
              type="button"
              onClick={handleResetToAttachment}
              className="text-xs text-[#66704B] hover:text-[#10110F] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Official Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSaveLogo}
              className="px-4 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Apply &amp; Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
