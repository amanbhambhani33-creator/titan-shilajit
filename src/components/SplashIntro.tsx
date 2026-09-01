import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, ShieldCheck, Play } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';

export const SplashIntro: React.FC = () => {
  const { showSplash, closeSplash } = useStoreContent();
  const [hasDropped, setHasDropped] = useState(false);
  const [showRipples, setShowRipples] = useState(false);

  useEffect(() => {
    if (showSplash) {
      // Step 1: Trigger bottle drop
      const timer1 = setTimeout(() => {
        setHasDropped(true);
      }, 150);

      // Step 2: Trigger impact shockwave / ripple
      const timer2 = setTimeout(() => {
        setShowRipples(true);
      }, 850);

      // Step 3: Auto transition after 3.6s
      const timer3 = setTimeout(() => {
        closeSplash();
      }, 3800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setHasDropped(false);
      setShowRipples(false);
    }
  }, [showSplash]);

  if (!showSplash) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="titan-splash-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0B2114] text-[#F7F3E8] overflow-hidden select-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, #183D27 0%, #0c2014 55%, #06110a 100%)',
        }}
      >
        {/* Subtle Ambient Background Grain & Mist */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#D4B66A_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Mountain Silhouettes in Backdrop */}
        <div className="absolute bottom-0 inset-x-0 h-72 opacity-20 pointer-events-none flex items-end justify-center">
          <svg viewBox="0 0 1200 300" className="w-full h-full text-[#10110F] fill-current preserve-3d">
            <path d="M0,300 L200,120 L350,220 L550,60 L750,240 L950,110 L1200,300 Z" opacity="0.6" />
            <path d="M100,300 L400,140 L650,260 L850,90 L1100,280 L1200,300 Z" opacity="0.9" />
          </svg>
        </div>

        {/* Top Bar: Brand Kicker & Skip Button */}
        <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 pt-8 flex items-center justify-between z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-xs bg-[#B88A32] text-[#10110F] flex items-center justify-center font-serif font-bold text-xs">
              T
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#D4B66A]/90 font-semibold">
              HIMALAYAN APOTHECARY • 16,000+ FT
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={closeSplash}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#B88A32] hover:text-[#10110F] text-[#F7F3E8] text-[11px] font-bold tracking-widest uppercase border border-white/15 transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </header>

        {/* Centerpiece: Cinematic Title & The Dropping Shilajit Glass Bottle */}
        <main className="relative flex-1 flex flex-col items-center justify-center w-full px-4 text-center z-10">
          {/* Main Typography Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <span className="text-[#D4B66A] text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase block mb-2">
              ESTD. HIMALAYAS
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#F7F3E8] leading-none drop-shadow-2xl">
              TITAN SHILAJIT
            </h1>
            <p className="text-xs sm:text-sm text-[#EEE8D7]/80 tracking-[0.25em] uppercase font-sans mt-3 font-light">
              Pure Power of the Himalayas
            </p>
          </motion.div>

          {/* Bottle Stage with Drop Animation & Shockwave Ripple */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
            {/* Impact Shockwaves / Pedestal Ripple Glow */}
            {showRipples && (
              <>
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="absolute bottom-10 w-32 h-12 rounded-full border-2 border-[#D4B66A] pointer-events-none"
                  style={{ boxShadow: '0 0 35px #B88A32' }}
                />
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.7 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
                  className="absolute bottom-10 w-32 h-12 rounded-full border border-[#B88A32] pointer-events-none"
                />
              </>
            )}

            {/* Glowing Golden Pedestal Base */}
            <div className="absolute bottom-10 w-36 h-6 rounded-full bg-gradient-to-r from-transparent via-[#D4B66A]/40 to-transparent blur-md" />
            <div className="absolute bottom-10 w-28 h-2 rounded-full bg-[#B88A32]/60 blur-xs" />

            {/* The Shilajit Amber Glass Jar / Bottle Dropping From Above */}
            <motion.div
              initial={{ y: -650, rotate: -8, scale: 0.7, opacity: 0 }}
              animate={
                hasDropped
                  ? {
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    }
                  : { y: -650, rotate: -8, scale: 0.7, opacity: 0 }
              }
              transition={{
                type: 'spring',
                damping: 14,
                stiffness: 110,
                mass: 1.2,
                duration: 0.9,
              }}
              className="relative z-20 flex flex-col items-center filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
            >
              {/* Luxury Amber Glass Shilajit Jar Graphic */}
              <div className="relative w-36 sm:w-40 h-44 sm:h-48 bg-gradient-to-b from-[#2d1b0d] via-[#1a0f07] to-[#0d0703] rounded-2xl border-2 border-[#B88A32]/60 overflow-hidden shadow-2xl flex flex-col items-center justify-between p-2">
                {/* Gold Metallic Airtight Lid */}
                <div className="w-full h-8 bg-gradient-to-r from-[#9A7426] via-[#F4DE9C] to-[#8C641D] rounded-t-xl border-b border-[#3b2713] flex items-center justify-center shadow-inner">
                  <div className="w-4/5 h-1 border-t border-b border-black/20" />
                </div>

                {/* Glass Bottle Body with Resin Depth & Luxury Label */}
                <div className="w-full flex-1 flex flex-col items-center justify-center relative px-2">
                  {/* Glass Reflection Highlight */}
                  <div className="absolute top-0 left-2 w-2 h-full bg-gradient-to-r from-white/25 to-transparent rounded-full opacity-60 pointer-events-none" />
                  
                  {/* Label on the Bottle */}
                  <div className="w-full bg-[#10110F] border border-[#B88A32]/50 rounded-sm py-2 px-1 text-center shadow-md">
                    <div className="text-[8px] font-mono tracking-[0.25em] text-[#D4B66A] uppercase font-bold">
                      TITAN
                    </div>
                    <div className="font-serif text-[13px] font-bold text-[#F7F3E8] tracking-tight leading-tight">
                      PURE RESIN
                    </div>
                    <div className="text-[7px] text-[#EEE8D7]/70 uppercase tracking-widest mt-0.5">
                      GRADE-A • 16,000 FT
                    </div>
                  </div>

                  {/* Dark Viscous Pure Himalayan Resin Glimmer */}
                  <div className="mt-2 w-8 h-2 rounded-full bg-[#B88A32]/30 blur-xs" />
                </div>

                {/* Bottom Base */}
                <div className="w-full h-3 bg-gradient-to-r from-[#140b04] via-[#3a200e] to-[#140b04] rounded-b-xl border-t border-black/40" />
              </div>
            </motion.div>
          </div>

          {/* Subtext and Instant Entry CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-col items-center gap-4 mt-2"
          >
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#D4B66A] font-medium tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#D4B66A]" />
              <span>100% Raw Himalayan Shilajit Resin • Lab Tested Heavy Metal Free</span>
            </div>

            <button
              id="splash-enter-store-btn"
              onClick={closeSplash}
              className="px-9 py-3.5 rounded-sm bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
            >
              <span>ENTER TITAN STORE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </main>

        {/* Footer: Slogan & Status */}
        <footer className="w-full max-w-7xl mx-auto px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EEE8D7]/60 tracking-wider font-light z-20 gap-2">
          <span>Delhi, India • High Altitude Ayurvedic Shodhana</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span className="text-[#D4B66A] font-semibold">Live Store Ready</span>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
