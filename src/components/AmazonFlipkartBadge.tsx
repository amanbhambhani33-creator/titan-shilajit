import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface AmazonFlipkartBadgeProps {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export const AmazonFlipkartBadge: React.FC<AmazonFlipkartBadgeProps> = ({
  variant = 'compact',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-white/95 border border-[#10110F]/15 shadow-xs ${className}`}
        title="100% Genuine Titan Shilajit is also available on Amazon and Flipkart"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#183D27] shrink-0">
          Also On:
        </span>
        <div className="flex items-center gap-2.5">
          {/* Amazon Logo */}
          <div className="flex items-center gap-1 text-[#10110F]" title="Amazon India">
            <svg
              className="h-3.5 w-auto"
              viewBox="0 0 100 30"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text x="0" y="20" fontFamily="sans-serif" fontSize="20" fontWeight="900" letterSpacing="-1">
                amazon
              </text>
              <path
                d="M10 25 Q35 30 65 24"
                stroke="#FF9900"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M63 21 L67 24 L63 27 Z" fill="#FF9900" />
            </svg>
          </div>

          <span className="text-gray-300 text-xs">•</span>

          {/* Flipkart Logo */}
          <div className="flex items-center gap-1" title="Flipkart India">
            <svg
              className="h-3.5 w-auto"
              viewBox="0 0 105 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="22" height="26" rx="3" fill="#2874F0" />
              <path
                d="M14 6H7V20H10V14H13V11H10V9H14V6Z"
                fill="#FFE11B"
              />
              <text x="26" y="19" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#2874F0">
                Flipkart
              </text>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Full banner display
  return (
    <div
      className={`p-4 sm:p-5 rounded-sm bg-linear-to-r from-[#183D27]/10 via-[#F7F3E8] to-[#D4B66A]/10 border border-[#B88A32]/30 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
              OFFICIAL CHANNELS
            </span>
            <span className="text-xs font-semibold text-[#10110F]">100% Genuine Guaranteed</span>
          </div>
          <h4 className="font-serif font-bold text-sm sm:text-base text-[#10110F] mt-0.5">
            We are on Amazon and Flipkart as well
          </h4>
          <p className="text-[11px] text-[#66704B]">
            Shop directly on our official store for exclusive extra ₹50 prepaid discount or find us on India's top marketplaces.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Amazon Badge */}
        <div className="px-3.5 py-2 rounded-xs bg-white border border-[#10110F]/15 shadow-xs flex items-center gap-1.5 hover:border-[#FF9900] transition-colors">
          <svg
            className="h-4 w-auto"
            viewBox="0 0 100 30"
            fill="#10110F"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text x="0" y="20" fontFamily="sans-serif" fontSize="20" fontWeight="900" letterSpacing="-1">
              amazon
            </text>
            <path
              d="M10 25 Q35 30 65 24"
              stroke="#FF9900"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M63 21 L67 24 L63 27 Z" fill="#FF9900" />
          </svg>
          <span className="text-[10px] font-bold text-[#10110F]/70 uppercase ml-1">in</span>
        </div>

        {/* Flipkart Badge */}
        <div className="px-3.5 py-2 rounded-xs bg-white border border-[#10110F]/15 shadow-xs flex items-center gap-2 hover:border-[#2874F0] transition-colors">
          <svg
            className="h-4 w-auto"
            viewBox="0 0 105 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="22" height="26" rx="3" fill="#2874F0" />
            <path
              d="M14 6H7V20H10V14H13V11H10V9H14V6Z"
              fill="#FFE11B"
            />
            <text x="26" y="19" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#2874F0">
              Flipkart
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
