import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import { BRAND_CONTACT } from '../data/content';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const PolicyPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPolicyContent = () => {
    switch (location.pathname) {
      case '/shipping-policy':
        return {
          title: 'Shipping & Delivery Policy',
          icon: <Truck className="w-8 h-8 text-[#183D27]" />,
          content: (
            <div className="space-y-4 text-sm text-[#66704B] leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-[#10110F]">1. Express Dispatch from Delhi</h3>
              <p>
                All Titan Shilajit orders placed directly or via our WhatsApp Concierge are processed and dispatched within 24 to 48 business hours from our central Delhi distribution center.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">2. Delivery Timelines</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Delhi NCR:</strong> 1 to 2 business days.</li>
                <li><strong>Metro Cities (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 4 business days.</li>
                <li><strong>Rest of India:</strong> 4 to 6 business days.</li>
              </ul>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">3. Complimentary Shipping</h3>
              <p>
                We provide complimentary express courier delivery across all serviceable pin codes in India for all Titan orders.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">4. Order Tracking</h3>
              <p>
                Once dispatched, tracking links are sent via SMS and WhatsApp. You can query your consignment status anytime on WhatsApp with our team.
              </p>
            </div>
          ),
        };

      case '/refund-policy':
        return {
          title: 'Cancellation & Returns Policy',
          icon: <RotateCcw className="w-8 h-8 text-[#183D27]" />,
          content: (
            <div className="space-y-5 text-sm text-[#66704B] leading-relaxed">
              <div className="p-4 bg-[#183D27]/10 rounded-xs border border-[#183D27]/20 text-[#183D27] font-semibold text-xs leading-relaxed">
                Titan Shilajit Customer Protection: Enjoy a <strong>6-Hour Instant Cancellation Window</strong> from order placement and a strict <strong>24-Hour Return Window</strong> upon package delivery.
              </div>

              <h3 className="font-serif font-bold text-lg text-[#10110F]">1. 6-Hour Instant Order Cancellation</h3>
              <p>
                Customers can cancel any placed order within <strong>6 hours of order placement</strong>. The exact time of placement is permanently recorded and printed on your official Tax Invoice and Order Slip.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#10110F]">
                <li><strong>How to Cancel:</strong> Click the "Cancel Order / Fill Return Form" button directly on your digital Order Slip or submit your Order ID through our online Return Form.</li>
                <li><strong>Refund Timeline:</strong> For prepaid orders (UPI / Card / Netbanking), 100% of the transaction amount is immediately reversed or sent to your provided UPI ID. For Cash on Delivery (COD) orders, cancellation prevents Delhivery dispatch.</li>
                <li><strong>Cutoff Expiry:</strong> After 6 hours, orders are automatically manifested and locked into our Delhi fulfillment conveyor with Delhivery Express.</li>
              </ul>

              <h3 className="font-serif font-bold text-lg text-[#10110F]">2. 24-Hour Post-Delivery Return Policy</h3>
              <p>
                From the exact minute your package is marked <strong>Delivered</strong> by Delhivery Express tracking, a strict <strong>24-hour inspection & return window</strong> is active.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#10110F]">
                <li><strong>Eligible Conditions:</strong> Transit container breakage, broken pharmaceutical jar seal, resin leakage, or incorrect variant delivered.</li>
                <li><strong>Reporting Window:</strong> You must submit the Return Form or notify our WhatsApp Concierge at {BRAND_CONTACT.phoneDisplay} within <strong>24 hours of delivery</strong> along with photo evidence of the packaging.</li>
                <li><strong>Doorstep Reverse-Pickup:</strong> Upon review, our Delhi dispatch team will arrange a complimentary Delhivery doorstep reverse-pickup within 24 to 48 hours.</li>
              </ul>

              <h3 className="font-serif font-bold text-lg text-[#10110F]">3. Botanical Hygiene & Bio-Safety Policy</h3>
              <p>
                Because authentic Himalayan Shilajit is an ingested dietary botanical supplement, opened or partially consumed jars after 24 hours of delivery cannot be accepted for return due to national AYUSH and FSSAI health and safety hygiene regulations.
              </p>

              <h3 className="font-serif font-bold text-lg text-[#10110F]">4. Concierge Assistance</h3>
              <p>
                For immediate assistance regarding order cancellations or returns, contact our Delhi dispatch desk directly on WhatsApp at <strong>{BRAND_CONTACT.phoneDisplay}</strong> (available 7 days a week).
              </p>
            </div>
          ),
        };

      case '/privacy-policy':
        return {
          title: 'Privacy Policy',
          icon: <ShieldCheck className="w-8 h-8 text-[#183D27]" />,
          content: (
            <div className="space-y-4 text-sm text-[#66704B] leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-[#10110F]">1. Information Collection</h3>
              <p>
                Titan Shilajit collects minimal personal contact details (such as Name, Phone Number, Delivery Address, and Wellness Assessment preferences) strictly to fulfill product orders and deliver tailored educational recommendations.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">2. Non-Disclosure & Security</h3>
              <p>
                We do not sell, rent, or trade your personal data to third-party marketing brokers. All WhatsApp communications are encrypted and managed directly by our dedicated Delhi support team.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">3. Communications</h3>
              <p>
                You may opt out of promotional messages or newsletter updates at any time by messaging STOP to our official WhatsApp line.
              </p>
            </div>
          ),
        };

      case '/disclaimer':
      default:
        return {
          title: 'Health & Medical Disclaimer',
          icon: <AlertCircle className="w-8 h-8 text-[#183D27]" />,
          content: (
            <div className="space-y-4 text-sm text-[#66704B] leading-relaxed">
              <div className="p-4 bg-[#183D27]/10 rounded-xs border border-[#183D27]/20 text-[#183D27] font-semibold text-xs">
                Important Notice: Titan Shilajit is a natural dietary botanical supplement, not a pharmaceutical prescription drug.
              </div>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">1. Educational Purpose</h3>
              <p>
                The information provided on this website, in our Himalayan Wellness Assessment, and through our WhatsApp communications is intended solely for educational, dietary, and historical reference. It is not a substitute for professional medical diagnosis, advice, or treatment.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">2. No Therapeutic Claims</h3>
              <p>
                Titan Shilajit products are not intended to diagnose, mitigate, treat, cure, or prevent any disease or chronic pathological condition.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">3. Physician Consultation</h3>
              <p>
                Always seek the advice of your qualified physician or healthcare provider prior to starting any new herbal supplement, particularly if you are pregnant, nursing, have active kidney or cardiovascular conditions, or take prescription pharmaceuticals.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">4. Individual Variance</h3>
              <p>
                Because individual metabolic and lifestyle factors differ, individual experiences and results may vary.
              </p>
            </div>
          ),
        };
    }
  };

  const { title, icon, content } = getPolicyContent();

  return (
    <div id="policy-page" className="min-h-screen pt-28 pb-24 bg-[#F7F3E8] text-[#10110F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#183D27] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-sm border border-[#10110F]/10 p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#10110F]/10">
            <div className="p-3 bg-[#F7F3E8] rounded-xs border border-[#10110F]/10">
              {icon}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#183D27]">
                TITAN LEGAL & CONSUMER POLICIES
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F]">
                {title}
              </h1>
            </div>
          </div>

          {content}

          <div className="mt-12 pt-6 border-t border-[#10110F]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#66704B]">
            <span>
              {location.pathname === '/refund-policy'
                ? 'Need to request a return or damage replacement?'
                : 'Have questions about our terms or policies?'}
            </span>
            {location.pathname === '/refund-policy' ? (
              <a
                href={getGeneralConciergeWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#183D27] font-bold hover:underline flex items-center gap-1.5"
              >
                <span>Initiate Return with Delhi Concierge on WhatsApp ({BRAND_CONTACT.phoneDisplay})</span>
              </a>
            ) : (
              <Link
                to="/faq"
                className="text-[#183D27] font-bold hover:underline"
              >
                Visit Help & FAQ Desk
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
