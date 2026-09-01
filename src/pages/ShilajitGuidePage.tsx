import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Droplet,
  Coffee,
  ShieldAlert,
  ArrowRight,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { FAQS } from '../data/content';

export const ShilajitGuidePage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div id="shilajit-guide-page" className="min-h-screen pt-28 pb-24 bg-[#F7F3E8] text-[#10110F]">
      {/* Hero */}
      <section className="relative py-16 bg-[#10110F] text-[#F7F3E8] overflow-hidden mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D27] text-[#D4B66A] text-xs font-bold tracking-[0.2em] uppercase border border-[#B88A32]/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>EDUCATIONAL APOTHECARY MANUAL</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F7F3E8]">
            THE COMPLETE SHILAJIT GUIDE
          </h1>

          <p className="text-sm sm:text-lg text-[#EEE8D7]/80 max-w-2xl font-sans font-light leading-relaxed">
            Understanding the ancient science, biochemical properties, and optimal daily routines of pure Himalayan Shilajit.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: What is Shilajit? */}
        <section className="mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#183D27]">
            CHAPTER 01
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] mt-1 mb-6">
            WHAT IS SHILAJIT?
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#66704B] font-sans leading-relaxed">
            <p className="text-[#10110F] font-medium">
              Shilajit is a natural mineral resin formed over centuries from the slow biological decomposition of mountain flora compressed under extreme tectonic pressure in high Himalayan rock formations.
            </p>
            <p>
              During warm summer months, as temperatures rise across high-altitude cliff faces above 16,000 feet, this dark, nutrient-dense resin naturally exudes from fissures in the rock. Known as <em>Shilajatu</em> in classical Ayurvedic literature, it has been revered for over 3,000 years as a premier <em>Rasayana</em> (rejuvenating compound).
            </p>
            <p>
              Unlike isolated synthetic vitamins, pure Shilajit delivers a complete synergistic matrix of over 84 ionic trace minerals, humic compounds, dibenzo-alpha-pyrones, and a rich concentration of fulvic acid.
            </p>
          </div>
        </section>

        {/* Section 2: How Fulvic Acid Works */}
        <section className="mb-20 p-8 rounded-xs bg-[#EEE8D7]/80 border border-[#10110F]/10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#183D27]">
            CHAPTER 02
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F] mt-1 mb-4">
            THE SCIENCE OF FULVIC ACID & MINERAL TRANSPORT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs sm:text-sm text-[#66704B] leading-relaxed">
              <p>
                Fulvic acid is one of the smallest bioactive organic molecules in nature. Because of its microscopic molecular size and low weight, it easily passes through cell membranes.
              </p>
              <p>
                When you consume Shilajit, fulvic acid binds with essential trace minerals (magnesium, zinc, iron, selenium) and escorts them directly into your mitochondria—the cellular power plants responsible for ATP energy production.
              </p>
              <div className="p-3 rounded-xs bg-white border border-[#10110F]/10 text-[#10110F] text-xs font-semibold">
                Titan Shilajit guarantees &gt; 75% purified Fulvic Acid density in every batch.
              </div>
            </div>

            <div className="bg-[#10110F] text-[#F7F3E8] p-6 rounded-xs border border-[#B88A32]/30 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#D4B66A]" />
                <h4 className="font-serif font-bold text-base text-[#F7F3E8]">Cellular Nutrient Matrix</h4>
              </div>
              <ul className="space-y-2 text-xs text-[#EEE8D7]/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4B66A]" />
                  <span>84+ Ionic Trace Minerals for Electrolyte Balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4B66A]" />
                  <span>Dibenzo-alpha-pyrones supporting mitochondrial output</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4B66A]" />
                  <span>Natural Humic compounds for gut barrier integrity</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Daily Ritual Protocols */}
        <section className="mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#183D27]">
            CHAPTER 03
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] mt-1 mb-6">
            HOW TO TAKE TITAN SHILAJIT: STEP-BY-STEP
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pure Resin Protocol */}
            <div className="p-6 rounded-xs bg-white border border-[#10110F]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#10110F]/10 mb-4">
                  <h3 className="font-serif font-bold text-xl text-[#10110F]">Pure Resin Protocol</h3>
                  <span className="text-xs font-bold text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
                    FLAGSHIP RITUAL
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#66704B]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-[#10110F]">Measure Dosage:</strong> Use the included measuring spoon to take a pea-sized amount (300mg to 500mg).
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-[#10110F]">Mix in Warm Liquid:</strong> Stir into 200ml of lukewarm water, green tea, or warm milk until fully dissolved (approx 60 seconds).
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-[#10110F]">Morning Timing:</strong> Consume on an empty stomach 20-30 minutes before breakfast for highest cellular absorption.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#10110F]/10">
                <Link
                  to="/product/titan-shilajit-resin"
                  className="text-xs font-bold uppercase tracking-widest text-[#183D27] hover:underline flex items-center gap-1"
                >
                  <span>View Pure Resin 20g</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Honey Sticks Protocol */}
            <div className="p-6 rounded-xs bg-white border border-[#10110F]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#10110F]/10 mb-4">
                  <h3 className="font-serif font-bold text-xl text-[#10110F]">Honey Sticks Protocol</h3>
                  <span className="text-xs font-bold text-[#B88A32] bg-[#B88A32]/10 px-2 py-0.5 rounded-xs">
                    ON-THE-GO
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#66704B]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#B88A32] text-[#10110F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-[#10110F]">Direct Consumption:</strong> Tear open 1 stick and consume directly from pouch for an instant natural energy surge.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#B88A32] text-[#10110F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-[#10110F]">Pre-Workout Booster:</strong> Take 30 minutes before high-intensity gym sessions or outdoor endurance runs.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#B88A32] text-[#10110F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-[#10110F]">Beverage Sweetener:</strong> Squeeze into herbal tea, lemon water, or morning oatmeal for delicious earthy sweetness.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#10110F]/10">
                <Link
                  to="/product/titan-honey-sticks-classic"
                  className="text-xs font-bold uppercase tracking-widest text-[#183D27] hover:underline flex items-center gap-1"
                >
                  <span>View Classic Honey Sticks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: FAQs Accordion */}
        <section id="faqs" className="mb-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#183D27]">
            CHAPTER 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] mt-1 mb-8">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="divide-y divide-[#10110F]/10 bg-white rounded-xs border border-[#10110F]/10 overflow-hidden">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#EEE8D7]/40 transition-colors focus:outline-none"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-[#10110F]">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#183D27] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#66704B] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-[#66704B] font-sans leading-relaxed border-t border-dashed border-[#10110F]/10 bg-[#F7F3E8]/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Safety Advisory Notice */}
        <div className="p-6 rounded-xs bg-[#183D27]/10 border border-[#183D27]/20 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-[#183D27] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#10110F]/80">
            <h4 className="font-bold text-[#183D27] uppercase tracking-wider">
              Safety & Contraindication Advisory
            </h4>
            <p>
              Titan Shilajit is intended for healthy adults seeking natural daily vitality support. It is not recommended for pregnant or breastfeeding mothers, individuals under 18 years of age, or those with active kidney or uric acid conditions without prior medical consultation. Always consult your qualified healthcare professional before beginning any new wellness supplement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
