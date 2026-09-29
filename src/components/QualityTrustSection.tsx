import React from 'react';
import {
  ShieldCheck,
  BadgeCheck,
  Award,
} from 'lucide-react';
import { useStoreContent, DEFAULT_QUALITY_TRUST } from '../context/StoreContentContext';

export const QualityTrustSection: React.FC = () => {
  const { content } = useStoreContent();
  const qualityTrustData = content.qualityTrust || DEFAULT_QUALITY_TRUST;
  const cards = qualityTrustData.cards && qualityTrustData.cards.length > 0
    ? qualityTrustData.cards
    : DEFAULT_QUALITY_TRUST.cards;

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

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#183D27]/80 border border-[#B88A32]/40 text-[#D4B66A] text-xs font-mono font-bold tracking-widest uppercase">
            <span>{cards.length} PURITY PILLARS</span>
          </div>
        </div>

        {/* 4 Purity & Trust Cards */}
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

          {/* Guarantee banner below cards */}
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
            <div className="px-4 py-2 rounded-xl bg-[#10110F] border border-[#B88A32]/60 text-[#D4B66A] text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#25D366]" />
              <span>NABL LAB VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityTrustSection;
