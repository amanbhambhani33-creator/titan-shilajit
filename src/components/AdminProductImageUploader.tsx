import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface AdminProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const AdminProductImageUploader: React.FC<AdminProductImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  // Compress image file to lightweight canvas JPEG data URL
  const compressFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
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
            resolve(canvas.toDataURL('image/jpeg', 0.85));
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
    setUploadNotice('Optimizing and loading images...');

    const filesToProcess = (Array.from(files) as File[]).slice(0, remainingSlots);
    try {
      const processedDataUrls: string[] = [];
      for (const file of filesToProcess) {
        const dataUrl = await compressFile(file);
        processedDataUrls.push(dataUrl);
      }
      const updated = [...safeImages, ...processedDataUrls].slice(0, maxImages);
      onChange(updated);
      setUploadNotice(`Added ${processedDataUrls.length} image(s). Up to ${maxImages} allowed.`);
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

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (safeImages.length >= maxImages) {
      setUploadNotice(`Maximum limit of ${maxImages} images reached.`);
      setTimeout(() => setUploadNotice(null), 3000);
      return;
    }

    const updated = [...safeImages, urlInput.trim()].slice(0, maxImages);
    onChange(updated);
    setUrlInput('');
    setUploadNotice(`Image URL added (${updated.length}/${maxImages}).`);
    setTimeout(() => setUploadNotice(null), 3000);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = safeImages.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
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
    <div className="space-y-3 bg-[#F7F3E8]/80 p-4 rounded-xs border border-[#10110F]/15">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#183D27]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#10110F]">
            Product Image Gallery (Up to {maxImages} Images)
          </span>
        </div>
        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs ${
          safeImages.length === maxImages
            ? 'bg-amber-100 text-amber-800'
            : 'bg-[#183D27]/10 text-[#183D27]'
        }`}>
          {safeImages.length} of {maxImages} uploaded
        </span>
      </div>

      <p className="text-[11px] text-[#66704B]">
        Upload product photography from your computer or paste direct image URLs. Image #1 will act as the primary storefront catalog cover. All images push directly to Firebase upon saving.
      </p>

      {/* Upload Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* File upload hidden input */}
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
          className="px-3.5 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5 text-[#D4B66A]" />
          <span>{isProcessing ? 'Processing...' : 'Upload Image File(s)'}</span>
        </button>

        {/* Or URL Input */}
        <div className="flex-1 flex gap-1.5">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste direct image URL (https://...)"
            disabled={safeImages.length >= maxImages}
            className="flex-1 px-3 py-1.5 rounded-xs border border-[#10110F]/20 text-xs bg-white disabled:bg-gray-100"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim() || safeImages.length >= maxImages}
            className="px-3 py-1.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
          >
            Add URL
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="text-[11px] font-semibold text-[#183D27] bg-[#183D27]/10 p-2 rounded-xs border border-[#183D27]/20 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#25D366]" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Grid of 5 Image Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        {Array.from({ length: maxImages }).map((_, index) => {
          const imgUrl = safeImages[index];
          const isPrimary = index === 0;

          if (imgUrl) {
            return (
              <div
                key={index}
                className={`relative group aspect-square rounded-xs overflow-hidden border-2 bg-black/40 flex flex-col justify-between ${
                  isPrimary
                    ? 'border-[#B88A32] shadow-sm'
                    : 'border-[#10110F]/20 hover:border-[#10110F]/40'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Badge Header */}
                <div className="absolute top-1 left-1 right-1 flex items-center justify-between pointer-events-none">
                  <span
                    className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs ${
                      isPrimary
                        ? 'bg-[#B88A32] text-[#10110F]'
                        : 'bg-black/70 text-white'
                    }`}
                  >
                    {isPrimary ? '1. Cover' : `${index + 1}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 pointer-events-auto transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Move Left / Right Controls */}
                <div className="absolute bottom-1 inset-x-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 px-1 py-0.5 rounded-xs">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveImage(index, 'left')}
                    className="p-0.5 text-white hover:text-[#D4B66A] disabled:opacity-20 cursor-pointer"
                    title="Move Left (Make Primary)"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[8px] uppercase tracking-wider text-white font-mono">
                    Reorder
                  </span>
                  <button
                    type="button"
                    disabled={index === safeImages.length - 1}
                    onClick={() => handleMoveImage(index, 'right')}
                    className="p-0.5 text-white hover:text-[#D4B66A] disabled:opacity-20 cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          }

          // Empty Slot
          return (
            <button
              key={index}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xs border-2 border-dashed border-[#10110F]/20 hover:border-[#B88A32] hover:bg-white/50 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-[#66704B] group-hover:text-[#B88A32] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-[#66704B] group-hover:text-[#10110F]">
                Slot {index + 1}
              </span>
              <span className="text-[8px] text-gray-400">
                {index === 0 ? 'Primary' : 'Add Photo'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default AdminProductImageUploader;
