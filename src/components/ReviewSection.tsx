import React from 'react';
import { Star, ShieldCheck, MessageCircle } from 'lucide-react';
import { REVIEWS } from '../data/reviews';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const ReviewSection: React.FC = () => {
  return (
    <section id="reviews-section" className="py-20 lg:py-28 bg-[#F7F3E8] text-[#10110F] relative border-b border-[#10110F]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col">
            <span className="text-[#183D27] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
              Verified Practitioner Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] tracking-tight">
              EXPERIENCES IN VITALITY
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-[#B88A32]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#B88A32]" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#10110F]">4.9 / 5.0 Rating</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-sm bg-white border border-[#10110F]/5 flex flex-col justify-between hover:border-[#B88A32]/40 transition-all shadow-xs"
            >
              <div>
                {/* Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#B88A32]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B88A32]" />
                    ))}
                  </div>

                  {review.verifiedPurchase && (
                    <div className="flex items-center gap-1 text-[9px] text-[#183D27] font-semibold tracking-wider uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Order</span>
                    </div>
                  )}
                </div>

                {/* Review Text */}
                <p className="font-serif text-sm italic text-[#10110F] leading-relaxed mb-4 font-light">
                  "{review.review}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-[#10110F]/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs text-[#10110F] tracking-wide">
                    {review.name}
                  </span>
                  <span className="text-[11px] text-[#66704B] font-light">{review.location}</span>
                </div>
                <span className="text-[10px] text-[#183D27] font-bold font-sans">
                  {review.productName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Experience Sharing CTA */}
        <div className="mt-12 p-6 rounded-sm bg-[#183D27]/10 border border-[#183D27]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-base text-[#10110F]">
              Have you tried Titan Shilajit?
            </h4>
            <p className="text-xs text-[#66704B] mt-0.5 font-light">
              Share your daily routine and morning protocol with our Delhi wellness team.
            </p>
          </div>

          <a
            href={getGeneralConciergeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-sm bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors shadow-sm shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>SHARE FEEDBACK</span>
          </a>
        </div>
      </div>
    </section>
  );
};
