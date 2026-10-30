import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const FaqPage: React.FC = () => {
  const { faqs } = useStoreContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const toggleAccordion = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const filteredFaqs = useMemo(() => {
    if (!faqs || faqs.length === 0) return [];
    if (selectedCategory === 'all') return faqs;
    return faqs.filter((faq) => {
      const cat = (faq.category || 'purity').toLowerCase();
      return cat.includes(selectedCategory.toLowerCase());
    });
  }, [faqs, selectedCategory]);

  return (
    <div id="faq-dedicated-page" className="min-h-screen pt-28 pb-20 bg-[#F7F3E8] text-[#10110F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs / Badge */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183D27]/10 text-[#183D27] text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-[#183D27]/20">
            <HelpCircle className="w-3.5 h-3.5 text-[#B88A32]" />
            <span>KNOWLEDGE BASE &amp; APOTHECARY HELP</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#10110F] mb-3">
            FREQUENTLY ASKED QUESTIONS
          </h1>

          <p className="text-sm sm:text-base text-[#66704B] font-sans max-w-xl font-light leading-relaxed">
            Everything you need to know about Titan pure Himalayan Shilajit, authentic Triphala purification, batch lab certificates, and daily ritual guidance.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'purity', label: 'Purity & Harvesting' },
            { id: 'dosage', label: 'Dosage & Ritual' },
            { id: 'safety', label: 'Safety & Storage' },
            { id: 'shipping', label: 'Shipping & Orders' },
            { id: 'aeo', label: 'AI & Direct Answers' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xs text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#183D27] text-[#F7F3E8] shadow-xs'
                  : 'bg-white/80 hover:bg-white text-[#10110F] border border-[#10110F]/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs Accordion List */}
        <div className="bg-white rounded-sm border border-[#10110F]/10 shadow-xs divide-y divide-[#10110F]/10 overflow-hidden mb-12">
          {filteredFaqs.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#66704B]">
              <p>No questions available in this category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-3 text-xs font-bold uppercase tracking-wider text-[#183D27] underline cursor-pointer"
              >
                View all FAQs
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndexes.includes(idx);
              return (
                <div key={idx} className="transition-colors">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#F7F3E8]/40 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-[#10110F] leading-snug">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-full bg-[#F7F3E8] shrink-0 border border-[#10110F]/10">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#183D27]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#66704B]" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed border-t border-dashed border-[#10110F]/10 bg-[#F7F3E8]/30 animate-in fade-in duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Direct Help Card */}
        <div className="bg-[#10110F] text-[#F7F3E8] p-6 sm:p-8 rounded-sm border border-[#B88A32]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#D4B66A] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>DIRECT AYURVEDIC APOTHECARY SUPPORT</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F3E8]">
              Have a question not listed here?
            </h3>
            <p className="text-xs text-[#EEE8D7]/75 max-w-md font-light">
              Chat live with our botanical team on WhatsApp for personalized dosage guidance, timing recommendations, and batch test verification.
            </p>
          </div>

          <a
            href={getGeneralConciergeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#10110F]" />
            <span>ASK ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
};
export default FaqPage;
