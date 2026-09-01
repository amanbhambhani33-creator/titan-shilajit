import React from 'react';
import { useStoreContent } from '../context/StoreContentContext';

export const TrustStrip: React.FC = () => {
  const { content } = useStoreContent();
  const strip = content.trustStrip;

  return (
    <section
      id="trust-strip-section"
      className="h-16 w-full bg-[#183D27] flex items-center justify-around px-4 sm:px-6 lg:px-10 border-y border-[#B88A32]/20 relative z-20 overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto min-w-[640px] px-2 sm:px-4">
        {strip.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B88A32] shrink-0" />
            <span className="text-[10px] sm:text-xs text-[#EEE8D7] font-bold tracking-widest uppercase whitespace-nowrap">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
