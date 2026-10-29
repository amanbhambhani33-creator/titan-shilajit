import React from 'react';
import { useStoreContent } from '../context/StoreContentContext';

interface TrustStripProps {
  className?: string;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ className = '' }) => {
  const { content } = useStoreContent();
  const baseItems = content.trustStrip && content.trustStrip.length > 0 ? content.trustStrip : [
    { title: '16,000+ FT HIGH HARVEST', subtitle: 'Pristine Himalayan Altitude' },
    { title: 'TRIPHALA PURIFICATION', subtitle: 'Traditional Ayurvedic Method' },
    { title: '70%+ FULVIC ACID', subtitle: 'Lab Certified Active Density' },
    { title: 'NABL CERTIFIED ZERO HEAVY METALS', subtitle: 'Zero Lead, Arsenic or Mercury' },
    { title: '100% PURE HIMALAYAN GOLD RESIN', subtitle: 'Original Grade Exudate' },
    { title: 'SLOW SUN-CURED 40 DAYS', subtitle: 'Preserved Bio-Active Trace Elements' },
  ];

  // Ensure Triphala Purification & 70%+ Fulvic Acid are strictly reflected
  const items = baseItems.map((item) => {
    let title = item.title;
    if (title.includes('SURYA TAPI')) title = 'TRIPHALA PURIFICATION';
    if (title.includes('75%') || title.includes('> 70%')) title = '70%+ FULVIC ACID';
    return { ...item, title };
  });

  const renderTrustList = (prefix: string) => (
    <div className="flex items-center shrink-0 px-2">
      {items.map((item, idx) => (
        <React.Fragment key={`${prefix}-${idx}`}>
          <div className="inline-flex items-center shrink-0">
            <span className="text-[10px] sm:text-xs text-[#EEE8D7] font-bold tracking-widest uppercase whitespace-nowrap">
              {item.title}
            </span>
          </div>

          {/* Symmetrically Centered Middle Dot Separator */}
          <div className="inline-flex items-center justify-center px-6 sm:px-10 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B88A32] shrink-0 opacity-80" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      id="trust-strip-announcement-bar"
      className={`h-12 sm:h-14 w-full bg-[#183D27] flex items-center border-y border-[#B88A32]/25 relative z-20 overflow-hidden select-none ${className}`}
      title="Titan Himalayan Purity & Quality Guarantees"
    >
      <div className="animate-marquee-left flex items-center whitespace-nowrap w-full">
        {renderTrustList('t-set-1')}
        {renderTrustList('t-set-2')}
      </div>
    </section>
  );
};
