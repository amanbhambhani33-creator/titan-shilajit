import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Award,
  FileText,
  BadgeCheck,
  Flame,
  Droplets,
  Layers,
} from 'lucide-react';
import { useStoreContent, DEFAULT_QUALITY_TRUST } from '../context/StoreContentContext';

interface QualityPillar {
  title: string;
  description: string;
}

interface QualitySlide {
  id: string;
  tabLabel: string;
  sectionKicker: string;
  heading: string;
  subheading: string;
  intro: string;
  bannerImageUrl: string;
  bannerTag: string;
  pictureUrl: string;
  pictureCaption: string;
  pictureBadge: string;
  pillars: QualityPillar[];
  notice?: string;
}

export const QualityTrustSection: React.FC = () => {
  const { content } = useStoreContent();
  const qualityTrustData = content.qualityTrust || DEFAULT_QUALITY_TRUST;
  const cards = qualityTrustData.cards && qualityTrustData.cards.length > 0
    ? qualityTrustData.cards
    : DEFAULT_QUALITY_TRUST.cards;

  const [activeTab, setActiveTab] = useState<'cards' | 'chapters'>('cards');

  const slides: QualitySlide[] = [
    {
      id: 'commitment',
      tabLabel: '01. Quality Commitment',
      sectionKicker: qualityTrustData.kicker || 'QUALITY & TRUST',
      heading: qualityTrustData.title || 'Quality You Can See. Trust You Can Feel.',
      subheading: 'Our Commitment to Quality',
      intro: qualityTrustData.description ||
        'At Titan Shilajit, we believe that true wellness begins with purity, transparency, and responsible quality practices. Our aim is to deliver products that reflect trust, consistency, and care at every stage.',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
      bannerTag: '16,000+ FT HIGH HIMALAYAN SELECTION',
      pictureUrl:
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85',
      pictureCaption: 'Pure Grade-A Himalayan Resin in Obsidian Amber Glass',
      pictureBadge: 'TRADITIONAL PURITY',
      pillars: [
        {
          title: 'Premium Quality Ingredients',
          description:
            'We focus on selecting quality ingredients and maintaining careful standards throughout the product journey.',
        },
        {
          title: 'Authenticity You Can Trust',
          description:
            'We value traditional wellness knowledge and combine it with a modern approach to quality and product care.',
        },
        {
          title: 'Consistency in Every Batch',
          description:
            'We work towards maintaining consistent quality, texture, appearance, and overall product experience.',
        },
        {
          title: 'Hygienic Processing & Packaging',
          description:
            'Our products are packed with attention to hygiene and safety to help preserve freshness and quality.',
        },
        {
          title: 'Transparent Product Information',
          description:
            'We provide clear information about ingredients, usage, batch details, and product specifications so customers can make informed choices.',
        },
        {
          title: 'Customer-Centric Approach',
          description:
            'Your trust motivates us to continuously focus on quality improvement and responsible product practices.',
        },
      ],
    },
    {
      id: 'assurance',
      tabLabel: '02. Quality Assurance',
      sectionKicker: 'QUALITY ASSURANCE',
      heading: 'Careful Standards From Source To Shelf',
      subheading: 'Continuous Process & Batch Oversight',
      intro:
        'At Titan Shilajit, quality is a continuous process. We focus on rigorous evaluation and careful oversight from raw extraction to safe storage and secure delivery.',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=85',
      bannerTag: 'NABL ACCREDITED LABORATORY ASSAY',
      pictureUrl:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85',
      pictureCaption: 'Standardized Chromatography & Heavy Metal Free Verification',
      pictureBadge: 'LAB CERTIFIED',
      pillars: [
        {
          title: 'Raw Material Evaluation',
          description:
            'Careful selection and evaluation of ingredients before they become part of our products.',
        },
        {
          title: 'Batch Traceability',
          description:
            'Maintaining batch details to support transparency and product tracking.',
        },
        {
          title: 'Quality Checks',
          description:
            'Following quality-focused procedures to help ensure product consistency and reliability.',
        },
        {
          title: 'Safe Storage Practices',
          description:
            'Proper handling and storage conditions to help maintain product quality.',
        },
        {
          title: 'Secure Packaging',
          description:
            'Protective packaging designed to maintain product integrity until it reaches you.',
        },
        {
          title: 'Customer Support & Transparency',
          description:
            'We believe in building long-term relationships through honest communication and reliable information.',
        },
      ],
    },
    {
      id: 'promise',
      tabLabel: '03. Our Sacred Promise',
      sectionKicker: 'OUR PROMISE & INTEGRITY',
      heading: 'Traditional Wellness Inspired by Authenticity & Trust',
      subheading: 'Our Dedicated Commitment to You',
      intro:
        'Titan Shilajit represents our commitment to bringing traditional wellness inspired products with a focus on quality, authenticity, and trust.',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      bannerTag: 'ANCIENT AYURVEDA MEETS MODERN TRANSPARENCY',
      pictureUrl:
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1000&q=85',
      pictureCaption: 'Apothecary Grade Packaging Sealed for Peak Potency',
      pictureBadge: 'GOLD SEAL PROMISE',
      pillars: [
        {
          title: 'High-Altitude Sourced',
          description:
            'Hand-gathered from sheer Himalayan granite crevices above 16,000 feet during peak solar heat.',
        },
        {
          title: 'Surya Tapi Purification',
          description:
            'Slow sun-cured over 40 days using glacial spring water, preserving sensitive live enzymes without heat degradation.',
        },
        {
          title: 'Full Batch Traceability',
          description:
            'Every jar corresponds to transparent batch documentation and verifiable third-party testing parameters.',
        },
        {
          title: 'Zero Synthetic Additives',
          description:
            'Free from artificial binders, chemical fillers, maltodextrin, heavy metals, or added sugar.',
        },
      ],
      notice:
        'Please refer to individual product packaging for complete ingredient details, batch information, testing details, serving guidelines, and regulatory information.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const DURATION = 7000;
  const INTERVAL_STEP = 100;

  useEffect(() => {
    if (!isPlaying || activeTab !== 'chapters') return;

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
  }, [isPlaying, slides.length, activeTab]);

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

  const active = slides[currentSlide];

  return (
    <section
      id="quality-trust-section"
      className="py-16 sm:py-24 bg-[#10110F] text-[#F7F3E8] relative overflow-hidden border-t border-b border-[#B88A32]/20"
    >
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-radial from-[#183D27]/25 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#D4B66A]" />
              <span className="text-[#B88A32] font-semibold text-xs tracking-[0.3em] uppercase">
                {qualityTrustData.kicker || 'QUALITY & TRUST'}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F7F3E8] tracking-tight">
              {qualityTrustData.title || 'Quality You Can See. Trust You Can Feel.'}
            </h2>
            <p className="text-xs sm:text-sm text-[#EEE8D7]/75 font-sans leading-relaxed max-w-2xl mt-2 font-light">
              {qualityTrustData.description}
            </p>
          </div>

          {/* View Toggle (4 Purity Cards vs Detailed Chapters) */}
          <div className="flex items-center gap-2 bg-[#183D27]/60 p-1 rounded-lg border border-[#B88A32]/30 shrink-0">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'cards'
                  ? 'bg-[#B88A32] text-[#10110F] shadow-sm'
                  : 'text-[#EEE8D7]/80 hover:text-white'
              }`}
            >
              Purity Pillars ({cards.length})
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-[#B88A32] text-[#10110F] shadow-sm'
                  : 'text-[#EEE8D7]/80 hover:text-white'
              }`}
            >
              Commitment Journey
            </button>
          </div>
        </div>

        {/* VIEW A: 4 Purity & Trust Cards (Matching User's Card Style Archetype) */}
        {activeTab === 'cards' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="bg-[#181A16] rounded-3xl overflow-hidden border border-[#B88A32]/30 shadow-lg hover:border-[#B88A32] transition-all duration-300 flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3.5] w-full overflow-hidden bg-[#10110F]">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181A16] via-[#181A16]/30 to-transparent" />
                    {card.badge && (
                      <div className="absolute top-3.5 right-3.5 bg-[#183D27]/95 border border-[#B88A32]/50 text-[#D4B66A] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {card.badge}
                      </div>
                    )}
                    {card.tag && (
                      <div className="absolute bottom-3 left-3.5 text-[#D4B66A] text-[10px] font-mono tracking-widest font-bold">
                        {card.tag}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3E8] tracking-tight mb-1 group-hover:text-[#D4B66A] transition-colors">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#B88A32] mb-2 font-mono">
                          {card.subtitle}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-[#EEE8D7]/80 font-sans leading-relaxed font-light">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D4B66A] font-semibold">
                      <span className="flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 text-[#D4B66A]" />
                        <span>Verified Standard</span>
                      </span>
                      <span className="text-[10px] font-mono text-white/40">0{idx + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick banner below cards */}
            <div className="mt-10 p-5 rounded-2xl bg-[#183D27]/40 border border-[#B88A32]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B88A32]/20 border border-[#B88A32]/40 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#D4B66A]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#F7F3E8]">
                    100% Surya Tapi Glacial Sun-Purified Shilajit
                  </h4>
                  <p className="text-xs text-[#EEE8D7]/75">
                    Zero chemical boiling • Free from maltodextrin & fillers • Full batch traceability
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('chapters')}
                className="px-4 py-2 rounded-xl bg-[#10110F] border border-[#B88A32]/60 hover:bg-[#B88A32] hover:text-[#10110F] text-[#D4B66A] text-xs font-bold uppercase tracking-wider transition-all shrink-0"
              >
                Read Detailed Standards &rarr;
              </button>
            </div>
          </div>
        )}

        {/* VIEW B: 3 Chapters Detailed Carousel */}
        {activeTab === 'chapters' && (
          <div className="animate-in fade-in duration-500">
            {/* Carousel Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-[#183D27]/80 border border-[#B88A32]/30 px-3 py-1.5 rounded-xs text-xs font-mono text-[#D4B66A]">
                <span>CHAPTER 0{currentSlide + 1} / 0{slides.length}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                  className="p-2 rounded-xs bg-[#10110F] border border-white/15 hover:border-[#B88A32] text-[#F7F3E8] hover:text-[#D4B66A] transition-colors"
                  title={isPlaying ? 'Pause Carousel' : 'Play Carousel'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handlePrev}
                  aria-label="Previous Chapter"
                  className="p-2 rounded-xs bg-[#10110F] border border-white/15 hover:border-[#B88A32] text-[#F7F3E8] hover:text-[#D4B66A] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Chapter"
                  className="p-2 rounded-xs bg-[#10110F] border border-white/15 hover:border-[#B88A32] text-[#F7F3E8] hover:text-[#D4B66A] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Chapter Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-8">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`text-left p-3.5 sm:p-4 rounded-xs border transition-all cursor-pointer relative overflow-hidden ${
                    currentSlide === idx
                      ? 'bg-[#183D27]/90 border-[#B88A32] shadow-lg shadow-[#183D27]/40'
                      : 'bg-[#10110F] border-white/10 hover:border-white/20 text-[#EEE8D7]/70 hover:text-[#F7F3E8]'
                  }`}
                >
                  {currentSlide === idx && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B88A32] to-[#E8CD82] transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <span
                    className={`text-[10px] font-mono tracking-widest uppercase block mb-1 ${
                      currentSlide === idx ? 'text-[#D4B66A]' : 'text-white/40'
                    }`}
                  >
                    {s.tabLabel}
                  </span>
                  <span
                    className={`font-serif text-sm sm:text-base font-bold block line-clamp-1 ${
                      currentSlide === idx ? 'text-[#F7F3E8]' : 'text-[#EEE8D7]/80'
                    }`}
                  >
                    {s.subheading}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Carousel Slide Card with Banner + Picture + Content */}
            <div className="bg-[#141513] border border-[#B88A32]/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
              {/* Top Atmospheric Header Banner */}
              <div className="relative h-36 sm:h-48 lg:h-56 w-full overflow-hidden">
                <img
                  key={active.bannerImageUrl}
                  src={active.bannerImageUrl}
                  alt={active.bannerTag}
                  className="w-full h-full object-cover object-center animate-in fade-in duration-700 brightness-75 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141513] via-[#141513]/60 to-transparent" />
                <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center gap-2">
                  <span className="bg-[#183D27]/90 border border-[#B88A32]/50 text-[#D4B66A] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-xs backdrop-blur-xs">
                    {active.bannerTag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 right-4">
                  <span className="text-[#B88A32] text-[11px] sm:text-xs font-bold uppercase tracking-widest block mb-1">
                    {active.sectionKicker}
                  </span>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#F7F3E8] tracking-tight">
                    {active.heading}
                  </h3>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[#EEE8D7] text-sm sm:text-base leading-relaxed max-w-4xl mb-8 font-light border-l-2 border-[#B88A32] pl-4 italic">
                  {active.intro}
                </p>

                {/* Split: Picture Showcase (Left) + Pillars Grid (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="relative w-full max-w-[340px] bg-[#10110F] border border-[#B88A32]/40 p-3 rounded-2xl shadow-xl group">
                      <div className="relative aspect-square sm:aspect-[4/4.5] w-full overflow-hidden rounded-xl bg-black/40">
                        <img
                          key={active.pictureUrl}
                          src={active.pictureUrl}
                          alt={active.pictureCaption}
                          className="w-full h-full object-cover object-center animate-in fade-in duration-700 group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/90 via-transparent to-transparent" />

                        <div className="absolute top-3 right-3 bg-[#183D27]/95 text-[#D4B66A] px-2.5 py-1 rounded-xs text-[9px] font-bold tracking-widest uppercase border border-[#B88A32]/50 shadow-md">
                          {active.pictureBadge}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-[11px] text-[#F7F3E8] font-medium leading-tight">
                            {active.pictureCaption}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#D4B66A]">
                        <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                          <BadgeCheck className="w-3.5 h-3.5 text-[#D4B66A]" />
                          Titan Verified
                        </span>
                        <span className="text-[#EEE8D7]/60 font-mono">100% PURE</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4B66A]">
                        {active.subheading}
                      </h4>
                      <span className="text-[11px] text-[#EEE8D7]/60">
                        {active.pillars.length} Key Standards
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {active.pillars.map((pillar, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-4 rounded-xl bg-[#10110F]/90 border border-white/10 hover:border-[#B88A32]/50 transition-all flex items-start gap-3 group"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#D4B66A] shrink-0 mt-0.5 group-hover:text-[#E8CD82] transition-colors" />
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-[#F7F3E8] mb-1 group-hover:text-[#D4B66A] transition-colors">
                              {pillar.title}
                            </h5>
                            <p className="text-[11px] sm:text-xs text-[#EEE8D7]/75 leading-relaxed font-light">
                              {pillar.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {active.notice && (
                      <div className="mt-6 p-4 rounded-xl bg-[#183D27]/40 border border-[#B88A32]/40 flex items-start gap-3">
                        <FileText className="w-4 h-4 text-[#D4B66A] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#EEE8D7]/90 leading-relaxed font-sans">
                          {active.notice}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Carousel Progress & Quick Switcher */}
              <div className="bg-[#10110F] px-6 sm:px-8 py-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#EEE8D7]/70 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>
                    Continuous Quality & Authenticity Standards from Himalayan Source to Sealed Jar
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4B66A]">
                    {isPlaying ? 'Auto-Advancing (7s)' : 'Paused'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => goToSlide(dotIdx)}
                        aria-label={`Jump to chapter ${dotIdx + 1}`}
                        className={`rounded-full transition-all ${
                          currentSlide === dotIdx
                            ? 'w-5 h-1.5 bg-[#D4B66A]'
                            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

