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
          title: 'Returns & Refund Policy',
          icon: <RotateCcw className="w-8 h-8 text-[#183D27]" />,
          content: (
            <div className="space-y-4 text-sm text-[#66704B] leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-[#10110F]">1. Purity Guarantee & Damage Replacement</h3>
              <p>
                Because Shilajit is an ingested botanical wellness product, we do not accept returns on opened jars or unsealed honey sticks due to strict health and safety hygiene regulations.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">2. Transit Damage or Defects</h3>
              <p>
                If your package arrives damaged, broken, or unsealed, please photograph the package and message our WhatsApp concierge at {BRAND_CONTACT.phoneDisplay} within 48 hours of delivery. We will immediately dispatch a replacement batch at zero cost.
              </p>
              <h3 className="font-serif font-bold text-lg text-[#10110F]">3. Cancellations</h3>
              <p>
                Orders can be cancelled prior to dispatch by messaging our WhatsApp concierge. Once handed over to the courier, cancellation is not possible.
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
                The information provided on this website, in our AI Wellness Assessment, and through our WhatsApp communications is intended solely for educational, dietary, and historical reference. It is not a substitute for professional medical diagnosis, advice, or treatment.
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
            <span>Have questions about our terms or policies?</span>
            <a
              href={getGeneralConciergeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#183D27] font-bold hover:underline"
            >
              Contact Delhi Concierge on WhatsApp ({BRAND_CONTACT.phoneDisplay})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
