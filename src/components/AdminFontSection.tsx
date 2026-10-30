import React, { useState } from 'react';
import { Type, Sparkles, Check, RotateCcw, Save, Sliders, Eye } from 'lucide-react';
import { useStoreContent, ThemeFontConfig } from '../context/StoreContentContext';

const SERIF_HEADING_OPTIONS = [
  { id: 'Cormorant Garamond', label: 'Cormorant Garamond (Classic Ayurvedic Luxury - Default)', sample: 'Sacred Mountain Resin' },
  { id: 'Playfair Display', label: 'Playfair Display (Editorial & High-Fashion)', sample: 'Sacred Mountain Resin' },
  { id: 'Prata', label: 'Prata (Refined Roman Elegance)', sample: 'Sacred Mountain Resin' },
  { id: 'Fraunces', label: 'Fraunces (Warm Organic Serif)', sample: 'Sacred Mountain Resin' },
  { id: 'Merriweather', label: 'Merriweather (Stately & High Readability)', sample: 'Sacred Mountain Resin' },
  { id: 'Cinzel', label: 'Cinzel (Imperial Monumental Capital Serif)', sample: 'Sacred Mountain Resin' },
];

const SANS_BODY_OPTIONS = [
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Ultra-Clean Modern - Default)', sample: 'Triphala sun-purified resin with 70%+ active fulvic acid.' },
  { id: 'Outfit', label: 'Outfit (Geometric Contemporary Sans)', sample: 'Triphala sun-purified resin with 70%+ active fulvic acid.' },
  { id: 'Inter', label: 'Inter (Precise Digital Readability)', sample: 'Triphala sun-purified resin with 70%+ active fulvic acid.' },
  { id: 'Montserrat', label: 'Montserrat (Balanced Architectural Sans)', sample: 'Triphala sun-purified resin with 70%+ active fulvic acid.' },
];

const DISPLAY_OPTIONS = [
  { id: 'Cinzel', label: 'Cinzel (Monumental Stone Roman - Default)', sample: 'TITAN SHILAJIT APOTHECARY' },
  { id: 'Syne', label: 'Syne (Avant-Garde Architectural)', sample: 'TITAN SHILAJIT APOTHECARY' },
  { id: 'Fraunces', label: 'Fraunces Display (Organic Luxury)', sample: 'TITAN SHILAJIT APOTHECARY' },
  { id: 'Playfair Display', label: 'Playfair Display (High Editorial)', sample: 'TITAN SHILAJIT APOTHECARY' },
];

interface AdminFontSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminFontSection: React.FC<AdminFontSectionProps> = ({ onSuccessToast }) => {
  const { content, updateThemeFont } = useStoreContent();
  const currentFont = content.themeFont || {
    serifFont: 'Cormorant Garamond',
    sansFont: 'Plus Jakarta Sans',
    displayFont: 'Cinzel',
  };

  const [serifFont, setSerifFont] = useState(currentFont.serifFont);
  const [sansFont, setSansFont] = useState(currentFont.sansFont);
  const [displayFont, setDisplayFont] = useState(currentFont.displayFont);
  const [isSaved, setIsSaved] = useState(false);

  const handleApplyFonts = () => {
    updateThemeFont({
      serifFont,
      sansFont,
      displayFont,
    });
    setIsSaved(true);
    if (onSuccessToast) {
      onSuccessToast(`Typography updated: ${serifFont} (Headings) / ${sansFont} (Body)`);
    }
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    const defaults = {
      serifFont: 'Cormorant Garamond',
      sansFont: 'Plus Jakarta Sans',
      displayFont: 'Cinzel',
    };
    setSerifFont(defaults.serifFont);
    setSansFont(defaults.sansFont);
    setDisplayFont(defaults.displayFont);
    updateThemeFont(defaults);
    if (onSuccessToast) {
      onSuccessToast('Reset brand fonts to default (Cormorant Garamond & Plus Jakarta Sans)');
    }
  };

  return (
    <div className="bg-white rounded-sm border border-[#10110F]/10 shadow-xs overflow-hidden mb-8">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#183D27] text-[#F7F3E8] border-b border-[#B88A32]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#D4B66A] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <Type className="w-3 h-3 text-[#D4B66A]" />
            <span>STOREFRONT TYPOGRAPHY CONTROLLER</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F3E8]">
            Brand Font &amp; Typography Settings
          </h2>
          <p className="text-xs text-[#EEE8D7]/80 font-sans mt-1">
            Choose custom primary serifs, clean sans-serif body fonts, and display accents. Changes apply instantly across the whole website and cloud database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-[#EEE8D7] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleApplyFonts}
            className="px-4 py-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Applied & Saved!' : 'Apply Fonts'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6 bg-[#F7F3E8]/30">
        {/* Font Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Serif / Heading */}
          <div className="p-4 rounded-xs bg-white border border-[#10110F]/10 shadow-xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183D27]">
              1. Heading / Title Font (Serif)
            </label>
            <p className="text-[11px] text-[#66704B] font-sans">
              Applied to all major section titles, hero headlines, and product names.
            </p>
            <select
              value={serifFont}
              onChange={(e) => setSerifFont(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/20 text-sm font-semibold text-[#10110F] focus:outline-none focus:border-[#183D27]"
            >
              {SERIF_HEADING_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <div
              className="p-3 rounded-xs bg-[#F7F3E8]/60 border border-dashed border-[#10110F]/15 text-lg font-bold text-[#10110F] text-center"
              style={{ fontFamily: `"${serifFont}", serif` }}
            >
              {serifFont}: Sacred Mountain Resin
            </div>
          </div>

          {/* 2. Body / Sans */}
          <div className="p-4 rounded-xs bg-white border border-[#10110F]/10 shadow-xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183D27]">
              2. Body &amp; Details Font (Sans)
            </label>
            <p className="text-[11px] text-[#66704B] font-sans">
              Applied to descriptions, pricing, buttons, reviews, and product specifications.
            </p>
            <select
              value={sansFont}
              onChange={(e) => setSansFont(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/20 text-sm font-semibold text-[#10110F] focus:outline-none focus:border-[#183D27]"
            >
              {SANS_BODY_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <div
              className="p-3 rounded-xs bg-[#F7F3E8]/60 border border-dashed border-[#10110F]/15 text-xs text-[#10110F] text-center"
              style={{ fontFamily: `"${sansFont}", sans-serif` }}
            >
              {sansFont}: Clean, razor-sharp apothecary legibility across all phone screens.
            </div>
          </div>

          {/* 3. Display / Accent */}
          <div className="p-4 rounded-xs bg-white border border-[#10110F]/10 shadow-xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183D27]">
              3. Display &amp; Kicker Font
            </label>
            <p className="text-[11px] text-[#66704B] font-sans">
              Applied to small luxury uppercase kickers, badges, and monogram logos.
            </p>
            <select
              value={displayFont}
              onChange={(e) => setDisplayFont(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/20 text-sm font-semibold text-[#10110F] focus:outline-none focus:border-[#183D27]"
            >
              {DISPLAY_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <div
              className="p-3 rounded-xs bg-[#F7F3E8]/60 border border-dashed border-[#10110F]/15 text-xs font-bold tracking-[0.2em] text-[#183D27] uppercase text-center"
              style={{ fontFamily: `"${displayFont}", serif` }}
            >
              {displayFont}: TITAN SHILAJIT APOTHECARY
            </div>
          </div>
        </div>

        {/* Live Specimen Preview Card */}
        <div className="p-6 rounded-xs bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4B66A]">
              <Eye className="w-4 h-4 text-[#D4B66A]" />
              <span>LIVE TYPOGRAPHY SPECIMEN PREVIEW</span>
            </div>
            <span className="text-[11px] text-white/50 font-mono">
              CSS: --font-serif: "{serifFont}" | --font-sans: "{sansFont}"
            </span>
          </div>

          <div>
            <span
              className="text-xs uppercase tracking-[0.25em] text-[#D4B66A] font-semibold block mb-1"
              style={{ fontFamily: `"${displayFont}", serif` }}
            >
              16,000+ FT HIGH HIMALAYAN HARVEST
            </span>
            <h1
              className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F7F3E8]"
              style={{ fontFamily: `"${serifFont}", serif` }}
            >
              Pure Himalayan Shilajit Resin • Swarna Gold Edition
            </h1>
          </div>

          <p
            className="text-xs sm:text-sm text-[#EEE8D7]/80 leading-relaxed max-w-3xl"
            style={{ fontFamily: `"${sansFont}", sans-serif` }}
          >
            Hand-gathered from sheer Himalayan granite crevices above 16,000 feet in Ladakh during peak solar heat. Purified with traditional Triphala herbal decoctions and slow-cured beneath open mountain sunlight, preserving delicate live enzymes and 70%+ active fulvic acid.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div
              className="text-xl sm:text-2xl font-bold text-[#D4B66A]"
              style={{ fontFamily: `"${sansFont}", sans-serif` }}
            >
              ₹1,499 <span className="text-xs text-white/50 line-through">₹2,499</span>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xs bg-[#B88A32] text-[#10110F] text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: `"${sansFont}", sans-serif` }}
            >
              Add to Cart • Extra ₹50 Off Prepaid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminFontSection;
