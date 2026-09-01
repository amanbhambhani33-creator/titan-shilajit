import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { TRUST_STRIP_ITEMS, BRAND_CONTACT } from '../data/content';
import { db, doc, getDoc, setDoc, onSnapshot } from '../lib/firebase';

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
  footer: { aboutText: string; creditText: string; location: string; phoneDisplay: string; email: string; tagline?: string; designedBy?: string };
}

const DEFAULT_HERO: HeroBannerConfig = {
  kicker: '16,000+ FT HIGH HIMALAYAN HARVEST',
  headlineLine1: 'SACRED MOUNTAIN RESIN.',
  headlineLine2: 'UNTOUCHED GEOLOGICAL GOLD.',
  headlineLine3: 'UNLEASH THE TITAN.',
  description: 'Pure high-altitude rock exudate, hand-gathered from extreme Ladakh crevices and Surya Tapi sun-purified in glacial spring water. Rich in 84+ ionic bio-minerals and >75% active Fulvic Acid.',
  shopButtonText: 'ACQUIRE TITAN RESIN',
  guideButtonText: 'THE ANCIENT HARVEST STORY',
  bgImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  productCardImageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  purityPercent: '98.4% Pure',
  purityLabel: 'NABL Lab Certified',
  gradeBadge: 'GRADE-A HIGH ROCK RESIN',
};

const DEFAULT_LAUNCH_BANNER: LaunchBannerConfig = {
  enabled: true,
  badge: 'ROYAL HARVEST EDITION 2026',
  title: 'Titan Shilajit Swarna Gold Edition',
  subtitle: 'Infused with 24K Ayurvedic Gold Bhasma & Hand-Picked Kashmiri Saffron',
  description: 'Our most elevated single-origin harvest above 18,000 feet in the Karakoram massif, meticulously blended with classical Swarna Bhasma for deep cellular regeneration, profound stamina, and radiant ojas.',
  offerTag: 'LIMITED HARVEST LAUNCH • RESERVE WITH 25% PRIVILEGE',
  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
  priceText: '₹2,499',
  mrpText: '₹3,299',
  buttonText: 'Reserve Swarna Gold on WhatsApp',
  buttonLink: '/shop',
  features: [
    'Wild-harvested above 18,000 ft in virgin Karakoram granite fissures',
    'Standardized >80% active Fulvic Acid bio-transporters',
    'Accompanied by hand-cast solid brass ritual measurement wand',
    'Sealed in UV-impervious obsidian glass vault with wax seal',
  ],
};

const DEFAULT_ANNOUNCEMENT: AnnouncementBarConfig = {
  enabled: true,
  text: '✨ PURE 16,000+ FT HIMALAYAN GOLD SHILAJIT • EXPRESS DISPATCH ACROSS INDIA • NABL LAB CERTIFIED',
  linkText: 'Order on WhatsApp',
  linkUrl: 'https://wa.me/919958474229',
};

const DEFAULT_BRAND_STORY: BrandStoryConfig = {
  kicker: 'The Sacred Mountain Lineage',
  title: 'ANCIENT HIMALAYAN RESILIENCE. RECLAIMED FOR MODERN LIFE.',
  quote: '"Shilajit is neither herb nor stone; it is the compressed life-memory of ancient primeval forests, distilled through millennia under extreme Himalayan tectonic pressure."',
  paragraph1: 'Titan Shilajit was born from a singular vow: to restore the unadulterated purity of high-altitude Himalayan rock resin without industrial boiling, chemical bleaching, or artificial dilution.',
  paragraph2: 'Our native foraging families ascend beyond 16,000 feet into the pristine granite ridges of Ladakh and Kashmir. Under the scorching high-altitude summer sun, raw crude exudate melts from rock cracks. We purify this nectar using time-honored Ayurvedic Shodhana—slowly filtering through glacial spring water and curing for over 40 days beneath open mountain sunlight (Surya Tapi) to keep vital bio-enzymes intact.',
  paragraph3: 'Encased in heavy UV-shielding dark amber glass and single-serve forest honey sticks, Titan Shilajit delivers raw mineral vitality, razor-sharp focus, and primal physical vigor directly to your morning cup.',
  imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
  badgeTitle: '16,000+ FT HIGH HARVEST',
  badgeSubtitle: 'Granite Ridge Wild Foraging',
};

const DEFAULT_PAGE_CONTENT: PageContentConfig = {
  announcement: DEFAULT_ANNOUNCEMENT,
  hero: DEFAULT_HERO,
  launchBanner: DEFAULT_LAUNCH_BANNER,
  brandStory: DEFAULT_BRAND_STORY,
  trustStrip: TRUST_STRIP_ITEMS,
  benefitsHeader: {
    kicker: 'Bioactive Elemental Matrix',
    title: 'THE CELLULAR POWER OF 84+ MOUNTAIN TRACE MINERALS',
    description: 'Each single morning serving of Titan Shilajit delivers concentrated fulvic acid and ionic trace minerals that awaken natural cellular ATP and sustained physical drive.',
  },
  cta: {
    kicker: 'The Daily Himalayan Awakening',
    titleLine1: 'YOUR TRUE STRENGTH',
    titleLine2: 'BEGINS AT DAWN.',
    description: 'Claim your pot of authentic high-altitude Himalayan Shilajit resin and experience the clarity, stamina, and deep physical calm revered for millennia.',
    shopBtnText: 'ACQUIRE TITAN SHILAJIT',
    whatsappBtnText: 'ORDER DIRECT ON WHATSAPP',
  },
  footer: {
    aboutText: 'Titan Shilajit brings the primal strength of pure Himalayan rock resin into modern life. 100% natural, Surya Tapi sun-purified, and NABL lab-certified for uncompromising daily vigor.',
    creditText: 'Designed by Supreme Ads',
    designedBy: 'Designed by Supreme Ads',
    tagline: 'Titan Shilajit brings the ancient strength of pure Himalayan Shilajit into the rhythm of modern life. Naturally rich, traditionally purified, and lab-tested for uncompromising daily vitality.',
    location: BRAND_CONTACT.location,
    phoneDisplay: BRAND_CONTACT.phoneDisplay,
    email: BRAND_CONTACT.email,
  },
};

interface StoreContentContextType {
  products: Product[];
  content: PageContentConfig;
  showSplash: boolean;
  isFirebaseSynced: boolean;
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
  saveAllToFirebase: () => Promise<boolean>;
  resetAllContent: () => void;
}

const StoreContentContext = createContext<StoreContentContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'titan_store_products_v2';
const CONTENT_STORAGE_KEY = 'titan_store_content_v2';
const SPLASH_SEEN_KEY = 'titan_splash_seen_session';

export const StoreContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirebaseSynced, setIsFirebaseSynced] = useState<boolean>(false);

  // Load products with fallback
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

  // Load content with fallback
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
          footer: { ...DEFAULT_PAGE_CONTENT.footer, ...parsed.footer, creditText: 'Designed by Supreme Ads', designedBy: 'Designed by Supreme Ads' },
        };
      }
    } catch (e) {
      console.warn('Failed to load content from storage:', e);
    }
    return DEFAULT_PAGE_CONTENT;
  });

  // Splash Screen state
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem(SPLASH_SEEN_KEY);
      return !seen;
    } catch (e) {
      return true;
    }
  });

  // Firestore Realtime Synchronization
  useEffect(() => {
    let unsubscribeContent: (() => void) | null = null;
    let unsubscribeProducts: (() => void) | null = null;

    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      unsubscribeContent = onSnapshot(
        contentDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as Partial<PageContentConfig>;
            setContent((prev) => ({
              ...prev,
              ...data,
              hero: { ...prev.hero, ...(data.hero || {}) },
              launchBanner: { ...prev.launchBanner, ...(data.launchBanner || {}) },
              brandStory: { ...prev.brandStory, ...(data.brandStory || {}) },
              footer: { ...prev.footer, ...(data.footer || {}), creditText: 'Designed by Supreme Ads', designedBy: 'Designed by Supreme Ads' },
            }));
            setIsFirebaseSynced(true);
          }
        },
        (error) => {
          console.warn('Firestore content sync notice (using local cache):', error.message);
        }
      );

      const productsDocRef = doc(db, 'store_content', 'products');
      unsubscribeProducts = onSnapshot(
        productsDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
              setProducts(data.items);
            }
          }
        },
        (error) => {
          console.warn('Firestore products sync notice (using local cache):', error.message);
        }
      );
    } catch (err) {
      console.warn('Firebase sync initialization notice:', err);
    }

    return () => {
      if (unsubscribeContent) unsubscribeContent();
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving content to storage:', e);
    }
  }, [content]);

  const saveAllToFirebase = async (): Promise<boolean> => {
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      await setDoc(contentDocRef, {
        ...content,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      const productsDocRef = doc(db, 'store_content', 'products');
      await setDoc(productsDocRef, {
        items: products,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setIsFirebaseSynced(true);
      return true;
    } catch (err) {
      console.error('Error writing to Firestore:', err);
      return false;
    }
  };

  const triggerSplash = () => setShowSplash(true);
  const closeSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
    } catch (e) {}
  };

  // Product mutations
  const addProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    // Background async sync to Firestore
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      setDoc(productsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setProducts(updated);
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      setDoc(productsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      setDoc(productsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      setDoc(productsDocRef, { items: DEFAULT_PRODUCTS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  // Content mutations
  const updateHeroBanner = (updates: Partial<HeroBannerConfig>) => {
    const newContent = {
      ...content,
      hero: { ...content.hero, ...updates },
    };
    setContent(newContent);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, newContent, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateLaunchBanner = (updates: Partial<LaunchBannerConfig>) => {
    const newContent = {
      ...content,
      launchBanner: { ...content.launchBanner, ...updates },
    };
    setContent(newContent);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, newContent, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateAnnouncementBar = (updates: Partial<AnnouncementBarConfig>) => {
    const newContent = {
      ...content,
      announcement: { ...content.announcement, ...updates },
    };
    setContent(newContent);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, newContent, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateBrandStory = (updates: Partial<BrandStoryConfig>) => {
    const newContent = {
      ...content,
      brandStory: { ...content.brandStory, ...updates },
    };
    setContent(newContent);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, newContent, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateTrustStripItem = (index: number, title: string, subtitle: string) => {
    const nextStrip = [...content.trustStrip];
    if (nextStrip[index]) {
      nextStrip[index] = { title, subtitle };
    }
    const newContent = { ...content, trustStrip: nextStrip };
    setContent(newContent);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, newContent, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updatePageContent = <K extends keyof PageContentConfig>(
    section: K,
    updates: Partial<PageContentConfig[K]>
  ) => {
    const newContent = {
      ...content,
      [section]: { ...content[section], ...updates },
    };
    setContent(newContent);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, newContent, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const resetAllContent = () => {
    setContent(DEFAULT_PAGE_CONTENT);
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      setDoc(contentDocRef, DEFAULT_PAGE_CONTENT, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  return (
    <StoreContentContext.Provider
      value={{
        products,
        content,
        showSplash,
        isFirebaseSynced,
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
        saveAllToFirebase,
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
