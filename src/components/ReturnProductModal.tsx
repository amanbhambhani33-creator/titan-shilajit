import React, { useState } from 'react';
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
} from 'lucide-react';
import { BRAND_CONTACT } from '../data/content';

interface ReturnProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReturnProductModal: React.FC<ReturnProductModalProps> = ({ isOpen, onClose }) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [productName, setProductName] = useState('Titan Pure Himalayan Shilajit Resin (20g)');
  const [reason, setReason] = useState('Damaged / Broken container in transit');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInvoice = invoiceNumber.trim();
    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.replace(/\D/g, '').trim();

    if (!cleanInvoice) {
      setErrorMessage('Please provide your Invoice Number or Order ID.');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Please enter your full name as on the bill.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const returnPayload = {
      invoiceNumber: cleanInvoice,
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: customerEmail.trim() || undefined,
      productName: productName.trim(),
      reason,
      details: details.trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Post to Server / Firestore so the return request is permanently recorded
    try {
      await fetch('/api/returns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnPayload),
      });
    } catch (apiErr) {
      console.warn('Notice recording return in backend:', apiErr);
    }

    // 2. Prepare WhatsApp message
    const formattedMsg =
      `*TITAN SHILAJIT RETURN REQUEST*\n\n` +
      `Hello Titan Support, I would like to request a return / replacement for my order:\n\n` +
      `• *Invoice No:* ${cleanInvoice}\n` +
      `• *Customer Name:* ${cleanName}\n` +
      `• *Mobile:* +91 ${cleanPhone.slice(-10)}\n` +
      (customerEmail.trim() ? `• *Email:* ${customerEmail.trim()}\n` : '') +
      `• *Product:* ${productName}\n` +
      `• *Return Reason:* ${reason}\n` +
      (details.trim() ? `• *Details:* ${details.trim()}\n` : '') +
      `\nPlease assist me with return pickup and replacement/refund. Thank you!`;

    const encoded = encodeURIComponent(formattedMsg);
    const waUrl = `https://wa.me/919958474229?text=${encoded}`;

    setIsSubmitting(false);
    setSubmitted(true);

    // Redirect to WhatsApp
    window.location.href = waUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white text-[#10110F] w-full max-w-lg rounded-sm shadow-2xl border border-[#10110F]/15 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#183D27] text-[#F7F3E8] p-5 flex items-center justify-between border-b border-[#B88A32]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10110F] text-[#D4B66A] border border-[#B88A32]/40 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4B66A]">
                EASY 7-DAY RETURN POLICY
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3E8] leading-tight">
                Want to Return Product?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Return Form"
            className="p-2 rounded-xs text-[#F7F3E8]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#10110F]">
                Return Request Recorded! 😊
              </h4>
              <p className="text-xs text-[#66704B] max-w-md mx-auto leading-relaxed">
                Your return request has been submitted into our system and opened on WhatsApp Concierge. Our Delhi dispatch desk will verify and arrange Delhivery return reverse-pickup within 24 hours.
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-wider hover:bg-[#10110F] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xs bg-[#183D27]/5 border border-[#183D27]/20 text-xs text-[#183D27] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#183D27] mt-0.5" />
                <p>
                  Fill out this quick form with your invoice details. Once submitted, your return is recorded and redirected to our <strong>WhatsApp Concierge (+91 99584 74229)</strong> for rapid approval.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xs bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Invoice Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Invoice Number / Order ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-2.5 text-[#66704B]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. TITAN-INV-2026-00101 or TITAN-782190"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
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
                      placeholder="Name on bill"
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
                  Product to Return <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3 top-2.5 text-[#66704B]" />
                  <input
                    type="text"
                    required
                    placeholder="Product name / variant (e.g. Pure Resin 20g)"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xs border border-[#10110F]/20 text-xs focus:ring-1 focus:ring-[#183D27]"
                  />
                </div>
              </div>

              {/* Reason for Return */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Reason for Return <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white focus:ring-1 focus:ring-[#183D27]"
                >
                  <option value="Damaged / Broken container in transit">Damaged / Broken container in transit</option>
                  <option value="Product seal broken or leaked">Product seal broken or leaked</option>
                  <option value="Wrong product or variant delivered">Wrong product or variant delivered</option>
                  <option value="Quality or texture concern">Quality or texture concern</option>
                  <option value="Ordered by mistake / Exchange size">Ordered by mistake / Exchange size</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Issue Description & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Please describe what happened (e.g. outer box seal broken, photos available for verification)..."
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
                  <span>{isSubmitting ? 'Recording...' : 'Submit & Open WhatsApp Concierge'}</span>
                </button>
                <p className="text-[10px] text-center text-[#66704B] mt-2">
                  Our Delhi dispatch team responds within 10–30 minutes during business hours.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
