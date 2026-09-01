import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto">
      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#10110F]/90 text-[#D4B66A] border border-[#B88A32]/30 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-[#183D27] transition-all hover:scale-105"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Sleek WhatsApp Button */}
      <a
        id="floating-whatsapp-trigger"
        href={getGeneralConciergeWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp with Titan Shilajit concierge"
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#183D27] rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-[#B88A32] hover:scale-105 hover:bg-[#10110F] transition-all group relative"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#F7F3E8] group-hover:text-[#25D366] transition-colors" />

        {/* Tooltip */}
        <span className="hidden sm:block absolute right-16 px-3 py-1.5 rounded-sm bg-[#10110F] text-[#F7F3E8] text-[10px] font-bold tracking-widest uppercase border border-[#B88A32]/30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
};
