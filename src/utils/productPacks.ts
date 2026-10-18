import { Product, ProductPack } from '../types';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85';

export function getProductPacks(product: Product): ProductPack[] {
  const cleanImages = (product.images || []).filter(Boolean);
  const primaryImg = product.image || cleanImages[0] || DEFAULT_FALLBACK_IMAGE;

  // If product already has configured packs (e.g. from Admin Desk or store catalog)
  if (product.packs && product.packs.length > 0) {
    return product.packs.map((p, idx) => {
      let packImg = p.image || '';
      if (typeof packImg === 'string' && packImg.includes('/uploads/')) {
        packImg = packImg.substring(packImg.indexOf('/uploads/'));
      }
      return {
        ...p,
        image: packImg || primaryImg,
      };
    });
  }

  // Pre-configured packs by slug with prices dynamically derived from product.price if modified
  const getPackImg = (idx: number) => {
    return cleanImages[idx] || primaryImg;
  };

  const basePrice = Number(product.price) || 1499;
  const baseMrp = Number(product.mrp) || Math.round(basePrice * 1.35);

  if (product.slug === 'titan-shilajit-resin') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: '20g Glass Jar (40–50 Servings)',
        price: Math.round(basePrice * 0.67),
        mrp: Math.round(baseMrp * 0.75),
        discount: '33% OFF',
        image: getPackImg(0),
        badge: 'STARTER TRIAL',
        savings: 'Save ₹500',
      },
      {
        id: 'popular',
        name: 'Most Popular Pack',
        label: 'Most Popular Pack',
        quantityText: '50g Jar + Pure Brass Spoon (100+ Servings)',
        price: basePrice,
        mrp: baseMrp,
        discount: product.discount || '32% OFF',
        image: getPackImg(1),
        badge: 'MOST POPULAR • BESTSELLER',
        savings: 'Save ₹900',
        isPopular: true,
      },
      {
        id: 'supersaver',
        name: 'Supersaver Pack',
        label: 'Supersaver Pack',
        quantityText: '100g Vault (2 x 50g) + 2 Brass Spoons + Testing Kit',
        price: Math.round(basePrice * 1.75),
        mrp: Math.round(baseMrp * 1.8),
        discount: '34% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER • MAX SAVINGS',
        savings: 'Save ₹1,700',
      },
    ];
  }

  if (product.slug === 'titan-honey-sticks-classic') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: '15 Sticks Box (150g)',
        price: Math.round(basePrice * 0.7),
        mrp: Math.round(baseMrp * 0.75),
        discount: '30% OFF',
        image: getPackImg(0),
        badge: 'STARTER PACK',
        savings: 'Save ₹300',
      },
      {
        id: 'popular',
        name: 'Most Popular Pack',
        label: 'Most Popular Pack',
        quantityText: '30 Sticks Twin Box (300g)',
        price: basePrice,
        mrp: baseMrp,
        discount: product.discount || '28% OFF',
        image: getPackImg(1),
        badge: 'MOST POPULAR',
        savings: 'Save ₹500',
        isPopular: true,
      },
      {
        id: 'supersaver',
        name: 'Supersaver Pack',
        label: 'Supersaver Pack',
        quantityText: '60 Sticks Family Pack (600g)',
        price: Math.round(basePrice * 1.7),
        mrp: Math.round(baseMrp * 1.75),
        discount: '31% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER • 2 MONTHS',
        savings: 'Save ₹1,000',
      },
    ];
  }

  if (product.slug === 'titan-honey-sticks-dark-chocolate') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: '15 Sticks Box (150g)',
        price: Math.round(basePrice * 0.68),
        mrp: Math.round(baseMrp * 0.75),
        discount: '32% OFF',
        image: getPackImg(0),
        badge: 'TRIAL PACK',
        savings: 'Save ₹350',
      },
      {
        id: 'popular',
        name: 'Most Popular Pack',
        label: 'Most Popular Pack',
        quantityText: '30 Sticks Twin Box (300g)',
        price: basePrice,
        mrp: baseMrp,
        discount: product.discount || '30% OFF',
        image: getPackImg(1),
        badge: 'MOST POPULAR',
        savings: 'Save ₹600',
        isPopular: true,
      },
      {
        id: 'supersaver',
        name: 'Supersaver Pack',
        label: 'Supersaver Pack',
        quantityText: '60 Sticks Mega Box (600g)',
        price: Math.round(basePrice * 1.7),
        mrp: Math.round(baseMrp * 1.75),
        discount: '31% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER',
        savings: 'Save ₹1,100',
      },
    ];
  }

  if (product.slug === 'titan-honey-sticks-strawberry') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: '15 Sticks Box (150g)',
        price: Math.round(basePrice * 0.68),
        mrp: Math.round(baseMrp * 0.75),
        discount: '32% OFF',
        image: getPackImg(0),
        badge: 'TRIAL PACK',
        savings: 'Save ₹350',
      },
      {
        id: 'popular',
        name: 'Most Popular Pack',
        label: 'Most Popular Pack',
        quantityText: '30 Sticks Twin Box (300g)',
        price: basePrice,
        mrp: baseMrp,
        discount: product.discount || '30% OFF',
        image: getPackImg(1),
        badge: 'MOST POPULAR',
        savings: 'Save ₹600',
        isPopular: true,
      },
      {
        id: 'supersaver',
        name: 'Supersaver Pack',
        label: 'Supersaver Pack',
        quantityText: '60 Sticks Mega Box (600g)',
        price: Math.round(basePrice * 1.7),
        mrp: Math.round(baseMrp * 1.75),
        discount: '31% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER',
        savings: 'Save ₹1,100',
      },
    ];
  }

  if (product.slug === 'titan-vitality-ritual-box') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: 'Starter Kit: 20g Resin + Brass Spoon',
        price: Math.round(basePrice * 0.68),
        mrp: Math.round(baseMrp * 0.67),
        discount: '25% OFF',
        image: getPackImg(0),
        badge: 'STARTER KIT',
        savings: 'Save ₹500',
      },
      {
        id: 'popular',
        name: 'Most Popular Pack',
        label: 'Most Popular Pack',
        quantityText: 'Signature Box: 20g Resin + Spoon + 10 Honey Sticks',
        price: basePrice,
        mrp: baseMrp,
        discount: product.discount || '27% OFF',
        image: getPackImg(1),
        badge: 'MOST POPULAR • SIGNATURE',
        savings: 'Save ₹800',
        isPopular: true,
      },
      {
        id: 'supersaver',
        name: 'Supersaver Pack',
        label: 'Supersaver Pack',
        quantityText: 'Grand Emperor: 50g Resin + Brass Spoon + 30 Honey Sticks',
        price: Math.round(basePrice * 1.6),
        mrp: Math.round(baseMrp * 1.65),
        discount: '30% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER • LUXURY',
        savings: 'Save ₹1,500',
      },
    ];
  }

  if (product.slug === 'titan-honey-sticks-trio') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: '15 Sticks Sampler (5 Classic + 5 Choco + 5 Berry)',
        price: Math.round(basePrice * 0.5),
        mrp: Math.round(baseMrp * 0.52),
        discount: '28% OFF',
        image: getPackImg(0),
        badge: 'SAMPLER',
        savings: 'Save ₹400',
      },
      {
        id: 'popular',
        name: 'Most Popular Pack',
        label: 'Most Popular Pack',
        quantityText: '30 Sticks Trio (10 of each flavor)',
        price: basePrice,
        mrp: baseMrp,
        discount: product.discount || '26% OFF',
        image: getPackImg(1),
        badge: 'MOST POPULAR',
        savings: 'Save ₹700',
        isPopular: true,
      },
      {
        id: 'supersaver',
        name: 'Supersaver Pack',
        label: 'Supersaver Pack',
        quantityText: '60 Sticks Mega Discovery (20 of each flavor)',
        price: Math.round(basePrice * 1.75),
        mrp: Math.round(baseMrp * 1.85),
        discount: '30% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER • BEST VALUE',
        savings: 'Save ₹1,500',
      },
    ];
  }

  // Generic fallback for any other custom product created by admin
  const trialPrice = Math.round(basePrice * 0.7);
  const trialMrp = Math.round(trialPrice * 1.4);
  const popularPrice = basePrice;
  const popularMrp = baseMrp;
  const supersaverPrice = Math.round(basePrice * 1.75);
  const supersaverMrp = Math.round(supersaverPrice * 1.5);

  return [
    {
      id: 'trial',
      name: 'Trial Pack',
      label: 'Trial Pack',
      quantityText: `${product.size || 'Standard'} (Trial)`,
      price: trialPrice,
      mrp: trialMrp,
      discount: `${Math.round(((trialMrp - trialPrice) / trialMrp) * 100)}% OFF`,
      image: getPackImg(0),
      badge: 'STARTER TRIAL',
      savings: `Save ₹${trialMrp - trialPrice}`,
    },
    {
      id: 'popular',
      name: 'Most Popular Pack',
      label: 'Most Popular Pack',
      quantityText: `${product.size || 'Standard'} (Most Popular)`,
      price: popularPrice,
      mrp: popularMrp,
      discount: product.discount || `${Math.round(((popularMrp - popularPrice) / popularMrp) * 100)}% OFF`,
      image: getPackImg(1),
      badge: 'MOST POPULAR',
      savings: `Save ₹${popularMrp - popularPrice}`,
      isPopular: true,
    },
    {
      id: 'supersaver',
      name: 'Supersaver Pack',
      label: 'Supersaver Pack',
      quantityText: `Dual Value Pack (2x ${product.size || 'Supply'})`,
      price: supersaverPrice,
      mrp: supersaverMrp,
      discount: `${Math.round(((supersaverMrp - supersaverPrice) / supersaverMrp) * 100)}% OFF`,
      image: getPackImg(2),
      badge: 'SUPERSAVER • MAX SAVINGS',
      savings: `Save ₹${supersaverMrp - supersaverPrice}`,
    },
  ];
}

/**
 * Synchronizes all pack prices whenever an admin updates the product's base price or MRP
 */
export function syncPacksToProductPrice(product: Product, newPrice: number, newMrp?: number): ProductPack[] {
  const currentPacks = (product.packs && product.packs.length > 0)
    ? [...product.packs]
    : getProductPacks(product);
  const safeMrp = newMrp || Math.round(newPrice * 1.35);

  return currentPacks.map((pack, idx) => {
    if (pack.isPopular || idx === 1 || currentPacks.length === 1) {
      const discountVal = safeMrp > newPrice ? `${Math.round(((safeMrp - newPrice) / safeMrp) * 100)}% OFF` : (pack.discount || '25% OFF');
      return {
        ...pack,
        price: newPrice,
        mrp: safeMrp,
        discount: discountVal,
        savings: safeMrp > newPrice ? `Save ₹${safeMrp - newPrice}` : pack.savings,
        isPopular: true,
      };
    } else if (idx === 0) {
      const trialPrice = Math.round(newPrice * 0.7);
      const trialMrp = Math.round(safeMrp * 0.75);
      return {
        ...pack,
        price: trialPrice,
        mrp: trialMrp,
        discount: trialMrp > trialPrice ? `${Math.round(((trialMrp - trialPrice) / trialMrp) * 100)}% OFF` : pack.discount,
        savings: trialMrp > trialPrice ? `Save ₹${trialMrp - trialPrice}` : pack.savings,
      };
    } else {
      const superPrice = Math.round(newPrice * 1.75);
      const superMrp = Math.round(safeMrp * 1.8);
      return {
        ...pack,
        price: superPrice,
        mrp: superMrp,
        discount: superMrp > superPrice ? `${Math.round(((superMrp - superPrice) / superMrp) * 100)}% OFF` : pack.discount,
        savings: superMrp > superPrice ? `Save ₹${superMrp - superPrice}` : pack.savings,
      };
    }
  });
}

/**
 * Clean short label for pack button headers (e.g., STARTER, POPULAR, BEST VALUE)
 * Guaranteed to fit inside narrow 3-column buttons without wrapping or colliding.
 */
export function getPackShortBadge(badge?: string, idx: number = 0): string {
  if (!badge) {
    if (idx === 0) return 'STARTER';
    if (idx === 1) return 'POPULAR';
    return 'BEST VALUE';
  }
  const firstPart = badge.split('•')[0].trim();
  if (firstPart.includes('POPULAR')) return 'POPULAR';
  if (firstPart.includes('TRIAL') || firstPart.includes('STARTER') || firstPart.includes('SAMPLER')) return 'STARTER';
  if (firstPart.includes('SUPERSAVER') || firstPart.includes('SAVINGS') || firstPart.includes('VALUE')) return 'BEST VALUE';
  return firstPart.length > 12 ? firstPart.slice(0, 11) : firstPart;
}

/**
 * Clean title for pack button (e.g. Trial Pack, Popular Pack, Value Pack)
 */
export function getPackShortName(pack: ProductPack, idx: number = 0): string {
  if (pack.id === 'trial' || idx === 0) return 'Trial Pack';
  if (pack.id === 'popular' || idx === 1) return 'Popular Pack';
  if (pack.id === 'supersaver' || idx === 2) return 'Value Pack';
  return pack.name.replace(/ Pack$/i, '') + ' Pack';
}

/**
 * Clean compact weight/portion text for pack button (e.g. 20g Jar, 50g + Spoon, 100g Vault)
 */
export function getPackShortQuantity(quantityText: string): string {
  if (!quantityText) return '';
  if (quantityText.includes('20g')) return '20g Jar';
  if (quantityText.includes('50g')) return '50g + Spoon';
  if (quantityText.includes('100g')) return '100g Vault';
  if (quantityText.includes('15 Sticks')) return '15 Sticks';
  if (quantityText.includes('30 Sticks')) return '30 Sticks';
  if (quantityText.includes('60 Sticks')) return '60 Sticks';
  if (quantityText.includes('2x') || quantityText.includes('Dual')) return 'Dual Pack';
  const base = quantityText.split('(')[0].trim();
  return base.length > 16 ? base.slice(0, 15) : base;
}
