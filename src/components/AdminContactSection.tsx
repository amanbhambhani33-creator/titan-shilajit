import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  MapPin,
  Mail,
  Clock,
  Save,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useStoreContent, DEFAULT_CONTACT } from '../context/StoreContentContext';
import { ContactConfig } from '../types';

interface AdminContactSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminContactSection: React.FC<AdminContactSectionProps> = ({ onSuccessToast }) => {
  const { content, updateContact } = useStoreContent();
  const currentContact: ContactConfig = content.contact || DEFAULT_CONTACT;

  const [form, setForm] = useState<ContactConfig>({
    phone: currentContact.phone || '+91 99584 74229',
    phoneDisplay: currentContact.phoneDisplay || '99584 74229',
    phoneRaw: currentContact.phoneRaw || '919958474229',
    whatsappNumber: currentContact.whatsappNumber || '919958474229',
    whatsappDisplay: currentContact.whatsappDisplay || '+91 99584 74229',
    whatsappDefaultMessage:
      currentContact.whatsappDefaultMessage ||
      'Hello Titan Shilajit Team, I would like to inquire about your pure Himalayan Shilajit products.',
    email: currentContact.email || 'concierge@titanshilajit.com',
    address: currentContact.address || 'Shiv Ram Traders, Delhi, India - 110006',
    location: currentContact.location || 'Delhi, India',
    instagram: currentContact.instagram || '@titan_shilajit',
    instagramUrl: currentContact.instagramUrl || 'https://instagram.com/titan_shilajit',
    facebookUrl: currentContact.facebookUrl || 'https://facebook.com/titanshilajit',
    hours: currentContact.hours || 'Monday – Saturday: 9:00 AM – 8:00 PM IST',
    ctaWhatsappLink: currentContact.ctaWhatsappLink || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync state if content changes remotely
  React.useEffect(() => {
    if (content.contact) {
      setForm((prev) => ({
        ...prev,
        ...content.contact,
      }));
    }
  }, [content.contact]);

  const handleChange = (field: keyof ContactConfig, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-sanitize raw numbers
      if (field === 'whatsappNumber') {
        next.phoneRaw = value.replace(/[^0-9]/g, '');
      }
      if (field === 'phone') {
        if (!next.phoneRaw) {
          next.phoneRaw = value.replace(/[^0-9]/g, '');
        }
      }
      return next;
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    // Clean phone numbers
    const cleanPhoneRaw = form.whatsappNumber
      ? form.whatsappNumber.replace(/[^0-9]/g, '')
      : form.phone.replace(/[^0-9]/g, '');

    const payload: ContactConfig = {
      ...form,
      phoneRaw: cleanPhoneRaw || '919958474229',
      whatsappNumber: cleanPhoneRaw || form.whatsappNumber || '919958474229',
    };

    const ok = await updateContact(payload);
    setIsSaving(false);

    if (ok) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
      if (onSuccessToast) {
        onSuccessToast('Contact details, WhatsApp number & social links updated successfully!');
      }
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset contact, WhatsApp, and social details to standard Titan Shilajit defaults?')) {
      setForm(DEFAULT_CONTACT);
      await updateContact(DEFAULT_CONTACT);
      if (onSuccessToast) {
        onSuccessToast('Contact details restored to default.');
      }
    }
  };

  const activeWhatsappRaw = (form.whatsappNumber || form.phoneRaw || '919958474229').replace(/[^0-9]/g, '');
  const testWhatsappLink = `https://wa.me/${activeWhatsappRaw}?text=${encodeURIComponent(
    form.whatsappDefaultMessage || 'Hello Titan Shilajit Team'
  )}`;

  return (
    <div id="admin-contact-management" className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#183D27] via-[#10110F] to-[#183D27] text-[#F7F3E8] p-6 sm:p-8 rounded-xs border border-[#B88A32]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#D4B66A] text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Contact & Social Hub</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F3E8]">
            Contact, WhatsApp & Social Links
          </h3>
          <p className="text-xs sm:text-sm text-[#EEE8D7]/80 leading-relaxed font-light">
            Manage your official customer care mobile number, WhatsApp concierge number, Instagram CTA link, Facebook page URL, and dispatch warehouse address. Changes instantly update across Header, Footer, Checkout, Policies, Floating WhatsApp, and Instagram sections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xs border border-white/20 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {justSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#183D27]" />
                <span>SAVED!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: WhatsApp Concierge & Ordering */}
        <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10110F]/10 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#25D366] flex items-center justify-center shrink-0 border border-[#B88A32]/30 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#10110F]">
                  WhatsApp Support & Direct Order Number
                </h4>
                <p className="text-xs text-[#66704B]">
                  Used for the floating WhatsApp button, "Order on WhatsApp", and customer concierge chats.
                </p>
              </div>
            </div>

            <a
              href={testWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#183D27]/10 hover:bg-[#183D27] text-[#183D27] hover:text-[#F7F3E8] border border-[#183D27]/30 text-xs font-bold transition-all shrink-0"
              title="Test current WhatsApp chat link in new tab"
            >
              <span>Test WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                WhatsApp Phone Number (with Country Code) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="e.g. 919958474229 or +91 99584 74229"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-mono focus:border-[#183D27] focus:ring-1 focus:ring-[#183D27]"
                />
              </div>
              <span className="text-[11px] text-[#66704B] block mt-1 font-mono">
                Digits only for wa.me link: <strong>{activeWhatsappRaw}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                WhatsApp Display Format
              </label>
              <input
                type="text"
                value={form.whatsappDisplay || ''}
                onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
                placeholder="e.g. +91 99584 74229"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-1">
                Human-friendly formatted text shown to users on contact cards.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Default Pre-Filled WhatsApp Message
              </label>
              <textarea
                rows={2}
                value={form.whatsappDefaultMessage || ''}
                onChange={(e) => handleChange('whatsappDefaultMessage', e.target.value)}
                placeholder="Message that automatically populates when a visitor taps WhatsApp..."
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-0.5">
                Greeting sent when customers initiate general inquiries or click the floating WhatsApp button.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1 flex items-center justify-between">
                <span>Custom Direct WhatsApp CTA Link (Optional Override)</span>
                <span className="text-[10px] text-[#B88A32] font-mono">Leave blank for automatic link</span>
              </label>
              <input
                type="url"
                value={form.ctaWhatsappLink || ''}
                onChange={(e) => handleChange('ctaWhatsappLink', e.target.value)}
                placeholder={`Leave empty to auto-generate: https://wa.me/${activeWhatsappRaw}`}
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Social Media & CTA Links (Instagram & Facebook) */}
        <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#10110F]/10">
            <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0 border border-[#B88A32]/30 shadow-xs">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#10110F]">
                Social Media Profiles & CTA Links
              </h4>
              <p className="text-xs text-[#66704B]">
                Configure your official Instagram page, Instagram handle CTA, and Facebook page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Instagram Profile Link */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F]">
                  Instagram Profile / CTA Link *
                </label>
                {form.instagramUrl && (
                  <a
                    href={form.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#183D27] hover:text-[#B88A32] font-bold flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="url"
                  required
                  value={form.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/titan_shilajit"
                  className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-mono"
                />
              </div>
              <span className="text-[11px] text-[#66704B] block">
                Target URL for the Instagram Community section and footer Instagram icon.
              </span>
            </div>

            {/* Instagram Handle Text */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F]">
                Instagram Handle / Display Name
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="e.g. @titan_shilajit"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-mono"
              />
              <span className="text-[11px] text-[#66704B] block">
                The text displayed on the CTA button (e.g. <strong>@titan_shilajit</strong>).
              </span>
            </div>

            {/* Facebook Page Link */}
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] flex items-center gap-2">
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Facebook Page Link</span>
                </label>
                {form.facebookUrl && (
                  <a
                    href={form.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#183D27] hover:text-[#B88A32] font-bold flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={form.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/titanshilajit or https://www.facebook.com/profile.php?id=..."
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-mono"
              />
              <span className="text-[11px] text-[#66704B] block">
                Official Facebook business page URL displayed with the Facebook icon in the footer and social links.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Customer Care Mobile, Address & Email */}
        <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#10110F]/10">
            <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0 border border-[#B88A32]/30 shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#10110F]">
                Mobile Number, Address & Customer Care
              </h4>
              <p className="text-xs text-[#66704B]">
                Primary customer care telephone, official business address, and concierge email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer Care Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Customer Care Mobile Number *
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +91 99584 74229"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-1">
                Full customer care contact phone shown across policies, invoice, and footer.
              </span>
            </div>

            {/* Phone Display Format */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Phone Display Text (Short / Header)
              </label>
              <input
                type="text"
                value={form.phoneDisplay}
                onChange={(e) => handleChange('phoneDisplay', e.target.value)}
                placeholder="e.g. 99584 74229"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-1">
                Compact phone format for header strips and contact pills.
              </span>
            </div>

            {/* Full Street Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Full Business / Dispatch Address *
              </label>
              <textarea
                rows={2}
                required
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Shiv Ram Traders, Delhi, India - 110006"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-0.5">
                Appears in Return / Refund Policies, About page, Shipping details, and PDF invoices.
              </span>
            </div>

            {/* City / Short Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                City / Location Tag
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Delhi, India"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-1">
                Quick location label shown next to the map icon in the footer and header drawer.
              </span>
            </div>

            {/* Concierge Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Customer Care / Concierge Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="concierge@titanshilajit.com"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#66704B] block mt-1">
                Official support email address for order notifications and customer inquiries.
              </span>
            </div>

            {/* Support Working Hours */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Support Business Hours & Availability
              </label>
              <input
                type="text"
                value={form.hours || ''}
                onChange={(e) => handleChange('hours', e.target.value)}
                placeholder="Monday – Saturday: 9:00 AM – 8:00 PM IST"
                className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Live Storefront Impact Matrix */}
        <div className="bg-[#F7F3E8] p-5 sm:p-6 rounded-xs border border-[#B88A32]/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183D27]">
            <ShieldCheck className="w-4 h-4 text-[#B88A32]" />
            <span>Storefront Locations Where These Changes Take Effect</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-[#10110F]">
            <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 shadow-xs">
              <span className="font-bold block text-[#183D27] mb-0.5">1. Footer Social &amp; Address</span>
              <p className="text-[#66704B] text-[11px]">
                Instagram, Facebook & WhatsApp icons; Customer care phone, email, and dispatch address.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 shadow-xs">
              <span className="font-bold block text-[#183D27] mb-0.5">2. Floating WhatsApp Helpdesk</span>
              <p className="text-[#66704B] text-[11px]">
                Direct click-to-chat button targeting your configured WhatsApp number: <strong>{activeWhatsappRaw}</strong>.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 shadow-xs">
              <span className="font-bold block text-[#183D27] mb-0.5">3. Instagram Community Section</span>
              <p className="text-[#66704B] text-[11px]">
                Direct CTA button and all 6 feed photo links redirect to your Instagram URL.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 shadow-xs">
              <span className="font-bold block text-[#183D27] mb-0.5">4. Checkout &amp; Cart Concierge</span>
              <p className="text-[#66704B] text-[11px]">
                Pre-filled cart order message sent directly to your WhatsApp desk.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 shadow-xs">
              <span className="font-bold block text-[#183D27] mb-0.5">5. Return &amp; Refund Policy Desk</span>
              <p className="text-[#66704B] text-[11px]">
                Official customer reporting window shows your mobile care number and WhatsApp desk.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 shadow-xs">
              <span className="font-bold block text-[#183D27] mb-0.5">6. About &amp; Legal Company Info</span>
              <p className="text-[#66704B] text-[11px]">
                Company address, contact numbers, email, and operational timings updated live.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#10110F]/10">
          <span className="text-xs text-[#66704B]">
            All updates sync automatically to Firestore and Hostinger database.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {justSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>SAVED SUCCESSFULLY!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#D4B66A]" />
                <span>{isSaving ? 'SAVING...' : 'SAVE CONTACT & SOCIAL LINKS'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
