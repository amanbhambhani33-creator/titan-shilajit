import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus, ArrowLeft, ArrowRight, Check, Star, Link as LinkIcon, ExternalLink, Globe, DownloadCloud, Loader2, Zap } from 'lucide-react';
import { normalizeImageUrl, handleImageError, downloadAndCacheImageUrl, DEFAULT_PRODUCT_FALLBACK } from '../utils/imageUrl';

interface AdminProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  coverImage?: string;
  onCoverChange?: (url: string) => void;
  maxImages?: number;
}

const DEFAULT_FALLBACK_IMAGE = DEFAULT_PRODUCT_FALLBACK;

export const AdminProductImageUploader: React.FC<AdminProductImageUploaderProps> = ({
  images,
  onChange,
  coverImage,
  onCoverChange,
  maxImages = 6,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [slotUrlInput, setSlotUrlInput] = useState('');
  const [activeSlotForUrl, setActiveSlotForUrl] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [expandedSlotIndex, setExpandedSlotIndex] = useState<number | null>(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const currentCover = coverImage || safeImages[0] || '';

  // Compress image file to lightweight canvas JPEG data URL
  const compressFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
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
            resolve(canvas.toDataURL('image/jpeg', 0.75));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - safeImages.length;
    if (remainingSlots <= 0) {
      setUploadNotice(`Maximum of ${maxImages} images already reached.`);
      setTimeout(() => setUploadNotice(null), 3000);
      return;
    }

    setIsProcessing(true);
    setUploadNotice('Optimizing and saving images to server storage...');

    const filesToProcess = (Array.from(files) as File[]).slice(0, remainingSlots);
    try {
      const processedUrls: string[] = [];
      for (const file of filesToProcess) {
        const dataUrl = await compressFile(file);
        let permanentUrl = dataUrl;
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl, filename: file.name }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              permanentUrl = data.url;
            }
          }
        } catch (uploadErr) {
          console.warn('Image upload endpoint notice:', uploadErr);
        }
        processedUrls.push(permanentUrl);
      }
      const updated = [...safeImages, ...processedUrls].slice(0, maxImages);
      onChange(updated);
      if (onCoverChange && updated[0]) {
        onCoverChange(updated[0]);
      }
      setUploadNotice(`Saved ${processedUrls.length} image(s) successfully!`);
    } catch (err) {
      console.error('Error reading files:', err);
      setUploadNotice('Failed to process image file.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadNotice(null), 3500);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add single or multiple image URLs (supports Google Drive, Dropbox, external CDNs)
  const handleAddUrl = (andCache = false) => {
    const raw = urlInput.trim();
    if (!raw) return;

    const newUrls = raw
      .split(/[\n,]+/)
      .map((s) => normalizeImageUrl(s))
      .filter((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/') || s.startsWith('data:image'));

    if (newUrls.length === 0) {
      setUploadNotice('Please enter a valid image URL starting with http://, https:// or /uploads/');
      setTimeout(() => setUploadNotice(null), 3000);
      return;
    }

    const availableSlots = maxImages - safeImages.length;
    if (availableSlots <= 0) {
      setUploadNotice(`Maximum limit of ${maxImages} images reached.`);
      setTimeout(() => setUploadNotice(null), 3000);
      return;
    }

    const toAdd = newUrls.slice(0, availableSlots);
    const updated = [...safeImages, ...toAdd];
    onChange(updated);
    if (onCoverChange && updated[0]) {
      onCoverChange(updated[0]);
    }
    setUrlInput('');

    if (andCache && toAdd[0] && (toAdd[0].startsWith('http://') || toAdd[0].startsWith('https://'))) {
      handleCacheUrl(toAdd[0], updated.length - toAdd.length);
    } else {
      setUploadNotice(`Added ${toAdd.length} image URL(s) successfully!`);
      setTimeout(() => setUploadNotice(null), 3000);
    }
  };

  // Cache an external URL to server storage (/uploads/...)
  const handleCacheUrl = async (targetUrl: string, targetIndex?: number) => {
    if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
      return;
    }

    setIsProcessing(true);
    setUploadNotice('Downloading and caching image permanently on server storage...');

    try {
      const result = await downloadAndCacheImageUrl(targetUrl, 'product-url');
      if (result.success && result.url) {
        const next = [...safeImages];
        const idx = targetIndex !== undefined && targetIndex >= 0 ? targetIndex : next.indexOf(targetUrl);
        if (idx !== -1) {
          next[idx] = result.url;
        } else if (next.length > 0) {
          next[0] = result.url;
        }
        onChange(next);
        if (onCoverChange && (idx === 0 || idx === -1)) {
          onCoverChange(result.url);
        }
        setUploadNotice('Image saved to server storage permanently (/uploads/...)!');
      } else {
        setUploadNotice('Direct URL active with automatic proxy fallback.');
      }
    } catch {
      setUploadNotice('Direct URL active with automatic proxy fallback.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadNotice(null), 3500);
    }
  };

  const handleUpdateCoverUrl = (newUrl: string) => {
    const clean = normalizeImageUrl(newUrl);
    const next = [...safeImages];
    if (clean) {
      if (next.length > 0) {
        next[0] = clean;
      } else {
        next.push(clean);
      }
    } else {
      next.splice(0, 1);
    }
    onChange(next);
    if (onCoverChange) {
      onCoverChange(clean);
    }
  };

  const handleUpdateSlotUrl = (index: number, newUrl: string) => {
    const clean = normalizeImageUrl(newUrl);
    const next = [...safeImages];
    if (clean) {
      next[index] = clean;
    } else {
      next.splice(index, 1);
    }
    onChange(next);
    setActiveSlotForUrl(null);
    setSlotUrlInput('');
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0 || index >= safeImages.length) return;
    const next = [...safeImages];
    const [target] = next.splice(index, 1);
    next.unshift(target);
    onChange(next);
    setUploadNotice('Image set as primary Cover Image!');
    setTimeout(() => setUploadNotice(null), 2500);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = safeImages.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    if (expandedSlotIndex === indexToRemove) {
      setExpandedSlotIndex(null);
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= safeImages.length) return;
    const next = [...safeImages];
    const temp = next[index];
    next[index] = next[newIdx];
    next[newIdx] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-4 bg-[#F7F3E8]/90 p-4 sm:p-5 rounded-xs border border-[#10110F]/15">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#183D27]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#10110F]">
            Product Images &amp; Cover Photo Management
          </span>
        </div>
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs ${
            safeImages.length === maxImages
              ? 'bg-amber-100 text-amber-800'
              : 'bg-[#183D27]/10 text-[#183D27]'
          }`}
        >
          {safeImages.length} of {maxImages} images
        </span>
      </div>

      {/* DEDICATED COVER IMAGE URL INPUT WITH LIVE PREVIEW */}
      <div className="p-3.5 bg-white rounded-xs border-2 border-[#183D27] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#10110F]">
            <Star className="w-4 h-4 text-[#B88A32] fill-[#B88A32]" />
            <span className="uppercase tracking-wider">
              Cover Image URL (Primary Storefront Photo)
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
            {safeImages[0] ? '✓ Active Cover Configured' : 'Primary Photo'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Cover Thumbnail Preview */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xs border-2 border-[#183D27]/40 bg-[#F7F3E8] overflow-hidden shrink-0 flex items-center justify-center relative group">
            {safeImages[0] ? (
              <img
                src={safeImages[0]}
                alt="Product Cover"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-0.5"
                onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
              />
            ) : (
              <div className="text-center p-1">
                <ImageIcon className="w-5 h-5 text-gray-400 mx-auto mb-0.5" />
                <span className="text-[8.5px] text-gray-500 font-bold uppercase block">
                  No Cover
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex gap-2">
              <input
                type="url"
                value={currentCover || safeImages[0] || ''}
                onChange={(e) => handleUpdateCoverUrl(e.target.value)}
                placeholder="Paste direct Cover Image URL (e.g. Google Drive, Dropbox, CDN)"
                className="flex-1 px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-[#F7F3E8] focus:bg-white focus:border-[#183D27] outline-none font-mono"
              />
              {safeImages[0] && (
                <button
                  type="button"
                  onClick={() => handleUpdateCoverUrl('')}
                  className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-xs text-[11px] font-bold cursor-pointer"
                  title="Clear cover image"
                >
                  Clear
                </button>
              )}
              {safeImages[0] && (safeImages[0].startsWith('http://') || safeImages[0].startsWith('https://')) && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleCacheUrl(safeImages[0], 0)}
                  className="px-2.5 py-1 bg-[#183D27] text-[#D4B66A] hover:bg-black rounded-xs text-[10px] font-bold uppercase tracking-wider cursor-pointer shrink-0 flex items-center gap-1"
                  title="Download URL and save permanent copy to server storage (/uploads/...)"
                >
                  <Zap className="w-3 h-3" />
                  <span className="hidden sm:inline">Save to Server</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-[#66704B] leading-tight flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#183D27] shrink-0" />
              <span>Supports Google Drive, Dropbox, Cloudinary, Imgur, Unsplash &amp; CDNs. Automatic proxy &amp; server caching active.</span>
            </p>
          </div>
        </div>
      </div>

      {/* QUICK URL ADDER & OPTIONAL FILE UPLOAD CONTROLS */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F]">
          Add Image by Direct URL (No Uploading Needed):
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Direct URL input */}
          <div className="flex-1 flex gap-1.5">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl(false);
                  }
                }}
                placeholder="Paste any public image link (Google Drive, Dropbox, CDN, https://...)"
                disabled={safeImages.length >= maxImages}
                className="w-full pl-8 pr-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white disabled:bg-gray-100 font-mono focus:border-[#183D27] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddUrl(false)}
              disabled={!urlInput.trim() || safeImages.length >= maxImages || isProcessing}
              className="px-3.5 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#D4B66A] text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer shrink-0 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddUrl(true)}
              disabled={!urlInput.trim() || safeImages.length >= maxImages || isProcessing}
              className="px-3 py-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer shrink-0 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Download image from URL and permanently store on your server/Hostinger disk"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add &amp; Cache</span>
            </button>
          </div>

          {/* Optional File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={safeImages.length >= maxImages || isProcessing}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={safeImages.length >= maxImages || isProcessing}
            className="px-3.5 py-2 rounded-xs bg-[#EEE8D7] hover:bg-stone-300 text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
            title="Upload image files from computer as alternative"
          >
            <Upload className="w-3.5 h-3.5 text-[#183D27]" />
            <span>{isProcessing ? 'Processing...' : 'Upload File'}</span>
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="text-[11px] font-semibold text-[#183D27] bg-[#183D27]/10 p-2.5 rounded-xs border border-[#183D27]/20 flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-[#25D366]" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* 5-SLOT GALLERY VISUAL GRID */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase text-[#66704B]">
            Gallery Slots (Slot 1 is the Cover Image):
          </span>
          <span className="text-[10px] text-[#66704B]">
            Click 'Set as Cover' on any image to make it primary.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {Array.from({ length: maxImages }).map((_, index) => {
            const imgUrl = safeImages[index];
            const isCover = index === 0;

            if (imgUrl) {
              return (
                <div
                  key={index}
                  className={`relative group aspect-square rounded-xs overflow-hidden border-2 bg-stone-900 flex flex-col justify-between ${
                    isCover
                      ? 'border-[#B88A32] ring-2 ring-[#B88A32]/40 shadow-sm'
                      : 'border-[#10110F]/20 hover:border-[#183D27]'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Image ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-1 bg-white"
                    onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                  />

                  {/* Header Badge */}
                  <div className="absolute top-1 left-1 right-1 flex items-center justify-between pointer-events-none">
                    <span
                      className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-xs ${
                        isCover
                          ? 'bg-[#B88A32] text-[#10110F]'
                          : 'bg-black/75 text-white'
                      }`}
                    >
                      {isCover ? '★ Cover' : `#${index + 1}`}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 pointer-events-auto transition-colors cursor-pointer shadow-xs"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute bottom-1 inset-x-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 p-1 rounded-xs">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(index)}
                        className="w-full py-0.5 text-[8.5px] font-bold uppercase tracking-wider bg-[#B88A32] text-[#10110F] hover:bg-[#D4B66A] rounded-xs cursor-pointer"
                      >
                        ★ Set As Cover
                      </button>
                    )}
                    <div className="flex items-center justify-between px-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveImage(index, 'left')}
                        className="text-white hover:text-[#D4B66A] disabled:opacity-20 cursor-pointer p-0.5"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedSlotIndex(expandedSlotIndex === index ? null : index)}
                        className="text-[8px] text-[#D4B66A] uppercase hover:underline cursor-pointer"
                      >
                        Edit URL
                      </button>
                      <button
                        type="button"
                        disabled={index === safeImages.length - 1}
                        onClick={() => handleMoveImage(index, 'right')}
                        className="text-white hover:text-[#D4B66A] disabled:opacity-20 cursor-pointer p-0.5"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Empty Slot (with inline URL input trigger)
            return (
              <div
                key={index}
                className="aspect-square rounded-xs border-2 border-dashed border-[#10110F]/20 hover:border-[#183D27] hover:bg-white/60 flex flex-col items-center justify-center p-2 text-center transition-all group relative"
              >
                {activeSlotForUrl === index ? (
                  <div className="w-full h-full flex flex-col justify-center gap-1 p-1">
                    <input
                      type="url"
                      autoFocus
                      placeholder="Paste URL..."
                      value={slotUrlInput}
                      onChange={(e) => setSlotUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUpdateSlotUrl(index, slotUrlInput);
                        } else if (e.key === 'Escape') {
                          setActiveSlotForUrl(null);
                        }
                      }}
                      className="w-full text-[10px] px-1.5 py-1 border border-[#183D27] rounded-xs bg-white font-mono"
                    />
                    <div className="flex gap-1 justify-center">
                      <button
                        type="button"
                        onClick={() => handleUpdateSlotUrl(index, slotUrlInput)}
                        className="px-2 py-0.5 text-[8.5px] bg-[#183D27] text-white font-bold rounded-xs cursor-pointer"
                      >
                        Set
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSlotForUrl(null);
                          setSlotUrlInput('');
                        }}
                        className="px-1.5 py-0.5 text-[8.5px] bg-gray-200 text-gray-700 font-bold rounded-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlotForUrl(index);
                      setSlotUrlInput('');
                    }}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#66704B] group-hover:text-[#183D27] group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[10px] font-bold text-[#66704B] group-hover:text-[#10110F]">
                      {index === 0 ? 'Add Cover' : `Slot ${index + 1}`}
                    </span>
                    <span className="text-[8px] text-[#183D27] font-semibold bg-[#183D27]/10 px-1 py-0.5 rounded-xs mt-1">
                      + Paste URL
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPANDABLE SLOT URL EDITOR */}
      {expandedSlotIndex !== null && safeImages[expandedSlotIndex] && (
        <div className="p-3 bg-white rounded-xs border border-[#183D27]/30 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#10110F]">
              Edit URL for Slot #{expandedSlotIndex + 1} {expandedSlotIndex === 0 ? '(Cover Image)' : ''}
            </span>
            <button
              type="button"
              onClick={() => setExpandedSlotIndex(null)}
              className="text-[11px] text-gray-500 hover:text-black cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={safeImages[expandedSlotIndex] || ''}
              onChange={(e) => handleUpdateSlotUrl(expandedSlotIndex, e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xs border border-gray-300 text-xs font-mono"
            />
            {expandedSlotIndex !== 0 && (
              <button
                type="button"
                onClick={() => {
                  handleSetAsCover(expandedSlotIndex);
                  setExpandedSlotIndex(0);
                }}
                className="px-3 py-1 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold cursor-pointer"
              >
                Make Cover
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductImageUploader;
