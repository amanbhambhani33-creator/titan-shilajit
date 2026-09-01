import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { INSTAGRAM_POSTS, BRAND_CONTACT } from '../data/content';

export const InstagramSection: React.FC = () => {
  return (
    <section id="instagram-section" className="py-20 bg-[#F7F3E8] text-[#10110F] border-b border-[#10110F]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[#183D27] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
              Community & Visual Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] tracking-tight">
              FOLLOW THE TITAN JOURNEY
            </h2>
          </div>

          <a
            href={BRAND_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#10110F] hover:text-[#183D27] border-b border-[#10110F] pb-1 transition-colors"
          >
            <span>{BRAND_CONTACT.instagram}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Visual Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={BRAND_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-sm bg-[#10110F] border border-[#10110F]/5 shadow-xs"
            >
              <img
                src={post.image}
                alt="Titan Shilajit Instagram creative"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-[#F7F3E8]">
                <div className="flex items-center gap-1.5 text-[10px] text-[#D4B66A] font-bold">
                  <Instagram className="w-3 h-3" />
                  <span>{post.likes}</span>
                </div>
                <p className="text-[10px] text-[#EEE8D7] line-clamp-2 mt-1 font-sans font-light">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
