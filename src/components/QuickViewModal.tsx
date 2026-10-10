import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Check,
  Star,
  ArrowRight,
  Mountain,
  FlaskConical,
  Droplet,
  Ban,
  Lock,
} from 'lucide-react';
import { Product, ProductPack } from '../types';
import { useCart } from '../context/CartContext';
import { getProductPacks, getPackShortBadge, getPackShortName, getPackShortQuantity } from '../utils/productPacks';
import { AmazonFlipkartBadge } from './AmazonFlipkartBadge';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

interface QuickViewModalContentProps {
  product: Product;
  onClose: () => void;
}

const QuickViewModalContent: React.FC<QuickViewModalContentProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const packs = getProductPacks(product);
  const [selectedPackIndex, setSelectedPackIndex] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentPack: ProductPack = packs[selectedPackIndex] || packs[0];

  // Stock check
  const isOutOfStock = !product.inStock || (product.stockQty !== undefined && product.stockQty <= 0);

  // Sync quantity with cart (prevents summing up issue)
  const cartQty = getItemQuantity(product.id, currentPack.id);
  const [quantity, setQuantity] = useState(cartQty > 0 ? cartQty : 1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  useEffect(() => {
    const existing = getItemQuantity(product.id, currentPack.id);
    if (existing > 0) {
      setQuantity(existing);
    }
  }, [product.id, currentPack.id, getItemQuantity]);

  const cleanProductImages = (product.images || []).filter((img) => img && !img.includes('unsplash.com'));
  const isGenericPackImg = !currentPack.image || currentPack.image.includes('unsplash.com');
  const activePackImg = (!isGenericPackImg && currentPack.image) ? currentPack.image : '';

  const displayImage = cleanProductImages[selectedImageIndex] || activePackImg || cleanProductImages[0] || '';
  const displayPrice = currentPack.price;
  const displayMrp = currentPack.mrp;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, currentPack, 'set');
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    try {
      sessionStorage.removeItem('titan_last_confirmed_order');
    } catch {}
    addToCart(product, quantity, currentPack, 'set');
    onClose();
    navigate('/checkout');
  };

  const handleSelectPack = (idx: number) => {
    setSelectedPackIndex(idx);
    setSelectedImageIndex(0);
  };

  return (
    <div
      id="quick-view-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quick-view-modal-card"
        className="w-full max-w-4xl bg-[#F7F3E8] rounded-sm shadow-2xl overflow-hidden border border-[#B88A32]/40 relative my-6 max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-[#10110F]/80 hover:bg-[#10110F] text-[#F7F3E8] transition-colors shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Gallery (Amazon-style large prominent product view) */}
        <div className="w-full md:w-1/2 bg-[#10110F] p-4 sm:p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-[#F7F3E8] border border-[#B88A32]/30 mb-3 sm:mb-4 flex items-center justify-center p-3">
              {displayImage ? (
                <img
                  key={displayImage}
                  src={displayImage}
                  alt={`${product.name} - ${currentPack.name}`}
                  className={`w-full h-full object-contain animate-in fade-in duration-300 ${
                    isOutOfStock ? 'opacity-55 grayscale' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#183D27] via-[#10110F] to-[#183D27]/80 text-[#D4B66A]">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B66A]/80 font-bold mb-1">TITAN SHILAJIT</span>
                  <span className="font-serif text-sm font-bold text-[#F7F3E8]">{product.name}</span>
                  <span className="text-[10px] text-[#EEE8D7]/60 mt-2 font-mono">{currentPack.name}</span>
                </div>
              )}
              {isOutOfStock ? (
                <div className="absolute top-3 left-3 bg-red-800 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs border border-red-500 shadow-md">
                  OUT OF STOCK
                </div>
              ) : currentPack.savings ? (
                <div className="absolute top-3 left-3 bg-[#183D27] text-[#D4B66A] text-[9.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs border border-[#B88A32]/40 shadow-xs">
                  {currentPack.savings}
                </div>
              ) : null}
            </div>

            {/* Thumbnail selector */}
            {cleanProductImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {cleanProductImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xs overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#D4B66A] opacity-100 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick purity proof badges */}
          <div className="mt-4 pt-3 border-t border-white/10 hidden sm:flex flex-col gap-1.5 text-[11px] text-[#EEE8D7]/80">
            <div className="flex items-center gap-2">
              <Mountain className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Harvested above 16,000 ft</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-3.5 h-3.5 text-[#25D366]" />
              <span>{product.fulvicAcidContent}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>Surya Tapi Sun-Purified</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Buying Options */}
        <div className="w-full md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Badge & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest text-[#183D27] bg-[#183D27]/10 px-2.5 py-1 rounded-xs">
                {product.category.toUpperCase()} • {currentPack.quantityText}
              </span>
              <div className="flex items-center gap-1 text-[#B88A32] text-xs">
                <Star className="w-3.5 h-3.5 fill-[#B88A32]" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-[#66704B]">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F] leading-tight mb-2">
              {product.name}
            </h3>

            <p className="text-xs text-[#66704B] font-sans leading-relaxed mb-4">
              {product.shortDescription || product.description}
            </p>

            {/* THREE PACK BUTTONS */}
            <div className="mb-4 p-3 rounded-xs bg-white border border-[#10110F]/10 shadow-xs">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-bold text-[#10110F] uppercase tracking-wider text-[10px]">
                  AVAILABLE PACK SIZES:
                </span>
                <span className="text-[#183D27] font-semibold text-[10px] bg-[#183D27]/10 px-2 py-0.5 rounded-xs border border-[#183D27]/15">
                  {currentPack.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {packs.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx;
                  const shortBadge = getPackShortBadge(pack.badge, idx);
                  const shortName = getPackShortName(pack, idx);
                  const shortQuantity = getPackShortQuantity(pack.quantityText);

                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => handleSelectPack(idx)}
                      className={`p-1.5 sm:p-2 rounded-xs border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[76px] ${
                        isSelected
                          ? 'bg-[#183D27] text-[#F7F3E8] border-[#B88A32] ring-1 ring-[#B88A32]'
                          : 'bg-[#F7F3E8] hover:bg-[#EEE8D7] text-[#10110F] border-[#10110F]/15'
                      }`}
                    >
                      <div
                        className={`w-full text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded-xs text-center truncate mb-1 ${
                          isSelected
                            ? 'bg-[#B88A32] text-[#10110F]'
                            : 'bg-[#10110F]/10 text-[#66704B]'
                        }`}
                      >
                        {shortBadge}
                      </div>
                      <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-tight truncate w-full ${isSelected ? 'text-[#D4B66A]' : 'text-[#10110F]'}`}>
                        {shortName}
                      </span>
                      <span className={`text-[9px] truncate w-full my-0.5 ${isSelected ? 'text-[#EEE8D7]/85' : 'text-[#66704B]'}`}>
                        {shortQuantity}
                      </span>
                      <span className={`text-xs sm:text-[13px] font-black mt-0.5 ${isSelected ? 'text-[#F7F3E8]' : 'text-[#10110F]'}`}>
                        ₹{pack.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Pack Full Details Banner */}
              <div className="mt-2 py-1 px-2 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex items-center justify-between text-[10px]">
                <span className="text-[#66704B] font-medium truncate">
                  {currentPack.quantityText}
                </span>
                {currentPack.savings && (
                  <span className="text-[#183D27] font-bold shrink-0 ml-1.5 whitespace-nowrap">
                    {currentPack.savings}
                  </span>
                )}
              </div>
            </div>

            {/* Price block */}
            <div className="flex items-baseline justify-between p-3 rounded-xs bg-[#EEE8D7]/70 border border-[#10110F]/10 mb-4">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#10110F]">
                  ₹{displayPrice * quantity}
                </span>
                {displayMrp && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    MRP ₹{displayMrp * quantity}
                  </span>
                )}
                {currentPack.savings && (
                  <span className="text-[10px] sm:text-xs font-bold text-[#183D27] bg-[#183D27]/15 px-2 py-0.5 rounded-xs">
                    {currentPack.savings}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold text-[#66704B]">
                Taxes Included
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#10110F]">
                Order Quantity:
              </span>
              <div className="flex items-center border border-[#10110F]/20 rounded-xs bg-white">
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm hover:bg-[#EEE8D7] text-[#10110F] font-bold disabled:opacity-30 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#10110F]">{quantity}</span>
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm hover:bg-[#EEE8D7] text-[#10110F] font-bold disabled:opacity-30 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-3 border-t border-[#10110F]/10">
            {isOutOfStock ? (
              <div className="p-3 rounded-xs bg-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest text-center border border-stone-300 flex items-center justify-center gap-2">
                <Ban className="w-4 h-4 text-stone-500" />
                <span>CURRENTLY OUT OF STOCK</span>
              </div>
            ) : (
              <>
                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer min-h-[44px]"
                >
                  <Lock className="w-4 h-4 text-[#D4B66A]" />
                  <span>BUY NOW — PROCEED TO BILLING (₹{displayPrice * quantity})</span>
                  <ArrowRight className="w-4 h-4 text-[#D4B66A]" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[42px]"
                  >
                    {isAddedToast ? (
                      <>
                        <Check className="w-4 h-4 text-[#D4B66A]" />
                        <span className="text-[#D4B66A]">
                          {cartQty > 0 ? 'UPDATED!' : 'ADDED!'}
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
                        <span>{cartQty > 0 ? `UPDATE (${quantity})` : 'ADD TO CART'}</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="py-3 rounded-xs border border-[#10110F]/30 text-[#10110F] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-[#EEE8D7] transition-colors text-center min-h-[42px]"
                  >
                    <span>FULL PAGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="pt-1">
                  <AmazonFlipkartBadge variant="compact" className="w-full justify-center bg-white/80" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return <QuickViewModalContent product={product} onClose={onClose} />;
};
