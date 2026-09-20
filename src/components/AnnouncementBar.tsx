import React from 'react';
import { Tag, ShieldCheck } from 'lucide-react';

interface AnnouncementBarProps {
  className?: string;
  variant?: 'header' | 'checkout' | 'embedded';
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  className = '',
  variant = 'header',
}) => {
  const marqueeItems = [
    { text: 'EXTRA Rs.50 OFF ON PREPAID ORDERS', highlight: true },
    { text: 'EXTRA Rs.50 OFF ON FIRST ORDER', highlight: true, code: 'FIRST50' },
    { text: '100% PURE HIMALAYAN GOLD GRADE SHILAJIT', highlight: false },
    { text: 'LAB TESTED FOR HEAVY METALS', highlight: false },
    { text: 'EXTRA Rs.50 OFF ON PREPAID ORDERS', highlight: true },
    { text: 'EXTRA Rs.50 OFF ON FIRST ORDER', highlight: true, code: 'FIRST50' },
    { text: 'FREE EXPRESS PAN-INDIA DELIVERY', highlight: false },
    { text: 'DIRECT WHATSAPP CONCIERGE DISPATCH', highlight: false },
  ];

  if (variant === 'checkout') {
    return (
      <div
        id="checkout-announcement-pill"
        className={`bg-[#183D27] text-[#F7F3E8] p-3 rounded-sm border border-[#B88A32]/40 shadow-xs flex flex-col gap-1.5 ${className}`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#D4B66A] uppercase">
          <Tag className="w-3.5 h-3.5 text-[#D4B66A]" />
          <span>Active Instant Savings Applied</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#F7F3E8]">
          <span className="bg-[#B88A32]/30 text-[#F7F3E8] px-2 py-0.5 rounded-xs border border-[#B88A32]/50 font-bold">
            EXTRA Rs.50 OFF ON PREPAID ORDERS
          </span>
          <span className="text-[#D4B66A] font-bold">•</span>
          <span className="bg-[#183D27] text-[#D4B66A] px-2 py-0.5 rounded-xs border border-[#D4B66A]/40 font-bold">
            EXTRA Rs.50 OFF ON FIRST ORDER (USE: FIRST50)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="global-moving-announcement-bar"
      className={`w-full overflow-hidden bg-[#183D27] text-[#F7F3E8] border-b border-[#B88A32]/40 py-2 relative z-40 select-none ${className}`}
      title="Special Prepaid & First Order Discount Offers"
    >
      <div className="animate-marquee-left flex items-center whitespace-nowrap">
        {/* First set of items */}
        <div className="flex items-center gap-8 sm:gap-12 shrink-0 px-4">
          {marqueeItems.map((item, idx) => (
            <div key={`m1-${idx}`} className="inline-flex items-center gap-3">
              {item.highlight ? (
                <div className="inline-flex items-center gap-1.5 bg-[#10110F]/60 px-3 py-0.5 rounded-xs border border-[#B88A32]/60 shadow-xs">
                  <span className="font-bold text-[10px] sm:text-xs tracking-wider text-[#F7F3E8] uppercase">
                    {item.text}
                  </span>
                  {item.code && (
                    <span className="bg-[#B88A32] text-[#10110F] text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-xs ml-1 tracking-widest">
                      {item.code}
                    </span>
                  )}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-[#EEE8D7] text-[10px] sm:text-xs tracking-widest uppercase opacity-85 font-medium">
                  <span>{item.text}</span>
                </div>
              )}
              <span className="text-[#D4B66A] opacity-60 text-xs font-bold">•</span>
            </div>
          ))}
        </div>

        {/* Duplicate set for endless smooth looping */}
        <div className="flex items-center gap-8 sm:gap-12 shrink-0 px-4" aria-hidden="true">
          {marqueeItems.map((item, idx) => (
            <div key={`m2-${idx}`} className="inline-flex items-center gap-3">
              {item.highlight ? (
                <div className="inline-flex items-center gap-1.5 bg-[#10110F]/60 px-3 py-0.5 rounded-xs border border-[#B88A32]/60 shadow-xs">
                  <span className="font-bold text-[10px] sm:text-xs tracking-wider text-[#F7F3E8] uppercase">
                    {item.text}
                  </span>
                  {item.code && (
                    <span className="bg-[#B88A32] text-[#10110F] text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-xs ml-1 tracking-widest">
                      {item.code}
                    </span>
                  )}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-[#EEE8D7] text-[10px] sm:text-xs tracking-widest uppercase opacity-85 font-medium">
                  <span>{item.text}</span>
                </div>
              )}
              <span className="text-[#D4B66A] opacity-60 text-xs font-bold">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
