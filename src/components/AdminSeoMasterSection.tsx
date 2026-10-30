import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Search,
  Bot,
  Globe,
  FileCode,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Tag,
  ExternalLink,
} from 'lucide-react';

interface KeywordGroup {
  id: string;
  category: string;
  badge: string;
  description: string;
  keywords: string[];
}

const MASTER_SEO_AEO_GROUPS: KeywordGroup[] = [
  {
    id: 'primary',
    category: '1. Primary SEO Keywords (High Priority)',
    badge: 'CORE RANKING',
    description: 'High search volume core head terms targeting top Google organic and AI search rankings.',
    keywords: [
      'Shilajit',
      'Pure Shilajit',
      'Original Shilajit',
      'Himalayan Shilajit',
      'Pure Himalayan Shilajit',
      'Shilajit Resin',
      'Original Shilajit Resin',
      'Natural Shilajit',
      'Authentic Shilajit',
      'Premium Shilajit',
      'Organic Shilajit',
      'Shilajit Supplement',
      'Shilajit for Men',
      'Ayurvedic Shilajit',
      'Himalayan Shilajit Resin',
      'Pure Shilajit Extract',
      'Authentic Himalayan Shilajit',
      'Shilajit India',
      'Shilajeet',
      'Shilajit Resin India',
    ],
  },
  {
    id: 'transactional',
    category: '2. Transactional & Buying-Intent Keywords (High Purchase Intent)',
    badge: 'E-COMMERCE REVENUE',
    description: 'Keywords searched by customers ready with payment methods (Google Shopping, Google Ads, high-converting pages).',
    keywords: [
      'Buy Shilajit Online',
      'Buy Original Shilajit',
      'Buy Pure Shilajit Resin',
      'Buy Himalayan Shilajit',
      'Best Shilajit in India',
      'Best Shilajit Resin in India',
      'Original Shilajit Online',
      'Pure Shilajit Online India',
      'Shilajit Resin Online',
      'Shilajit Resin Price',
      'Original Shilajit Price',
      'Himalayan Shilajit Price',
      'Shilajit Online Shopping',
      '100% Pure Shilajit Resin',
      'Best Quality Shilajit',
      'Authentic Shilajit Online',
      'Premium Himalayan Shilajit',
      'Shilajit Buy Online India',
      'Where to Buy Original Shilajit',
      'Lab Tested Shilajit Resin',
    ],
  },
  {
    id: 'product_specific',
    category: '3. Product-Specific & Formulation Keywords',
    badge: 'CATALOG & VARIANTS',
    description: 'Targeted formulations, forms, and purity certifications.',
    keywords: [
      'Himalayan Shilajit Resin',
      'Shilajit Gold Resin',
      'Shilajit Honey Sticks',
      'Shilajit Capsules',
      'Shilajit Tablets',
      'Shilajit Drops',
      'Shilajit Liquid Extract',
      'Pure Shilajit Extract',
      'Shilajit with Fulvic Acid',
      'Mineral Rich Shilajit',
      'Lab Tested Himalayan Shilajit',
      'Purified Shilajit Resin',
      'Natural Himalayan Resin',
      'Premium Shilajit Supplement',
      'Ayurvedic Shilajit Resin',
      'Shilajit Resin Packaging',
      'Shilajit Spoon Wand',
    ],
  },
  {
    id: 'benefits',
    category: '4. Benefits & Informational Keywords',
    badge: 'BLOGS & EDUCATION',
    description: 'Ideal for educational blogs, landing pages, and long-tail informational search.',
    keywords: [
      'Shilajit Benefits',
      'Himalayan Shilajit Benefits',
      'Shilajit Benefits for Men',
      'Shilajit Nutritional Composition',
      'Shilajit Fulvic Acid Benefits',
      'Shilajit Minerals and Properties',
      'Shilajit for Daily Wellness',
      'Shilajit Traditional Uses',
      'Shilajit and Energy',
      'Shilajit and Stamina',
      'Shilajit and Physical Performance',
      'Shilajit and Male Wellness',
      'Shilajit for Active Lifestyle',
      'Shilajit Antioxidant Properties',
      'Himalayan Shilajit Composition',
    ],
  },
  {
    id: 'longtail',
    category: '5. Long-Tail SEO Keywords (High Quality Traffic)',
    badge: 'CONVERTING QUESTIONS',
    description: 'Detailed user intent questions that capture high-trust consumers.',
    keywords: [
      'How to identify original Shilajit',
      'How to check pure Shilajit at home',
      'How to consume Shilajit resin',
      'How to use Himalayan Shilajit',
      'What is the best form of Shilajit',
      'Shilajit resin vs capsules',
      'Original Shilajit vs fake Shilajit',
      'How is Himalayan Shilajit purified',
      'How to store Shilajit resin',
      'What is fulvic acid in Shilajit',
      'What makes Himalayan Shilajit different',
      'How to choose the best Shilajit brand',
      'What to check before buying Shilajit',
      'How to verify Shilajit purity',
      'Shilajit quality and authenticity',
    ],
  },
  {
    id: 'competitor',
    category: '6. Competitor Brand & Comparison Keywords',
    badge: 'BRAND COMPARISON',
    description: 'Competitor intercept queries used for comparison pages and Google Ads search themes.',
    keywords: [
      'Kapiva Shilajit',
      'Kapiva Shilajit price',
      'Kapiva Shilajit review',
      'Upakarma Shilajit',
      'Upakarma Resin',
      'Rasayanam Shilajit',
      'Rasayanam Resin',
      'Dabur Shilajit',
      'Dabur Shilajit Gold',
      'Himalaya Shilajit',
      'Zandu Shilajit',
      'Patanjali Shilajit',
      'Baidyanath Shilajit',
      'Man Matters Shilajit',
      'Neuherbs Shilajit',
      'Nutrabay Shilajit',
      'Dr Vaidya Shilajit',
      'Bold Care Shilajit',
      'Best Shilajit brands in India',
      'Best Himalayan Shilajit brands',
      'Kapiva vs Upakarma Shilajit',
      'Kapiva vs Rasayanam Shilajit',
      'Which Shilajit brand is best?',
    ],
  },
  {
    id: 'aeo',
    category: '7. AEO — Answer Engine Optimization Queries (ChatGPT & Google AI)',
    badge: 'AI OVERVIEWS & CHATGPT',
    description: 'Natural language questions conversational AI models extract for instant answers and direct citations.',
    keywords: [
      'What is Himalayan Shilajit and how is it harvested?',
      'How can I identify pure Shilajit resin from fake products?',
      'What is the importance of 70%+ fulvic acid in Shilajit?',
      'How should beginners consume Shilajit resin for vitality?',
      'Can Shilajit resin be dissolved in warm milk or green tea?',
      'Why is Triphala sun-purification better than boiling methods?',
      'Is Titan Shilajit tested by NABL accredited third-party laboratories?',
      'What are the side effects or contraindications of Shilajit?',
      'How long does it take for Shilajit to show energy and endurance results?',
      'How should raw Shilajit honey sticks be used on the go?',
    ],
  },
  {
    id: 'local',
    category: '8. Local & Pan-India City SEO Keywords',
    badge: 'GEO LOCALIZATION',
    description: 'Express shipping location keywords for top tier-1 and tier-2 Indian metropolitan markets.',
    keywords: [
      'Shilajit Delhi NCR',
      'Shilajit Mumbai',
      'Shilajit Bengaluru',
      'Shilajit Hyderabad',
      'Shilajit Pune',
      'Shilajit Chennai',
      'Shilajit Kolkata',
      'Shilajit Ahmedabad',
      'Shilajit Jaipur',
      'Shilajit Chandigarh',
      'Shilajit Lucknow',
      'Shilajit Gurgaon',
      'Shilajit Noida',
      'Shilajit Surat',
      'Shilajit Indore',
      'Shilajit India Same Day Dispatch',
    ],
  },
];

interface AdminSeoMasterSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminSeoMasterSection: React.FC<AdminSeoMasterSectionProps> = ({ onSuccessToast }) => {
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('primary');
  const [searchFilter, setSearchFilter] = useState('');

  const handleCopyGroup = (group: KeywordGroup) => {
    const text = group.keywords.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedGroup(group.id);
    if (onSuccessToast) onSuccessToast(`Copied ${group.keywords.length} keywords for ${group.category}!`);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const handleCopyAll = () => {
    const all = MASTER_SEO_AEO_GROUPS.flatMap((g) => g.keywords).join(', ');
    navigator.clipboard.writeText(all);
    setCopiedGroup('ALL');
    if (onSuccessToast) onSuccessToast('Copied all master SEO & AEO keywords to clipboard!');
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const currentGroup = MASTER_SEO_AEO_GROUPS.find((g) => g.id === activeTab) || MASTER_SEO_AEO_GROUPS[0];

  const filteredKeywords = searchFilter
    ? currentGroup.keywords.filter((k) => k.toLowerCase().includes(searchFilter.toLowerCase()))
    : currentGroup.keywords;

  return (
    <div className="bg-white rounded-sm border border-[#10110F]/10 shadow-xs overflow-hidden mb-8">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 bg-[#183D27] text-[#F7F3E8] border-b border-[#B88A32]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#D4B66A] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#D4B66A]" />
            <span>AI ENGINE (AEO) &amp; GOOGLE SEO MASTER HUB</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F3E8]">
            Complete SEO + AEO Keyword Master System
          </h2>
          <p className="text-xs text-[#EEE8D7]/80 font-sans mt-1">
            Engineered to dominate Google Organic Search, Google AI Overviews, ChatGPT conversational citations, and Pan-India purchase intent.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="px-4 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          {copiedGroup === 'ALL' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedGroup === 'ALL' ? 'Copied Master List!' : 'Copy All Master Keywords'}</span>
        </button>
      </div>

      {/* Schema.org Status Indicators */}
      <div className="p-4 bg-[#10110F] text-[#F7F3E8] border-b border-[#B88A32]/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 block font-mono">SCHEMA 1</span>
            <strong className="text-white">Organization JSON-LD</strong>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 block font-mono">SCHEMA 2</span>
            <strong className="text-white">Product &amp; Price (INR)</strong>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 block font-mono">SCHEMA 3</span>
            <strong className="text-white">FAQPage for AI Overviews</strong>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-white/50 block font-mono">TAGGING</span>
            <strong className="text-[#D4B66A]">Canonical + Robots Max</strong>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="p-4 bg-[#F7F3E8] border-b border-[#10110F]/10 flex overflow-x-auto no-scrollbar gap-1.5">
        {MASTER_SEO_AEO_GROUPS.map((group) => {
          const isActive = activeTab === group.id;
          return (
            <button
              key={group.id}
              onClick={() => {
                setActiveTab(group.id);
                setSearchFilter('');
              }}
              className={`px-3 py-1.5 rounded-xs text-[11px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#183D27] text-white shadow-xs'
                  : 'bg-white hover:bg-white/80 text-[#10110F] border border-[#10110F]/10'
              }`}
            >
              {group.badge}
            </button>
          );
        })}
      </div>

      {/* Active Group Content */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7F3E8]/60 p-4 rounded-xs border border-[#10110F]/10">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[9px] font-bold uppercase tracking-wider mr-2">
              {currentGroup.badge}
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#10110F] inline">
              {currentGroup.category}
            </h3>
            <p className="text-xs text-[#66704B] font-sans mt-1">
              {currentGroup.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleCopyGroup(currentGroup)}
              className="px-3.5 py-1.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedGroup === currentGroup.id ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#D4B66A]" />
              )}
              <span>Copy {currentGroup.keywords.length} Keywords</span>
            </button>
          </div>
        </div>

        {/* Filter input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#10110F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={`Search within ${currentGroup.keywords.length} keywords...`}
            className="w-full pl-9 pr-3 py-2 rounded-xs bg-white border border-[#10110F]/15 text-xs text-[#10110F] focus:outline-none focus:border-[#183D27]"
          />
        </div>

        {/* Keyword Pills Display */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredKeywords.map((kw, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-xs bg-white border border-[#10110F]/15 hover:border-[#183D27] text-xs font-semibold text-[#10110F] flex items-center gap-2 shadow-xs transition-colors group cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(kw);
                if (onSuccessToast) onSuccessToast(`Copied "${kw}"`);
              }}
              title="Click to copy single keyword"
            >
              <span>{kw}</span>
              <Copy className="w-3 h-3 text-[#10110F]/30 group-hover:text-[#183D27]" />
            </div>
          ))}
        </div>

        {/* AEO Best Practice Box */}
        <div className="p-4 rounded-xs bg-[#10110F] text-[#F7F3E8] border border-[#B88A32]/40 text-xs space-y-2 mt-4">
          <div className="flex items-center gap-2 text-[#D4B66A] font-bold uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>AI OVERVIEWS &amp; CHATGPT CITATION PROTOCOL</span>
          </div>
          <p className="text-[#EEE8D7]/80 leading-relaxed font-sans">
            AI search engines (Google SGE, Perplexity, ChatGPT Search) prefer <strong>clear factual definitions</strong> (40–60 words) immediately after question headings, explicit percentages (e.g. <em>70%+ Fulvic Acid</em>), and verified geographic origin (<em>above 16,000 ft in Ladakh</em>). These are actively integrated into your homepage metadata and Schema.org FAQPage.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminSeoMasterSection;
