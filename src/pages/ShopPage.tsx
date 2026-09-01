import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, MessageCircle, ShieldCheck, Award } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const ShopPage: React.FC = () => {
  const { products } = useStoreContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'all'
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeCategory, sortBy]);

  return (
    <div id="shop-page" className="min-h-screen pt-28 pb-20 bg-[#F7F3E8] text-[#10110F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Shop Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D27]/10 text-[#183D27] text-xs font-bold tracking-[0.2em] uppercase">
            <Award className="w-3.5 h-3.5 text-[#B88A32]" />
            <span>AUTHENTIC HIMALAYAN APOTHECARY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#10110F]">
            THE TITAN SHOP
          </h1>

          <p className="text-sm sm:text-base text-[#66704B] font-sans leading-relaxed">
            Every batch of Titan Shilajit is hand-harvested from high Himalayan altitudes, traditionally sun-cured, and verified for maximum bioactive purity.
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-[#EEE8D7]/80 rounded-xs border border-[#10110F]/10 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'resin', label: 'Pure Resin' },
              { id: 'honey-sticks', label: 'Honey Sticks' },
              { id: 'bundles', label: 'Ritual Boxes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xs text-xs font-bold tracking-wider uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#10110F] text-[#F7F3E8] shadow-xs'
                    : 'bg-white/60 text-[#10110F] hover:bg-[#183D27] hover:text-[#F7F3E8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#66704B] font-semibold uppercase">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#10110F]/20 rounded-xs px-3 py-1.5 text-xs font-medium text-[#10110F] focus:outline-none focus:border-[#B88A32]"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Direct Concierge Banner */}
        <div className="mt-16 p-8 rounded-xs bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#D4B66A] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>DELHI DIRECT DISPATCH</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#F7F3E8]">
              Need help selecting your Titan product?
            </h3>
            <p className="text-xs text-[#EEE8D7]/75 max-w-lg">
              Connect directly with our wellness team on WhatsApp for personalized product guidance, batch certificates, and express Indian delivery.
            </p>
          </div>

          <a
            href={getGeneralConciergeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>ORDER VIA WHATSAPP (+91 99584 74229)</span>
          </a>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
