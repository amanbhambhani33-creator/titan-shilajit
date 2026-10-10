import { Product, ProductPack } from '../types';

export function getProductPacks(product: Product): ProductPack[] {
  const cleanImages = (product.images || []).filter((img) => img && !img.includes('unsplash.com'));
  const primaryImg = cleanImages[0] || '';

  // If product already has configured packs (e.g. from Admin Desk)
  if (product.packs && product.packs.length > 0) {
    return product.packs.map((p) => {
      // If pack image is empty or an old generic unsplash placeholder or mismatched resin photo, automatically use primaryImg
      const isGeneric = !p.image || p.image.includes('unsplash.com') || (product.slug === 'titan-honey-sticks-strawberry' && p.image.includes('shilajit-resin'));
      return {
        ...p,
        image: isGeneric ? primaryImg : (p.image || primaryImg),
      };
    });
  }

  // Pre-configured packs by slug, strictly using the product's own images (user uploaded / pasted)
  const getPackImg = (idx: number) => {
    return primaryImg;
  };

  if (product.slug === 'titan-shilajit-resin') {
    return [
      {
        id: 'trial',
        name: 'Trial Pack',
        label: 'Trial Pack',
        quantityText: '20g Glass Jar (40–50 Servings)',
        price: 999,
        mrp: 1499,
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
        price: 1899,
        mrp: 2799,
        discount: '32% OFF',
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
        price: 3299,
        mrp: 4999,
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
        price: 699,
        mrp: 999,
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
        price: 1299,
        mrp: 1799,
        discount: '28% OFF',
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
        price: 2199,
        mrp: 3199,
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
        price: 749,
        mrp: 1099,
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
        price: 1399,
        mrp: 1999,
        discount: '30% OFF',
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
        price: 2399,
        mrp: 3499,
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
        price: 749,
        mrp: 1099,
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
        price: 1399,
        mrp: 1999,
        discount: '30% OFF',
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
        price: 2399,
        mrp: 3499,
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
        price: 1499,
        mrp: 1999,
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
        price: 2199,
        mrp: 2999,
        discount: '27% OFF',
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
        price: 3499,
        mrp: 4999,
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
        price: 999,
        mrp: 1399,
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
        price: 1999,
        mrp: 2699,
        discount: '26% OFF',
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
        price: 3499,
        mrp: 4999,
        discount: '30% OFF',
        image: getPackImg(2),
        badge: 'SUPERSAVER • BEST VALUE',
        savings: 'Save ₹1,500',
      },
    ];
  }

  // Generic fallback for any other custom product created by admin
  const basePrice = product.price || 1299;
  const trialPrice = Math.round(basePrice * 0.7);
  const trialMrp = Math.round(trialPrice * 1.4);
  const popularPrice = basePrice;
  const popularMrp = product.mrp || Math.round(popularPrice * 1.35);
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
