import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'titan-shilajit-resin',
    name: 'Titan Pure Himalayan Shilajit Resin',
    slug: 'titan-shilajit-resin',
    category: 'resin',
    tagline: '100% Raw, Grade-A Himalayan Shilajit Resin Harvested at 16,000+ Feet',
    price: 1499,
    mrp: 1999,
    discount: '25% OFF',
    size: '20g Glass Jar',
    servings: '40–50 Servings',
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=85'
    ],
    shortDescription: 'Sourced from the pristine high-altitude rocky crevices of the Himalayas. Rich in naturally occurring fulvic acid, minerals, and bioactive compounds for cellular vitality.',
    description: 'Titan Pure Himalayan Shilajit Resin is the pinnacle of ancient natural strength. Hand-harvested from high-altitude rock faces above 16,000 feet in the Himalayan range during peak summer months, our resin undergoes slow sun-drying and gentle traditional purification using pure spring water. It retains maximum natural bio-availability without synthetic preservatives, binders, or artificial additives.',
    origin: 'Kashmir & Ladakh High Himalayan Ranges (16,000+ ft)',
    elevation: '16,000 – 18,000 ft',
    fulvicAcidContent: '> 75% Lab Verified Fulvic Acid',
    ingredients: [
      '100% Pure Himalayan Shilajit (Asphaltum punjabianum) Resin',
      '84+ Naturally Occurring Ionic Trace Minerals',
      'Naturally Occurring Humic Acid & Dibenzopyrones'
    ],
    benefits: [
      {
        title: 'Cellular Energy & Vitality',
        description: 'Supports mitochondrial ATP production and healthy cellular nutrient transport.'
      },
      {
        title: 'Stamina & Physical Endurance',
        description: 'Traditionally revered for assisting active bodies with sustained energy output.'
      },
      {
        title: 'Mental Clarity & Calm Focus',
        description: 'Bioactive fulvic compounds assist cognitive resilience and everyday mental focus.'
      },
      {
        title: 'Nutrient Bio-Absorption',
        description: 'Fulvic acid naturally acts as a micro-transporter, aiding nutrient assimilation in daily diets.'
      }
    ],
    usage: [
      {
        step: 'Step 1: Measure',
        instruction: 'Use the included stainless steel spoon to take a pea-sized portion (approx. 300mg to 500mg).'
      },
      {
        step: 'Step 2: Dissolve',
        instruction: 'Stir into 100ml of lukewarm water, warm milk, green tea, or herbal infusion until fully dissolved.'
      },
      {
        step: 'Step 3: Consume',
        instruction: 'Drink once daily, ideally in the morning on an empty stomach for optimal consistency.'
      }
    ],
    qualityNotes: [
      'NABL Accredited Third-Party Lab Tested for Heavy Metals (Lead, Arsenic, Mercury, Cadmium)',
      'Traditional Ayurvedic Shodhana (Gentle Spring Water Purification)',
      'Packaged in UV-protective, dark amber cosmetic-grade glass jar with airtight seal',
      'Free from maltodextrin, artificial fillers, sugar, preservatives, and GMOs'
    ],
    safetyNotes: 'Store in a cool, dry place away from direct sunlight. Do not exceed the suggested daily serving. Keep out of reach of children.'
  },
  {
    id: 'titan-honey-sticks-classic',
    name: 'Titan Shilajit Honey Sticks — Classic Honey',
    slug: 'titan-honey-sticks-classic',
    category: 'honey-sticks',
    tagline: 'Pure Himalayan Shilajit infused with 100% Raw Wild Himalayan Forest Honey',
    price: 999,
    mrp: 1299,
    discount: '23% OFF',
    size: 'Box of 15 Sticks (10g each)',
    servings: '15 Servings',
    rating: 4.8,
    reviewCount: 215,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
    ],
    shortDescription: 'Convenient single-serve honey sticks blending authentic purified Himalayan Shilajit resin with unprocessed wild forest honey for an earthy, naturally sweet vitality boost on the go.',
    description: 'Designed for modern lifestyles and effortless daily routines, Titan Classic Honey Sticks combine the legendary benefits of high-altitude Himalayan Shilajit with single-origin wild forest honey. No spoon required, no measuring hassle — just tear, squeeze directly, or stir into your morning beverage.',
    origin: 'Himalayan Foothills & High Altitude Reserve',
    elevation: '14,000 – 16,000 ft Shilajit Source',
    fulvicAcidContent: 'Standardized 350mg Purified Shilajit per stick',
    ingredients: [
      'Pure Raw Himalayan Wild Forest Honey (96.5%)',
      'Purified High-Altitude Himalayan Shilajit Resin (3.5% / 350mg)'
    ],
    benefits: [
      {
        title: 'Effortless On-The-Go Vitality',
        description: 'Pre-portioned single-serve stick fits into your pocket, gym bag, or office drawer.'
      },
      {
        title: 'Natural Sustained Energy',
        description: 'Combines the slow-release natural sugars of raw honey with bioactive fulvic minerals.'
      },
      {
        title: 'Rich Earthy Flavor',
        description: 'Smooth, naturally sweetened profile that softens the potent bitter notes of raw Shilajit.'
      }
    ],
    usage: [
      {
        step: 'Step 1: Tear',
        instruction: 'Tear open the top notch of 1 Titan Honey Stick.'
      },
      {
        step: 'Step 2: Consume',
        instruction: 'Squeeze directly into your mouth or mix into warm water, oatmeal, black coffee, or herbal tea.'
      },
      {
        step: 'Step 3: Timing',
        instruction: 'Best taken in the morning or 30 minutes before your workout or high-focus work sessions.'
      }
    ],
    qualityNotes: [
      '100% Raw, unpasteurized and unheated Himalayan honey',
      'No added sucrose, glucose, artificial flavors or corn syrup',
      'Food-grade, BPA-free nitrogen-flushed single-use sachets'
    ],
    safetyNotes: 'Not suitable for infants under 12 months. Store at room temperature.'
  },
  {
    id: 'titan-honey-sticks-dark-chocolate',
    name: 'Titan Shilajit Honey Sticks — Dark Chocolate',
    slug: 'titan-honey-sticks-dark-chocolate',
    category: 'honey-sticks',
    tagline: 'Infused with Organic 70% Raw Cacao & Himalayan Shilajit',
    price: 1099,
    mrp: 1399,
    discount: '21% OFF',
    size: 'Box of 15 Sticks (10g each)',
    servings: '15 Servings',
    rating: 4.9,
    reviewCount: 184,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85'
    ],
    shortDescription: 'Decadent dark raw cacao meets pure Himalayan Shilajit and raw wild honey. A delicious, antioxidant-rich pre-workout and afternoon ritual.',
    description: 'A sophisticated harmony of 70% ceremonial raw cacao, wildflower honey, and purified Himalayan Shilajit. The flavonoids from unroasted cacao complement the mineral density of Shilajit, creating a velvety, rich pick-me-up that elevates both physical vitality and mood.',
    origin: 'Himalayan Forest Honey & Single-Origin Cacao',
    elevation: '15,000+ ft Shilajit Source',
    fulvicAcidContent: 'Standardized 350mg Purified Shilajit per stick',
    ingredients: [
      'Pure Raw Himalayan Honey (88%)',
      'Organic Raw Dark Cacao Powder 70% (8.5%)',
      'Purified Himalayan Shilajit Resin (3.5% / 350mg)'
    ],
    benefits: [
      {
        title: 'Antioxidant & Mood Support',
        description: 'Naturally contains theobromine and polyphenols from raw cacao for clean alertness.'
      },
      {
        title: 'Post-Workout Recovery Snack',
        description: 'Pairs wholesome natural carbohydrates and electrolytes with restorative minerals.'
      },
      {
        title: 'Gourmet Wellness Experience',
        description: 'Velvety dark chocolate taste with warm honey sweetness and subtle mineral depth.'
      }
    ],
    usage: [
      {
        step: 'Step 1: Tear & Enjoy',
        instruction: 'Tear open and consume directly as an afternoon treat or pre-workout fuel.'
      },
      {
        step: 'Step 2: Beverage Pairing',
        instruction: 'Drizzle over warm espresso, almond milk, or protein shakes for an elevated recipe.'
      }
    ],
    qualityNotes: [
      'No refined sugars or dairy ingredients',
      'Non-alkalized raw cacao retaining natural flavanols',
      'Individually sealed for freshness and travel convenience'
    ],
    safetyNotes: 'Contains cocoa. Store in a cool, dark environment.'
  },
  {
    id: 'titan-honey-sticks-strawberry',
    name: 'Titan Shilajit Honey Sticks — Strawberry',
    slug: 'titan-honey-sticks-strawberry',
    category: 'honey-sticks',
    tagline: 'Infused with Wild Himalayan Strawberry Extract & Forest Honey',
    price: 1099,
    mrp: 1399,
    discount: '21% OFF',
    size: 'Box of 15 Sticks (10g each)',
    servings: '15 Servings',
    rating: 4.8,
    reviewCount: 147,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
    ],
    shortDescription: 'Refreshing, tart Himalayan wild strawberry notes fused with sweet wildflower honey and pure Shilajit resin. A bright daily vitality boost.',
    description: 'Crafted for those who crave a bright, fruity twist to their wellness routine. Real cold-pressed wild Himalayan strawberry fruit essence is blended with raw honey and our pure purified Shilajit resin, offering a naturally uplifting taste without artificial flavor drops.',
    origin: 'Himalayan Sub-Alpine Valleys',
    elevation: '15,000+ ft Shilajit Source',
    fulvicAcidContent: 'Standardized 350mg Purified Shilajit per stick',
    ingredients: [
      'Pure Raw Himalayan Forest Honey (91.5%)',
      'Natural Wild Himalayan Strawberry Fruit Essence (5.0%)',
      'Purified Himalayan Shilajit Resin (3.5% / 350mg)'
    ],
    benefits: [
      {
        title: 'Bright & Crisp Palate',
        description: 'A delicate strawberry aroma and balanced natural sweetness.'
      },
      {
        title: 'Daily Refreshment',
        description: 'An enjoyable and gentle way to introduce Shilajit into any daily schedule.'
      },
      {
        title: 'Gentle Vitality & Focus',
        description: 'Supports balanced energy throughout demanding workdays without nervous jitters.'
      }
    ],
    usage: [
      {
        step: 'Step 1: Direct Intake',
        instruction: 'Tear and consume directly, or mix into iced water or fruit smoothies.'
      },
      {
        step: 'Step 2: Yogurt & Breakfast Bowl',
        instruction: 'Drizzle over Greek yogurt, chia pudding, or fresh seasonal fruits.'
      }
    ],
    qualityNotes: [
      '100% Real fruit essence, no synthetic red food colorants',
      'Micro-filtered for smooth consistency',
      'Third-party tested for purity and microbial safety'
    ],
    safetyNotes: 'Store below 30°C in a dry location.'
  },
  {
    id: 'titan-vitality-ritual-box',
    name: 'The Titan Vitality Ritual Box',
    slug: 'titan-vitality-ritual-box',
    category: 'bundles',
    tagline: 'The Ultimate Himalayan Wellness Set: Resin 20g + Spoon + Classic Honey Sticks (10 Pack)',
    price: 2199,
    mrp: 2999,
    discount: '27% OFF',
    size: 'Complete Ritual Gift Box',
    servings: '60+ Servings Total',
    rating: 5.0,
    reviewCount: 96,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85'
    ],
    shortDescription: 'Our flagship ritual kit featuring the 20g Pure Resin Jar, custom engraved matte-black stainless measuring spoon, and a 10-stick pack of Classic Honey Sticks for travel.',
    description: 'The definitive Titan Shilajit experience. Designed for those committed to a high-standard morning routine at home and on the move. Includes our lab-certified Grade-A Himalayan Resin, our precision stainless steel dosing spoon, and travel-ready Classic Honey Sticks, presented in a luxury matte black and gold rigid gift box.',
    origin: 'Himalayan Ranges (16,000+ ft)',
    elevation: '16,000+ ft',
    fulvicAcidContent: '> 75% Lab Verified Fulvic Acid',
    ingredients: [
      'Titan Pure Himalayan Shilajit Resin (20g)',
      'Titan Shilajit Classic Honey Sticks (10 Sticks x 10g)',
      '1x Precision Stainless Steel Measuring Spoon'
    ],
    benefits: [
      {
        title: 'Complete Dual Protocol',
        description: 'Use the pure resin for morning home tea rituals, and honey sticks for work or travel.'
      },
      {
        title: 'Precision Dosing Spoon',
        description: 'Guarantees the exact 300–500mg daily serving every single morning.'
      },
      {
        title: 'Luxury Gift Ready',
        description: 'Housed in an embossed matte dark charcoal gift chest with gold foil detailing.'
      }
    ],
    usage: [
      {
        step: 'Home Routine',
        instruction: 'Use the stainless spoon to dissolve a pea-sized portion of resin in warm water each morning.'
      },
      {
        step: 'Travel Routine',
        instruction: 'Take 1 honey stick with you on active days or workouts when away from home.'
      }
    ],
    qualityNotes: [
      'Comprehensive Batch Lab Analysis Certificate included in the box',
      'Custom gold-accented precision dosing instrument',
      'Strict quality seal on all components'
    ],
    safetyNotes: 'Store in a cool, dry place. Refer to individual product instructions.'
  },
  {
    id: 'titan-honey-sticks-trio',
    name: 'Titan Honey Sticks Discovery Trio',
    slug: 'titan-honey-sticks-trio',
    category: 'bundles',
    tagline: '30 Sticks Variety: 10 Classic + 10 Dark Chocolate + 10 Strawberry',
    price: 1999,
    mrp: 2699,
    discount: '26% OFF',
    size: 'Bundle of 3 Boxes (30 Sticks Total)',
    servings: '30 Servings',
    rating: 4.9,
    reviewCount: 112,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=85'
    ],
    shortDescription: 'Explore all three flavor profiles of Titan Shilajit Honey Sticks in one complete wellness pack. Pure Wild Honey, 70% Raw Dark Chocolate, and Wild Strawberry.',
    description: 'The perfect way to discover your favorite daily Shilajit stick. Enjoy the traditional simplicity of Classic Honey, the rich antioxidant indulgence of Dark Chocolate, and the crisp refreshing berry notes of Wild Strawberry.',
    origin: 'Himalayan Range',
    elevation: '15,000+ ft',
    fulvicAcidContent: 'Standardized 350mg Purified Shilajit per stick',
    ingredients: [
      '1x Titan Honey Sticks Classic Honey (10 sticks)',
      '1x Titan Honey Sticks Dark Chocolate (10 sticks)',
      '1x Titan Honey Sticks Strawberry (10 sticks)'
    ],
    benefits: [
      {
        title: 'Full Flavor Spectrum',
        description: 'Switch between Classic, Dark Cacao, and Strawberry based on mood and time of day.'
      },
      {
        title: '30-Day Complete Supply',
        description: 'One full month of effortless daily vitality.'
      },
      {
        title: 'Greatest Value Pack',
        description: 'Save 26% compared to purchasing individual boxes separately.'
      }
    ],
    usage: [
      {
        step: 'Morning',
        instruction: 'Try Classic Honey with your morning green tea.'
      },
      {
        step: 'Afternoon / Gym',
        instruction: 'Enjoy Dark Chocolate 30 mins before workout or Strawberry with cold water.'
      }
    ],
    qualityNotes: [
      'All 3 varieties formulated with 100% natural, unadulterated ingredients',
      'Third-party tested batch quality guarantee'
    ],
    safetyNotes: 'Store in cool ambient conditions.'
  }
];
