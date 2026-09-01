import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const CTASection: React.FC = () => {
  return (
    <section id="final-cta-section" className="py-24 bg-[#10110F] text-[#F7F3E8] relative overflow-hidden border-t border-[#B88A32]/20">
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#183D27] blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10 flex flex-col items-center">
        <span className="text-[#B88A32] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
          Himalayan Power in Modern Life
        </span>

        <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F7F3E8] leading-tight mb-6">
          YOUR DAILY POWER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7F3E8] via-[#D4B66A] to-[#66704B]">
            STARTS HERE.
          </span>
        </h2>

        <p className="font-sans text-xs sm:text-base text-[#EEE8D7]/75 max-w-xl leading-relaxed font-light mb-8">
          Explore the Titan collection and discover a simpler way to make natural wellness part of your everyday routine.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <Link
            id="final-cta-shop-btn"
            to="/shop"
            className="px-9 py-4 rounded-sm bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            id="final-cta-whatsapp-btn"
            href={getGeneralConciergeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-sm bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-[#B88A32]/40 shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </section>
  );
};
