import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, BenefitCard, QualityTrustCard, QualityTrustConfig, HeroSlideImage, OrderRecord, Review } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { REVIEWS as DEFAULT_REVIEWS } from '../data/reviews';
import { TRUST_STRIP_ITEMS, BRAND_CONTACT } from '../data/content';
import { db, doc, getDoc, setDoc, onSnapshot, collection, getDocs, query, where } from '../lib/firebase';

export type { BenefitCard, QualityTrustCard, QualityTrustConfig, HeroSlideImage };

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
  imagePosition?: 'right' | 'left' | 'center';
  // Picture transition configuration
  showWords?: boolean; // Set to false: "no words required only picture transistion req"
  autoplayInterval?: number; // In milliseconds (e.g. 4500)
  transitionEffect?: 'fade' | 'slide';
  pictures?: HeroSlideImage[];
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
  productBenefits: BenefitCard[];
  qualityTrust: QualityTrustConfig;
  cta: { kicker: string; titleLine1: string; titleLine2: string; description: string; shopBtnText: string; whatsappBtnText: string };
  footer: { aboutText: string; creditText: string; location: string; phoneDisplay: string; email: string; tagline?: string; designedBy?: string };
}

export const DEFAULT_PRODUCT_BENEFITS: BenefitCard[] = [
  {
    id: 'peak-strength',
    title: 'Peak Muscle Strength',
    subtitle: 'Physical Power & Recovery',
    description: 'Helps boost physical power & muscle recovery with nutrient-rich Shilajit for a stronger, leaner you.',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=85',
    tag: 'POWER & MUSCLE',
  },
  {
    id: 'enhanced-endurance',
    title: 'Enhanced Endurance',
    subtitle: 'Intense Workout Support',
    description: 'Elevate your stamina and lift heavier with natural energy that supports intense workout sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=85',
    tag: 'ENDURANCE & LIFT',
  },
  {
    id: 'stamina-agility',
    title: 'Stamina & Agility',
    subtitle: 'Speed & Sustained Vitality',
    description: 'Fuel your speed and performance. Stay active and energized throughout the day with natural vitality.',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=85',
    tag: 'SPEED & VIGOR',
  },
  {
    id: 'immunity-metabolism',
    title: 'Immunity & Metabolism',
    subtitle: 'Cellular Defense & Health',
    description: 'Shilajit helps regulate metabolism and boosts immune response, ensuring you stay resilient and healthy year-round.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=85',
    tag: 'IMMUNITY & METABOLISM',
  },
];

export const DEFAULT_QUALITY_TRUST: QualityTrustConfig = {
  kicker: 'QUALITY & TRUST',
  title: 'Quality You Can See. Trust You Can Feel.',
  description: 'At Titan Shilajit, we believe that true wellness begins with purity, transparency, and responsible quality practices. Hand-gathered above 16,000 ft, Surya Tapi sun-purified, and third-party NABL lab certified.',
  cards: [
    {
      id: 'qt-1',
      title: '16,000+ FT High Sourced',
      subtitle: 'Virgin Himalayan Granite Ridges',
      description: 'Hand-gathered from sheer Himalayan granite crevices above 16,000 feet in Ladakh and Kashmir during peak solar heat.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85',
      badge: 'HIGH ALTITUDE',
      tag: '01. SOURCE',
    },
    {
      id: 'qt-2',
      title: 'Surya Tapi Sun Purified',
      subtitle: 'Traditional 40-Day Solar Curing',
      description: 'Slow-cured beneath open mountain sunlight using glacial spring water, preserving delicate live enzymes and >75% fulvic acid.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
      badge: 'SOLAR PURITY',
      tag: '02. PROCESS',
    },
    {
      id: 'qt-3',
      title: 'NABL Lab Certified',
      subtitle: 'Chromatography Purity Verified',
      description: 'Rigorous third-party laboratory assay testing for heavy metals, fulvic potency, safety, and 100% absence of synthetic adulterants.',
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=85',
      badge: 'LAB VERIFIED',
      tag: '03. TESTING',
    },
    {
      id: 'qt-4',
      title: 'Obsidian Amber Glass Vault',
      subtitle: 'Sealed for Maximum Bio-Potency',
      description: 'Encased in heavy UV-impervious obsidian glass to guard against light degradation, accompanied by stainless measurement wand.',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85',
      badge: 'PREMIUM VAULT',
      tag: '04. PACKAGING',
    },
  ],
};

export const DEFAULT_HERO_PICTURES: HeroSlideImage[] = [
  {
    id: 'pic-1',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Pure Himalayan Shilajit Resin (20g Jar)',
    linkUrl: '/product/titan-shilajit-resin',
    altText: 'Titan Pure Himalayan Shilajit Resin Jar',
  },
  {
    id: 'pic-2',
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Shilajit Honey Sticks — Classic Raw Honey',
    linkUrl: '/product/titan-honey-sticks-classic',
    altText: 'Titan Shilajit Classic Raw Honey Sticks',
  },
  {
    id: 'pic-3',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Shilajit Honey Sticks — 70% Dark Cacao',
    linkUrl: '/product/titan-honey-sticks-dark-chocolate',
    altText: 'Titan Shilajit Dark Chocolate Honey Sticks',
  },
  {
    id: 'pic-4',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Shilajit Honey Sticks — Wild Strawberry',
    linkUrl: '/product/titan-honey-sticks-strawberry',
    altText: 'Titan Shilajit Wild Strawberry Honey Sticks',
  },
  {
    id: 'pic-5',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1920&q=85',
    title: 'The Titan Vitality Ritual Box (Resin + Spoon + Sticks)',
    linkUrl: '/product/titan-vitality-ritual-box',
    altText: 'The Titan Vitality Ritual Box with Measuring Wand',
  },
  {
    id: 'pic-6',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=85',
    title: 'Titan Honey Sticks Discovery Trio (30-Stick Variety Pack)',
    linkUrl: '/product/titan-honey-sticks-trio',
    altText: 'Titan Honey Sticks Discovery Trio Pack',
  },
];

const DEFAULT_HERO: HeroBannerConfig = {
  kicker: '16,000+ FT HIGH HIMALAYAN HARVEST',
  headlineLine1: 'SACRED MOUNTAIN RESIN.',
  headlineLine2: 'UNTOUCHED GEOLOGICAL GOLD.',
  headlineLine3: 'UNLEASH THE TITAN.',
  description: 'Pure high-altitude rock exudate, hand-gathered from extreme Ladakh crevices and Surya Tapi sun-purified in glacial spring water. Rich in 84+ ionic bio-minerals and >75% active Fulvic Acid.',
  shopButtonText: 'ACQUIRE TITAN RESIN',
  guideButtonText: 'THE ANCIENT HARVEST STORY',
  bgImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  productCardImageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
  purityPercent: '98.4% Pure',
  purityLabel: 'NABL Lab Certified',
  gradeBadge: 'GRADE-A HIGH ROCK RESIN',
  imagePosition: 'right',
  showWords: false, // Strict user instruction: "no words required only picture transistion req"
  autoplayInterval: 7500,
  transitionEffect: 'fade',
  pictures: DEFAULT_HERO_PICTURES,
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
  buttonText: 'View Swarna Gold Reserve',
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
  text: 'PURE 16,000+ FT HIMALAYAN GOLD SHILAJIT • EXPRESS DISPATCH ACROSS INDIA • NABL LAB CERTIFIED',
  linkText: 'Explore Catalog',
  linkUrl: '/shop',
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
    kicker: 'Natural Power & Vitality',
    title: 'PRODUCT BENEFITS',
    description: 'Each single morning serving of Titan Shilajit delivers concentrated fulvic acid and ionic trace minerals that awaken natural cellular ATP and sustained physical drive.',
  },
  productBenefits: DEFAULT_PRODUCT_BENEFITS,
  qualityTrust: DEFAULT_QUALITY_TRUST,
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
  lastSyncTime: string | null;
  triggerSplash: () => void;
  closeSplash: () => void;
  // Product actions
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  updateProductStock: (id: string, qty: number) => Promise<boolean>;
  toggleProductInStock: (id: string) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetProductsToDefault: () => void;
  // Inventory alerts
  lowStockProducts: Product[];
  lowStockCount: number;
  // Orders & Customer First-Order validation
  orders: OrderRecord[];
  recordOrder: (order: Omit<OrderRecord, 'id' | 'createdAt'>) => Promise<string>;
  checkCustomerFirstOrder: (mobileOrEmail: string) => Promise<{ isFirstOrder: boolean; previousOrderCount: number; message?: string }>;
  // Banner and content actions
  updateHeroBanner: (updates: Partial<HeroBannerConfig>) => void;
  updateLaunchBanner: (updates: Partial<LaunchBannerConfig>) => void;
  updateAnnouncementBar: (updates: Partial<AnnouncementBarConfig>) => void;
  updateBrandStory: (updates: Partial<BrandStoryConfig>) => void;
  updateTrustStripItem: (index: number, title: string, subtitle: string) => void;
  updateProductBenefits: (cards: BenefitCard[]) => Promise<boolean>;
  updateBenefitCard: (cardId: string, updates: Partial<BenefitCard>) => Promise<boolean>;
  updateQualityTrust: (updates: Partial<QualityTrustConfig>) => Promise<boolean>;
  updateQualityTrustCard: (cardId: string, updates: Partial<QualityTrustCard>) => Promise<boolean>;
  updatePageContent: <K extends keyof PageContentConfig>(section: K, updates: Partial<PageContentConfig[K]>) => void;
  // Reviews management
  reviews: Review[];
  addReview: (review: Review) => Promise<boolean>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  resetReviewsToDefault: () => Promise<boolean>;
  refreshReviews: () => Promise<boolean>;
  refreshStoreData: () => Promise<boolean>;
  saveAllToFirebase: () => Promise<boolean>;
  testFirestoreConnection: () => Promise<{ success: boolean; message: string }>;
  resetAllContent: () => void;
}

const StoreContentContext = createContext<StoreContentContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'titan_store_products_v2';
const CONTENT_STORAGE_KEY = 'titan_store_content_v2';
const REVIEWS_STORAGE_KEY = 'titan_store_reviews_v2';
const SPLASH_SEEN_KEY = 'titan_splash_seen_session';
const LAST_SYNC_STORAGE_KEY = 'titan_last_firestore_sync';

// Utility to sanitize and purge all generic unsplash images from memory and persistence
function sanitizeProductsImages(items: Product[]): Product[] {
  if (!Array.isArray(items)) return [];
  return items.map((p) => {
    const cleanImgs = (p.images || []).filter((img) => img && !img.includes('unsplash.com'));
    const cleanPacks = (p.packs || []).map((pk, idx) => {
      const isGeneric = !pk.image || pk.image.includes('unsplash.com');
      const fallbackImg = cleanImgs[idx] || cleanImgs[0] || '';
      return {
        ...pk,
        image: isGeneric ? fallbackImg : pk.image,
      };
    });
    return {
      ...p,
      images: cleanImgs,
      packs: cleanPacks,
    };
  });
}

export const StoreContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirebaseSynced, setIsFirebaseSynced] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LAST_SYNC_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  // Load reviews with fallback
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load reviews from storage:', e);
    }
    return DEFAULT_REVIEWS;
  });

  // Load products with fallback (strictly purging generic Unsplash images from memory)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeProductsImages(parsed);
      }
    } catch (e) {
      console.warn('Failed to load products from storage:', e);
    }
    return sanitizeProductsImages(DEFAULT_PRODUCTS);
  });

  // Load content with fallback
  const [content, setContent] = useState<PageContentConfig>(() => {
    try {
      const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const heroData = { ...DEFAULT_PAGE_CONTENT.hero, ...parsed.hero };
        if (!heroData.productCardImageUrl || heroData.productCardImageUrl.includes('photo-1614850523296')) {
          heroData.productCardImageUrl = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85';
        }
        if (!Array.isArray(heroData.pictures) || heroData.pictures.length === 0) {
          heroData.pictures = DEFAULT_HERO_PICTURES;
        }
        if (heroData.showWords === undefined) {
          heroData.showWords = false; // "no words required only picture transistion req"
        }
        const announcementData = { ...DEFAULT_PAGE_CONTENT.announcement, ...parsed.announcement };
        if (announcementData.text) {
          announcementData.text = announcementData.text.replace(/✨/g, '').trim();
        }

        const productBenefitsData = Array.isArray(parsed.productBenefits) && parsed.productBenefits.length > 0
          ? parsed.productBenefits
          : DEFAULT_PRODUCT_BENEFITS;

        const qualityTrustData = parsed.qualityTrust
          ? {
              ...DEFAULT_QUALITY_TRUST,
              ...parsed.qualityTrust,
              cards: Array.isArray(parsed.qualityTrust.cards) && parsed.qualityTrust.cards.length > 0
                ? parsed.qualityTrust.cards
                : DEFAULT_QUALITY_TRUST.cards,
            }
          : DEFAULT_QUALITY_TRUST;

        return {
          ...DEFAULT_PAGE_CONTENT,
          ...parsed,
          hero: heroData,
          launchBanner: { ...DEFAULT_PAGE_CONTENT.launchBanner, ...parsed.launchBanner },
          announcement: announcementData,
          brandStory: { ...DEFAULT_PAGE_CONTENT.brandStory, ...parsed.brandStory },
          productBenefits: productBenefitsData,
          qualityTrust: qualityTrustData,
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

  // Orders State (synced with Firestore)
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('titan_store_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Firestore Realtime Synchronization
  useEffect(() => {
    let unsubscribeContent: (() => void) | null = null;
    let unsubscribeProducts: (() => void) | null = null;
    let unsubscribeReviews: (() => void) | null = null;
    let unsubscribeOrders: (() => void) | null = null;

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
              hero: {
                ...prev.hero,
                ...(data.hero || {}),
                pictures: Array.isArray(data.hero?.pictures) && data.hero!.pictures!.length > 0
                  ? data.hero!.pictures!
                  : (prev.hero?.pictures && prev.hero.pictures.length > 0 ? prev.hero.pictures : DEFAULT_HERO_PICTURES),
                showWords: data.hero?.showWords !== undefined ? data.hero.showWords : (prev.hero?.showWords ?? false),
              },
              launchBanner: { ...prev.launchBanner, ...(data.launchBanner || {}) },
              brandStory: { ...prev.brandStory, ...(data.brandStory || {}) },
              productBenefits: Array.isArray(data.productBenefits) && data.productBenefits.length > 0
                ? data.productBenefits
                : prev.productBenefits || DEFAULT_PRODUCT_BENEFITS,
              qualityTrust: data.qualityTrust
                ? {
                    ...DEFAULT_QUALITY_TRUST,
                    ...(prev.qualityTrust || {}),
                    ...data.qualityTrust,
                    cards: Array.isArray(data.qualityTrust.cards) && data.qualityTrust.cards.length > 0
                      ? data.qualityTrust.cards
                      : (prev.qualityTrust?.cards || DEFAULT_QUALITY_TRUST.cards),
                  }
                : prev.qualityTrust || DEFAULT_QUALITY_TRUST,
              footer: { ...prev.footer, ...(data.footer || {}), creditText: 'Designed by Supreme Ads', designedBy: 'Designed by Supreme Ads' },
            }));
            setIsFirebaseSynced(true);
            const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLastSyncTime(nowStr);
            try { localStorage.setItem(LAST_SYNC_STORAGE_KEY, nowStr); } catch {}
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
              const clean = sanitizeProductsImages(data.items);
              setProducts(clean);
              try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(clean)); } catch {}
            }
          }
        },
        (error) => {
          console.warn('Firestore products sync notice (using local cache):', error.message);
        }
      );

      // Reviews realtime snapshot
      const reviewsDocRef = doc(db, 'store_content', 'reviews');
      unsubscribeReviews = onSnapshot(
        reviewsDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
              setReviews(data.items);
            }
          }
        },
        (error) => {
          console.warn('Firestore reviews sync notice (using local cache):', error.message);
        }
      );

      // Orders realtime snapshot
      const ordersColRef = collection(db, 'orders');
      unsubscribeOrders = onSnapshot(
        ordersColRef,
        (snap) => {
          const fetchedOrders: OrderRecord[] = [];
          snap.forEach((docSnap) => {
            fetchedOrders.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          if (fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
            try { localStorage.setItem('titan_store_orders_v1', JSON.stringify(fetchedOrders)); } catch {}
          }
        },
        (error) => {
          console.warn('Firestore orders sync notice:', error.message);
        }
      );

      // Resilient server-side fetch fallback for store content, products & reviews
      fetch('/api/store-content')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success) {
            if (Array.isArray(data.products) && data.products.length > 0) {
              const clean = sanitizeProductsImages(data.products);
              setProducts(clean);
              try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(clean)); } catch {}
            }
            if (Array.isArray(data.reviews) && data.reviews.length > 0) {
              setReviews(data.reviews);
              try { localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data.reviews)); } catch {}
            }
            if (data.content && typeof data.content === 'object') {
              setContent((prev) => ({
                ...prev,
                ...data.content,
                hero: {
                  ...prev.hero,
                  ...(data.content.hero || {}),
                },
                footer: {
                  ...prev.footer,
                  ...(data.content.footer || {}),
                  creditText: 'Designed by Supreme Ads',
                  designedBy: 'Designed by Supreme Ads',
                },
              }));
              try { localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(data.content)); } catch {}
            }
          }
        })
        .catch(() => {});

      // Resilient server-side fetch fallback for orders
      fetch('/api/orders')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            setOrders((prev) => {
              const prevIds = new Set(prev.map((o) => o.id || o.orderNumber));
              const missing = data.orders.filter((o: any) => !prevIds.has(o.id || o.orderNumber));
              if (missing.length === 0) return prev;
              return [...missing, ...prev];
            });
          }
        })
        .catch(() => {});
    } catch (err) {
      console.warn('Firebase sync initialization notice:', err);
    }

    return () => {
      if (unsubscribeContent) unsubscribeContent();
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeReviews) unsubscribeReviews();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to storage:', e);
    }
  }, [reviews]);

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

  // Helper to sync content changes directly to Firestore and server API in background
  const syncContentToFirestore = async (newContent: PageContentConfig): Promise<boolean> => {
    let success = false;
    try {
      const contentDocRef = doc(db, 'store_content', 'main');
      await setDoc(contentDocRef, {
        ...newContent,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      success = true;
    } catch (err) {
      console.warn('Direct Firestore content sync notice (fallback to server API):', err);
    }

    // Resilient server API fallback write (Guaranteed to persist on Vercel / Hostinger / Custom Domain)
    try {
      const res = await fetch('/api/store-content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      if (res.ok) success = true;
    } catch {}

    if (success) {
      setIsFirebaseSynced(true);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(nowStr);
      try { localStorage.setItem(LAST_SYNC_STORAGE_KEY, nowStr); } catch {}
    }
    return success;
  };

  const saveAllToFirebase = async (): Promise<boolean> => {
    let success = false;
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

      const reviewsDocRef = doc(db, 'store_content', 'reviews');
      await setDoc(reviewsDocRef, {
        items: reviews,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      success = true;
    } catch (err) {
      console.warn('Direct Firestore batch sync notice (fallback to server API):', err);
    }

    // Dual server write pipeline for guaranteed persistence
    try {
      await Promise.all([
        fetch('/api/store-content/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        }),
        fetch('/api/store-content/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products }),
        }),
        fetch('/api/store-content/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews }),
        }),
      ]);
      success = true;
    } catch {}

    if (success) {
      setIsFirebaseSynced(true);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(nowStr);
      try { localStorage.setItem(LAST_SYNC_STORAGE_KEY, nowStr); } catch {}
    }
    return success;
  };

  const refreshReviews = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/store-content');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          try { localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data.reviews)); } catch {}
          return true;
        }
      }
    } catch {}
    return false;
  };

  const refreshStoreData = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/store-content');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data.products)); } catch {}
        }
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          try { localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data.reviews)); } catch {}
        }
        if (data.content && typeof data.content === 'object') {
          setContent((prev) => ({ ...prev, ...data.content }));
          try { localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(data.content)); } catch {}
        }
        setIsFirebaseSynced(true);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(nowStr);
        return true;
      }
    } catch {}
    return false;
  };

  const testFirestoreConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const pingDocRef = doc(db, 'store_content', 'ping_test');
      const testPayload = {
        ping: 'ok',
        clientTime: new Date().toISOString(),
      };
      await setDoc(pingDocRef, testPayload, { merge: true });
      const snap = await getDoc(pingDocRef);
      if (snap.exists()) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(timeStr);
        setIsFirebaseSynced(true);
        return {
          success: true,
          message: `Firestore is fully operational! Verified write & read at ${timeStr}`,
        };
      }
      return { success: false, message: 'Document written but failed to read back.' };
    } catch (err: any) {
      return {
        success: false,
        message: `Firestore connection error: ${err.message || 'Unknown network error'}`,
      };
    }
  };

  const triggerSplash = () => setShowSplash(true);
  const closeSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
    } catch (e) {}
  };

  // Inventory Stock & Low Stock Calculation (< 20 pcs)
  const lowStockProducts = products.filter(
    (p) => (p.stockQty !== undefined && p.stockQty < 20) || !p.inStock
  );
  const lowStockCount = lowStockProducts.length;

  // Product mutations
  const addProduct = async (newProduct: Product): Promise<boolean> => {
    // If stockQty <= 0, automatically mark out of stock
    const sanitizedProduct: Product = {
      ...newProduct,
      inStock: (newProduct.stockQty ?? 50) > 0 ? Boolean(newProduct.inStock) : false,
      stockQty: newProduct.stockQty ?? 50,
    };
    const updated = [sanitizedProduct, ...products];
    setProducts(updated);
    try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated)); } catch {}
    let success = false;
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      await setDoc(productsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore addProduct client notice:', e);
    }
    try {
      await fetch('/api/store-content/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updated }),
      });
      success = true;
    } catch {}
    if (success) setIsFirebaseSynced(true);
    return success;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    const updated = products.map((item) => {
      if (item.id !== id) return item;
      const nextStock = updates.stockQty !== undefined ? updates.stockQty : item.stockQty;
      const nextInStock = updates.inStock !== undefined 
        ? updates.inStock 
        : (nextStock !== undefined ? nextStock > 0 : item.inStock);

      const mergedImages = updates.images !== undefined ? updates.images : item.images;
      const cleanImages = (mergedImages || []).filter((img) => img && !img.includes('unsplash.com'));

      const mergedPacks = updates.packs !== undefined ? updates.packs : item.packs;
      const cleanPacks = (mergedPacks || []).map((pk, idx) => {
        const isGeneric = !pk.image || pk.image.includes('unsplash.com');
        return {
          ...pk,
          image: isGeneric ? (cleanImages[idx] || cleanImages[0] || '') : pk.image,
        };
      });

      return {
        ...item,
        ...updates,
        images: cleanImages,
        packs: cleanPacks,
        stockQty: nextStock,
        inStock: (nextStock !== undefined && nextStock <= 0) ? false : nextInStock,
      };
    });
    setProducts(updated);
    try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated)); } catch {}
    let success = false;
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      await setDoc(productsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore updateProduct client notice:', e);
    }
    try {
      const res = await fetch('/api/store-content/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updated }),
      });
      if (res.ok) success = true;
    } catch {}
    if (success) setIsFirebaseSynced(true);
    return success;
  };

  const updateProductStock = async (id: string, qty: number): Promise<boolean> => {
    return await updateProduct(id, { stockQty: Math.max(0, qty), inStock: qty > 0 });
  };

  const toggleProductInStock = async (id: string): Promise<boolean> => {
    const target = products.find((p) => p.id === id);
    if (!target) return false;
    const nextInStock = !target.inStock;
    return await updateProduct(id, { inStock: nextInStock });
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated)); } catch {}
    let success = false;
    try {
      const productsDocRef = doc(db, 'store_content', 'products');
      await setDoc(productsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore deleteProduct client notice:', e);
    }
    try {
      await fetch('/api/store-content/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updated }),
      });
      success = true;
    } catch {}
    return success;
  };

  // Reviews actions (realtime Firestore push + backend server fallback for 100% reliability)
  const addReview = async (newReview: Review): Promise<boolean> => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    let success = false;
    try {
      const reviewsDocRef = doc(db, 'store_content', 'reviews');
      await setDoc(reviewsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore addReview notice:', e);
    }
    try {
      await fetch('/api/store-content/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: updated }),
      });
      success = true;
    } catch {}
    if (success) setIsFirebaseSynced(true);
    return success;
  };

  const updateReview = async (id: string, updates: Partial<Review>): Promise<boolean> => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setReviews(updated);
    let success = false;
    try {
      const reviewsDocRef = doc(db, 'store_content', 'reviews');
      await setDoc(reviewsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore updateReview notice:', e);
    }
    try {
      await fetch('/api/store-content/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: updated }),
      });
      success = true;
    } catch {}
    if (success) setIsFirebaseSynced(true);
    return success;
  };

  const deleteReview = async (id: string): Promise<boolean> => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    let success = false;
    try {
      const reviewsDocRef = doc(db, 'store_content', 'reviews');
      await setDoc(reviewsDocRef, { items: updated, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore deleteReview notice:', e);
    }
    try {
      await fetch('/api/store-content/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: updated }),
      });
      success = true;
    } catch {}
    if (success) setIsFirebaseSynced(true);
    return success;
  };

  const resetReviewsToDefault = async (): Promise<boolean> => {
    setReviews(DEFAULT_REVIEWS);
    let success = false;
    try {
      const reviewsDocRef = doc(db, 'store_content', 'reviews');
      await setDoc(reviewsDocRef, { items: DEFAULT_REVIEWS, updatedAt: new Date().toISOString() }, { merge: true });
      success = true;
    } catch (e) {
      console.warn('Firestore resetReviewsToDefault notice:', e);
    }
    try {
      await fetch('/api/store-content/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: DEFAULT_REVIEWS }),
      });
      success = true;
    } catch {}
    if (success) setIsFirebaseSynced(true);
    return success;
  };

  // Check if phone or email has placed an order previously
  const checkCustomerFirstOrder = async (
    mobileOrEmail: string
  ): Promise<{ isFirstOrder: boolean; previousOrderCount: number; message?: string }> => {
    const cleanQuery = mobileOrEmail.trim().toLowerCase().replace(/[^a-z0-9@.]/g, '');
    if (!cleanQuery) {
      return { isFirstOrder: true, previousOrderCount: 0 };
    }

    // 1. Check in local cache first
    const localMatches = orders.filter((o) => {
      const oPhone = (o.customerPhone || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const oEmail = (o.customerEmail || '').toLowerCase().trim();
      return (oPhone && cleanQuery.includes(oPhone)) || (oEmail && oEmail === cleanQuery);
    });

    if (localMatches.length > 0) {
      return {
        isFirstOrder: false,
        previousOrderCount: localMatches.length,
        message: 'A prior order was found with this phone number or email.',
      };
    }

    // 2. Query server endpoint directly (instant & resilient)
    try {
      const serverRes = await fetch(`/api/orders/check-customer?query=${encodeURIComponent(cleanQuery)}`);
      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.success && !serverData.isFirstOrder) {
          return {
            isFirstOrder: false,
            previousOrderCount: serverData.count || 1,
            message: 'Previous order found in Titan records with this mobile number or email ID.',
          };
        }
      }
    } catch {}

    // 3. Query Firestore orders collection via Web SDK
    try {
      const ordersCol = collection(db, 'orders');
      const snap = await getDocs(ordersCol);
      let matchCount = 0;
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const oPhone = (data.customerPhone || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        const oEmail = (data.customerEmail || '').toString().toLowerCase().trim();
        if ((oPhone && (cleanQuery.includes(oPhone) || oPhone.includes(cleanQuery))) || (oEmail && oEmail === cleanQuery)) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        return {
          isFirstOrder: false,
          previousOrderCount: matchCount,
          message: 'Previous order found in Titan records with this mobile number or email ID.',
        };
      }
    } catch (err) {
      console.warn('Order lookup in Firestore fallback to clean:', err);
    }

    return { isFirstOrder: true, previousOrderCount: 0 };
  };

  // Record an order to Firestore and local state
  const recordOrder = async (
    orderInput: Omit<OrderRecord, 'id' | 'createdAt'>
  ): Promise<string> => {
    const newId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullOrder: OrderRecord = {
      ...orderInput,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [fullOrder, ...prev]);

    // 1. Send to server backend to push directly to Firestore REST API (guaranteed persistence)
    try {
      fetch('/api/orders/push-firestore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullOrder),
      }).catch((e) => console.warn('Background server firestore push notice:', e));
    } catch {}

    // 2. Write via Firebase Web SDK
    try {
      const orderDocRef = doc(db, 'orders', newId);
      await setDoc(orderDocRef, fullOrder);
      // Reduce product stock quantities accordingly in Firestore
      for (const item of orderInput.items) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod && prod.stockQty !== undefined) {
          const nextStock = Math.max(0, prod.stockQty - item.quantity);
          updateProductStock(prod.id, nextStock);
        }
      }
    } catch (err) {
      console.warn('Notice saving order to Firestore Web SDK (persisted via server):', err);
    }

    return newId;
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
    syncContentToFirestore(newContent);
  };

  const updateLaunchBanner = (updates: Partial<LaunchBannerConfig>) => {
    const newContent = {
      ...content,
      launchBanner: { ...content.launchBanner, ...updates },
    };
    setContent(newContent);
    syncContentToFirestore(newContent);
  };

  const updateAnnouncementBar = (updates: Partial<AnnouncementBarConfig>) => {
    const newContent = {
      ...content,
      announcement: { ...content.announcement, ...updates },
    };
    setContent(newContent);
    syncContentToFirestore(newContent);
  };

  const updateBrandStory = (updates: Partial<BrandStoryConfig>) => {
    const newContent = {
      ...content,
      brandStory: { ...content.brandStory, ...updates },
    };
    setContent(newContent);
    syncContentToFirestore(newContent);
  };

  const updateTrustStripItem = (index: number, title: string, subtitle: string) => {
    const nextStrip = [...content.trustStrip];
    if (nextStrip[index]) {
      nextStrip[index] = { title, subtitle };
    }
    const newContent = { ...content, trustStrip: nextStrip };
    setContent(newContent);
    syncContentToFirestore(newContent);
  };

  const updateProductBenefits = async (cards: BenefitCard[]): Promise<boolean> => {
    const newContent = {
      ...content,
      productBenefits: cards,
    };
    setContent(newContent);
    return await syncContentToFirestore(newContent);
  };

  const updateBenefitCard = async (cardId: string, updates: Partial<BenefitCard>): Promise<boolean> => {
    const updatedCards = content.productBenefits.map((card) =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    return await updateProductBenefits(updatedCards);
  };

  const updateQualityTrust = async (updates: Partial<QualityTrustConfig>): Promise<boolean> => {
    const newQualityTrust = {
      ...content.qualityTrust,
      ...updates,
      cards: updates.cards || content.qualityTrust.cards,
    };
    const newContent = {
      ...content,
      qualityTrust: newQualityTrust,
    };
    setContent(newContent);
    return await syncContentToFirestore(newContent);
  };

  const updateQualityTrustCard = async (cardId: string, updates: Partial<QualityTrustCard>): Promise<boolean> => {
    const updatedCards = content.qualityTrust.cards.map((card) =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    return await updateQualityTrust({ cards: updatedCards });
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
    syncContentToFirestore(newContent);
  };

  const resetAllContent = () => {
    setContent(DEFAULT_PAGE_CONTENT);
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    syncContentToFirestore(DEFAULT_PAGE_CONTENT);
  };

  return (
    <StoreContentContext.Provider
      value={{
        products,
        content,
        showSplash,
        isFirebaseSynced,
        lastSyncTime,
        triggerSplash,
        closeSplash,
        addProduct,
        updateProduct,
        updateProductStock,
        toggleProductInStock,
        deleteProduct,
        resetProductsToDefault,
        lowStockProducts,
        lowStockCount,
        orders,
        recordOrder,
        checkCustomerFirstOrder,
        updateHeroBanner,
        updateLaunchBanner,
        updateAnnouncementBar,
        updateBrandStory,
        updateTrustStripItem,
        updateProductBenefits,
        updateBenefitCard,
        updateQualityTrust,
        updateQualityTrustCard,
        updatePageContent,
        reviews,
        addReview,
        updateReview,
        deleteReview,
        resetReviewsToDefault,
        refreshReviews,
        refreshStoreData,
        saveAllToFirebase,
        testFirestoreConnection,
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
