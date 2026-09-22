import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { useStoreContent, DEFAULT_PRODUCT_BENEFITS } from '../context/StoreContentContext';
import { useCart } from '../context/CartContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

export const BenefitsSection: React.FC = () => {
  const { content, products } = useStoreContent();
  const { addToCart, openCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const benefits = (content.productBenefits && content.productBenefits.length > 0)
    ? content.productBenefits
    : DEFAULT_PRODUCT_BENEFITS;

  const header = content.benefitsHeader || {
    kicker: 'Natural Power & Vitality',
    title: 'PRODUCT BENEFITS',
    description: 'Each single morning serving of Titan Shilajit delivers concentrated fulvic acid and ionic trace minerals that awaken natural cellular ATP and sustained physical drive.',
  };

  // Find primary product for the quick buy strip
  const primaryProduct = products.find((p) => p.slug.includes('resin') || p.category === 'resin') || products[0];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 320;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveSlide(Math.min(newIndex, benefits.length - 1));
    }
  };

  return (
    <section id="benefits-section" className="py-16 sm:py-24 bg-[#FAF7F2] text-[#10110F] relative overflow-hidden border-t border-b border-[#B88A32]/15">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#B88A32]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#183D27]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header matching user visual reference */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A32]/15 text-[#8F661B] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>{header.kicker || 'NATURAL POWER & VITALITY'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#10110F] tracking-tight uppercase mb-4">
            {header.title || 'PRODUCT BENEFITS'}
          </h2>

          <p className="text-sm sm:text-base text-[#4A4B42] font-sans leading-relaxed max-w-2xl mx-auto font-light">
            {header.description}
          </p>
        </div>

        {/* Carousel / Navigation Controls for Mobile & Tablet */}
        <div className="flex items-center justify-between sm:justify-end gap-3 mb-6">
          <span className="text-xs font-mono text-[#8F661B] font-semibold sm:hidden">
            0{activeSlide + 1} / 0{benefits.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Scroll benefits left"
              className="w-9 h-9 rounded-full bg-white border border-[#10110F]/15 hover:border-[#B88A32] text-[#10110F] hover:text-[#B88A32] flex items-center justify-center shadow-xs transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Scroll benefits right"
              className="w-9 h-9 rounded-full bg-white border border-[#10110F]/15 hover:border-[#B88A32] text-[#10110F] hover:text-[#B88A32] flex items-center justify-center shadow-xs transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Cards Row matching user screenshot */}
        <div
          ref={scrollRef}
          onScroll={handleScrollEvent}
          className="flex lg:grid lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {benefits.map((card, idx) => (
            <div
              key={card.id || idx}
              className="min-w-[280px] sm:min-w-[300px] lg:min-w-0 flex-1 snap-start bg-[#F4EDE4] rounded-3xl overflow-hidden border border-[#B88A32]/25 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Area with warm contrast container */}
              <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-[#EFE4D7]">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4EDE4] via-transparent to-transparent opacity-80" />
                {card.tag && (
                  <div className="absolute top-3.5 left-3.5 bg-[#183D27] text-[#D4B66A] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                    {card.tag}
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#10110F] tracking-tight mb-2 group-hover:text-[#8F661B] transition-colors">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8F661B] mb-2 font-mono">
                      {card.subtitle}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-[#4A4B42] font-sans leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#10110F]/10 flex items-center justify-between text-[11px] text-[#8F661B] font-semibold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#B88A32]" />
                    <span>Ayurvedic Bio-ATP</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#10110F]/50">0{idx + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicator dots for mobile */}
        <div className="flex lg:hidden items-center justify-center gap-1.5 mt-4">
          {benefits.map((_, dotIdx) => (
            <div
              key={dotIdx}
              className={`rounded-full transition-all ${
                activeSlide === dotIdx ? 'w-5 h-1.5 bg-[#8F661B]' : 'w-1.5 h-1.5 bg-[#10110F]/20'
              }`}
            />
          ))}
        </div>

        {/* Quick Product Banner Strip (as featured at the bottom of the user screenshot) */}
        {primaryProduct && (
          <div className="mt-10 sm:mt-12 bg-white rounded-2xl p-4 sm:p-6 border border-[#B88A32]/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#10110F]/10 shrink-0">
                <img
                  src={primaryProduct.images[0] || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80'}
                  alt={primaryProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#183D27] text-[#D4B66A] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    CERTIFIED 100% PURE
                  </span>
                  <div className="flex items-center text-[#B88A32] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#B88A32]" />
                    <span className="font-bold text-[#10110F] ml-1">4.9</span>
                    <span className="text-gray-400 text-[10px] ml-1">(420+ Reviews)</span>
                  </div>
                </div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#10110F] mt-0.5">
                  {primaryProduct.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg font-black text-[#183D27]">
                    ₹{primaryProduct.price.toLocaleString('en-IN')}
                  </span>
                  {primaryProduct.mrp && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{primaryProduct.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {primaryProduct.discount && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs">
                      {primaryProduct.discount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => {
                  addToCart(primaryProduct, 1);
                  openCart();
                }}
                className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider hover:bg-[#10110F] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
                <span>Add To Cart</span>
              </button>
              <a
                href={getProductWhatsAppUrl(primaryProduct, 1)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

