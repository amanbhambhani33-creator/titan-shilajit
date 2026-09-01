import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCartCheckoutWhatsAppUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  const whatsappCheckoutUrl = getCartCheckoutWhatsAppUrl(items);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={closeCart}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#F7F3E8] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#10110F]/10">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-[#10110F] tracking-wide">
                YOUR TITAN CART
              </span>
              <span className="text-xs bg-[#183D27] text-[#F7F3E8] px-2 py-0.5 rounded-full font-semibold">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 text-[#10110F]/70 hover:text-[#10110F] hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#EEE8D7] flex items-center justify-center text-[#B88A32]">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#10110F]">Your cart is empty</h3>
              <p className="text-sm text-[#66704B] max-w-xs">
                Explore our pure Himalayan Shilajit resin and natural honey sticks to build your daily vitality ritual.
              </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 rounded-sm bg-[#10110F] text-[#F7F3E8] text-xs font-semibold tracking-widest uppercase hover:bg-[#183D27] transition-colors"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          ) : (
            <div className="py-4 divide-y divide-[#10110F]/10 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-sm border border-[#10110F]/10 shrink-0 bg-[#10110F]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-[#10110F] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-[#66704B] font-sans">{item.product.size}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-sm text-[#10110F]">
                        ₹{item.product.price}
                      </span>
                      {item.product.mrp && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{item.product.mrp}
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#10110F]/20 rounded-sm bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-xs hover:bg-[#EEE8D7] text-[#10110F]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-xs hover:bg-[#EEE8D7] text-[#10110F]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove item"
                        className="text-red-700/70 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="pt-6 border-t border-[#10110F]/10 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#66704B] font-medium">Subtotal</span>
              <span className="font-display text-lg font-bold text-[#10110F]">₹{totalPrice}</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-sm bg-[#183D27]/10 border border-[#183D27]/20 text-xs text-[#183D27]">
              <ShieldCheck className="w-4 h-4 text-[#183D27] shrink-0" />
              <span>Complimentary Express Shipping across India included</span>
            </div>

            <a
              id="cart-checkout-whatsapp-btn"
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-sm bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5 text-[#10110F]" />
              <span>CONFIRM ORDER ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <p className="text-[11px] text-center text-[#66704B]">
              Direct ordering via WhatsApp ensures priority Delhi dispatch, batch authenticity certificates, and personalized routine advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
