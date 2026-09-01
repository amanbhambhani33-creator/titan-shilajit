import React from 'react';
import { Shield, Flame, Activity, Zap, Brain, Heart, RefreshCw, Sun } from 'lucide-react';
import { SHILAJIT_BENEFITS } from '../data/content';

export const BenefitsSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    energy: <Zap className="w-5 h-5 text-[#B88A32]" />,
    stamina: <Activity className="w-5 h-5 text-[#B88A32]" />,
    strength: <Shield className="w-5 h-5 text-[#B88A32]" />,
    focus: <Brain className="w-5 h-5 text-[#B88A32]" />,
    wellness: <Heart className="w-5 h-5 text-[#B88A32]" />,
    stress: <Sun className="w-5 h-5 text-[#B88A32]" />,
    recovery: <RefreshCw className="w-5 h-5 text-[#B88A32]" />,
    vitality: <Flame className="w-5 h-5 text-[#B88A32]" />,
  };

  return (
    <section id="benefits-section" className="py-20 lg:py-28 bg-[#10110F] text-[#F7F3E8] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#183D27]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#B88A32]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-[#B88A32] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
            Bioactive Himalayan Minerals
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F3E8] tracking-tight mb-4">
            THE POWER OF SHILAJIT
          </h2>

          <p className="text-xs sm:text-sm text-[#EEE8D7]/75 font-sans leading-relaxed font-light">
            Revered in classical Ayurvedic traditions as <em>Shilajatu</em> (conqueror of rock), modern research highlights its rich concentration of bio-available fulvic acid and ionic trace minerals.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHILAJIT_BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="p-6 rounded-sm bg-[#183D27]/20 border border-white/10 hover:border-[#B88A32]/40 transition-all duration-300 flex flex-col justify-between group hover:bg-[#183D27]/30"
            >
              <div>
                <div className="w-10 h-10 rounded-sm bg-[#10110F] border border-[#B88A32]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {iconMap[benefit.id] || <Flame className="w-5 h-5 text-[#B88A32]" />}
                </div>

                <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#D4B66A]">
                  {benefit.tagline}
                </span>

                <h3 className="font-serif text-lg font-bold text-[#F7F3E8] mt-1 mb-2">
                  {benefit.title}
                </h3>

                <p className="text-xs text-[#EEE8D7]/75 font-sans leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[9px] text-[#D4B66A] tracking-widest uppercase font-semibold">
                <span>Traditional Botanical Support</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Note */}
        <div className="mt-12 text-center text-xs text-[#EEE8D7]/50 italic font-sans font-light">
          * Statements based on traditional botanical documentation and client-approved product profiles. Individual results may vary.
        </div>
      </div>
    </section>
  );
};
