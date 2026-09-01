import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Award } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

export const HeroSection: React.FC = () => {
  const { content, products } = useStoreContent();
  const hero = content.hero;
  const resinProduct = products.find((p) => p.slug === 'titan-shilajit-resin') || products[0];

  return (
    <section
      id="hero-cinematic-section"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center bg-[#10110F] text-[#F7F3E8] overflow-hidden pt-24 lg:pt-20"
    >
      {/* Background Image with grayscale & dark gradient */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-[#10110F] via-[#10110F]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10110F] via-transparent to-[#10110F]/80 z-10" />
        <img
          src={hero.bgImageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'}
          alt="High Himalayan Peaks"
          className="w-full h-full object-cover object-center grayscale"
        />
      </div>

      {/* Decorative vertical accent badge on top right */}
      <div className="hidden lg:flex flex-col items-end gap-1 absolute top-28 right-12 xl:right-16 z-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#B88A32]" />
        <span className="text-[#B88A32] text-[10px] tracking-[0.4em] [writing-mode:vertical-rl] rotate-180 uppercase opacity-70 mt-4 font-semibold">
          {hero.gradeBadge || 'Grade-A Resin'}
        </span>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="text-[#B88A32] font-semibold text-xs tracking-[0.3em] uppercase block mb-4">
              {hero.kicker}
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold leading-[0.94] mb-6 tracking-tight">
              <span className="text-[#F7F3E8] block drop-shadow-md">
                {hero.headlineLine1}
              </span>
              <span className="text-[#D4B66A] block drop-shadow-[0_3px_15px_rgba(212,182,106,0.35)]">
                {hero.headlineLine2}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#E8CA7D] to-[#D4B66A] block">
                {hero.headlineLine3}
              </span>
            </h1>

            <p className="text-[#EEE8D7] opacity-65 text-sm sm:text-base max-w-md mb-10 leading-relaxed font-light">
              {hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                id="hero-shop-cta"
                to="/shop"
                className="px-8 py-4 bg-[#B88A32] text-[#10110F] font-bold text-xs tracking-widest uppercase hover:bg-[#D4B66A] transition-all shadow-xl rounded-sm text-center"
              >
                {hero.shopButtonText || 'Shop Titan Shilajit'}
              </Link>

              <Link
                id="hero-guide-cta"
                to="/why-titan"
                className="px-8 py-4 border border-[#F7F3E8]/20 text-[#F7F3E8] font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all rounded-sm text-center"
              >
                {hero.guideButtonText || 'Discover The Power'}
              </Link>
            </div>

            {/* Micro Trust Proof */}
            <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#EEE8D7]/75">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4B66A]" />
                <span>NABL Lab Verified Heavy Metal Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4B66A]" />
                <span>&gt; 75% Active Fulvic Acid</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Instant WhatsApp Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Showcase Card with Floating Lab Badge */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end pb-8 sm:pb-12">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] bg-[#10110F] border border-[#B88A32]/30 p-2.5 sm:p-3 shadow-2xl rounded-sm">
              <div className="relative aspect-4/5 w-full bg-[#10110F] overflow-hidden rounded-xs">
                <img
                  src={hero.productCardImageUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt="Titan Pure Himalayan Shilajit Resin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-[#183D27] text-[#D4B66A] px-2.5 py-1 rounded-xs text-[9px] font-bold tracking-widest uppercase border border-[#B88A32]/30">
                  {hero.gradeBadge || 'GRADE-A RESIN'}
                </div>
              </div>

              {/* Floating Purity Badge */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-[#F7F3E8] p-5 sm:p-6 shadow-2xl border border-[#10110F]/10 rounded-sm z-30">
                <p className="font-serif italic text-2xl sm:text-3xl text-[#183D27] leading-none font-bold">
                  {hero.purityPercent || '98.2% Purity'}
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-1 opacity-70 font-sans font-bold text-[#10110F]">
                  {hero.purityLabel || 'Lab Verified Resin'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
