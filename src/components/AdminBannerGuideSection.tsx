import React, { useState } from 'react';
import { Image, Smartphone, Monitor, Info, Check, Copy, Sparkles, Layers } from 'lucide-react';

interface BannerSizeSpec {
  name: string;
  recommendedSize: string;
  aspectRatio: string;
  format: string;
  maxFileSize: string;
  description: string;
  mobileTip: string;
  usageLocation: string;
  badge: string;
}

const BANNER_SPECS: BannerSizeSpec[] = [
  {
    name: 'Desktop Hero Main Background',
    recommendedSize: '1920 × 800 px',
    aspectRatio: '12:5 or 16:9 widescreen',
    format: 'WebP or JPEG (quality 85%)',
    maxFileSize: '< 350 KB',
    description: 'The primary luxury atmospheric background spanning the top of the storefront. Keep the central horizontal band clean as it hosts the floating product jar.',
    mobileTip: 'On screens < 768px, the view automatically shifts focal focus towards the center. Place vital elements within the middle 60%.',
    usageLocation: 'Homepage Hero Top (storefront desktop)',
    badge: 'HERO DESKTOP',
  },
  {
    name: 'Mobile Hero Banner (Vertical Orientation)',
    recommendedSize: '1080 × 1350 px',
    aspectRatio: '4:5 vertical portrait',
    format: 'WebP or JPEG (quality 85%)',
    maxFileSize: '< 250 KB',
    description: 'Optimized vertical banner for handheld mobile devices without horizontal stretching or side-clipping.',
    mobileTip: 'Fills standard phone viewports smoothly without pushing the call-to-action buttons below the first fold.',
    usageLocation: 'Homepage Mobile Hero (< 640px screens)',
    badge: 'HERO MOBILE',
  },
  {
    name: 'Hero Picture Transition Carousel Slides',
    recommendedSize: '1920 × 1080 px',
    aspectRatio: '16:9 standard landscape',
    format: 'WebP or JPEG (85% compression)',
    maxFileSize: '< 300 KB each',
    description: 'Sliding product photography transitioning smoothly on the hero section without text overlay as per store design.',
    mobileTip: 'Scaled with object-cover on mobile. Center the subject (e.g. Shilajit jar or honey sticks) strictly in the center 800x800 box.',
    usageLocation: 'Picture Transition Carousel in Hero Section',
    badge: 'PICTURE TRANSITIONS',
  },
  {
    name: 'Product Catalog & Shop Product Photos',
    recommendedSize: '1000 × 1000 px',
    aspectRatio: '1:1 perfect square',
    format: 'PNG with transparency OR clean cream (#F7F3E8) / studio black',
    maxFileSize: '< 200 KB',
    description: 'High-resolution packshot of resin jars, honey stick pouches, and wooden spoons. Used across Product Showcases, Shop Page, and Cart Drawer.',
    mobileTip: 'Displayed as 2-column grid on mobile phones. Crisp 1:1 ratio prevents uneven row heights.',
    usageLocation: 'Homepage Showcase, Shop Catalog, QuickView Modal, Invoice Slip',
    badge: 'SHOP CATALOG',
  },
  {
    name: 'Brand Story Mountain Landscape Image',
    recommendedSize: '1200 × 1500 px',
    aspectRatio: '4:5 vertical aspect ratio',
    format: 'WebP or JPEG (rich contrast)',
    maxFileSize: '< 300 KB',
    description: 'Majestic photography of Himalayan granite peaks, glacial clouds, or Ladakh harvesters. Displays with a luxury floating gold quote card.',
    mobileTip: 'On mobile devices, the quote card sits neatly below the photo to prevent covering the mountains.',
    usageLocation: 'Brand Story Section ("The Sacred Mountain Lineage")',
    badge: 'BRAND STORY',
  },
  {
    name: 'Royal Launch / Swarna Gold Banner',
    recommendedSize: '1600 × 900 px',
    aspectRatio: '16:9 widescreen',
    format: 'WebP or JPEG (quality 90%)',
    maxFileSize: '< 350 KB',
    description: 'Special edition promotional card highlighting Swarna 24K Gold Bhasma and Kashmiri Saffron edition with gold borders.',
    mobileTip: 'Stacks vertically on phone displays, maintaining high legibility of feature bullet points.',
    usageLocation: 'Launch Banner Section',
    badge: 'PROMO BANNER',
  },
  {
    name: 'Store Header & Invoice Brand Logo',
    recommendedSize: '512 × 256 px or SVG vector',
    aspectRatio: '2:1 wide horizontal',
    format: 'PNG with transparent alpha channel or SVG',
    maxFileSize: '< 80 KB',
    description: 'Store emblem and apothecary wordmark. Displayed in top navigation header, sticky checkout bar, and PDF invoice slips.',
    mobileTip: 'Rendered at max-height 38px on desktop and 32px on mobile for optimal clearance.',
    usageLocation: 'Header, Mobile Menu, Footer, PDF Invoice',
    badge: 'BRAND LOGO',
  },
];

export const AdminBannerGuideSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyDimensions = (spec: BannerSizeSpec, idx: number) => {
    navigator.clipboard.writeText(`${spec.name}: ${spec.recommendedSize} (${spec.aspectRatio})`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-sm border border-[#10110F]/10 shadow-xs overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-[#183D27] text-[#F7F3E8] border-b border-[#B88A32]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#D4B66A] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <Info className="w-3 h-3 text-[#D4B66A]" />
            <span>IMAGE SIZING REFERENCE GUIDE</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F3E8]">
            Banner &amp; Image Dimension Descriptions
          </h2>
          <p className="text-xs text-[#EEE8D7]/80 font-sans mt-1">
            Exact pixel sizes, aspect ratios, and mobile optimization guidelines for all banners and image assets across the storefront.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="px-3 py-1.5 rounded-xs bg-white/10 text-[#D4B66A] text-xs font-mono font-bold border border-white/15 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
            <span className="text-white/40">•</span>
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </span>
        </div>
      </div>

      {/* Grid of Spec Cards */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F7F3E8]/40">
        {BANNER_SPECS.map((spec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xs bg-white border border-[#10110F]/10 shadow-xs flex flex-col justify-between hover:border-[#183D27]/40 transition-all"
          >
            <div>
              {/* Top Badge & Copy Button */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[9px] font-black uppercase tracking-wider border border-[#183D27]/20">
                  {spec.badge}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyDimensions(spec, idx)}
                  className="p-1 rounded-xs hover:bg-[#F7F3E8] text-[#10110F]/60 hover:text-[#183D27] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy dimensions"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-sm text-[#10110F] mb-1 leading-snug">
                {spec.name}
              </h3>

              {/* Recommended Size Highlight */}
              <div className="p-2.5 rounded-xs bg-[#10110F] text-[#F7F3E8] my-2 text-center">
                <div className="text-[10px] text-[#D4B66A] font-bold uppercase tracking-wider">
                  Recommended Resolution
                </div>
                <div className="font-mono text-base font-bold text-white tracking-wide">
                  {spec.recommendedSize}
                </div>
                <div className="text-[10px] text-[#EEE8D7]/70 font-sans mt-0.5">
                  Aspect Ratio: <span className="text-[#D4B66A] font-semibold">{spec.aspectRatio}</span>
                </div>
              </div>

              {/* Specs Micro-List */}
              <div className="space-y-1.5 text-[11px] text-[#66704B] font-sans my-2.5">
                <div className="flex justify-between border-b border-[#10110F]/5 pb-1">
                  <span className="font-medium text-[#10110F]/70">Best Format:</span>
                  <span className="font-semibold text-[#10110F]">{spec.format}</span>
                </div>
                <div className="flex justify-between border-b border-[#10110F]/5 pb-1">
                  <span className="font-medium text-[#10110F]/70">Target Weight:</span>
                  <span className="font-semibold text-emerald-700">{spec.maxFileSize}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-[#10110F]/70">Placement:</span>
                  <span className="font-semibold text-[#183D27] text-right truncate max-w-[170px]">{spec.usageLocation}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#10110F]/80 font-sans leading-relaxed mb-2.5">
                {spec.description}
              </p>
            </div>

            {/* Mobile Optimization Tip */}
            <div className="p-2.5 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-950 text-[11px] font-sans flex items-start gap-2 mt-2">
              <Smartphone className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block text-[10px] uppercase tracking-wider">Mobile Layout Rule:</strong>
                <span className="leading-tight text-[#10110F]/85">{spec.mobileTip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminBannerGuideSection;
