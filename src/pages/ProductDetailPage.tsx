import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Check,
  Star,
  Mountain,
  Droplet,
  FlaskConical,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { REVIEWS } from '../data/reviews';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useStoreContent();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'how-to-use' | 'lab-testing' | 'reviews'>('overview');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-20 bg-[#F7F3E8] text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-[#10110F]">Product Not Found</h2>
        <p className="text-sm text-[#66704B] mt-2 mb-6">The requested Titan formulation does not exist.</p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const whatsappUrl = getProductWhatsAppUrl(product, quantity);
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);

  return (
    <div id="product-detail-page" className="min-h-screen pt-28 pb-24 bg-[#F7F3E8] text-[#10110F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#66704B] font-sans mb-8">
          <Link to="/" className="hover:text-[#10110F]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#10110F]">Shop</Link>
          <span>/</span>
          <span className="text-[#10110F] font-semibold">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
          {/* Left Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-[#10110F] border border-[#10110F]/10 shadow-lg">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-xs border border-[#B88A32]/40 shadow-sm">
                  {product.discount}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-xs overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#B88A32] shadow-sm scale-105'
                      : 'border-black/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Buy Box (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#183D27] bg-[#183D27]/10 px-3 py-1 rounded-xs">
                  {product.category.toUpperCase()} • {product.size}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-[#B88A32]">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating) ? 'fill-[#B88A32]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#10110F]">{product.rating}</span>
                  <span className="text-[#66704B]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] leading-tight mb-2">
                {product.name}
              </h1>

              <p className="font-sans text-sm text-[#66704B] leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              {/* Price Banner */}
              <div className="p-4 rounded-xs bg-[#EEE8D7]/80 border border-[#10110F]/10 flex items-baseline justify-between mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-[#10110F]">
                    ₹{product.price}
                  </span>
                  {product.mrp && (
                    <span className="text-sm text-gray-500 line-through">
                      MRP ₹{product.mrp}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
                    Taxes Included
                  </span>
                </div>
                <span className="text-xs text-[#66704B] font-semibold uppercase">
                  {product.servings}
                </span>
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-[#10110F]">
                <div className="flex items-center gap-2 p-2.5 rounded-xs bg-white border border-[#10110F]/10">
                  <Mountain className="w-4 h-4 text-[#B88A32] shrink-0" />
                  <span>Harvested at {product.elevation}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xs bg-white border border-[#10110F]/10">
                  <FlaskConical className="w-4 h-4 text-[#183D27] shrink-0" />
                  <span>{product.fulvicAcidContent}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xs bg-white border border-[#10110F]/10">
                  <Droplet className="w-4 h-4 text-[#183D27] shrink-0" />
                  <span>Traditional Sun Purification</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xs bg-white border border-[#10110F]/10">
                  <ShieldCheck className="w-4 h-4 text-[#B88A32] shrink-0" />
                  <span>NABL Heavy Metal Certified</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#10110F]">
                  Select Quantity:
                </span>
                <div className="flex items-center border border-[#10110F]/20 rounded-xs bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-sm hover:bg-[#EEE8D7] text-[#10110F]"
                  >
                    -
                  </button>
                  <span className="px-5 text-sm font-bold text-[#10110F]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-sm hover:bg-[#EEE8D7] text-[#10110F]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#66704B]">
                  Total: <strong className="text-[#10110F]">₹{product.price * quantity}</strong>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              {/* Big Primary WhatsApp Button */}
              <a
                id="product-detail-buy-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 text-[#10110F]" />
                <span>ORDER ON WHATSAPP (₹{product.price * quantity})</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="py-3.5 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4B66A]" />
                  <span>ADD TO CART</span>
                </button>

                <Link
                  to="/wellness-assessment"
                  className="py-3.5 rounded-xs border border-[#183D27] text-[#183D27] hover:bg-[#183D27] hover:text-[#F7F3E8] font-semibold text-xs uppercase tracking-wider text-center transition-colors"
                >
                  WELLNESS ASSESSMENT
                </Link>
              </div>

              <div className="mt-2 text-center text-[11px] text-[#66704B]">
                Complimentary express shipping across India • Cash on delivery available via WhatsApp concierge
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information */}
        <div className="bg-white rounded-sm border border-[#10110F]/10 p-6 sm:p-10 mb-16 shadow-xs">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-[#10110F]/10 gap-6 sm:gap-10 mb-8">
            {[
              { id: 'overview', label: 'Overview & Profile' },
              { id: 'how-to-use', label: 'How to Consume & Routine' },
              { id: 'lab-testing', label: 'Himalayan Lab Verification' },
              { id: 'reviews', label: `Verified Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 font-serif text-base sm:text-lg font-bold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-[#183D27] border-b-2 border-[#183D27]'
                    : 'text-[#66704B] hover:text-[#10110F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-sm text-[#10110F]/85 font-sans leading-relaxed">
              <p>{product.description}</p>

              <div>
                <h4 className="font-serif text-lg font-bold text-[#10110F] mb-3">Key Bioactive Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                      <Check className="w-4 h-4 text-[#183D27] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#10110F]">
                        {typeof b === 'string' ? b : `${(b as any).title}: ${(b as any).description}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 text-xs text-[#66704B] italic">
                * Note: Titan Shilajit is a dietary botanical formulation. Statements are based on traditional Ayurvedic texts and client-approved documentation. Individual results may vary.
              </div>
            </div>
          )}

          {/* Tab Content: How to Use */}
          {activeTab === 'how-to-use' && (
            <div className="space-y-6 text-sm text-[#10110F]/85 font-sans leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h5 className="font-serif font-bold text-sm text-[#10110F]">Measure Serving</h5>
                  <p className="text-xs text-[#66704B]">
                    {product.slug.includes('resin')
                      ? 'Use the included stainless spoon to measure a pea-sized portion (300mg to 500mg).'
                      : 'Take 1 single-origin stick directly or stir into warm beverage.'}
                  </p>
                </div>

                <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h5 className="font-serif font-bold text-sm text-[#10110F]">Dissolve in Liquid</h5>
                  <p className="text-xs text-[#66704B]">
                    Dissolve completely in lukewarm water, green tea, or warm milk. Stir for 60 seconds until liquid turns golden-amber.
                  </p>
                </div>

                <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h5 className="font-serif font-bold text-sm text-[#10110F]">Morning Consistency</h5>
                  <p className="text-xs text-[#66704B]">
                    Consume first thing in the morning on an empty stomach. Continue for 60–90 consecutive days for natural metabolic adaptation.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xs bg-[#183D27]/10 border border-[#183D27]/20 flex items-start gap-3 text-xs text-[#183D27]">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Recommended Schedule:</strong> Maintain daily morning intake for 2 to 3 months. If taking other medications, maintain a 2-hour interval and consult your physician.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content: Lab Testing */}
          {activeTab === 'lab-testing' && (
            <div className="space-y-6 text-sm text-[#10110F]/85 font-sans leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                  <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Fulvic Acid</span>
                  <div className="font-serif text-2xl font-bold text-[#183D27] mt-1">&gt; 75% Purity</div>
                  <p className="text-[11px] text-[#66704B] mt-1">High bioactive transport capacity</p>
                </div>

                <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                  <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Heavy Metals</span>
                  <div className="font-serif text-2xl font-bold text-[#183D27] mt-1">Pass (ND)</div>
                  <p className="text-[11px] text-[#66704B] mt-1">Lead, Cadmium, Arsenic, Mercury tested</p>
                </div>

                <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                  <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Microbial Purity</span>
                  <div className="font-serif text-2xl font-bold text-[#183D27] mt-1">Zero Pathogens</div>
                  <p className="text-[11px] text-[#66704B] mt-1">Sterilized through traditional sunlight</p>
                </div>

                <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                  <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Trace Minerals</span>
                  <div className="font-serif text-2xl font-bold text-[#183D27] mt-1">84+ Ionic</div>
                  <p className="text-[11px] text-[#66704B] mt-1">Naturally occurring electrolyte complex</p>
                </div>
              </div>

              <p className="text-xs text-[#66704B]">
                Batch test certificates (COA) are verified through independent NABL-accredited testing laboratories in India. Digital test certificates for your batch can also be requested via our WhatsApp concierge.
              </p>
            </div>
          )}

          {/* Tab Content: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {productReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-[#B88A32]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#B88A32]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#183D27] font-bold uppercase">
                          Verified Order
                        </span>
                      </div>
                      <p className="font-serif text-sm italic text-[#10110F] mb-3">
                        "{rev.review}"
                      </p>
                      <div className="text-xs font-semibold text-[#10110F]">{rev.name} • <span className="text-[#66704B] font-normal">{rev.location}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-[#66704B]">
                  Be among the first to review this Titan formulation. Share your routine on WhatsApp.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#10110F]">
              COMPLEMENT YOUR TITAN RITUAL
            </h3>
            <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-[#183D27] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
