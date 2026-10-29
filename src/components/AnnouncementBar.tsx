import React from 'react';
import { Tag } from 'lucide-react';

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
    { text: 'SAME DAY DELHIVERY EXPRESS DISPATCH', highlight: false },
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
          <span className="inline-flex items-center justify-center px-1 text-[#D4B66A] font-bold">•</span>
          <span className="bg-[#183D27] text-[#D4B66A] px-2 py-0.5 rounded-xs border border-[#D4B66A]/40 font-bold">
            EXTRA Rs.50 OFF ON FIRST ORDER (USE: FIRST50)
          </span>
        </div>
      </div>
    );
  }

  const renderMarqueeList = (prefix: string) => (
    <div className="flex items-center shrink-0 px-2">
      {marqueeItems.map((item, idx) => (
        <React.Fragment key={`${prefix}-${idx}`}>
          <div className="inline-flex items-center shrink-0">
            {item.highlight ? (
              <div className="inline-flex items-center gap-1.5 bg-[#10110F]/70 px-3 py-1 rounded-xs border border-[#B88A32]/70 shadow-xs">
                <span className="font-bold text-[10px] sm:text-xs tracking-wider text-[#F7F3E8] uppercase">
                  {item.text}
                </span>
                {item.code && (
                  <span className="bg-[#B88A32] text-[#10110F] text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-xs ml-1 tracking-widest">
                    {item.code}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center text-[#EEE8D7] text-[10px] sm:text-xs tracking-widest uppercase opacity-90 font-medium">
                <span>{item.text}</span>
              </div>
            )}
          </div>

          {/* Symmetrically Centered Middle Dot Separator */}
          <div className="inline-flex items-center justify-center px-5 sm:px-8 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4B66A] shrink-0 opacity-80" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      id="global-moving-announcement-bar"
      className={`w-full overflow-hidden bg-[#183D27] text-[#F7F3E8] border-b border-[#B88A32]/40 py-2 relative z-40 select-none ${className}`}
      title="Special Prepaid & First Order Discount Offers"
    >
      <div className="animate-marquee-left flex items-center whitespace-nowrap">
        {renderMarqueeList('set-1')}
        {renderMarqueeList('set-2')}
      </div>
    </div>
  );
};
