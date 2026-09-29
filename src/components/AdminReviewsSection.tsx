import React, { useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Search,
  MessageCircle,
  Award,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Review, Product } from '../types';

interface AdminReviewsSectionProps {
  reviews: Review[];
  products: Product[];
  addReview: (review: Review) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  resetReviewsToDefault: () => Promise<boolean>;
  showToast: (msg: string) => void;
}

export const AdminReviewsSection: React.FC<AdminReviewsSectionProps> = ({
  reviews,
  products,
  addReview,
  deleteReview,
  resetReviewsToDefault,
  showToast,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Review Form State
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || 'titan-resin-20g'
  );
  const [productName, setProductName] = useState<string>(
    products[0]?.name || 'Titan Pure Himalayan Shilajit Resin'
  );
  const [location, setLocation] = useState('New Delhi');
  const [reviewText, setReviewText] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [reviewDate, setReviewDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  });

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) {
      showToast('Please provide both the reviewer name and review text.');
      return;
    }

    setIsSubmitting(true);
    const newRev: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: selectedProductId,
      productName: productName.trim() || 'Titan Pure Himalayan Shilajit',
      name: authorName.trim(),
      location: location.trim() || 'India',
      rating: Number(rating) || 5,
      review: reviewText.trim(),
      verifiedPurchase: Boolean(verifiedPurchase),
      date: reviewDate.trim() || 'Recently',
    };

    const success = await addReview(newRev);
    setIsSubmitting(false);

    if (success) {
      showToast('Review published and pushed live to Firebase & storefront!');
      setAuthorName('');
      setReviewText('');
      setShowAddForm(false);
    } else {
      showToast('Review saved locally.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      const ok = await deleteReview(id);
      if (ok) {
        showToast('Review deleted from Firebase & storefront.');
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all customer reviews to factory defaults?')) {
      const ok = await resetReviewsToDefault();
      if (ok) {
        showToast('Reviews reset to factory defaults and synced to Firebase.');
      }
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.review.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) /
          reviews.length
        ).toFixed(1)
      : '5.0';

  return (
    <div id="admin-reviews-section" className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white p-6 sm:p-8 rounded-xs border-2 border-[#B88A32]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[10px] font-bold uppercase tracking-widest mb-1.5 border border-[#183D27]/20">
            <Award className="w-3 h-3 text-[#B88A32]" />
            <span>CUSTOMER TESTIMONIALS &amp; REVIEWS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F]">
            Customer Review Manager
          </h2>
          <p className="text-xs text-[#66704B] max-w-xl mt-1">
            Add authentic practitioner feedback, ratings, and verified buyer badges. All changes push directly to Firebase Firestore to go live hand-to-hand on the storefront.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-[#F7F3E8] rounded-xs border border-[#10110F]/10 text-center">
            <div className="flex items-center justify-center gap-1 text-[#B88A32]">
              <Star className="w-3.5 h-3.5 fill-[#B88A32]" />
              <span className="font-bold text-sm text-[#10110F]">{averageRating}</span>
            </div>
            <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">
              {reviews.length} Total Reviews
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>{showAddForm ? 'Close Form' : 'Add New Review'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2.5 rounded-xs border border-[#10110F]/20 text-xs font-semibold text-[#10110F] hover:bg-black/5 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset reviews to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#66704B]" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Add Review Drawer / Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateReview}
          className="bg-white p-6 sm:p-8 rounded-xs border-2 border-[#183D27] shadow-lg space-y-5 animate-in fade-in duration-200"
        >
          <div className="border-b border-[#10110F]/10 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B88A32]" />
              <h3 className="font-serif text-lg font-bold text-[#10110F]">
                Add Verified Customer Review
              </h3>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs">
              Direct Live Push
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Reviewer Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Vikramaditya S. or Dr. Amit V."
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
              />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                Rating ({rating} Stars)
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="p-1 rounded-xs hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        starVal <= rating
                          ? 'fill-[#B88A32] text-[#B88A32]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Product Association */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                Product Formulation Reviewed
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-medium cursor-pointer"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
                <option value="custom">Other / Custom Formulation</option>
              </select>
              {selectedProductId === 'custom' && (
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter custom product name"
                  className="w-full mt-2 px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                />
              )}
            </div>

            {/* Review Date */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
                Display Date
              </label>
              <input
                type="text"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                placeholder="e.g. September 29, 2026"
                className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
              />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#10110F] mb-1">
              Customer Feedback / Testimonial *
            </label>
            <textarea
              rows={3}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="e.g. The quality of Titan Shilajit Resin is noticeably superior. It dissolves cleanly in lukewarm water with zero sandy residue..."
              className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
            />
          </div>

          {/* Verified Buyer Checkbox */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedPurchase}
                onChange={(e) => setVerifiedPurchase(e.target.checked)}
                className="rounded-xs text-[#183D27] focus:ring-[#183D27] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#10110F] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#183D27]" />
                <span>Mark as Verified Purchase / Order</span>
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish & Push to Firebase'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-xs border border-[#10110F]/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#10110F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by name, city, product, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xs border border-[#10110F]/15 text-xs text-[#10110F] placeholder:text-[#10110F]/40 focus:outline-none"
          />
        </div>
        <span className="text-xs text-[#66704B] font-mono shrink-0">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </span>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-xs bg-white border border-[#10110F]/10 shadow-xs flex flex-col justify-between hover:border-[#B88A32]/60 transition-all group"
          >
            <div>
              {/* Header with Stars, Date & Actions */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex text-[#B88A32] mb-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B88A32]" />
                    ))}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#10110F]">
                    {rev.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#66704B]">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {rev.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {rev.date}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(rev.id, rev.name)}
                  className="p-1.5 rounded-xs text-red-500 hover:bg-red-50 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Product Badge & Verified Order */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[9.5px] uppercase font-bold text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs truncate max-w-[200px]">
                  {rev.productName}
                </span>
                {rev.verifiedPurchase && (
                  <span className="text-[9.5px] uppercase font-bold text-[#D4B66A] bg-[#10110F] px-1.5 py-0.5 rounded-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="font-serif text-xs italic text-[#10110F]/85 leading-relaxed line-clamp-5">
                "{rev.review}"
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#10110F]/5 text-[10px] text-gray-400 font-mono">
              ID: {rev.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminReviewsSection;
