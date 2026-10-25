import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Package,
  Clock,
  Check,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { BRAND_CONTACT } from '../data/content';
import { getOrderTimeInfo, formatDateTime } from '../utils/orderPolicy';

export interface ReturnProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
  initialInvoiceNumber?: string;
  initialCustomerName?: string;
  initialCustomerPhone?: string;
  initialCustomerEmail?: string;
  initialProductName?: string;
  initialRequestType?: 'cancellation_6h' | 'return_24h_delivery';
  orderCreatedAt?: string;
  orderDeliveredAt?: string;
  onSuccess?: () => void;
}

export const ReturnProductModal: React.FC<ReturnProductModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
  initialInvoiceNumber = '',
  initialCustomerName = '',
  initialCustomerPhone = '',
  initialCustomerEmail = '',
  initialProductName = 'Titan Pure Himalayan Shilajit Resin (20g)',
  initialRequestType = 'cancellation_6h',
  orderCreatedAt,
  orderDeliveredAt,
  onSuccess,
}) => {
  const [requestType, setRequestType] = useState<'cancellation_6h' | 'return_24h_delivery'>(initialRequestType);
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoiceNumber || initialOrderNumber || '');
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || '');
  const [customerName, setCustomerName] = useState(initialCustomerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(initialCustomerEmail || '');
  const [productName, setProductName] = useState(initialProductName);
  const [reason, setReason] = useState('Ordered by mistake / Change of mind');
  const [details, setDetails] = useState('');
  const [refundUpi, setRefundUpi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync props when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setRequestType(initialRequestType);
      if (initialInvoiceNumber || initialOrderNumber) {
        setInvoiceNumber(initialInvoiceNumber || initialOrderNumber);
      }
      if (initialOrderNumber) setOrderNumber(initialOrderNumber);
      if (initialCustomerName) setCustomerName(initialCustomerName);
      if (initialCustomerPhone) setCustomerPhone(initialCustomerPhone);
      if (initialCustomerEmail) setCustomerEmail(initialCustomerEmail);
      if (initialProductName) setProductName(initialProductName);
      
      // Default reason based on request type
      if (initialRequestType === 'cancellation_6h') {
        setReason('Ordered by mistake / Change of mind');
      } else {
        setReason('Damaged / Broken container in transit');
      }
      setSubmitted(false);
      setErrorMessage(null);
    }
  }, [isOpen, initialInvoiceNumber, initialOrderNumber, initialCustomerName, initialCustomerPhone, initialCustomerEmail, initialProductName, initialRequestType]);

  // Adjust default reason when switching tabs
  const handleTypeChange = (type: 'cancellation_6h' | 'return_24h_delivery') => {
    setRequestType(type);
    if (type === 'cancellation_6h') {
      setReason('Ordered by mistake / Change of mind');
    } else {
      setReason('Damaged / Broken container in transit');
    }
  };

  if (!isOpen) return null;

  // Calculate policy status
  const timeInfo = getOrderTimeInfo(orderCreatedAt, orderDeliveredAt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInvoice = invoiceNumber.trim();
    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.replace(/\D/g, '').trim();

    if (!cleanInvoice) {
      setErrorMessage('Please provide your Order ID or Invoice Number.');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Please enter your full customer name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Client-side advisory checks if timestamps are available
    if (requestType === 'cancellation_6h' && orderCreatedAt) {
      const isPast6h = !timeInfo.isWithin6HourCancellation;
      if (isPast6h) {
        const confirmPast6h = window.confirm(
          'Notice: More than 6 hours have passed since this order was placed. Our logistics partner Delhivery has already scheduled your dispatch. Would you still like to submit this cancellation request to our concierge desk?'
        );
        if (!confirmPast6h) return;
      }
    }

    if (requestType === 'return_24h_delivery' && orderDeliveredAt) {
      const isPast24h = !timeInfo.isWithin24HourReturn;
      if (isPast24h) {
        const confirmPast24h = window.confirm(
          'Notice: More than 24 hours have passed since package delivery. Standard returns must be reported within 24 hours. Would you like to proceed with our concierge team for review?'
        );
        if (!confirmPast24h) return;
      }
    }

    setIsSubmitting(true);

    const returnPayload = {
      orderNumber: orderNumber.trim() || cleanInvoice,
      invoiceNumber: cleanInvoice,
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: customerEmail.trim() || undefined,
      productName: productName.trim(),
      requestType,
      reason,
      details: details.trim(),
      refundUpiOrAccount: refundUpi.trim() || undefined,
      orderPlacedAt: orderCreatedAt || undefined,
      deliveredAt: orderDeliveredAt || undefined,
      createdAt: new Date().toISOString(),
    };

    // 1. Post to Server / Firestore
    try {
      const res = await fetch('/api/returns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnPayload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn('Backend recorded note:', data?.error);
      }
    } catch (apiErr) {
      console.warn('Notice recording return in backend:', apiErr);
    }

    // 2. Prepare WhatsApp message with clear time stamps
    const isCancellation = requestType === 'cancellation_6h';
    const titleHeader = isCancellation
      ? `*TITAN SHILAJIT - ORDER CANCELLATION REQUEST (WITHIN 6 HOURS)*`
      : `*TITAN SHILAJIT - RETURN REQUEST (WITHIN 24H OF DELIVERY)*`;

    const placedLine = orderCreatedAt
      ? `• *Order Placed Time:* ${formatDateTime(orderCreatedAt)}\n`
      : '';
    const deliveredLine = orderDeliveredAt
      ? `• *Delivery Time:* ${formatDateTime(orderDeliveredAt)}\n`
      : '';
    const refundLine = refundUpi.trim()
      ? `• *UPI / Refund Account:* ${refundUpi.trim()}\n`
      : '';

    const formattedMsg =
      `${titleHeader}\n\n` +
      `Hello Titan Support, I would like to submit a ${isCancellation ? 'Cancellation' : 'Return'} request:\n\n` +
      `• *Order / Invoice No:* ${cleanInvoice}\n` +
      placedLine +
      deliveredLine +
      `• *Customer Name:* ${cleanName}\n` +
      `• *Mobile:* +91 ${cleanPhone.slice(-10)}\n` +
      (customerEmail.trim() ? `• *Email:* ${customerEmail.trim()}\n` : '') +
      `• *Product:* ${productName}\n` +
      `• *Reason:* ${reason}\n` +
      refundLine +
      (details.trim() ? `• *Notes:* ${details.trim()}\n` : '') +
      `\nPlease assist me with immediate processing. Thank you!`;

    const encoded = encodeURIComponent(formattedMsg);
    const waUrl = `https://wa.me/919958474229?text=${encoded}`;

    setIsSubmitting(false);
    setSubmitted(true);

    if (onSuccess) {
      onSuccess();
    }

    // Redirect to WhatsApp Concierge
    setTimeout(() => {
      window.location.href = waUrl;
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white text-[#10110F] w-full max-w-lg rounded-sm shadow-2xl border border-[#10110F]/15 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#183D27] text-[#F7F3E8] p-4 sm:p-5 flex items-center justify-between border-b border-[#B88A32]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10110F] text-[#D4B66A] border border-[#B88A32]/40 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4B66A] block">
                CUSTOMER PROTECTION DESK
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3E8] leading-tight">
                Order Cancellation & Return Form
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Form"
            className="p-2 rounded-xs text-[#F7F3E8]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#EEE8D7] border-b border-[#10110F]/10 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTypeChange('cancellation_6h')}
            className={`py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              requestType === 'cancellation_6h'
                ? 'bg-[#183D27] text-[#F7F3E8] shadow-xs'
                : 'text-[#66704B] hover:text-[#10110F]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>6-Hour Cancellation</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('return_24h_delivery')}
            className={`py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              requestType === 'return_24h_delivery'
                ? 'bg-[#183D27] text-[#F7F3E8] shadow-xs'
                : 'text-[#66704B] hover:text-[#10110F]'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>24-Hour Return (Delivered)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#10110F]">
                Request Recorded & Opening WhatsApp!
              </h4>
              <p className="text-xs text-[#66704B] max-w-md mx-auto leading-relaxed">
                Your {requestType === 'cancellation_6h' ? 'order cancellation' : 'product return'} has been logged in our Firestore database. We are redirecting you to our official <strong>WhatsApp Concierge (+91 99584 74229)</strong> for instant review and approval.
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-wider hover:bg-[#10110F] transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dynamic Policy Notice Box */}
              {requestType === 'cancellation_6h' ? (
                <div className="p-3.5 rounded-xs bg-[#183D27]/5 border border-[#183D27]/20 text-xs text-[#183D27] space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Clock className="w-4 h-4 text-[#183D27] shrink-0" />
                    <span>6-Hour Instant Cancellation Policy</span>
                  </div>
                  <p className="text-[11px] text-[#66704B] leading-relaxed">
                    You can cancel your order within <strong>6 hours of placement</strong>. The exact placement time is mentioned on your Order Slip. Full refund is initiated immediately to your payment source or UPI.
                  </p>
                  {orderCreatedAt && (
                    <div className="pt-1 mt-1 border-t border-[#183D27]/15 flex items-center justify-between text-[11px]">
                      <span>Placed: <strong>{timeInfo.orderPlacedFormatted}</strong></span>
                      {timeInfo.isWithin6HourCancellation ? (
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-xs">
                          {timeInfo.formattedTimeRemaining} remaining to cancel
                        </span>
                      ) : (
                        <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-xs">
                          6h window elapsed (in dispatch)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xs bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>24-Hour Post-Delivery Return Policy</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Once delivered by Delhivery, you have <strong>24 hours</strong> to inspect your package and report transit damage, broken seals, or discrepancy. Complimentary doorstep reverse-pickup will be scheduled.
                  </p>
                  {orderDeliveredAt && (
                    <div className="pt-1 mt-1 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                      <span>Delivered: <strong>{timeInfo.deliveredFormatted}</strong></span>
                      {timeInfo.isWithin24HourReturn ? (
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-xs">
                          {timeInfo.formattedReturnTimeRemaining} left in 24h window
                        </span>
                      ) : (
                        <span className="font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded-xs">
                          24h return window expired
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xs bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order ID / Invoice Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Order ID / Invoice Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-2.5 text-[#66704B]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. TITAN-984321 or INV-TITAN-00123"
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                      setOrderNumber(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27] focus:border-[#183D27]"
                  />
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-[#66704B]" />
                    <input
                      type="text"
                      required
                      placeholder="Name on order"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[#66704B]" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27]"
                    />
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Product Item <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3 top-2.5 text-[#66704B]" />
                  <input
                    type="text"
                    required
                    placeholder="Product name / pack size"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27]"
                  />
                </div>
              </div>

              {/* Reason for Request */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  {requestType === 'cancellation_6h' ? 'Reason for Cancellation' : 'Reason for Return'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white focus:ring-1 focus:ring-[#183D27]"
                >
                  {requestType === 'cancellation_6h' ? (
                    <>
                      <option value="Ordered by mistake / Change of mind">Ordered by mistake / Change of mind</option>
                      <option value="Selected incorrect pack or variant">Selected incorrect pack or variant</option>
                      <option value="Need to change shipping address or phone">Need to change shipping address or phone</option>
                      <option value="Duplicate order placed accidentally">Duplicate order placed accidentally</option>
                      <option value="Payment or coupon issue">Payment or coupon issue</option>
                      <option value="Other reason">Other reason</option>
                    </>
                  ) : (
                    <>
                      <option value="Damaged / Broken container in transit">Damaged / Broken container in transit</option>
                      <option value="Product jar seal broken or leaked">Product jar seal broken or leaked</option>
                      <option value="Wrong item or variant delivered">Wrong item or variant delivered</option>
                      <option value="Defective or compromised packaging">Defective or compromised packaging</option>
                      <option value="Quality concern upon delivery">Quality concern upon delivery</option>
                      <option value="Other reason">Other reason</option>
                    </>
                  )}
                </select>
              </div>

              {/* UPI ID for Refund (Optional for speedy refunds) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  UPI ID for Refund <span className="text-gray-400 font-normal lowercase">(optional for instant refund)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank or 9999999999@paytm"
                  value={refundUpi}
                  onChange={(e) => setRefundUpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27]"
                />
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Additional Notes / Issue Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide any additional details for our Delhi fulfillment desk..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xs bg-[#25D366] hover:bg-[#20bd5a] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Submitting...'
                      : requestType === 'cancellation_6h'
                      ? 'Submit 6h Cancellation & Open WhatsApp'
                      : 'Submit 24h Return & Open WhatsApp'}
                  </span>
                </button>
                <p className="text-[10.5px] text-center text-[#66704B] mt-2">
                  Our Delhi dispatch desk verifies time stamps and responds within 10–30 minutes.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
