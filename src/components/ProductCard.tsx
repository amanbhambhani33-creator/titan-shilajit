import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Star, ShoppingBag, Check, Plus, Minus, Ban, Zap } from 'lucide-react';
import { Product, ProductPack } from '../types';
import { useCart } from '../context/CartContext';
import { getProductPacks, getPackShortBadge, getPackShortName, getPackShortQuantity } from '../utils/productPacks';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isHomeScreen?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  isHomeScreen = false,
}) => {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const packs = getProductPacks(product);

  // Stock status check
  const isOutOfStock = !product.inStock || (product.stockQty !== undefined && product.stockQty <= 0);

  // Default to Most Popular pack (index 1) or first available
  const [selectedPackIndex, setSelectedPackIndex] = useState(1);
  const currentPack: ProductPack = packs[selectedPackIndex] || packs[0];

  // Cart quantity synchronization (Requirement 3: sync with cart so increasing doesn't sum up incorrectly)
  const cartQty = getItemQuantity(product.id, currentPack.id);
  const [quantity, setQuantity] = useState(cartQty > 0 ? cartQty : 1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  useEffect(() => {
    const existing = getItemQuantity(product.id, currentPack.id);
    if (existing > 0) {
      setQuantity(existing);
    }
  }, [product.id, currentPack.id, getItemQuantity]);

  // Dynamic image, price, mrp, and quantity based on active pack
  // Strictly prefer user-uploaded images and custom pack photos - zero generic unsplash photos
  const cleanProductImages = (product.images || []).filter((img) => img && !img.includes('unsplash.com'));
  const isGenericPackImg = !currentPack.image || currentPack.image.includes('unsplash.com');
  const displayImage = (!isGenericPackImg && currentPack.image)
    ? currentPack.image
    : (cleanProductImages[selectedPackIndex] || cleanProductImages[0] || '');
  const displayPrice = currentPack.price;
  const displayMrp = currentPack.mrp;
  const displayQuantityText = currentPack.quantityText;

  const handleSelectPack = (idx: number) => {
    setSelectedPackIndex(idx);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    // mode 'set' ensures setting directly to the specified quantity without summing up
    addToCart(product, quantity, currentPack, 'set');
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      className={`group flex flex-col justify-between bg-white rounded-sm border p-4 sm:p-5 transition-all duration-300 shadow-xs hover:shadow-xl relative ${
        isOutOfStock
          ? 'border-red-200/60 bg-stone-50/50'
          : 'border-[#10110F]/10 hover:border-[#B88A32]/60'
      }`}
    >
      {/* Upper Section: Image Container */}
      <div>
        <div
          onClick={() => (isHomeScreen ? onQuickView(product) : undefined)}
          className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-[#10110F] rounded-xs cursor-pointer mb-4"
        >
          {displayImage ? (
            isHomeScreen ? (
              <div className="block w-full h-full">
                <img
                  key={displayImage}
                  src={displayImage}
                  alt={`${product.name} - ${currentPack.name}`}
                  className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ${
                    isOutOfStock ? 'opacity-50 grayscale' : 'opacity-95 group-hover:opacity-100'
                  }`}
                  loading="lazy"
                />
              </div>
            ) : (
              <Link to={`/product/${product.slug}`} className="block w-full h-full">
                <img
                  key={displayImage}
                  src={displayImage}
                  alt={`${product.name} - ${currentPack.name}`}
                  className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ${
                    isOutOfStock ? 'opacity-50 grayscale' : 'opacity-95 group-hover:opacity-100'
                  }`}
                  loading="lazy"
                />
              </Link>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#183D27] via-[#10110F] to-[#183D27]/80 text-[#D4B66A]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B66A]/80 font-bold mb-1">TITAN SHILAJIT</span>
              <span className="font-serif text-sm font-bold text-[#F7F3E8] line-clamp-2">{product.name}</span>
              <span className="text-[10px] text-[#EEE8D7]/60 mt-2 font-mono">{currentPack.name}</span>
            </div>
          )}

          {/* Badges & Pack indicator */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-xs bg-red-800 text-white text-[10px] font-sans font-black tracking-widest uppercase border border-red-500 shadow-md">
                OUT OF STOCK
              </span>
            ) : (
              <>
                {currentPack.savings && !isHomeScreen && (
                  <span className="px-2.5 py-0.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-[9px] font-sans font-bold tracking-widest uppercase border border-[#B88A32]/40 shadow-xs">
                    {currentPack.savings}
                  </span>
                )}
                {!isHomeScreen && (
                  <span className="px-2.5 py-0.5 rounded-xs bg-[#10110F]/90 backdrop-blur-xs text-[#F7F3E8] text-[9px] font-sans font-semibold tracking-wider uppercase border border-white/10">
                    {displayQuantityText}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Quick View and Direct Add overlay (desktop hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-4 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick View product details"
              className="px-3.5 py-2 rounded-xs bg-[#F7F3E8] hover:bg-[#D4B66A] text-[#10110F] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            {!isOutOfStock && !isHomeScreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                aria-label="Add selected pack to cart"
                className="px-3.5 py-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                title="Add Pack to Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Pack</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-[#183D27] font-bold uppercase tracking-wider bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
              {product.category === 'resin'
                ? 'PURE RESIN'
                : product.category === 'honey-sticks'
                ? 'HONEY STICK'
                : 'RITUAL BUNDLE'}
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

          {isHomeScreen ? (
            <button
              onClick={() => onQuickView(product)}
              className="font-serif text-base sm:text-lg font-bold text-[#10110F] hover:text-[#183D27] transition-colors leading-snug line-clamp-2 text-left cursor-pointer"
            >
              {product.name}
            </button>
          ) : (
            <Link
              to={`/product/${product.slug}`}
              className="font-serif text-base sm:text-lg font-bold text-[#10110F] hover:text-[#183D27] transition-colors leading-snug line-clamp-2"
            >
              {product.name}
            </Link>
          )}

          <p className="text-xs text-[#66704B] font-sans line-clamp-2 leading-relaxed font-light">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOME SCREEN VIEW: Pack size & Pricing HIDDEN, ONLY 1 ACTION BUTTON BELOW */}
      {/* (Requirement 9: only one button below every product on home screen opening popup) */}
      {/* ========================================================================= */}
      {isHomeScreen ? (
        <div className="mt-3 pt-3 border-t border-[#10110F]/10">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-3 px-4 rounded-xs bg-stone-200 text-stone-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed border border-stone-300"
            >
              <Ban className="w-3.5 h-3.5 text-stone-500" />
              <span>OUT OF STOCK</span>
            </button>
          ) : (
            <button
              type="button"
              id={`home-product-details-btn-${product.slug}`}
              onClick={() => onQuickView(product)}
              className="w-full py-3 px-4 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95 cursor-pointer group/btn min-h-[44px]"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4B66A] group-hover/btn:scale-110 transition-transform" />
              <span>VIEW DETAILS & BUY OPTIONS</span>
            </button>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* NON-HOME / SHOP PAGE VIEW: Standard 3 Pack selection, pricing & quantity  */
        /* ========================================================================= */
        <div className="mt-2 pt-3 border-t border-[#10110F]/10 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#10110F] uppercase tracking-wider text-[10px]">
              SELECT PACK SIZE:
            </span>
            <span className="text-[#183D27] font-semibold text-[10px] bg-[#183D27]/10 px-2 py-0.5 rounded-xs border border-[#183D27]/15">
              {currentPack.name}
            </span>
          </div>

          {/* 3 Pack Selection Buttons */}
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
                  className={`flex flex-col items-center justify-between p-1.5 sm:p-2 rounded-xs border text-center transition-all cursor-pointer min-h-[76px] ${
                    isSelected
                      ? 'bg-[#183D27] text-[#F7F3E8] border-[#B88A32] shadow-sm ring-1 ring-[#B88A32]/60'
                      : 'bg-[#F7F3E8]/60 hover:bg-[#EEE8D7] text-[#10110F] border-[#10110F]/15'
                  }`}
                >
                  <div
                    className={`w-full py-0.5 px-1 text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-center truncate rounded-xs mb-1 ${
                      isSelected
                        ? 'bg-[#B88A32] text-[#10110F]'
                        : 'bg-[#10110F]/10 text-[#66704B]'
                    }`}
                  >
                    {shortBadge}
                  </div>

                  <span
                    className={`text-[10px] sm:text-[11px] font-bold tracking-tight uppercase leading-tight truncate w-full ${
                      isSelected ? 'text-[#D4B66A]' : 'text-[#10110F]'
                    }`}
                  >
                    {shortName}
                  </span>

                  <span
                    className={`text-[9px] font-medium leading-none truncate w-full my-0.5 ${
                      isSelected ? 'text-[#EEE8D7]/80' : 'text-[#66704B]'
                    }`}
                  >
                    {shortQuantity}
                  </span>

                  <span
                    className={`text-xs sm:text-[13px] font-black font-sans leading-none mt-0.5 ${
                      isSelected ? 'text-[#F7F3E8]' : 'text-[#10110F]'
                    }`}
                  >
                    ₹{pack.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Pack Full Details Banner */}
          <div className="py-1 px-2 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 flex items-center justify-between text-[10px]">
            <span className="text-[#66704B] font-medium truncate">
              {currentPack.quantityText}
            </span>
            {currentPack.savings && (
              <span className="text-[#183D27] font-bold shrink-0 ml-1.5 whitespace-nowrap">
                {currentPack.savings}
              </span>
            )}
          </div>

          {/* Dynamic Price Display & Quantity Stepper */}
          <div className="pt-2 mt-1 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#10110F]">
                  ₹{displayPrice * quantity}
                </span>
                {displayMrp && (
                  <span className="text-xs text-gray-400 line-through font-light">
                    ₹{displayMrp * quantity}
                  </span>
                )}
              </div>
              {currentPack.savings && (
                <span className="text-[10px] text-[#183D27] font-semibold">
                  Instant Savings: {currentPack.savings}
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#10110F]/20 rounded-xs bg-[#F7F3E8]">
              <button
                disabled={isOutOfStock}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease pack quantity"
                className="p-1.5 text-[#10110F] hover:bg-[#10110F]/10 transition-colors disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold text-[#10110F]">{quantity}</span>
              <button
                disabled={isOutOfStock}
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase pack quantity"
                className="p-1.5 text-[#10110F] hover:bg-[#10110F]/10 transition-colors disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {isOutOfStock ? (
              <div className="col-span-2 py-2.5 px-3 rounded-xs bg-stone-200 text-stone-600 text-[11px] font-bold tracking-wider uppercase text-center border border-stone-300 flex items-center justify-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-stone-500" />
                <span>CURRENTLY OUT OF STOCK</span>
              </div>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.name} ${currentPack.name} to Cart`}
                  className="py-2.5 px-2 rounded-xs bg-[#10110F] text-[#F7F3E8] hover:bg-[#183D27] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer shadow-sm"
                >
                  {isAddedToast ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#D4B66A]" />
                      <span className="text-[#D4B66A]">
                        {cartQty > 0 ? 'UPDATED!' : 'ADDED!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B88A32]" />
                      <span>{cartQty > 0 ? `UPDATE (${quantity})` : 'ADD TO CART'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, quantity, currentPack, 'set');
                    navigate('/checkout');
                  }}
                  aria-label={`Buy ${product.name} ${currentPack.name} now`}
                  className="py-2.5 px-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xs transition-all min-h-[42px] cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#D4B66A]" />
                  <span>BUY NOW</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
