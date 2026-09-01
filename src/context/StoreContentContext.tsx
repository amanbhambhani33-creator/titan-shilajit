import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { TRUST_STRIP_ITEMS, SHILAJIT_BENEFITS, BRAND_CONTACT, FAQS } from '../data/content';

export interface HeroBannerConfig {
  kicker: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  description: string;
  shopButtonText: string;
  guideButtonText: string;
  bgImageUrl: string;
  productCardImageUrl: string;
  purityPercent: string;
  purityLabel: string;
  gradeBadge: string;
}

export interface LaunchBannerConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  offerTag: string;
  imageUrl: string;
  priceText: string;
  mrpText: string;
  buttonText: string;
  buttonLink: string;
  features: string[];
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  linkText: string;
  linkUrl: string;
}

export interface BrandStoryConfig {
  kicker: string;
  title: string;
  quote: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  imageUrl: string;
  badgeTitle: string;
  badgeSubtitle: string;
}

export interface PageContentConfig {
  announcement: AnnouncementBarConfig;
  hero: HeroBannerConfig;
  launchBanner: LaunchBannerConfig;
  brandStory: BrandStoryConfig;
  trustStrip: Array<{ title: string; subtitle: string }>;
  benefitsHeader: { kicker: string; title: string; description: string };
  cta: { kicker: string; titleLine1: string; titleLine2: string; description: string; shopBtnText: string; whatsappBtnText: string };
  footer: { aboutText: string; creditText: string; location: string; phoneDisplay: string; email: string };
}

const DEFAULT_HERO: HeroBannerConfig = {
  kicker: 'Pure Power of the Himalayas',
  headlineLine1: 'UNLEASH',
  headlineLine2: 'THE TITAN',
  headlineLine3: 'WITHIN.',
  description: 'Naturally rich, traditionally valued and carefully prepared. Titan Shilajit brings the ancient strength of the Himalayas into the rhythm of modern life.',
  shopButtonText: 'Shop Titan Shilajit',
  guideButtonText: 'Discover The Power',
  bgImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  productCardImageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  purityPercent: '98.2% Purity',
  purityLabel: 'Lab Verified Resin',
  gradeBadge: 'GRADE-A RESIN',
};

const DEFAULT_LAUNCH_BANNER: LaunchBannerConfig = {
  enabled: true,
  badge: 'NEW LAUNCH 2026',
  title: 'Titan Shilajit Gold Resin Edition',
  subtitle: 'Infused with 24K Edible Gold Bhasma & Organic Saffron',
  description: 'Experience our highest elevation harvest from 18,000+ feet in Ladakh, enriched with traditional Swarna Bhasma for ultimate cellular regeneration and peak physical drive.',
  offerTag: 'EXCLUSIVE INTRODUCTORY LAUNCH OFFER • 25% OFF',
  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
  priceText: '₹2,499',
  mrpText: '₹3,299',
  buttonText: 'Order New Launch on WhatsApp',
  buttonLink: '/shop',
  features: [
    'Harvested above 18,000 ft in the Karakoram range',
    'Standardized >80% active Fulvic Acid density',
    'Includes Custom Solid Brass Measuring Ritual Spoon',
    'Dispatched in Signature Obsidian UV-Glass Vault',
  ],
};

const DEFAULT_ANNOUNCEMENT: AnnouncementBarConfig = {
  enabled: true,
  text: '⚡ EXPRESS DISPATCH ACROSS INDIA • 100% PURE HIMALAYAN SHILAJIT (NABL LAB VERIFIED)',
  linkText: 'Order on WhatsApp',
  linkUrl: 'https://wa.me/919958474229',
};

const DEFAULT_BRAND_STORY: BrandStoryConfig = {
  kicker: 'The Titan Philosophy',
  title: 'HONORING ANCIENT STRENGTH IN THE MODERN AGE.',
  quote: '"Shilajit is not merely a supplement; it is the concentrated geological memory of the Himalayas seeping through millennia of natural pressure."',
  paragraph1: 'Titan Shilajit was founded with a singular commitment: to deliver unadulterated, high-altitude Himalayan Shilajit without dilution, chemical bleaching, or artificial sweeteners.',
  paragraph2: 'We wild-harvest above 16,000 feet in remote mountain crevices of Kashmir and Ladakh where the air is pristine. Our crude exudate is purified using traditional Ayurvedic Shodhana spring water washes and slow Surya Tapi (sun-curing) to preserve essential heat-sensitive bio-minerals and fulvic complexes.',
  paragraph3: 'Packaged in UV-protective dark amber glass jars and portable nitrogen-flushed honey sticks, Titan Shilajit is formulated to seamlessly empower your daily performance, focus, and natural recovery.',
  imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
  badgeTitle: '16,000+ FT SOURCING',
  badgeSubtitle: 'Extreme High Altitude Harvest',
};

const DEFAULT_PAGE_CONTENT: PageContentConfig = {
  announcement: DEFAULT_ANNOUNCEMENT,
  hero: DEFAULT_HERO,
  launchBanner: DEFAULT_LAUNCH_BANNER,
  brandStory: DEFAULT_BRAND_STORY,
  trustStrip: TRUST_STRIP_ITEMS,
  benefitsHeader: {
    kicker: 'Bioactive Potency',
    title: 'THE POWER OF PURE HIMALAYAN BIO-MINERALS',
    description: 'Each morning serving of Titan Shilajit delivers 84+ ionic trace minerals and >75% lab-certified fulvic acid to invigorate cellular ATP and natural metabolic drive.',
  },
  cta: {
    kicker: 'Himalayan Power in Modern Life',
    titleLine1: 'YOUR DAILY POWER',
    titleLine2: 'STARTS HERE.',
    description: 'Explore the Titan collection and discover a simpler way to make natural wellness part of your everyday routine.',
    shopBtnText: 'SHOP NOW',
    whatsappBtnText: 'ORDER ON WHATSAPP',
  },
  footer: {
    aboutText: 'Titan Shilajit brings the ancient strength of pure Himalayan Shilajit into the rhythm of modern life. Naturally rich, traditionally purified, and lab-tested for uncompromising daily vitality.',
    creditText: 'Designed by Supreme Ads',
    location: BRAND_CONTACT.location,
    phoneDisplay: BRAND_CONTACT.phoneDisplay,
    email: BRAND_CONTACT.email,
  },
};

interface StoreContentContextType {
  products: Product[];
  content: PageContentConfig;
  showSplash: boolean;
  triggerSplash: () => void;
  closeSplash: () => void;
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  // Banner and content actions
  updateHeroBanner: (updates: Partial<HeroBannerConfig>) => void;
  updateLaunchBanner: (updates: Partial<LaunchBannerConfig>) => void;
  updateAnnouncementBar: (updates: Partial<AnnouncementBarConfig>) => void;
  updateBrandStory: (updates: Partial<BrandStoryConfig>) => void;
  updateTrustStripItem: (index: number, title: string, subtitle: string) => void;
  updatePageContent: <K extends keyof PageContentConfig>(section: K, updates: Partial<PageContentConfig[K]>) => void;
  resetAllContent: () => void;
}

const StoreContentContext = createContext<StoreContentContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'titan_store_products_v1';
const CONTENT_STORAGE_KEY = 'titan_store_content_v1';
const SPLASH_SEEN_KEY = 'titan_splash_seen_session';

export const StoreContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load products from localStorage or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load products from storage:', e);
    }
    return DEFAULT_PRODUCTS;
  });

  // Load content from localStorage or fallback
  const [content, setContent] = useState<PageContentConfig>(() => {
    try {
      const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PAGE_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_PAGE_CONTENT.hero, ...parsed.hero },
          launchBanner: { ...DEFAULT_PAGE_CONTENT.launchBanner, ...parsed.launchBanner },
          announcement: { ...DEFAULT_PAGE_CONTENT.announcement, ...parsed.announcement },
          brandStory: { ...DEFAULT_PAGE_CONTENT.brandStory, ...parsed.brandStory },
          footer: { ...DEFAULT_PAGE_CONTENT.footer, ...parsed.footer, creditText: 'Designed by Supreme Ads' },
        };
      }
    } catch (e) {
      console.warn('Failed to load content from storage:', e);
    }
    return DEFAULT_PAGE_CONTENT;
  });

  // Initial Splash Screen state (shows on first page open)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem(SPLASH_SEEN_KEY);
      return !seen;
    } catch (e) {
      return true;
    }
  });

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  }, [products]);

  // Persist content
  useEffect(() => {
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving content to storage:', e);
    }
  }, [content]);

  const triggerSplash = () => {
    setShowSplash(true);
  };

  const closeSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
    } catch (e) {}
  };

  // Product mutations
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  // Content mutations
  const updateHeroBanner = (updates: Partial<HeroBannerConfig>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updates },
    }));
  };

  const updateLaunchBanner = (updates: Partial<LaunchBannerConfig>) => {
    setContent((prev) => ({
      ...prev,
      launchBanner: { ...prev.launchBanner, ...updates },
    }));
  };

  const updateAnnouncementBar = (updates: Partial<AnnouncementBarConfig>) => {
    setContent((prev) => ({
      ...prev,
      announcement: { ...prev.announcement, ...updates },
    }));
  };

  const updateBrandStory = (updates: Partial<BrandStoryConfig>) => {
    setContent((prev) => ({
      ...prev,
      brandStory: { ...prev.brandStory, ...updates },
    }));
  };

  const updateTrustStripItem = (index: number, title: string, subtitle: string) => {
    setContent((prev) => {
      const nextStrip = [...prev.trustStrip];
      if (nextStrip[index]) {
        nextStrip[index] = { title, subtitle };
      }
      return { ...prev, trustStrip: nextStrip };
    });
  };

  const updatePageContent = <K extends keyof PageContentConfig>(
    section: K,
    updates: Partial<PageContentConfig[K]>
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  const resetAllContent = () => {
    setContent(DEFAULT_PAGE_CONTENT);
    localStorage.removeItem(CONTENT_STORAGE_KEY);
  };

  return (
    <StoreContentContext.Provider
      value={{
        products,
        content,
        showSplash,
        triggerSplash,
        closeSplash,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        updateHeroBanner,
        updateLaunchBanner,
        updateAnnouncementBar,
        updateBrandStory,
        updateTrustStripItem,
        updatePageContent,
        resetAllContent,
      }}
    >
      {children}
    </StoreContentContext.Provider>
  );
};

export const useStoreContent = () => {
  const ctx = useContext(StoreContentContext);
  if (!ctx) {
    throw new Error('useStoreContent must be used within a StoreContentProvider');
  }
  return ctx;
};
