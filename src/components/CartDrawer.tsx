import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  CheckCircle2,
  Lock,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreContent } from '../context/StoreContentContext';
import { BRAND_CONTACT } from '../data/content';
import { AnnouncementBar } from './AnnouncementBar';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { checkCustomerFirstOrder, recordOrder } = useStoreContent();

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(() => {
    try { return localStorage.getItem('titan_cart_name') || ''; } catch { return ''; }
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    try { return localStorage.getItem('titan_cart_phone') || ''; } catch { return ''; }
  });
  const [customerEmail, setCustomerEmail] = useState(() => {
    try { return localStorage.getItem('titan_cart_email') || ''; } catch { return ''; }
  });

  // Coupon Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  if (!isOpen) return null;

  // Coupon Application & First-Order Eligibility Verification
  const handleApplyCoupon = async (codeToApply?: string) => {
    const rawCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!rawCode) return;

    setCouponMessage(null);
    setIsVerifyingCoupon(true);

    const isFirstOrderCoupon = ['FIRST50', 'FIRSTORDER', 'WELCOME50', 'NEW50'].includes(rawCode);

    if (isFirstOrderCoupon) {
      const cleanPhone = customerPhone.trim();
      const cleanEmail = customerEmail.trim();

      if (!cleanPhone && !cleanEmail) {
        setCouponMessage({
          type: 'error',
          text: 'Please enter your Mobile Number or Email below first to verify first-order eligibility.',
        });
        setIsVerifyingCoupon(false);
        return;
      }

      // Check Mobile Number in Firestore / Previous Orders
      if (cleanPhone) {
        const phoneCheck = await checkCustomerFirstOrder(cleanPhone);
        if (!phoneCheck.isFirstOrder) {
          setAppliedCoupon(null);
          setDiscountAmount(0);
          setCouponMessage({
            type: 'error',
            text: `Coupon rejected: This coupon (${rawCode}) is only valid for your first order. A previous order was found with mobile number ${cleanPhone}.`,
          });
          setIsVerifyingCoupon(false);
          return;
        }
      }

      // Check Email ID in Firestore / Previous Orders
      if (cleanEmail) {
        const emailCheck = await checkCustomerFirstOrder(cleanEmail);
        if (!emailCheck.isFirstOrder) {
          setAppliedCoupon(null);
          setDiscountAmount(0);
          setCouponMessage({
            type: 'error',
            text: `Coupon rejected: This coupon (${rawCode}) is only valid for your first order. A previous order was found with email ${cleanEmail}.`,
          });
          setIsVerifyingCoupon(false);
          return;
        }
      }

      // Passed check! Apply first order discount
      setAppliedCoupon(rawCode);
      setDiscountAmount(50);
      setCouponMessage({
        type: 'success',
        text: `First order coupon ${rawCode} applied! Extra ₹50 discount deducted from your total.`,
      });
    } else if (rawCode === 'TITAN100' && totalPrice >= 2000) {
      setAppliedCoupon(rawCode);
      setDiscountAmount(100);
      setCouponMessage({
        type: 'success',
        text: `TITAN100 applied! Extra ₹100 discount deducted.`,
      });
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMessage({
        type: 'error',
        text: `Coupon "${rawCode}" is not recognized or does not meet minimum order requirements. Try "FIRST50".`,
      });
    }

    setIsVerifyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
    setCouponCode('');
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  // Generate WhatsApp Checkout URL with customer and coupon details
  const handleConfirmOrderWhatsApp = async () => {
    // Save contact info locally
    try {
      if (customerName) localStorage.setItem('titan_cart_name', customerName);
      if (customerPhone) localStorage.setItem('titan_cart_phone', customerPhone);
      if (customerEmail) localStorage.setItem('titan_cart_email', customerEmail);
    } catch {}

    // Record the order to Firestore so future repeat orders with same mobile/email cannot reuse FIRST50
    try {
      await recordOrder({
        orderNumber: `TITAN-${Date.now().toString().slice(-6)}`,
        customerName: customerName || 'Valued Guest',
        customerPhone: customerPhone || 'Via WhatsApp',
        customerEmail: customerEmail || 'N/A',
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          packName: item.selectedPack?.name || item.product.size,
          quantity: item.quantity,
          price: item.selectedPack ? item.selectedPack.price : item.product.price,
        })),
        subtotal: totalPrice,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        total: finalTotal,
        status: 'confirmed',
        paymentMethod: 'whatsapp_prepaid',
      });
    } catch (err) {
      console.warn('Order record log notice:', err);
    }

    // Build formatted WhatsApp Message
    const itemsList = items
      .map((item, index) => {
        const packName = item.selectedPack ? ` (${item.selectedPack.name} - ${item.selectedPack.quantityText})` : ` (${item.product.size})`;
        const price = item.selectedPack ? item.selectedPack.price : item.product.price;
        return `${index + 1}. ${item.product.name}${packName} x ${item.quantity} = ₹${price * item.quantity}`;
      })
      .join('\n');

    const customerDetails = [
      customerName ? `Name: ${customerName}` : null,
      customerPhone ? `Mobile: ${customerPhone}` : null,
      customerEmail ? `Email: ${customerEmail}` : null,
    ].filter(Boolean).join('\n');

    const discountLine = appliedCoupon
      ? `Coupon Code: ${appliedCoupon} (-₹${discountAmount} First Order Savings Applied)`
      : 'No coupon code applied';

    const message = `Hello Titan Shilajit Concierge,

I would like to confirm my order:

${itemsList}

${customerDetails ? `CUSTOMER DETAILS:\n${customerDetails}\n` : ''}Subtotal: ₹${totalPrice}
${appliedCoupon ? `${discountLine}\n` : ''}Final Total Payable: ₹${finalTotal}
Shipping: Complimentary Express Across India Included

Please confirm order dispatch and share payment details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${BRAND_CONTACT.phoneRaw}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={closeCart}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#F7F3E8] h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#10110F]/10">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-[#10110F] tracking-wide">
                YOUR TITAN CART
              </span>
              <span className="text-xs bg-[#183D27] text-[#D4B66A] px-2.5 py-0.5 rounded-full font-bold">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 text-[#10110F]/70 hover:text-[#10110F] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
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
              {items.map((item) => {
                const itemKey = item.id || (item.selectedPack ? `${item.product.id}-${item.selectedPack.id}` : item.product.id);
                const displayImage = item.selectedPack ? item.selectedPack.image : item.product.images[0];
                const unitPrice = item.selectedPack ? item.selectedPack.price : item.product.price;
                const unitMrp = item.selectedPack ? item.selectedPack.mrp : item.product.mrp;
                const displaySize = item.selectedPack ? item.selectedPack.quantityText : item.product.size;

                return (
                  <div key={itemKey} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <img
                      src={displayImage}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-sm border border-[#10110F]/10 shrink-0 bg-[#10110F]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-serif text-sm font-semibold text-[#10110F] truncate">
                          {item.product.name}
                        </h4>
                        {item.selectedPack && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#183D27] text-[#D4B66A] px-1.5 py-0.2 rounded-xs">
                            {item.selectedPack.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#66704B] font-sans mt-0.5">{displaySize}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-sm text-[#10110F]">
                          ₹{unitPrice}
                        </span>
                        {unitMrp && (
                          <span className="text-xs text-gray-500 line-through">
                            ₹{unitMrp}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#10110F]/20 rounded-sm bg-white">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="px-2 py-1 text-xs hover:bg-[#EEE8D7] text-[#10110F] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="px-2 py-1 text-xs hover:bg-[#EEE8D7] text-[#10110F] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(itemKey)}
                          aria-label="Remove item"
                          className="text-red-700/70 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer Information & Coupon & Checkout Section */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-[#10110F]/10 flex flex-col gap-3">
            {/* Prepaid & First Order Discount Banner */}
            <AnnouncementBar variant="checkout" />

            {/* Customer Details Form (Required for First Order Coupon Validation) */}
            <div className="bg-white p-3 rounded-xs border border-[#10110F]/15 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#183D27] block">
                Customer Details (For First Order Verification & Dispatch)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Mobile No. (e.g. 9876543210)"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (couponMessage?.type === 'error') setCouponMessage(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs w-full"
                />
                <input
                  type="email"
                  placeholder="Email ID (e.g. name@gmail.com)"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (couponMessage?.type === 'error') setCouponMessage(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Full Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs w-full"
              />
            </div>

            {/* Coupon Code Input & Status */}
            <div className="bg-white p-3 rounded-xs border border-[#10110F]/15 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#10110F]">
                  <Tag className="w-3.5 h-3.5 text-[#B88A32]" />
                  <span>First Order Coupon Code</span>
                </div>
                {!appliedCoupon && (
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('FIRST50');
                      handleApplyCoupon('FIRST50');
                    }}
                    className="text-[10px] text-[#183D27] underline font-bold hover:text-[#B88A32]"
                  >
                    Use "FIRST50"
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xs bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon}</strong> Applied (-₹{discountAmount})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[10px] uppercase font-bold text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (FIRST50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 rounded-xs border border-[#10110F]/20 text-xs uppercase font-bold"
                  />
                  <button
                    type="button"
                    disabled={isVerifyingCoupon || !couponCode.trim()}
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-1.5 bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] rounded-xs text-xs font-bold uppercase disabled:opacity-50 cursor-pointer"
                  >
                    {isVerifyingCoupon ? 'Verifying...' : 'Apply'}
                  </button>
                </div>
              )}

              {/* Coupon Response Message (e.g. rejection if repeat customer) */}
              {couponMessage && (
                <div
                  className={`p-2 rounded-xs text-[11px] flex items-start gap-1.5 leading-snug ${
                    couponMessage.type === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {couponMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <span>{couponMessage.text}</span>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex items-center justify-between text-[#66704B]">
                <span>Items Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>First Order Coupon Discount ({appliedCoupon})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#66704B]">
                <span>Express Pan-India Shipping</span>
                <span className="text-emerald-700 font-semibold uppercase">FREE</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-[#10110F] pt-2 border-t border-[#10110F]/10">
                <span>Final Payable</span>
                <span className="font-serif text-xl font-bold">₹{finalTotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-sm bg-[#183D27]/10 border border-[#183D27]/20 text-[11px] text-[#183D27]">
              <ShieldCheck className="w-4 h-4 text-[#183D27] shrink-0" />
              <span>Complimentary Delhivery Pan-India Express Shipping included</span>
            </div>

            {/* Primary Action: Proceed to Billing & Checkout */}
            <button
              id="cart-checkout-proceed-btn"
              onClick={() => {
                try {
                  if (customerName) localStorage.setItem('titan_checkout_name', customerName);
                  if (customerPhone) localStorage.setItem('titan_checkout_phone', customerPhone);
                  if (customerEmail) localStorage.setItem('titan_checkout_email', customerEmail);
                  sessionStorage.removeItem('titan_last_confirmed_order');
                } catch {}
                closeCart();
                navigate('/checkout');
              }}
              className="w-full py-4 rounded-sm bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer min-h-[46px]"
            >
              <Lock className="w-4 h-4 text-[#D4B66A]" />
              <span>PROCEED TO BILLING & CHECKOUT (₹{finalTotal})</span>
              <ArrowRight className="w-4 h-4 text-[#D4B66A]" />
            </button>

            {/* Payment & Delivery Badges */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#66704B]">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-[#183D27]" />
                Cards & UPI
              </span>
              <span>•</span>
              <span>Cash on Delivery</span>
              <span>•</span>
              <span>Delhivery One</span>
            </div>

            {/* Secondary WhatsApp Concierge Fallback */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleConfirmOrderWhatsApp}
                className="text-[11px] text-[#183D27] hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Prefer ordering with Concierge on WhatsApp? Click here</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
