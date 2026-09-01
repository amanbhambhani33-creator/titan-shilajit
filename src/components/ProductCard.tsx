import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const whatsappUrl = getProductWhatsAppUrl(product, 1);

  return (
    <div
      id={`product-card-${product.slug}`}
      className="group flex flex-col justify-between bg-white hover:bg-white rounded-sm border border-[#10110F]/5 hover:border-[#B88A32]/40 p-4 transition-all duration-300 shadow-xs hover:shadow-md"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-[#10110F] rounded-xs cursor-pointer mb-4">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.discount && (
            <span className="px-2 py-0.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-[9px] font-sans font-bold tracking-widest uppercase border border-[#B88A32]/30">
              {product.discount}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-xs bg-[#10110F]/80 backdrop-blur-xs text-[#F7F3E8] text-[9px] font-sans font-medium tracking-wider uppercase">
            {product.size}
          </span>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={() => onQuickView(product)}
            aria-label="Quick View product details"
            className="px-3 py-1.5 rounded-xs bg-[#F7F3E8] text-[#10110F] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md hover:bg-[#D4B66A] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            aria-label="Add to bag"
            className="p-1.5 rounded-xs bg-[#10110F] text-[#F7F3E8] hover:bg-[#183D27] transition-colors shadow-md"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-1">
          {/* Category kicker & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-[#183D27] font-bold uppercase tracking-wider">
              {product.category === 'resin' ? 'PURE RESIN' : product.category === 'honey-sticks' ? 'HONEY STICK' : 'RITUAL BUNDLE'}
            </span>
            <div className="flex items-center gap-1 text-[#B88A32] text-xs">
              <Star className="w-3 h-3 fill-[#B88A32] text-[#B88A32]" />
              <span className="text-[10px] text-[#10110F] font-bold font-sans">
                {product.rating}
              </span>
              <span className="text-[10px] text-[#66704B] font-medium font-sans">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-serif text-base font-bold text-[#10110F] hover:text-[#183D27] transition-colors leading-snug line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#66704B] font-sans line-clamp-2 leading-relaxed font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Primary Action Buttons */}
        <div className="pt-3 border-t border-[#10110F]/5 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-[#10110F]">
                ₹{product.price}
              </span>
              {product.mrp && (
                <span className="text-xs text-gray-400 line-through font-light">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <span className="text-[9px] uppercase tracking-wider text-[#183D27] font-semibold bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
              {product.servings}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="py-2.5 px-2 rounded-xs border border-[#10110F]/15 text-[#10110F] text-[10px] font-bold tracking-wider uppercase text-center hover:bg-[#10110F] hover:text-[#F7F3E8] transition-all"
            >
              DETAILS
            </Link>

            <a
              id={`buy-whatsapp-${product.slug}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
