import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  const [isHovered, setIsHovered] = useState(false);

  // Touch gesture state for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Slow, relaxed carousel speed (7.5s - 8s default, leisurely pace)
  const duration = Math.max(5000, hero.autoplayInterval || 7500);

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
      className="relative w-full bg-[#10110F] text-[#F7F3E8] overflow-hidden pt-24 sm:pt-28 lg:pt-24 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Picture Transition Stage */}
      <div
        className="relative w-full h-[54vh] sm:h-[68vh] lg:h-[80vh] min-h-[380px] max-h-[820px] overflow-hidden bg-[#0A0B0A]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pictures Stack with Smooth Crossfade or Slide */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isNext = (index === (currentSlide + 1) % slides.length);
          const isPrev = (index === (currentSlide - 1 + slides.length) % slides.length);
          const targetUrl = getProductTargetUrl(slide, index);

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
              <Link
                to={targetUrl}
                className="block w-full h-full cursor-pointer"
                tabIndex={isActive ? 0 : -1}
                aria-label={slide.title || 'Explore Titan Shilajit Product'}
              >
                {ImageElement}
              </Link>

              {/* Subtle Cinematic Vignette Framing (no text, pure aesthetic atmosphere) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/70 via-transparent to-[#10110F]/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10110F]/40 via-transparent to-[#10110F]/40 pointer-events-none" />

              {/* Product Direct Buying Option Badge on each slide */}
              <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 z-20 pointer-events-auto">
                <Link
                  to={targetUrl}
                  tabIndex={isActive ? 0 : -1}
                  className="inline-flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xs bg-[#10110F]/85 hover:bg-[#183D27] text-[#F7F3E8] border border-[#B88A32]/60 shadow-2xl backdrop-blur-md transition-all group/badge"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-widest text-[#D4B66A] font-bold">
                      PRODUCT SPECIAL
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-[#F7F3E8] group-hover/badge:text-[#D4B66A] transition-colors truncate max-w-[190px] sm:max-w-xs">
                      {slide.title || 'Titan Pure Himalayan Shilajit'}
                    </span>
                  </div>
                  <span className="ml-1 px-2.5 py-1 rounded-xs bg-[#B88A32] text-[#10110F] text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 group-hover/badge:bg-[#E8CD82] transition-colors shadow-xs">
                    <span>BUY PRODUCT</span>
                    <span>&rarr;</span>
                  </span>
                </Link>
              </div>
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

        {/* Sleek Minimalist Dots Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 sm:bottom-6 inset-x-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-[#10110F]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B88A32]/40 shadow-lg">
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
          </div>
        )}
      </div>
    </section>
  );
};
export default HeroSection;
