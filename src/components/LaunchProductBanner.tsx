import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const LaunchProductBanner: React.FC = () => {
  const { content } = useStoreContent();
  const banner = content.launchBanner;

  if (!banner || !banner.enabled) return null;

  return (
    <section
      id="new-launch-product-banner"
      className="relative bg-[#10110F] text-[#F7F3E8] py-14 sm:py-20 border-y border-[#B88A32]/30 overflow-hidden"
    >
      {/* Dynamic Background Ambient Light */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#183D27] blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#B88A32] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="bg-gradient-to-br from-[#183D27]/80 via-[#10110F] to-[#183D27]/40 border border-[#B88A32]/40 rounded-sm p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B88A32] text-[#10110F] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-4 shadow-md">
                <Award className="w-3.5 h-3.5" />
                <span>{banner.badge || 'NEW LAUNCH 2026'}</span>
              </div>

              {/* Offer Tag */}
              <div className="text-[11px] sm:text-xs font-bold tracking-widest text-[#D4B66A] uppercase mb-2">
                {banner.offerTag}
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F7F3E8] leading-tight mb-3">
                {banner.title}
              </h2>
              <h3 className="text-base sm:text-lg text-[#EEE8D7]/85 font-medium mb-4 italic font-serif">
                {banner.subtitle}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#EEE8D7]/75 font-sans leading-relaxed max-w-xl mb-6 font-light">
                {banner.description}
              </p>

              {/* Key Features Bullet List */}
              {banner.features && banner.features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mb-8">
                  {banner.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#EEE8D7]">
                      <div className="w-4 h-4 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0 border border-[#B88A32]/40">
                        <Zap className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing & CTA Buttons */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#D4B66A]">
                    {banner.priceText}
                  </span>
                  {banner.mrpText && (
                    <span className="text-sm line-through text-[#EEE8D7]/50 font-sans">
                      {banner.mrpText}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    id="launch-banner-whatsapp-cta"
                    href={getGeneralConciergeWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 sm:px-8 py-3.5 rounded-sm bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{banner.buttonText || 'Order via WhatsApp'}</span>
                  </a>

                  <Link
                    to="/shop"
                    className="px-6 py-3.5 rounded-sm border border-[#F7F3E8]/30 hover:bg-white/10 text-[#F7F3E8] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    <span>View Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Showcase Image (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-4/5 rounded-sm overflow-hidden border-2 border-[#B88A32]/50 shadow-2xl group">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10110F] via-transparent to-transparent opacity-60" />

                {/* Floating Banner Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#10110F]/90 backdrop-blur-sm border border-[#B88A32]/40 p-3 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#D4B66A] font-bold block">
                      LIMITED BATCH HARVEST
                    </span>
                    <span className="font-serif text-xs font-bold text-[#F7F3E8]">
                      Certified Authentic Himalayan
                    </span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#25D366]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
