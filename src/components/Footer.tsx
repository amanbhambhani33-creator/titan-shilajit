import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, MapPin, Phone, Mail, ShieldCheck, Settings } from 'lucide-react';
import { BRAND_CONTACT } from '../data/content';
import { useStoreContent } from '../context/StoreContentContext';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const { content } = useStoreContent();
  const footerConfig = content.footer;

  return (
    <footer id="main-footer" className="bg-[#10110F] text-[#F7F3E8] border-t border-[#B88A32]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#183D27] text-[#B88A32] border border-[#B88A32]/40 flex items-center justify-center font-serif font-bold text-lg">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-tight font-bold text-xl text-[#F7F3E8] uppercase">
                  Titan Shilajit
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#D4B66A] font-medium font-sans">
                  Pure Power of the Himalayas
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#EEE8D7]/75 font-sans leading-relaxed max-w-sm font-light">
              {footerConfig.tagline ||
                'Titan Shilajit brings the ancient strength of pure Himalayan Shilajit into the rhythm of modern life. Naturally rich, traditionally purified, and lab-tested for uncompromising daily vitality.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Titan Shilajit on Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[#D4B66A] hover:border-[#D4B66A] hover:bg-[#B88A32]/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={getGeneralConciergeWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Titan Shilajit on WhatsApp"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-col gap-2 pt-2 text-xs text-[#EEE8D7]/75 font-light">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>{BRAND_CONTACT.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>WhatsApp: {BRAND_CONTACT.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>{BRAND_CONTACT.email}</span>
              </div>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-sm tracking-[0.2em] uppercase text-[#D4B66A] font-semibold">
              SHOP
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#EEE8D7]/80 font-light">
              <li>
                <Link to="/product/titan-shilajit-resin" className="hover:text-[#D4B66A] transition-colors">
                  Shilajit Pure Resin (20g)
                </Link>
              </li>
              <li>
                <Link to="/product/titan-honey-sticks-classic" className="hover:text-[#D4B66A] transition-colors">
                  Classic Raw Honey Sticks
                </Link>
              </li>
              <li>
                <Link to="/product/titan-honey-sticks-dark-chocolate" className="hover:text-[#D4B66A] transition-colors">
                  Dark Chocolate Honey Sticks
                </Link>
              </li>
              <li>
                <Link to="/product/titan-honey-sticks-strawberry" className="hover:text-[#D4B66A] transition-colors">
                  Wild Strawberry Honey Sticks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bundles" className="hover:text-[#D4B66A] transition-colors">
                  Ritual Boxes & Bundles
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#D4B66A] transition-colors">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Discover */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-sm tracking-[0.2em] uppercase text-[#D4B66A] font-semibold">
              DISCOVER
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#EEE8D7]/80 font-light">
              <li>
                <Link to="/why-titan" className="hover:text-[#D4B66A] transition-colors">
                  Why Titan
                </Link>
              </li>
              <li>
                <Link to="/shilajit-guide" className="hover:text-[#D4B66A] transition-colors">
                  Shilajit Education Guide
                </Link>
              </li>
              <li>
                <Link to="/wellness-assessment" className="text-[#D4B66A] hover:underline transition-colors flex items-center gap-1 font-medium">
                  <span>Wellness Assessment</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4B66A] transition-colors">
                  About Our Brand
                </Link>
              </li>
              <li>
                <Link to="/shilajit-guide#faqs" className="hover:text-[#D4B66A] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Legal */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-sm tracking-[0.2em] uppercase text-[#D4B66A] font-semibold">
              POLICIES
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#EEE8D7]/80 font-light">
              <li>
                <a
                  href={getGeneralConciergeWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4B66A] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#D4B66A] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#D4B66A] transition-colors">
                  Returns & Cancellations
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#D4B66A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#D4B66A] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-[#D4B66A] transition-colors">
                  Health Disclaimer
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white/5 hover:bg-[#183D27] text-[#D4B66A] text-[10px] uppercase tracking-wider font-semibold border border-white/10 transition-colors"
                >
                  <Settings className="w-3 h-3" />
                  <span>Admin Desk</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Health Disclaimer Strip */}
        <div className="pt-8 pb-6 text-xs text-[#EEE8D7]/60 leading-relaxed border-b border-white/10 font-light">
          <div className="flex items-start gap-2 max-w-4xl">
            <ShieldCheck className="w-4 h-4 text-[#D4B66A] shrink-0 mt-0.5" />
            <p>
              <strong>Health Disclaimer:</strong> Titan Shilajit products are dietary wellness supplements crafted from purified Himalayan botanical exudates and wild forest honey. Statements on this website have not been evaluated by regulatory drug authorities. These products are not intended to diagnose, treat, cure, or prevent any medical condition or disease. Consult a qualified physician prior to use if you have an underlying medical condition, take prescription medication, or are pregnant or nursing. Individual results may vary.
            </p>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EEE8D7]/60 gap-4 font-light">
          <p>© {new Date().getFullYear()} Titan Shilajit. All rights reserved. Crafted in Delhi, India.</p>
          
          {/* Designed by Supreme Ads attribution */}
          <div className="flex items-center gap-2">
            <span className="text-[#D4B66A] font-medium tracking-wide">
              {footerConfig.designedBy || 'Designed by Supreme Ads'}
            </span>
          </div>

          <p className="flex items-center gap-2 text-[#EEE8D7]/50">
            <span>Pure Himalayan Origin</span>
            <span>•</span>
            <span>Lab Verified Purity</span>
            <span>•</span>
            <span>Direct WhatsApp Delivery</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
