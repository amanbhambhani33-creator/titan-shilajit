import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { Product } from '../types';

export const ProductShowcaseSection: React.FC = () => {
  const { products } = useStoreContent();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'resin' | 'honey-sticks' | 'bundles'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="collection-showcase-section" className="py-20 lg:py-28 bg-[#F7F3E8] text-[#10110F] relative border-b border-[#10110F]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col">
            <span className="text-[#183D27] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
              Pure Himalayan Formulations
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#10110F] tracking-tight">
              THE TITAN COLLECTION
            </h2>
            <p className="text-xs sm:text-sm text-[#66704B] font-sans max-w-lg mt-2 font-light">
              Explore our core Shilajit-based wellness range. Pure Grade-A resin and portable raw honey sticks.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#EEE8D7]/80 p-1 rounded-sm border border-[#10110F]/5">
            {(
              [
                { id: 'all', label: 'All Products' },
                { id: 'resin', label: 'Pure Resin' },
                { id: 'honey-sticks', label: 'Honey Sticks' },
                { id: 'bundles', label: 'Bundles & Rituals' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xs text-[11px] font-bold tracking-widest uppercase transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#183D27] text-[#F7F3E8] shadow-xs'
                    : 'text-[#10110F]/70 hover:text-[#10110F] hover:bg-black/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
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

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold tracking-[0.2em] uppercase shadow-md transition-colors"
          >
            <span>VIEW COMPLETE CATALOG</span>
            <ArrowRight className="w-4 h-4 text-[#D4B66A]" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
