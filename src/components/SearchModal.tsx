import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Delete, XCircle } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { FAQS } from '../data/content';
import { normalizeImageUrl } from '../utils/imageUrl';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products: storeProducts } = useStoreContent();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : DEFAULT_PRODUCTS;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    setQuery((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const cleanQuery = query.trim().toLowerCase();

  const filteredProducts = cleanQuery === ''
    ? []
    : activeProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.shortDescription?.toLowerCase().includes(cleanQuery) ||
          p.category?.toLowerCase().includes(cleanQuery) ||
          p.tagline?.toLowerCase().includes(cleanQuery) ||
          p.fulvicAcidContent?.toLowerCase().includes(cleanQuery) ||
          (p.badgeTag && p.badgeTag.toLowerCase().includes(cleanQuery))
      );

  const filteredFaqs = cleanQuery === ''
    ? []
    : FAQS.filter(
        (f) =>
          f.question.toLowerCase().includes(cleanQuery) ||
          f.answer.toLowerCase().includes(cleanQuery)
      );

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="search-modal-panel"
        className="w-full max-w-2xl bg-[#F7F3E8] rounded-sm shadow-2xl overflow-hidden border border-[#B88A32]/40 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar with Clear & Backspace */}
        <div className="relative flex items-center border-b-2 border-[#10110F] pb-3">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#10110F]/60 mr-2.5 sm:mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pure resin, honey sticks, guides, dosage..."
            className="w-full bg-transparent font-serif text-lg sm:text-2xl text-[#10110F] placeholder:text-[#10110F]/40 focus:outline-none pr-2"
          />

          {/* Action buttons: Backspace, Clear, Close */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1 sm:ml-2">
            {query.length > 0 && (
              <>
                {/* Backspace Button */}
                <button
                  type="button"
                  onClick={handleBackspace}
                  title="Backspace (Delete last character)"
                  aria-label="Backspace delete last character"
                  className="px-2 sm:px-2.5 py-1.5 rounded-xs bg-[#EEE8D7] hover:bg-[#183D27] hover:text-[#F7F3E8] text-[#10110F] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-[#10110F]/15 active:scale-95 shadow-2xs"
                >
                  <Delete className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#183D27] hover:text-inherit" />
                  <span className="text-[10px] uppercase font-sans tracking-wider hidden sm:inline">Backspace</span>
                </button>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear search text"
                  aria-label="Clear all search text"
                  className="px-2 sm:px-2.5 py-1.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#D4B66A] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95 shadow-xs"
                >
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] uppercase font-sans tracking-wider">Clear</span>
                </button>
              </>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              aria-label="Close search modal"
              title="Close search modal"
              className="p-1.5 text-[#10110F]/60 hover:text-[#10110F] hover:bg-black/5 rounded-xs transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Popular searches suggestions */}
        {cleanQuery === '' && (
          <div className="py-6 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66704B]">
              Quick Inquiries
            </span>
            <div className="flex flex-wrap gap-2">
              {['Pure Resin 50g', 'Honey Sticks Classic', 'Triphala Purification', '70%+ Fulvic Acid', 'Dark Chocolate', 'How to use', 'Heavy metal testing'].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-3 py-1.5 rounded-xs bg-[#EEE8D7] text-xs font-medium text-[#10110F] hover:bg-[#183D27] hover:text-[#F7F3E8] transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {cleanQuery !== '' && (
          <div className="py-6 max-h-[60vh] overflow-y-auto divide-y divide-[#10110F]/10 flex flex-col gap-4 pr-1">
            {filteredProducts.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#183D27]">
                  Products ({filteredProducts.length})
                </span>
                {filteredProducts.map((p) => {
                  const cover = normalizeImageUrl(p.images?.[0] || p.image || '');
                  return (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xs hover:bg-[#EEE8D7] transition-colors group border border-transparent hover:border-[#10110F]/10"
                    >
                      <div className="flex items-center gap-3">
                        {cover ? (
                          <img
                            src={cover}
                            alt={p.name}
                            className="w-12 h-12 rounded-xs object-cover bg-black"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xs bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-bold text-xs">
                            TITAN
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-sm text-[#10110F] group-hover:text-[#183D27]">
                              {p.name}
                            </h4>
                            {p.badgeTag && p.badgeTag !== 'none' && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-xs bg-[#183D27] text-[#D4B66A]">
                                {p.badgeTag.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#66704B]">₹{p.price.toLocaleString('en-IN')} • {p.size}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#B88A32] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}

            {filteredFaqs.length > 0 && (
              <div className="pt-4 flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#183D27]">
                  Educational Answers &amp; FAQs
                </span>
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="p-3 bg-[#EEE8D7]/40 rounded-xs">
                    <h5 className="font-serif font-semibold text-sm text-[#10110F]">
                      {faq.question}
                    </h5>
                    <p className="text-xs text-[#66704B] mt-1 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && filteredFaqs.length === 0 && (
              <div className="py-8 text-center text-sm text-[#66704B] space-y-2">
                <p className="font-medium text-[#10110F]">No matching results found for "{query}".</p>
                <p className="text-xs">
                  Try using the <button type="button" onClick={handleClear} className="text-[#183D27] font-bold underline">Clear</button> button to browse our complete catalog or visit our Help &amp; FAQ desk.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
