import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  MessageCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { useCart } from '../context/CartContext';
import { getProductPacks } from '../utils/productPacks';

interface HeroSlide {
  id: string;
  kicker: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  description: string;
  badge: string;
  purityPercent: string;
  purityLabel: string;
  productCardImageUrl: string;
  bgImageUrl: string;
  productSlug: string;
  priceNote: string;
}

export const HeroSection: React.FC = () => {
  const { content, products } = useStoreContent();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const hero = content.hero;

  const slides: HeroSlide[] = [
    {
      id: 'slide-resin-pure',
      kicker: hero.kicker || '16,000+ FT HIGH HIMALAYAN HARVEST',
      headlineLine1: hero.headlineLine1 || 'SACRED MOUNTAIN RESIN.',
      headlineLine2: hero.headlineLine2 || 'UNTOUCHED GEOLOGICAL GOLD.',
      headlineLine3: hero.headlineLine3 || 'UNLEASH THE TITAN.',
      description:
        hero.description ||
        'Hand-harvested from high-altitude rock faces above 16,000 feet during peak summer melt. Lab-verified > 75% active fulvic acid for raw cellular vitality and sustained physical endurance.',
      badge: hero.gradeBadge || 'GRADE-A HIGH ROCK RESIN',
      purityPercent: hero.purityPercent || '98.2% Purity',
      purityLabel: hero.purityLabel || 'Lab Verified Resin',
      productCardImageUrl:
        hero.productCardImageUrl ||
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
      bgImageUrl:
        hero.bgImageUrl ||
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      productSlug: 'titan-shilajit-resin',
      priceNote: 'Trial Pack ₹999 | Popular 50g ₹1,899',
    },
    {
      id: 'slide-resin-gold',
      kicker: 'SUN-CURED AYURVEDIC PURIFICATION',
      headlineLine1: 'SACRED MOUNTAIN RESIN.',
      headlineLine2: 'PURE FULVIC GOLD.',
      headlineLine3: 'UNLEASH THE TITAN.',
      description:
        'Purified through slow traditional spring-water shodhana and sun-cured over 40 days. Preserving 84+ ionic trace minerals and natural humic bio-compounds without synthetic binders.',
      badge: '100% ORGANIC RESIN EXTRACT',
      purityPercent: '> 75% Fulvic',
      purityLabel: 'NABL Lab Certified',
      productCardImageUrl:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
      bgImageUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
      productSlug: 'titan-shilajit-resin',
      priceNote: 'Most Popular 50g Jar + Brass Spoon',
    },
    {
      id: 'slide-honey-sticks',
      kicker: 'EFFORTLESS ON-THE-GO NUTRITION',
      headlineLine1: 'SACRED MOUNTAIN RESIN.',
      headlineLine2: 'RAW FOREST HONEY.',
      headlineLine3: 'UNLEASH THE TITAN.',
      description:
        'Pre-portioned single-serve sticks blending 350mg purified high-altitude Shilajit with unprocessed wild forest honey. Squeeze directly for instantaneous natural energy and mental clarity.',
      badge: 'PORTABLE HONEY STICKS',
      purityPercent: '350mg Resin',
      purityLabel: 'Per Single Sachet',
      productCardImageUrl:
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
      bgImageUrl:
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=80',
      productSlug: 'titan-honey-sticks-classic',
      priceNote: 'Starter 15 Sticks ₹699 | Twin Box ₹1,299',
    },
    {
      id: 'slide-ritual-box',
      kicker: 'MASTER APOTHECARY CEREMONY',
      headlineLine1: 'SACRED MOUNTAIN RESIN.',
      headlineLine2: 'HANDCRAFTED BRASS SPOON.',
      headlineLine3: 'UNLEASH THE TITAN.',
      description:
        'The definitive Titan collection: 20g Pure Himalayan Resin jar paired with an engraved pure brass measuring instrument, travel honey sticks, and verified batch laboratory certificate.',
      badge: 'COMPLETE RITUAL CHEST',
      purityPercent: '100% Pure',
      purityLabel: 'Zero Additives / GMOs',
      productCardImageUrl:
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=85',
      bgImageUrl:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      productSlug: 'titan-vitality-ritual-box',
      priceNote: 'Signature Gift Set ₹2,199',
    },
  ];

  const DURATION = 8000; // 8 seconds per slide (between 7-10 sec)
  const INTERVAL_STEP = 100;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + (INTERVAL_STEP / DURATION) * 100;
      });
    }, INTERVAL_STEP);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlide((curr) => (curr - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentSlide((curr) => (curr + 1) % slides.length);
    setProgress(0);
  };

  const activeSlide = slides[currentSlide];

  // Find product for current slide
  const targetProduct =
    products.find((p) => p.slug === activeSlide.productSlug) ||
    products[0] || {
      id: 'titan-shilajit-resin',
      name: 'Titan Pure Himalayan Shilajit Resin',
      slug: 'titan-shilajit-resin',
      price: 999,
      size: '20g Glass Jar',
      images: [activeSlide.productCardImageUrl],
    };

  const handleBuyNow = () => {
    const packs = getProductPacks(targetProduct as any);
    // Prefer popular pack or trial pack
    const selectedPack = packs[1] || packs[0];
    addToCart(targetProduct as any, 1, selectedPack);
  };

  return (
    <section
      id="hero-cinematic-section"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center bg-[#10110F] text-[#F7F3E8] overflow-hidden pt-32 lg:pt-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0 z-0 opacity-35 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-[#10110F] via-[#10110F]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10110F] via-transparent to-[#10110F]/90 z-10" />
        <img
          key={activeSlide.bgImageUrl}
          src={activeSlide.bgImageUrl}
          alt="High Himalayan Peaks"
          className="w-full h-full object-cover object-center grayscale scale-105 animate-in fade-in zoom-in-95 duration-1000"
        />
      </div>

      {/* Decorative vertical accent badge on top right */}
      <div className="hidden lg:flex flex-col items-end gap-1 absolute top-32 right-12 xl:right-16 z-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#B88A32]" />
        <span className="text-[#B88A32] text-[10px] tracking-[0.4em] [writing-mode:vertical-rl] rotate-180 uppercase opacity-70 mt-4 font-semibold">
          {activeSlide.badge}
        </span>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 w-full py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Text & Controls */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Slide Index Pill & Kicker */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="text-[#B88A32] font-semibold text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase">
                {activeSlide.kicker}
              </span>
              <span className="text-[#D4B66A]/60 text-xs">•</span>
              <span className="text-[10px] font-mono tracking-widest text-[#D4B66A] bg-[#183D27] px-2 py-0.5 rounded-xs border border-[#B88A32]/40">
                0{currentSlide + 1} / 0{slides.length}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold leading-[0.96] sm:leading-[0.94] mb-5 sm:mb-6 tracking-tight transition-all duration-500">
              <span className="text-[#F7F3E8] block drop-shadow-md">
                {activeSlide.headlineLine1}
              </span>
              <span className="text-[#D4B66A] block drop-shadow-[0_3px_15px_rgba(212,182,106,0.35)]">
                {activeSlide.headlineLine2}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#E8CA7D] to-[#D4B66A] block">
                {activeSlide.headlineLine3}
              </span>
            </h1>

            <p className="text-[#EEE8D7] opacity-80 text-sm sm:text-base max-w-lg mb-8 sm:mb-9 leading-relaxed font-light min-h-[56px]">
              {activeSlide.description}
            </p>

            {/* Action Buttons: Prominent BUY NOW + Secondary Catalog CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-6">
              {/* Prominent BUY NOW Button */}
              <button
                id="hero-buy-now-btn"
                onClick={handleBuyNow}
                className="px-8 sm:px-10 py-4 bg-gradient-to-r from-[#B88A32] via-[#E8CD82] to-[#B88A32] text-[#10110F] font-black text-xs sm:text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_25px_rgba(212,182,106,0.6)] transition-all shadow-xl rounded-sm text-center min-h-[48px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-[#10110F] text-[#10110F]" />
                <span>BUY NOW</span>
              </button>

              <Link
                id="hero-shop-cta"
                to="/shop"
                className="px-7 sm:px-8 py-3.5 sm:py-4 bg-[#183D27] text-[#F7F3E8] font-bold text-xs tracking-widest uppercase hover:bg-[#10110F] border border-[#B88A32]/40 transition-all rounded-sm text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>{hero.shopButtonText || 'Titan Collection'}</span>
              </Link>

              <Link
                id="hero-guide-cta"
                to="/why-titan"
                className="px-6 sm:px-7 py-3.5 sm:py-4 border border-[#F7F3E8]/30 text-[#F7F3E8] font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all rounded-sm text-center min-h-[48px] flex items-center justify-center"
              >
                <span>Discover Purity</span>
              </Link>
            </div>

            {/* Micro Trust Strip */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-[#EEE8D7]/75">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4B66A] shrink-0" />
                <span>NABL Lab Verified Heavy Metal Free</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Award className="w-4 h-4 text-[#D4B66A] shrink-0" />
                <span>&gt; 75% Active Fulvic Acid</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>Instant WhatsApp Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Showcase Card with Carousel Transition & Controls */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center pb-6 sm:pb-12 mt-4 lg:mt-0">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] bg-[#10110F] border border-[#B88A32]/40 p-3 sm:p-4 shadow-2xl rounded-sm">
              <div className="relative aspect-4/5 w-full bg-[#10110F] overflow-hidden rounded-xs">
                <img
                  key={activeSlide.productCardImageUrl}
                  src={activeSlide.productCardImageUrl}
                  alt={targetProduct.name}
                  className="w-full h-full object-cover animate-in fade-in duration-700 hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/90 via-transparent to-transparent" />

                {/* Top Right Grade Badge */}
                <div className="absolute top-3 right-3 bg-[#183D27]/95 text-[#D4B66A] px-2.5 py-1 rounded-xs text-[9px] font-bold tracking-widest uppercase border border-[#B88A32]/50 shadow-md">
                  {activeSlide.badge}
                </div>

                {/* Bottom Card Title & Quick Add Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#D4B66A] font-bold uppercase tracking-wider">
                      {targetProduct.name}
                    </span>
                    <span className="text-[11px] text-[#F7F3E8] font-sans font-medium">
                      {activeSlide.priceNote}
                    </span>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="p-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] transition-colors shadow-lg cursor-pointer"
                    title="Quick Buy"
                  >
                    <Zap className="w-4 h-4 fill-[#10110F]" />
                  </button>
                </div>
              </div>

              {/* Floating Purity Badge */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-[#F7F3E8] p-3 sm:p-5 shadow-2xl border border-[#10110F]/10 rounded-sm z-30">
                <p className="font-serif italic text-xl sm:text-2xl text-[#183D27] leading-none font-bold">
                  {activeSlide.purityPercent}
                </p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 opacity-75 font-sans font-bold text-[#10110F]">
                  {activeSlide.purityLabel}
                </p>
              </div>
            </div>

            {/* Carousel Interactive Controls (Progress Bar, Dots, Next/Prev) */}
            <div className="w-full max-w-[320px] sm:max-w-[380px] mt-8 flex flex-col gap-2.5">
              {/* Progress Bar for 8s Timer */}
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#B88A32] to-[#E8CD82] h-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`transition-all rounded-full ${
                        currentSlide === idx
                          ? 'w-6 h-2 bg-[#D4B66A]'
                          : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#EEE8D7]/60 mr-2">
                    {isPaused ? 'Paused' : 'Auto 8s'}
                  </span>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    className="p-1.5 rounded-xs bg-[#10110F] border border-white/10 hover:border-[#B88A32] text-[#F7F3E8] hover:text-[#D4B66A] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next slide"
                    className="p-1.5 rounded-xs bg-[#10110F] border border-white/10 hover:border-[#B88A32] text-[#F7F3E8] hover:text-[#D4B66A] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
