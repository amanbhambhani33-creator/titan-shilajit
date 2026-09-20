import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, MessageCircle, ShoppingBag, ShieldCheck, Check, Star, ArrowRight } from 'lucide-react';
import { Product, ProductPack } from '../types';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { getProductPacks } from '../utils/productPacks';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const packs = getProductPacks(product);
  const [selectedPackIndex, setSelectedPackIndex] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const currentPack: ProductPack = packs[selectedPackIndex] || packs[0];

  const displayImage = currentPack.image || product.images[selectedImageIndex] || product.images[0];
  const displayPrice = currentPack.price;
  const displayMrp = currentPack.mrp;

  const whatsappUrl = getProductWhatsAppUrl(product, quantity, currentPack);

  const handleAddToCart = () => {
    addToCart(product, quantity, currentPack);
    onClose();
  };

  const handleSelectPack = (idx: number) => {
    setSelectedPackIndex(idx);
  };

  return (
    <div
      id="quick-view-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quick-view-modal-card"
        className="w-full max-w-3xl bg-[#F7F3E8] rounded-sm shadow-2xl overflow-hidden border border-[#B88A32]/30 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#10110F]/10 hover:bg-[#10110F] text-[#10110F] hover:text-[#F7F3E8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="bg-[#10110F] p-6 flex flex-col justify-between">
            <div className="aspect-square w-full rounded-xs overflow-hidden bg-black/40 border border-white/10 mb-4">
              <img
                key={displayImage}
                src={displayImage}
                alt={`${product.name} - ${currentPack.name}`}
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-xs overflow-hidden border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#D4B66A] opacity-100 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-5 max-h-[80vh] overflow-y-auto">
            <div>
              {/* Badge & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#183D27] bg-[#183D27]/10 px-2.5 py-1 rounded-xs">
                  {product.category.toUpperCase()} • {currentPack.quantityText}
                </span>
                <div className="flex items-center gap-1 text-[#B88A32] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#B88A32]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#66704B]">({product.reviewCount})</span>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#10110F] leading-tight mb-2">
                {product.name}
              </h3>

              <p className="text-xs text-[#66704B] font-sans leading-relaxed mb-3">
                {product.shortDescription}
              </p>

              {/* THREE PACK BUTTONS */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-[#10110F] uppercase tracking-wider text-[10px]">
                    SELECT PACK:
                  </span>
                  <span className="text-[#183D27] font-semibold text-[10px] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
                    {currentPack.name} ({currentPack.quantityText})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {packs.map((pack, idx) => {
                    const isSelected = selectedPackIndex === idx;
                    return (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => handleSelectPack(idx)}
                        className={`p-2 rounded-xs border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#183D27] text-[#F7F3E8] border-[#B88A32] ring-1 ring-[#B88A32]'
                            : 'bg-white hover:bg-[#EEE8D7] text-[#10110F] border-[#10110F]/15'
                        }`}
                      >
                        <div className={`text-[10px] font-bold uppercase ${isSelected ? 'text-[#D4B66A]' : 'text-[#10110F]'}`}>
                          {pack.name}
                        </div>
                        <div className="text-[9px] opacity-75 my-0.5">{pack.quantityText}</div>
                        <div className={`text-xs font-black ${isSelected ? 'text-[#F7F3E8]' : 'text-[#10110F]'}`}>
                          ₹{pack.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price block */}
              <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-[#10110F]/10">
                <span className="font-display text-2xl font-bold text-[#10110F]">
                  ₹{displayPrice * quantity}
                </span>
                {displayMrp && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{displayMrp * quantity}
                  </span>
                )}
                {currentPack.savings && (
                  <span className="text-xs font-bold text-[#183D27] bg-[#183D27]/15 px-2 py-0.5 rounded-xs">
                    {currentPack.savings}
                  </span>
                )}
              </div>

              {/* Highlights */}
              <div className="flex flex-col gap-1.5 mb-4 text-xs text-[#10110F]/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B88A32]" />
                  <span>Harvested at {product.elevation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#183D27]" />
                  <span>{product.fulvicAcidContent}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold text-[#10110F]">Quantity:</span>
                <div className="flex items-center border border-[#10110F]/20 rounded-xs bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm hover:bg-[#EEE8D7]"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm hover:bg-[#EEE8D7]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <a
                id="modal-buy-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#10110F]" />
                <span>ORDER ON WHATSAPP (₹{displayPrice * quantity})</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="py-2.5 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-[#183D27] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
                  <span>ADD TO CART</span>
                </button>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="py-2.5 rounded-xs border border-[#10110F]/30 text-[#10110F] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-[#EEE8D7] transition-colors text-center"
                >
                  <span>FULL DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
