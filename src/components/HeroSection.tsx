import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { useStoreContent, DEFAULT_HERO_PICTURES } from '../context/StoreContentContext';
import { HeroSlideImage } from '../types';

export const HeroSection: React.FC = () => {
  const { content } = useStoreContent();
  const hero = content.hero;

  const slides: HeroSlideImage[] =
    Array.isArray(hero.pictures) && hero.pictures.length > 0
      ? hero.pictures
      : DEFAULT_HERO_PICTURES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch gesture state for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Mandatory 3-5 second automation interval
  const rawInterval = hero.autoplayInterval || 4000;
  const duration = Math.min(5000, Math.max(3000, rawInterval));
  const intervalStep = 50;

  // Next and Prev handlers
  const handleNext = useCallback(() => {
    setCurrentSlide((curr) => (curr + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((curr) => (curr - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  // Autoplay timer with progress bar (3-5s continuous automation)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (intervalStep / duration) * 100;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, duration, slides.length, handleNext]);

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
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

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

  return (
    <section
      id="hero-picture-transition-section"
      className="relative w-full bg-[#10110F] text-[#F7F3E8] overflow-hidden pt-24 sm:pt-28 lg:pt-24 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Picture Transition Stage */}
      <div className="relative w-full h-[54vh] sm:h-[68vh] lg:h-[80vh] min-h-[380px] max-h-[820px] overflow-hidden bg-[#0A0B0A]">
        {/* Pictures Stack with Smooth Crossfade or Slide */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isNext = (index === (currentSlide + 1) % slides.length);
          const isPrev = (index === (currentSlide - 1 + slides.length) % slides.length);

          const ImageElement = (
            <img
              src={slide.imageUrl}
              alt={slide.altText || slide.title || `Himalayan Pure Shilajit Transition Slide ${index + 1}`}
              className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out scale-100 group-hover:scale-105"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          );

          return (
            <div
              key={slide.id || index}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-all ease-in-out duration-700 group ${
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
              {slide.linkUrl ? (
                <Link
                  to={slide.linkUrl}
                  className="block w-full h-full cursor-pointer"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={slide.title || 'Explore Titan Shilajit Product'}
                >
                  {ImageElement}
                </Link>
              ) : (
                <div className="w-full h-full">
                  {ImageElement}
                </div>
              )}

              {/* Subtle Cinematic Vignette Framing (no text, pure aesthetic atmosphere) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/60 via-transparent to-[#10110F]/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10110F]/40 via-transparent to-[#10110F]/40 pointer-events-none" />
            </div>
          );
        })}

        {/* Optional Words Overlay (Only shown if explicitly toggled on in admin, otherwise hidden) */}
        {showWords && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-4xl mx-auto pointer-events-none">
            <span className="text-[#D4B66A] font-semibold text-xs tracking-[0.25em] uppercase mb-2">
              {hero.kicker}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#F7F3E8] mb-3">
              {hero.headlineLine1} {hero.headlineLine2}
            </h1>
            <p className="text-sm sm:text-base text-[#EEE8D7]/80 max-w-xl mb-6">
              {hero.description}
            </p>
            <div className="pointer-events-auto">
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-3 bg-[#B88A32] text-[#10110F] font-bold text-xs tracking-widest uppercase hover:bg-[#D4B66A] transition-colors rounded-xs shadow-lg"
              >
                <span>{hero.shopButtonText || 'Shop Collection'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Left Chevron Button */}
        {slides.length > 1 && (
          <button
            onClick={handlePrev}
            id="hero-picture-prev-btn"
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-[#10110F]/65 hover:bg-[#183D27] text-[#F7F3E8] hover:text-[#D4B66A] border border-[#B88A32]/40 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Right Chevron Button */}
        {slides.length > 1 && (
          <button
            onClick={handleNext}
            id="hero-picture-next-btn"
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-[#10110F]/65 hover:bg-[#183D27] text-[#F7F3E8] hover:text-[#D4B66A] border border-[#B88A32]/40 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Top-Right Dedicated Play/Pause Indicator (Mandatory 3-5s automation) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-auto">
          <button
            type="button"
            id="hero-header-play-pause-btn"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume picture automation' : 'Pause picture automation'}
            className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              isPaused
                ? 'bg-[#B88A32] text-[#10110F] border-[#E8CD82] ring-2 ring-[#B88A32]/40 scale-105'
                : 'bg-[#10110F]/80 text-[#EEE8D7] hover:text-[#D4B66A] border-white/20 hover:border-[#B88A32]/60'
            }`}
            title={isPaused ? 'Click to Play transition (3-5s)' : 'Click to Pause transition'}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current text-[#10110F]" />
                <span className="font-black">RESUME AUTO</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 fill-current text-[#D4B66A]" />
                <span>{(duration / 1000).toFixed(1)}S AUTO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </>
            )}
          </button>
        </div>

        {/* Subtle Bottom Controls & Indicator Pill */}
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto pointer-events-none">
          {/* Prominent Play / Pause Button with Label */}
          <button
            type="button"
            id="hero-bottom-play-pause-btn"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume picture transition' : 'Pause picture transition'}
            className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-xl active:scale-95 ${
              isPaused
                ? 'bg-[#B88A32] text-[#10110F] border-[#E8CD82] ring-2 ring-[#B88A32]/50'
                : 'bg-[#10110F]/85 hover:bg-[#183D27] text-[#D4B66A] border-[#B88A32]/50'
            }`}
            title={isPaused ? 'Click to Auto-play (3-5s)' : 'Click to Pause'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#10110F]" />
                <span className="text-[10px] font-black tracking-widest uppercase">PLAY</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current text-[#D4B66A]" />
                <span className="text-[10px] font-bold tracking-widest uppercase">PAUSE</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </>
            )}
          </button>

          {/* Dots Indicators */}
          <div className="pointer-events-auto flex items-center gap-2 bg-[#10110F]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#B88A32]/40 shadow-md">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to picture ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-7 h-2 bg-gradient-to-r from-[#B88A32] to-[#E8CD82] shadow-xs'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Slide Count Indicator & Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#D4B66A] bg-[#10110F]/75 px-3 py-1.5 rounded-full border border-[#B88A32]/40 backdrop-blur-md">
            <span>0{currentSlide + 1} / 0{slides.length}</span>
            {isPaused && (
              <span className="text-[9px] font-sans font-bold bg-[#B88A32] text-[#10110F] px-1 rounded-xs uppercase">
                PAUSED
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Countdown Progress Bar at Bottom of Image Frame */}
        {slides.length > 1 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/50 z-30">
            <div
              className={`h-full transition-all duration-75 ease-linear ${
                isPaused
                  ? 'bg-[#B88A32]/50 opacity-60'
                  : 'bg-gradient-to-r from-[#B88A32] via-[#E8CD82] to-[#B88A32]'
              }`}
              style={{ width: isPaused ? `${progress}%` : `${progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
};
export default HeroSection;
