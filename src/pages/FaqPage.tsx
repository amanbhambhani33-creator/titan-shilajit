import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { FAQS } from '../data/content';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

interface ExtendedFaq {
  question: string;
  answer: string;
  category: 'all' | 'purity' | 'dosage' | 'shipping' | 'safety';
}

const EXTENDED_FAQS: ExtendedFaq[] = [
  {
    question: 'What is Titan Shilajit and where is it harvested?',
    answer:
      'Titan Shilajit is Grade-A wild Himalayan rock exudate hand-harvested from sheer granite rock formations above 16,000 feet in Ladakh and the Karakoram ranges. At these extreme altitudes, intense UV radiation and temperature fluctuations produce the highest concentrations of active fulvic acid and ionic minerals in the world.',
    category: 'purity',
  },
  {
    question: 'How is Titan Shilajit purified (Surya Tapi method)?',
    answer:
      'Unlike mass-market commercial extracts boiled down with high artificial heat (which destroys delicate bioactive enzymes), Titan Shilajit is purified through the classical Ayurvedic Surya Tapi method: rinsed and filtered repeatedly in pure glacial spring water, then sun-cured under mountain sunlight for 40+ days until it condenses into a thick, glass-like resin.',
    category: 'purity',
  },
  {
    question: 'What percentage of Fulvic Acid is guaranteed?',
    answer:
      'Every batch of Titan Shilajit is NABL third-party laboratory tested and chromatography-verified to contain greater than 75% active Fulvic Acid bio-carriers. Batch certificates are accessible on our site and via our WhatsApp concierge.',
    category: 'purity',
  },
  {
    question: 'How should I consume Titan Shilajit Pure Resin?',
    answer:
      'Using the stainless steel measurement wand provided in each box, scoop a pea-sized portion (approximately 300mg to 500mg). Stir it into a cup of lukewarm water, raw cow milk, almond milk, or green tea until completely dissolved. Consume once daily in the morning on an empty stomach or 30 minutes before physical training.',
    category: 'dosage',
  },
  {
    question: 'How do I use the Shilajit Raw Honey Sticks on the go?',
    answer:
      'Titan Honey Sticks combine 350mg of pure Surya Tapi purified Shilajit with raw high-altitude wildflower forest honey. Simply tear the top notch and squeeze directly into your mouth, or stir into warm tea or morning oats. No measuring wand or water glass required.',
    category: 'dosage',
  },
  {
    question: 'How soon can I expect to feel the vitality benefits?',
    answer:
      'Most practitioners report a clear lift in mental alertness, physical stamina, and recovery within 3 to 7 days of daily use. Because Shilajit works at the mitochondrial level to restore ATP energy and mineral balance, cumulative full-body benefits compound significantly over 4 to 8 weeks.',
    category: 'dosage',
  },
  {
    question: 'Is Titan Shilajit tested for heavy metals and pesticides?',
    answer:
      'Yes. Safety is paramount. Every harvest batch undergoes ICP-MS heavy metal analysis (Lead, Arsenic, Cadmium, and Mercury) to ensure levels are far below strict Ayurvedic Pharmacopoeia of India (API) and international safety thresholds. Zero synthetic binders, maltodextrin, or preservatives are ever added.',
    category: 'safety',
  },
  {
    question: 'Are there any contraindications or side effects?',
    answer:
      'Titan Shilajit is safe for daily consumption by healthy adults. It is not recommended for children under 18, pregnant or nursing mothers, or individuals with active hyperuricemia (gout) or chronic kidney conditions without prior physician clearance. Consult your doctor if you are taking blood-thinning medications.',
    category: 'safety',
  },
  {
    question: 'What are the shipping charges and delivery timeframes across India?',
    answer:
      'We provide FREE Express Pan-India Delivery on all orders. Metro deliveries (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) arrive within 24 to 48 hours. Tier-2 and Tier-3 cities typically arrive in 2 to 4 business days via Bluedart and express air couriers with live SMS tracking.',
    category: 'shipping',
  },
  {
    question: 'How are orders placed and tracked?',
    answer:
      'You can place your order directly through our secure online store with zero extra fees. We offer instant Cash on Delivery (COD) and encrypted Razorpay options. All orders are assigned an official continuous Tax Invoice and a Delhivery AWB number, allowing you to track your delivery in real time via SMS and online dashboard.',
    category: 'shipping',
  },
  {
    question: 'How should I store the Obsidian Glass Jar?',
    answer:
      'Keep the jar sealed tightly in a cool, dry place away from direct sunlight. High-purity Shilajit naturally softens in warm environments and hardens in cold weather. If the resin becomes too firm to scoop, place the sealed jar in a bowl of warm water for 2 minutes to restore its smooth consistency.',
    category: 'safety',
  },
];

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'purity' | 'dosage' | 'shipping' | 'safety'>('all');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const toggleAccordion = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const filteredFaqs = useMemo(() => {
    return EXTENDED_FAQS.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

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
            Everything you need to know about Titan pure Himalayan Shilajit, Surya Tapi solar purification, batch lab certificates, and daily ritual guidance.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-[#10110F]/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., dosage, warm milk, lab test, delivery)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-sm bg-white border border-[#10110F]/15 text-sm sm:text-base text-[#10110F] placeholder:text-[#10110F]/40 focus:outline-none focus:border-[#183D27] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#66704B] hover:text-[#10110F]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'purity', label: 'Purity & Harvesting' },
            { id: 'dosage', label: 'Dosage & Ritual' },
            { id: 'safety', label: 'Safety & Storage' },
            { id: 'shipping', label: 'Shipping & Orders' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
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
              <p>No questions matched "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs font-bold uppercase tracking-wider text-[#183D27] underline"
              >
                Reset filters
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
