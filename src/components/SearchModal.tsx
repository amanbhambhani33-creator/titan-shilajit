import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { FAQS } from '../data/content';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );

  const filteredFaqs = query.trim() === ''
    ? []
    : FAQS.filter(
        (f) =>
          f.question.toLowerCase().includes(query.toLowerCase()) ||
          f.answer.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-md flex items-start justify-center p-4 pt-20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="search-modal-panel"
        className="w-full max-w-2xl bg-[#F7F3E8] rounded-sm shadow-2xl overflow-hidden border border-[#B88A32]/40 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center border-b-2 border-[#10110F] pb-3">
          <Search className="w-6 h-6 text-[#10110F]/60 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pure resin, honey sticks, guides, dosage..."
            autoFocus
            className="w-full bg-transparent font-serif text-xl sm:text-2xl text-[#10110F] placeholder:text-[#10110F]/40 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 text-[#10110F]/60 hover:text-[#10110F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular searches suggestions */}
        {query.trim() === '' && (
          <div className="py-6 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66704B]">
              Quick Inquiries
            </span>
            <div className="flex flex-wrap gap-2">
              {['Pure Resin Jar', 'Honey Sticks Classic', 'Dark Chocolate', 'Strawberry', 'How to use', 'Heavy metal testing'].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-3 py-1.5 rounded-xs bg-[#EEE8D7] text-xs font-medium text-[#10110F] hover:bg-[#183D27] hover:text-[#F7F3E8] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query.trim() !== '' && (
          <div className="py-6 max-h-[60vh] overflow-y-auto divide-y divide-[#10110F]/10 flex flex-col gap-4">
            {filteredProducts.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#183D27]">
                  Products ({filteredProducts.length})
                </span>
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xs hover:bg-[#EEE8D7] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xs object-cover bg-black"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#10110F] group-hover:text-[#183D27]">
                          {p.name}
                        </h4>
                        <span className="text-xs text-[#66704B]">₹{p.price} • {p.size}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B88A32] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}

            {filteredFaqs.length > 0 && (
              <div className="pt-4 flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#183D27]">
                  Educational Answers & FAQs
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
              <div className="py-8 text-center text-sm text-[#66704B]">
                No matching results found for "{query}". You can also inquire directly with our Delhi concierge on WhatsApp.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
