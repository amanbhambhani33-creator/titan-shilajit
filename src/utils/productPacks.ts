import { Product, ProductPack } from '../types';

export function getProductPacks(product: Product): [ProductPack, ProductPack, ProductPack] {
  if (product.packs && product.packs.length === 3) {
    return product.packs as [ProductPack, ProductPack, ProductPack];
  }

  // Pre-configured packs by slug
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
        image: product.images[0] || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[1] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[2] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[1] || 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[2] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[0] || 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[1] || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[2] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[0] || 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[1] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[2] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[0] || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[1] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[2] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[0] || 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[1] || 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=85',
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
        image: product.images[2] || 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=85',
        badge: 'SUPERSAVER • BEST VALUE',
        savings: 'Save ₹1,500',
      },
    ];
  }

  // Generic fallback for any other custom product
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
      image: product.images[0] || '',
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
      image: product.images[1] || product.images[0] || '',
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
      image: product.images[2] || product.images[0] || '',
      badge: 'SUPERSAVER • MAX SAVINGS',
      savings: `Save ₹${supersaverMrp - supersaverPrice}`,
    },
  ];
}
