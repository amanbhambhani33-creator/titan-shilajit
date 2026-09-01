import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { BRAND_CONTACT } from '../data/content';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="min-h-screen pt-28 pb-24 bg-[#F7F3E8] text-[#10110F]">
      {/* Hero */}
      <section className="relative py-20 bg-[#10110F] text-[#F7F3E8] overflow-hidden mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D27] text-[#D4B66A] text-xs font-bold tracking-[0.2em] uppercase border border-[#B88A32]/30">
            <Mountain className="w-3.5 h-3.5" />
            <span>FOUNDED IN HIMALAYAN PURITY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F7F3E8]">
            THE STORY OF TITAN
          </h1>

          <p className="text-sm sm:text-lg text-[#EEE8D7]/80 max-w-2xl font-sans font-light leading-relaxed">
            Bridging ancient high-altitude botanical knowledge with modern, lab-tested daily vitality rituals.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Content */}
        <div className="space-y-8 text-sm sm:text-base text-[#66704B] font-sans leading-relaxed mb-16">
          <p className="text-[#10110F] font-serif text-xl sm:text-2xl leading-snug">
            Titan Shilajit was born from a simple realization: in an era of synthetic energy drinks, artificial pre-workouts, and chemical stimulants, the human body yearns for pure, organic, bio-available earth minerals.
          </p>

          <p>
            For thousands of years, Himalayan ascetics and traditional healers revered Shilajit as the king of rasayanas. Yet modern commerce has too often diluted this sacred resin with sugar syrups, chemical extract powders, and low-altitude substitutes.
          </p>

          <p>
            Titan was established to restore uncompromised authenticity. We source exclusively from extreme Himalayan elevations above 16,000 feet, where the air is pure and the mineral deposits remain untainted. We adhere to the traditional Ayurvedic Shodhana method—purifying the raw exudate in natural mountain spring water and sun-curing it for months under open Himalayan skies.
          </p>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10">
            <Mountain className="w-6 h-6 text-[#183D27] mb-3" />
            <h4 className="font-serif font-bold text-lg text-[#10110F] mb-1">Purity of Origin</h4>
            <p className="text-xs text-[#66704B] leading-relaxed">
              Harvested only at peak summer from high-altitude rock faces with zero industrial interference.
            </p>
          </div>

          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10">
            <ShieldCheck className="w-6 h-6 text-[#183D27] mb-3" />
            <h4 className="font-serif font-bold text-lg text-[#10110F] mb-1">Scientific Verification</h4>
            <p className="text-xs text-[#66704B] leading-relaxed">
              Every single batch is NABL certified for heavy metals, microbial safety, and &gt;75% fulvic acid.
            </p>
          </div>

          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10">
            <Heart className="w-6 h-6 text-[#183D27] mb-3" />
            <h4 className="font-serif font-bold text-lg text-[#10110F] mb-1">Direct Connection</h4>
            <p className="text-xs text-[#66704B] leading-relaxed">
              Personalized guidance, batch authenticity certificates, and direct dispatch through WhatsApp.
            </p>
          </div>
        </div>

        {/* Delhi Concierge & Contact Card */}
        <div className="p-8 rounded-xs bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#D4B66A]">
              DELHI HEADQUARTERS & DISPATCH
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#F7F3E8]">
              Connect Directly with Titan Shilajit
            </h3>
            <div className="space-y-1 text-xs text-[#EEE8D7]/80">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>{BRAND_CONTACT.location}</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>WhatsApp: {BRAND_CONTACT.phoneDisplay}</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>{BRAND_CONTACT.email}</span>
              </p>
            </div>
          </div>

          <a
            href={getGeneralConciergeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
};
