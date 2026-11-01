import React, { useState } from 'react';
import {
  Clock,
  Scale,
  Droplet,
  Coffee,
  Sunrise,
  Dumbbell,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Heart,
  Timer,
} from 'lucide-react';
import { Product } from '../types';

interface ProductHowToUseSectionProps {
  product: Product;
  variant?: 'full' | 'compact';
}

export const ProductHowToUseSection: React.FC<ProductHowToUseSectionProps> = ({
  product,
  variant = 'full',
}) => {
  const isResin = product.category === 'resin' || product.slug.includes('resin');
  const isHoneySticks =
    product.category === 'honey-sticks' ||
    product.slug.includes('honey-stick') ||
    product.slug.includes('trio');
  const isBundleWithBoth =
    product.category === 'bundles' ||
    product.slug.includes('ritual-box') ||
    product.slug.includes('bundle');

  // If bundle has both, allow toggle
  const [activeGuide, setActiveGuide] = useState<'resin' | 'honey'>(
    isHoneySticks ? 'honey' : 'resin'
  );

  const showResinGuide = isBundleWithBoth ? activeGuide === 'resin' : !isHoneySticks;

  return (
    <div className="space-y-6">
      {/* If Bundle: Toggle between Resin and Honey Sticks */}
      {isBundleWithBoth && (
        <div className="flex items-center justify-center p-1.5 rounded-sm bg-[#10110F]/5 border border-[#10110F]/10 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveGuide('resin')}
            className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeGuide === 'resin'
                ? 'bg-[#183D27] text-[#D4B66A] shadow-xs'
                : 'text-[#10110F]/70 hover:text-[#10110F]'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Pure Resin Ritual</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGuide('honey')}
            className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeGuide === 'honey'
                ? 'bg-[#183D27] text-[#D4B66A] shadow-xs'
                : 'text-[#10110F]/70 hover:text-[#10110F]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Honey Sticks (On-The-Go)</span>
          </button>
        </div>
      )}

      {/* ---------------- RESIN USAGE PROTOCOL ---------------- */}
      {showResinGuide ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#10110F]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                <Droplet className="w-3 h-3 text-[#B88A32]" />
                <span>ANCIENT AYURVEDIC MORNING RITUAL</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F]">
                How to Use Titan Pure Resin
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#B88A32]/15 text-[#B88A32] text-xs font-bold uppercase tracking-wider self-start sm:self-auto border border-[#B88A32]/30">
              Daily Serving: 200mg – 250mg
            </span>
          </div>

          {/* 3 Steps Visual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1: Measure Dosage */}
            <div className="relative group p-5 sm:p-6 rounded-sm bg-gradient-to-b from-[#F7F3E8] to-white border border-[#10110F]/10 shadow-xs hover:border-[#183D27]/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Step indicator & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                    01
                  </div>
                  <span className="px-2.5 py-1 rounded-xs bg-[#183D27]/10 text-[#183D27] text-[10px] font-bold uppercase tracking-wider">
                    Pea-Sized Portion
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xs bg-[#B88A32]/15 text-[#B88A32] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Scale className="w-6 h-6 text-[#B88A32]" />
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mb-2 leading-tight">
                  Measure Dosage
                </h4>

                <p className="text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed">
                  Use the included measuring spoon to take a <strong>pea-sized amount</strong> (200mg to 250mg).
                </p>
              </div>

              {/* Step highlight footer */}
              <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center gap-2 text-[11px] font-semibold text-[#183D27]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Stainless wand included in every box</span>
              </div>
            </div>

            {/* Step 2: Mix in Warm Liquid */}
            <div className="relative group p-5 sm:p-6 rounded-sm bg-gradient-to-b from-[#F7F3E8] to-white border border-[#10110F]/10 shadow-xs hover:border-[#183D27]/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                    02
                  </div>
                  <span className="px-2.5 py-1 rounded-xs bg-[#183D27]/10 text-[#183D27] text-[10px] font-bold uppercase tracking-wider">
                    200ml Warm Liquid
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xs bg-[#B88A32]/15 text-[#B88A32] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Coffee className="w-6 h-6 text-[#B88A32]" />
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mb-2 leading-tight">
                  Mix in Warm Liquid
                </h4>

                <p className="text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed">
                  Stir into <strong>200ml of lukewarm water, green tea, or warm milk</strong> until fully dissolved (approx 60 seconds).
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center gap-2 text-[11px] font-semibold text-[#183D27]">
                <Timer className="w-3.5 h-3.5 text-[#B88A32]" />
                <span>Dissolves completely into golden-amber</span>
              </div>
            </div>

            {/* Step 3: Morning Timing */}
            <div className="relative group p-5 sm:p-6 rounded-sm bg-gradient-to-b from-[#F7F3E8] to-white border border-[#10110F]/10 shadow-xs hover:border-[#183D27]/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                    03
                  </div>
                  <span className="px-2.5 py-1 rounded-xs bg-[#B88A32]/20 text-[#B88A32] text-[10px] font-bold uppercase tracking-wider">
                    20-30 Min Prior
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xs bg-[#B88A32]/15 text-[#B88A32] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sunrise className="w-6 h-6 text-[#B88A32]" />
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mb-2 leading-tight">
                  Morning Timing
                </h4>

                <p className="text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed">
                  Consume on an <strong>empty stomach 20-30 minutes before breakfast</strong> for highest cellular absorption.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center gap-2 text-[11px] font-semibold text-[#183D27]">
                <Zap className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>Maximum mitochondrial ATP uptake</span>
              </div>
            </div>
          </div>

          {/* Luxury Pro-Tip Strip */}
          <div className="p-4 sm:p-5 rounded-sm bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-[#D4B66A]" />
              </div>
              <div className="text-xs space-y-0.5">
                <strong className="text-[#D4B66A] block uppercase tracking-wider font-sans">
                  Ayurvedic Master Tip:
                </strong>
                <p className="text-[#EEE8D7]/85 font-sans leading-relaxed">
                  Never boil Shilajit resin directly over high flames. Lukewarm water or milk preserves its live botanical enzymes and 70%+ active fulvic acid structure.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xs bg-[#183D27] text-[#D4B66A] text-[10px] font-bold uppercase tracking-widest shrink-0 border border-[#B88A32]/30">
              1 Jar = 40–50 Days
            </span>
          </div>
        </div>
      ) : (
        /* ---------------- HONEY STICKS USAGE PROTOCOL ---------------- */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#10110F]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#B88A32] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                <Zap className="w-3 h-3 text-[#D4B66A]" />
                <span>ON-THE-GO DAILY VITALITY PROTOCOL</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F]">
                How to Use Honey Sticks (All Flavors)
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-wider self-start sm:self-auto border border-[#B88A32]/30">
              No Spoon • Zero Mess
            </span>
          </div>

          {/* 3 Steps Visual Cards Grid for Honey Sticks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1: Direct Consumption */}
            <div className="relative group p-5 sm:p-6 rounded-sm bg-gradient-to-b from-[#F7F3E8] to-white border border-[#10110F]/10 shadow-xs hover:border-[#B88A32]/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                    01
                  </div>
                  <span className="px-2.5 py-1 rounded-xs bg-[#B88A32]/15 text-[#B88A32] text-[10px] font-bold uppercase tracking-wider">
                    ON-THE-GO
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xs bg-[#183D27]/10 text-[#183D27] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-[#B88A32]" />
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mb-2 leading-tight">
                  Direct Consumption
                </h4>

                <p className="text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed">
                  Tear open one stick and <strong>consume directly from the pouch</strong> for convenient, on-the-go use anytime, anywhere.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center gap-2 text-[11px] font-semibold text-[#183D27]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Fits in pocket, gym bag, or laptop sleeve</span>
              </div>
            </div>

            {/* Step 2: Pre-Workout Booster */}
            <div className="relative group p-5 sm:p-6 rounded-sm bg-gradient-to-b from-[#F7F3E8] to-white border border-[#10110F]/10 shadow-xs hover:border-[#B88A32]/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                    02
                  </div>
                  <span className="px-2.5 py-1 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    30 Min Prior
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xs bg-[#183D27]/10 text-[#183D27] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6 text-[#B88A32]" />
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mb-2 leading-tight">
                  Pre-Workout Booster
                </h4>

                <p className="text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed">
                  Take <strong>30 minutes before high-intensity gym sessions</strong> or outdoor endurance runs for clean, sustained stamina.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center gap-2 text-[11px] font-semibold text-[#183D27]">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Clean ATP energy without caffeine crashes</span>
              </div>
            </div>

            {/* Step 3: Beverage Sweetener */}
            <div className="relative group p-5 sm:p-6 rounded-sm bg-gradient-to-b from-[#F7F3E8] to-white border border-[#10110F]/10 shadow-xs hover:border-[#B88A32]/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                    03
                  </div>
                  <span className="px-2.5 py-1 rounded-xs bg-[#B88A32]/15 text-[#B88A32] text-[10px] font-bold uppercase tracking-wider">
                    Daily Pairing
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xs bg-[#183D27]/10 text-[#183D27] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-[#B88A32]" />
                </div>

                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mb-2 leading-tight">
                  Beverage Sweetener
                </h4>

                <p className="text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed">
                  Squeeze into <strong>herbal tea, lemon water, or morning oatmeal</strong> for delicious earthy sweetness and vitality.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#10110F]/10 flex items-center gap-2 text-[11px] font-semibold text-[#183D27]">
                <Coffee className="w-3.5 h-3.5 text-[#183D27]" />
                <span>Raw wild forest honey + 350mg Shilajit</span>
              </div>
            </div>
          </div>

          {/* Flavor Guide Note */}
          <div className="p-4 sm:p-5 rounded-sm bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#D4B66A]" />
              </div>
              <div className="text-xs space-y-0.5">
                <strong className="text-[#D4B66A] block uppercase tracking-wider font-sans">
                  Universal for All Flavors:
                </strong>
                <p className="text-[#EEE8D7]/85 font-sans leading-relaxed">
                  Applies identically to <strong>Classic Wild Honey</strong>, <strong>70% Dark Chocolate</strong>, and <strong>Wild Strawberry</strong> sticks. 100% natural raw honey with standardized 350mg high-altitude Shilajit per stick.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xs bg-[#183D27] text-[#D4B66A] text-[10px] font-bold uppercase tracking-widest shrink-0 border border-[#B88A32]/30">
              100% Raw Forest Honey
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductHowToUseSection;
