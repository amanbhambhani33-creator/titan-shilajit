import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStoreContent, DEFAULT_HERO_PICTURES } from '../context/StoreContentContext';
import { HeroSlideImage } from '../types';
import { handleImageError } from '../utils/imageUrl';

export const HeroSection: React.FC = () => {
  const { content } = useStoreContent();
  const hero = content.hero;

  const slides: HeroSlideImage[] =
    Array.isArray(hero.pictures) && hero.pictures.length > 0
      ? hero.pictures
      : DEFAULT_HERO_PICTURES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});

  // Touch gesture state for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Slow, relaxed carousel speed (7.5s - 8s default, leisurely pace)
  const duration = Math.max(5000, hero.autoplayInterval || 7500);

  // Measure natural image aspect ratio to automatically adjust mobile container
  const handleImageLoaded = (key: string | number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspectRatios((prev) => ({
        ...prev,
        [String(key)]: ratio,
      }));
    }
  };

  // Next and Prev handlers
  const handleNext = useCallback(() => {
    setCurrentSlide((curr) => (curr + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((curr) => (curr - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  // Autoplay timer: gently pauses when hovered
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, duration);

    return () => clearInterval(timer);
  }, [isHovered, duration, slides.length, handleNext]);

  // Touch swipe listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = slides[currentSlide] || slides[0];
  const isSlideEffect = hero.transitionEffect === 'slide';

  // Words overlay toggle (defaults to false = NO words, only picture transition)
  const showWords = Boolean(hero.showWords);

  // Resolve responsive mobile aspect ratio
  const activeKey = activeSlide.id || String(currentSlide);
  const detectedRatio = aspectRatios[activeKey] || aspectRatios[String(currentSlide)] || (16 / 9);

  const mobileRatioSetting = hero.mobileAspectRatio || 'auto';
  let resolvedMobileAspect = detectedRatio;
  if (mobileRatioSetting === '16/9') resolvedMobileAspect = 16 / 9;
  else if (mobileRatioSetting === '4/3') resolvedMobileAspect = 4 / 3;
  else if (mobileRatioSetting === '1/1') resolvedMobileAspect = 1;
  else if (mobileRatioSetting === '4/5') resolvedMobileAspect = 4 / 5;
  // Guard ratio between 0.65 and 2.4
  resolvedMobileAspect = Math.max(0.65, Math.min(2.4, resolvedMobileAspect));

  const mobileFit = hero.mobileFit || 'auto';

  // Helper to resolve product specific target URL
  const getProductTargetUrl = (slide: HeroSlideImage, index: number): string => {
    if (slide.linkUrl && slide.linkUrl.startsWith('/product/')) {
      return slide.linkUrl;
    }
    const defaultProductLinks = [
      '/product/titan-shilajit-resin',
      '/product/titan-honey-sticks-classic',
      '/product/titan-honey-sticks-dark-chocolate',
      '/product/titan-honey-sticks-strawberry',
      '/product/titan-vitality-ritual-box',
      '/product/titan-honey-sticks-trio',
    ];
    return defaultProductLinks[index % defaultProductLinks.length];
  };

  return (
    <section
      id="hero-picture-transition-section"
      className="relative w-full bg-[#10110F] text-[#F7F3E8] overflow-hidden pt-20 sm:pt-28 lg:pt-24 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile-Adaptive Picture Transition Stage */}
      <div
        className="relative w-full sm:h-[68vh] lg:h-[80vh] min-h-[200px] sm:min-h-[420px] max-h-[860px] overflow-hidden bg-[#0A0B0A] transition-[aspect-ratio,height] duration-500 ease-out"
        style={{
          aspectRatio: `var(--mobile-hero-aspect, ${resolvedMobileAspect})`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pictures Stack with Smooth Crossfade or Slide */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isNext = (index === (currentSlide + 1) % slides.length);
          const isPrev = (index === (currentSlide - 1 + slides.length) % slides.length);
          const targetUrl = getProductTargetUrl(slide, index);

          return (
            <div
              key={slide.id || index}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-all ease-in-out duration-1000 group ${
                isSlideEffect
                  ? isActive
                    ? 'opacity-100 translate-x-0 z-10'
                    : isNext
                    ? 'opacity-0 translate-x-full z-0'
                    : isPrev
                    ? 'opacity-0 -translate-x-full z-0'
                    : 'opacity-0 z-0'
                  : isActive
                  ? 'opacity-100 z-10 scale-100'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* 1. Ambient Blurred Backdrop for Ultra-Luxury Fill (Mobile & Desktop) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35 sm:opacity-20 z-0">
                <img
                  src={slide.mobileImageUrl || slide.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover blur-2xl scale-110"
                />
              </div>

              {/* 2. Main Foreground Banner Image with <picture> support */}
              <Link
                to={targetUrl}
                className="relative z-10 block w-full h-full cursor-pointer flex items-center justify-center"
                tabIndex={isActive ? 0 : -1}
                aria-label={slide.title || 'Explore Titan Shilajit Product'}
              >
                <picture className="w-full h-full flex items-center justify-center">
                  {slide.mobileImageUrl && (
                    <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />
                  )}
                  <img
                    src={slide.imageUrl}
                    alt={slide.altText || slide.title || `Himalayan Pure Shilajit Transition Slide ${index + 1}`}
                    referrerPolicy="no-referrer"
                    onLoad={(e) => handleImageLoaded(slide.id || index, e)}
                    className={`w-full h-full transform transition-transform duration-7000 ease-out scale-100 group-hover:scale-105 ${
                      mobileFit === 'cover'
                        ? 'object-cover object-center'
                        : 'object-contain sm:object-cover object-center'
                    }`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onError={(e) =>
                      handleImageError(e, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=85')
                    }
                  />
                </picture>
              </Link>

              {/* Subtle Cinematic Vignette Framing (no text, pure aesthetic atmosphere) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/70 via-transparent to-[#10110F]/20 pointer-events-none z-15" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10110F]/30 via-transparent to-[#10110F]/30 pointer-events-none z-15" />

              {/* Product Direct Buying Option Badge on each slide (Mobile Optimized) */}
              <div className="absolute bottom-2.5 sm:bottom-16 left-2.5 sm:left-8 z-20 pointer-events-auto">
                <Link
                  to={targetUrl}
                  tabIndex={isActive ? 0 : -1}
                  className="inline-flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xs bg-[#10110F]/90 hover:bg-[#183D27] text-[#F7F3E8] border border-[#B88A32]/60 shadow-xl backdrop-blur-md transition-all group/badge max-w-[210px] sm:max-w-xs"
                >
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-[#D4B66A] font-bold">
                      PRODUCT SPECIAL
                    </span>
                    <span className="text-[10px] sm:text-xs font-serif font-bold text-[#F7F3E8] group-hover/badge:text-[#D4B66A] transition-colors truncate">
                      {slide.title || 'Titan Pure Himalayan Shilajit'}
                    </span>
                  </div>
                  <span className="ml-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs bg-[#B88A32] text-[#10110F] text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-0.5 group-hover/badge:bg-[#E8CD82] transition-colors shadow-xs">
                    <span>BUY</span>
                    <span>&rarr;</span>
                  </span>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Optional Words Overlay (Only shown if explicitly toggled on in admin, otherwise hidden) */}
        {showWords && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-12 lg:p-16 max-w-4xl mx-auto pointer-events-none">
            <span className="text-[#D4B66A] font-semibold text-xs tracking-[0.25em] uppercase mb-1 sm:mb-2">
              {hero.kicker}
            </span>
            <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#F7F3E8] mb-2 sm:mb-3">
              {hero.headlineLine1} {hero.headlineLine2}
            </h1>
            <p className="text-xs sm:text-base text-[#EEE8D7]/80 max-w-xl mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
              {hero.description}
            </p>
            <div className="pointer-events-auto">
              <Link
                to="/shop"
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#B88A32] text-[#10110F] font-bold text-[11px] sm:text-xs tracking-widest uppercase hover:bg-[#D4B66A] transition-colors rounded-xs shadow-lg"
              >
                <span>{hero.shopButtonText || 'Shop Collection'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Desktop/Tablet Arrow Navigation (Hover visible) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous banner picture"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#10110F]/70 hover:bg-[#183D27] text-[#D4B66A] border border-[#B88A32]/50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next banner picture"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#10110F]/70 hover:bg-[#183D27] text-[#D4B66A] border border-[#B88A32]/50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Minimalist Dots Indicators (Corner docked on mobile, centered on desktop) */}
        {slides.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-6 right-2.5 sm:right-auto sm:inset-x-0 z-30 flex items-center justify-end sm:justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-[#10110F]/80 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#B88A32]/40 shadow-lg">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to picture ${idx + 1}`}
                  className={`transition-all rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-gradient-to-r from-[#B88A32] to-[#E8CD82] shadow-xs'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default HeroSection;
