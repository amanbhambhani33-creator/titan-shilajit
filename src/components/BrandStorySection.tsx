import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Droplet, Award } from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';

export const BrandStorySection: React.FC = () => {
  const { content } = useStoreContent();
  const story = content.brandStory;

  return (
    <section id="brand-story-section" className="py-20 lg:py-32 bg-[#F7F3E8] text-[#10110F] relative overflow-hidden border-b border-[#10110F]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Split: Himalayan imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/5 rounded-sm overflow-hidden bg-[#10110F] shadow-2xl border border-[#10110F]/10">
              <img
                src={story.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85'}
                alt="Pristine Himalayan Altitude & Shilajit Cliffs"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10110F]/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-sm bg-[#10110F]/90 backdrop-blur-md border border-[#B88A32]/30 text-[#F7F3E8]">
                <span className="text-[9px] tracking-[0.3em] text-[#D4B66A] uppercase font-bold">
                  {story.badgeTitle || 'HIMALAYAN HERITAGE'}
                </span>
                <p className="font-serif text-lg italic text-[#EEE8D7] mt-1 font-light">
                  {story.quote || '"Harvested where the earth touches the sky. Purified through sun and mountain spring water."'}
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-[#183D27] text-[#F7F3E8] p-5 rounded-sm border border-[#B88A32]/40 shadow-xl max-w-xs flex-col gap-1">
              <div className="flex items-center gap-2 text-[#D4B66A]">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Traditional Shodhana</span>
              </div>
              <p className="text-[11px] text-[#EEE8D7]/80 font-light">
                Slow sun-cured purification retaining all 84+ ionic trace minerals.
              </p>
            </div>
          </div>

          {/* Right Split: Editorial copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-[#183D27] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
              {story.kicker || 'The Titan Heritage'}
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#10110F] leading-[1.05] tracking-tight mb-6">
              {story.title || 'POWER, PRESERVED BY NATURE.'}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed font-light mb-8">
              <p className="text-[#10110F]/90 font-normal">
                {story.paragraph1}
              </p>
              <p>
                {story.paragraph2}
              </p>
              {story.paragraph3 && (
                <p>
                  {story.paragraph3}
                </p>
              )}
            </div>

            {/* Bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="flex items-start gap-3 p-4 rounded-sm bg-white border border-[#10110F]/5 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#183D27] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#10110F]">Verified Purity</h4>
                  <p className="text-[11px] text-[#66704B] mt-0.5 font-light">Heavy-metal tested & fulvic acid standardized.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-sm bg-white border border-[#10110F]/5 shadow-xs">
                <Droplet className="w-5 h-5 text-[#183D27] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#10110F]">Zero Additives</h4>
                  <p className="text-[11px] text-[#66704B] mt-0.5 font-light">No artificial sugars, maltodextrin, or binders.</p>
                </div>
              </div>
            </div>

            <Link
              id="brand-story-explore-cta"
              to="/about"
              className="px-8 py-3.5 rounded-sm bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-2.5 transition-colors shadow-md"
            >
              <span>EXPLORE OUR STORY</span>
              <ArrowRight className="w-4 h-4 text-[#D4B66A]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
