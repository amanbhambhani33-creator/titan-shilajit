import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Play,
  Layers,
} from 'lucide-react';
import { HeroBannerConfig, DEFAULT_HERO_PICTURES } from '../context/StoreContentContext';
import { HeroSlideImage } from '../types';

interface AdminPictureTransitionSectionProps {
  hero: HeroBannerConfig;
  updateHeroBanner: (updates: Partial<HeroBannerConfig>) => void;
  showToast: (msg: string) => void;
}

const PRESET_PICTURES: Array<{ label: string; url: string; title: string; link: string }> = [
  {
    label: 'Pure Shilajit Resin Obsidian Jar',
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Himalayan Shilajit Pure Resin Jar',
    link: '/shop',
  },
  {
    label: 'Raw Honey Sticks Single Sachet',
    url: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1920&q=85',
    title: 'Portable Raw Forest Shilajit Honey Sticks',
    link: '/shop',
  },
  {
    label: '16,000+ FT High Himalayan Glacial Harvest',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85',
    title: '16,000+ FT High Himalayan Glacial Rock Crests',
    link: '/why-titan',
  },
  {
    label: 'Surya Tapi 40-Day Solar Curing',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=85',
    title: 'Surya Tapi 40-Day Solar Spring Water Purification',
    link: '/shilajit-guide',
  },
  {
    label: 'Master Apothecary Ritual Chest & Brass Wand',
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Apothecary Master Ritual Chest & Brass Wand',
    link: '/shop',
  },
  {
    label: 'Raw Mountain Spring Glacial Exudate',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    title: 'Virgin Himalayan Granite Mountain Ridge',
    link: '/why-titan',
  },
];

export const AdminPictureTransitionSection: React.FC<AdminPictureTransitionSectionProps> = ({
  hero,
  updateHeroBanner,
  showToast,
}) => {
  const pictures: HeroSlideImage[] =
    Array.isArray(hero.pictures) && hero.pictures.length > 0
      ? hero.pictures
      : DEFAULT_HERO_PICTURES;

  const [previewIdx, setPreviewIdx] = useState(0);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('/shop');
  const [showAddForm, setShowAddForm] = useState(false);

  const autoplayInterval = hero.autoplayInterval || 4500;
  const transitionEffect = hero.transitionEffect || 'fade';
  const showWords = Boolean(hero.showWords);

  // Update whole pictures array
  const setPictures = (nextPictures: HeroSlideImage[]) => {
    updateHeroBanner({ pictures: nextPictures });
  };

  const handleUpdateSlide = (id: string, updates: Partial<HeroSlideImage>) => {
    const next = pictures.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPictures(next);
  };

  const handleRemoveSlide = (id: string) => {
    if (pictures.length <= 1) {
      showToast('At least one transition picture must remain.');
      return;
    }
    const next = pictures.filter((p) => p.id !== id);
    setPictures(next);
    if (previewIdx >= next.length) {
      setPreviewIdx(Math.max(0, next.length - 1));
    }
    showToast('Picture removed from transition.');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pictures.length) return;

    const copy = [...pictures];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setPictures(copy);
    setPreviewIdx(targetIndex);
  };

  const handleAddNewSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      showToast('Please enter an image URL.');
      return;
    }

    const newSlide: HeroSlideImage = {
      id: `pic-${Date.now()}`,
      imageUrl: newUrl.trim(),
      title: newTitle.trim() || 'Himalayan Shilajit Picture',
      linkUrl: newLink.trim() || '/shop',
      altText: newTitle.trim() || 'Titan Shilajit Picture',
    };

    const next = [...pictures, newSlide];
    setPictures(next);
    setNewUrl('');
    setNewTitle('');
    setShowAddForm(false);
    setPreviewIdx(next.length - 1);
    showToast('New picture added to transition slider!');
  };

  const handleAddPreset = (preset: typeof PRESET_PICTURES[0]) => {
    const newSlide: HeroSlideImage = {
      id: `pic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      imageUrl: preset.url,
      title: preset.title,
      linkUrl: preset.link,
      altText: preset.title,
    };
    const next = [...pictures, newSlide];
    setPictures(next);
    setPreviewIdx(next.length - 1);
    showToast(`Added preset: "${preset.label}"`);
  };

  const handleResetDefaults = () => {
    setPictures(DEFAULT_HERO_PICTURES);
    updateHeroBanner({
      showWords: false,
      autoplayInterval: 4500,
      transitionEffect: 'fade',
      pictures: DEFAULT_HERO_PICTURES,
    });
    setPreviewIdx(0);
    showToast('Picture transition reset to factory defaults.');
  };

  const activePreview = pictures[previewIdx] || pictures[0];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xs border-2 border-[#B88A32]/40 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#10110F]/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[10px] font-bold uppercase tracking-widest mb-1 border border-[#183D27]/20">
            HERO SHOWCASE • PICTURE TRANSITION
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#10110F]">
            Front Page Picture Transition Slider
          </h3>
          <p className="text-xs text-[#66704B]">
            Configure the transition pictures on the front page. No words required — pure luxury picture transition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xs border border-[#10110F]/20 text-xs font-semibold text-[#10110F] hover:bg-black/5 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#66704B]" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Picture transition settings saved to cloud!')}
            className="px-4 py-1.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#10110F] transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>Save to Cloud</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Preview Card */}
      <div className="bg-[#10110F] rounded-sm p-4 sm:p-5 border border-[#B88A32]/30 text-[#F7F3E8] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#D4B66A] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-[11px]">
              Live Front Page Preview ({pictures.length} Slides)
            </span>
          </div>
          <span>
            Slide {previewIdx + 1} of {pictures.length} • {transitionEffect.toUpperCase()} • {autoplayInterval / 1000}s
          </span>
        </div>

        {/* Preview Frame */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#0A0B0A] rounded-xs overflow-hidden border border-white/10 group">
          {activePreview && (
            <img
              key={activePreview.imageUrl}
              src={activePreview.imageUrl}
              alt={activePreview.altText || activePreview.title || 'Transition Preview'}
              className="w-full h-full object-cover object-center animate-in fade-in duration-500"
            />
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Navigation Arrows inside preview */}
          {pictures.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setPreviewIdx((curr) => (curr - 1 + pictures.length) % pictures.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#10110F]/70 text-white hover:text-[#D4B66A] border border-white/20 transition-all cursor-pointer"
                title="Preview Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewIdx((curr) => (curr + 1) % pictures.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#10110F]/70 text-white hover:text-[#D4B66A] border border-white/20 transition-all cursor-pointer"
                title="Preview Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom Indicators in Preview */}
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5">
            {pictures.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPreviewIdx(i)}
                className={`transition-all rounded-full ${
                  previewIdx === i ? 'w-5 h-1.5 bg-[#D4B66A]' : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#EEE8D7]/70 pt-1">
          <span className="truncate">
            Current Image Title: <strong className="text-white">{activePreview?.title || 'Pure Himalayan Shilajit'}</strong>
          </span>
          <span className="shrink-0 text-[#D4B66A]">
            Target Link: {activePreview?.linkUrl || 'None'}
          </span>
        </div>
      </div>

      {/* Transition Timing & Animation Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F7F3E8] p-4 rounded-xs border border-[#10110F]/10">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
            Autoplay Interval (Mandatory 3–5s)
          </label>
          <select
            value={autoplayInterval}
            onChange={(e) => updateHeroBanner({ autoplayInterval: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-medium cursor-pointer"
          >
            <option value={3000}>3.0 Seconds (Fast)</option>
            <option value={3500}>3.5 Seconds (Dynamic)</option>
            <option value={4000}>4.0 Seconds (Recommended • 4s)</option>
            <option value={4500}>4.5 Seconds (Smooth • 4.5s)</option>
            <option value={5000}>5.0 Seconds (Relaxed • 5s)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
            Transition Animation Style
          </label>
          <select
            value={transitionEffect}
            onChange={(e) => updateHeroBanner({ transitionEffect: e.target.value as 'fade' | 'slide' })}
            className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-medium cursor-pointer"
          >
            <option value="fade">Smooth Dissolve / Crossfade</option>
            <option value="slide">Horizontal Eased Slide</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xs border border-[#10110F]/20 min-h-[38px]">
            <input
              type="checkbox"
              checked={showWords}
              onChange={(e) => updateHeroBanner({ showWords: e.target.checked })}
              className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
            />
            <span className="text-xs font-bold text-[#10110F]">
              Display Words Overlay (Default: OFF)
            </span>
          </label>
        </div>
      </div>

      {/* Picture Slides List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-bold text-[#10110F] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#B88A32]" />
            <span>Active Transition Pictures ({pictures.length})</span>
          </h4>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#10110F] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>{showAddForm ? 'Cancel Add' : 'Add Custom Picture'}</span>
          </button>
        </div>

        {/* Add New Slide Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddNewSlide}
            className="bg-[#F7F3E8] p-4 sm:p-5 rounded-xs border-2 border-dashed border-[#B88A32] space-y-4 animate-in fade-in duration-200"
          >
            <h5 className="font-serif text-sm font-bold text-[#183D27] uppercase tracking-wider">
              Add New Picture to Transition
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Target Link (When Clicked)
                </label>
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="e.g. /shop or /why-titan"
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Picture Description / Alt Text
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Pure Himalayan Shilajit 20g Glass Jar"
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                />
              </div>
            </div>

            {/* Thumbnail Preview of New URL */}
            {newUrl.trim() && (
              <div className="flex items-center gap-3 p-2 bg-white rounded-xs border border-[#10110F]/10">
                <img
                  src={newUrl}
                  alt="Preview"
                  className="w-16 h-12 object-cover rounded-xs border border-[#10110F]/10"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-[11px] text-[#66704B]">Image preview ready</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xs border border-[#10110F]/20 text-xs font-semibold text-[#10110F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#10110F]"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>Confirm &amp; Add Slide</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Pictures List */}
        <div className="space-y-3">
          {pictures.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`p-3.5 sm:p-4 rounded-xs border transition-all ${
                previewIdx === index
                  ? 'border-[#B88A32] bg-[#F7F3E8]/60 shadow-xs'
                  : 'border-[#10110F]/15 bg-white hover:border-[#10110F]/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Index Pill & Thumbnail */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <div
                    onClick={() => setPreviewIdx(index)}
                    className="relative w-20 h-14 bg-black rounded-xs overflow-hidden border border-[#10110F]/20 cursor-pointer group"
                    title="Click to preview this slide above"
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'Slide thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px] font-bold uppercase">
                      View
                    </div>
                  </div>
                </div>

                {/* Form Fields for this slide */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 min-w-0">
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#66704B] mb-0.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={slide.imageUrl}
                      onChange={(e) => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#66704B] mb-0.5">
                      Target Link
                    </label>
                    <input
                      type="text"
                      value={slide.linkUrl || ''}
                      onChange={(e) => handleUpdateSlide(slide.id, { linkUrl: e.target.value })}
                      placeholder="/shop"
                      className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#66704B] mb-0.5">
                      Description / Alt Label
                    </label>
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) =>
                        handleUpdateSlide(slide.id, {
                          title: e.target.value,
                          altText: e.target.value,
                        })
                      }
                      placeholder="Slide Description"
                      className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Reorder and Delete Actions */}
                <div className="flex md:flex-col items-center justify-end gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#10110F]/10">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveSlide(index, 'up')}
                      className="p-1.5 rounded-xs border border-[#10110F]/20 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[#10110F]" />
                    </button>
                    <button
                      type="button"
                      disabled={index === pictures.length - 1}
                      onClick={() => handleMoveSlide(index, 'down')}
                      className="p-1.5 rounded-xs border border-[#10110F]/20 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[#10110F]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="p-1.5 rounded-xs border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Image Presets Library */}
      <div className="p-4 bg-[#F7F3E8] rounded-xs border border-[#10110F]/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#183D27]">
            Instant Image Preset Library (1-Click Add)
          </span>
          <span className="text-[10px] text-[#66704B]">Click to append to transition</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_PICTURES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddPreset(preset)}
              className="flex flex-col items-center p-2 rounded-xs bg-white border border-[#10110F]/10 hover:border-[#B88A32] hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full aspect-[4/3] object-cover rounded-xs mb-1.5 group-hover:scale-102 transition-transform"
              />
              <span className="text-[10px] font-bold text-[#10110F] leading-tight text-center truncate w-full">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminPictureTransitionSection;
