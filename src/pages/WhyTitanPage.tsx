import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  Sun,
  ShieldCheck,
  Award,
  Droplet,
  Check,
  X,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { SOURCING_STEPS } from '../data/content';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

export const WhyTitanPage: React.FC = () => {
  return (
    <div id="why-titan-page" className="min-h-screen pt-28 pb-24 bg-[#F7F3E8] text-[#10110F]">
      {/* Hero Banner */}
      <section className="relative py-16 lg:py-24 bg-[#10110F] text-[#F7F3E8] overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1800&q=80"
            alt="Himalayan Mountain Peaks"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10110F] via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D27] text-[#D4B66A] text-xs font-bold tracking-[0.2em] uppercase border border-[#B88A32]/30">
            <Award className="w-3.5 h-3.5" />
            <span>THE GOLD STANDARD OF SHILAJIT</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F7F3E8]">
            WHY TITAN SHILAJIT
          </h1>

          <p className="text-base sm:text-xl text-[#EEE8D7]/80 max-w-2xl font-sans font-light leading-relaxed">
            The difference between ordinary black resin and authentic Himalayan medicine lies in altitude, water purification, and lab-tested fulvic acid density.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xs bg-[#183D27] text-[#D4B66A] flex items-center justify-center mb-4">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#10110F] mb-2">16,000+ FT Altitude</h3>
              <p className="text-xs text-[#66704B] leading-relaxed">
                Crude Shilajit harvested at extreme Himalayan elevations avoids lower-valley organic contaminants and agricultural runoff.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#10110F]/10 text-[11px] font-bold text-[#183D27]">
              Pristine Rock Exudate
            </div>
          </div>

          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xs bg-[#183D27] text-[#D4B66A] flex items-center justify-center mb-4">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#10110F] mb-2">Ayurvedic Shodhana</h3>
              <p className="text-xs text-[#66704B] leading-relaxed">
                Purified exclusively with natural mountain spring water and slow sun-curing (Surya Tapi), preserving sensitive enzymatic bioactives.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#10110F]/10 text-[11px] font-bold text-[#183D27]">
              Zero Chemical Solvents
            </div>
          </div>

          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xs bg-[#183D27] text-[#D4B66A] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#10110F] mb-2">NABL Certified</h3>
              <p className="text-xs text-[#66704B] leading-relaxed">
                Every single batch is independently tested for heavy metals (Lead, Arsenic, Mercury, Cadmium) and microbial safety in India.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#10110F]/10 text-[11px] font-bold text-[#183D27]">
              Heavy-Metal Verified
            </div>
          </div>

          <div className="p-6 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xs bg-[#183D27] text-[#D4B66A] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#10110F] mb-2">&gt; 75% Fulvic Acid</h3>
              <p className="text-xs text-[#66704B] leading-relaxed">
                Rich in microscopic carrier molecules that transport 84+ ionic trace minerals directly across cell membranes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#10110F]/10 text-[11px] font-bold text-[#183D27]">
              High Bio-Availability
            </div>
          </div>
        </div>

        {/* 4-Step Journey */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#183D27]">
              FROM CLIFF FACE TO APOTHECARY JAR
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] mt-1">
              THE PURIFICATION RITUAL
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOURCING_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-xs bg-white border border-[#10110F]/10 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <span className="font-display font-bold text-2xl text-[#B88A32]">{step.step}</span>
                  <h4 className="font-serif font-bold text-lg text-[#10110F] mt-2 mb-2">{step.title}</h4>
                  <p className="text-xs text-[#66704B] leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#10110F]/10 text-[10px] uppercase font-bold tracking-widest text-[#183D27]">
                  {step.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table: Titan vs Mass Market */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#183D27]">
              HONEST EVALUATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] mt-1">
              HOW TITAN COMPARES
            </h2>
            <p className="text-xs text-[#66704B] mt-2">
              Mass market Shilajit is often diluted with maltodextrin powder, high-heat processed, or collected from contaminated low altitudes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xs border border-[#10110F]/10 text-left border-collapse">
              <thead>
                <tr className="bg-[#10110F] text-[#F7F3E8] text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 sm:p-5">Quality Dimension</th>
                  <th className="p-4 sm:p-5 bg-[#183D27] text-[#D4B66A]">TITAN SHILAJIT</th>
                  <th className="p-4 sm:p-5">Mass Market Shilajit Resin</th>
                  <th className="p-4 sm:p-5">Shilajit Capsules / Pills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#10110F]/10 text-xs sm:text-sm text-[#10110F]">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Harvest Altitude</td>
                  <td className="p-4 sm:p-5 bg-[#183D27]/5 font-bold text-[#183D27] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> 16,000+ ft High Himalayas
                  </td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Under 8,000 ft (Low Foothills)</td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Undisclosed / Imported Extract</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Purification Method</td>
                  <td className="p-4 sm:p-5 bg-[#183D27]/5 font-bold text-[#183D27] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Spring Water & Sun Drying
                  </td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Commercial Industrial Boilers</td>
                  <td className="p-4 sm:p-5 text-[#66704B]">High-Heat Spray Drying</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Fulvic Acid Concentration</td>
                  <td className="p-4 sm:p-5 bg-[#183D27]/5 font-bold text-[#183D27] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> &gt; 75% Lab Certified
                  </td>
                  <td className="p-4 sm:p-5 text-[#66704B]">30% – 50% Average</td>
                  <td className="p-4 sm:p-5 text-[#66704B]">10% – 20% Extract Blend</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Fillers & Additives</td>
                  <td className="p-4 sm:p-5 bg-[#183D27]/5 font-bold text-[#183D27] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Zero (100% Pure Resin)
                  </td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Water diluents or molasses</td>
                  <td className="p-4 sm:p-5 text-[#66704B] flex items-center gap-1.5 text-red-700">
                    <X className="w-4 h-4" /> Maltodextrin & Silica Flow Agents
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Heavy Metal Testing</td>
                  <td className="p-4 sm:p-5 bg-[#183D27]/5 font-bold text-[#183D27] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Every Batch NABL Certified
                  </td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Irregular or self-reported</td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Rarely provided per batch</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Direct Concierge Dispatch</td>
                  <td className="p-4 sm:p-5 bg-[#183D27]/5 font-bold text-[#183D27] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Direct Delhi Team on WhatsApp
                  </td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Automated 3rd-party warehouse</td>
                  <td className="p-4 sm:p-5 text-[#66704B]">Generic marketplace sellers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-xs bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F3E8]">
              Ready to experience pure Himalayan Shilajit?
            </h3>
            <p className="text-xs sm:text-sm text-[#EEE8D7]/80 max-w-lg">
              Explore our purified resin jar with measuring spoon or our single-origin raw honey sticks for portable vitality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/shop"
              className="px-6 py-3.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] font-bold text-xs uppercase tracking-wider text-center transition-colors"
            >
              SHOP THE COLLECTION
            </Link>

            <a
              href={getGeneralConciergeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP CONCIERGE</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
