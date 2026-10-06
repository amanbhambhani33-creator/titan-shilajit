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
  updateReview?: (id: string, updates: Partial<Review>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  resetReviewsToDefault: () => Promise<boolean>;
  refreshReviews?: () => Promise<boolean>;
  showToast: (msg: string) => void;
}

export const AdminReviewsSection: React.FC<AdminReviewsSectionProps> = ({
  reviews,
  products,
  addReview,
  updateReview,
  deleteReview,
  resetReviewsToDefault,
  refreshReviews,
  showToast,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const genuineReviews = reviews.filter((r) => r.verifiedPurchase !== false);
  const genuineCount = genuineReviews.length;
  const genuineRating =
    genuineCount > 0
      ? (
          genuineReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) /
          genuineCount
        ).toFixed(1)
      : '5.0';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshReviews) {
      await refreshReviews();
    }
    setIsRefreshing(false);
    showToast('Reviews refreshed! Only genuine verified reviews are counted on the storefront.');
  };

  return (
    <div id="admin-reviews-section" className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white p-6 sm:p-8 rounded-xs border-2 border-[#B88A32]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[10px] font-bold uppercase tracking-widest mb-1.5 border border-[#183D27]/20">
            <Award className="w-3 h-3 text-[#B88A32]" />
            <span>GENUINE TESTIMONIALS &amp; REVIEWS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F]">
            Customer Review Manager
          </h2>
          <p className="text-xs text-[#66704B] max-w-xl mt-1">
            Manage genuine practitioner feedback and verified buyer status. Storefront rating and counter dynamically count <strong>only genuinely verified reviews</strong>.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-[#183D27]/10 rounded-xs border border-[#183D27]/20 text-center">
            <div className="flex items-center justify-center gap-1 text-[#B88A32]">
              <Star className="w-3.5 h-3.5 fill-[#B88A32]" />
              <span className="font-bold text-sm text-[#183D27]">{genuineRating}</span>
            </div>
            <span className="text-[10px] text-[#183D27] uppercase font-bold tracking-wider">
              {genuineCount} Genuine Verified
            </span>
          </div>

          <div className="px-3.5 py-2 bg-[#F7F3E8] rounded-xs border border-[#10110F]/10 text-center">
            <span className="font-mono font-bold text-sm text-[#10110F]">{reviews.length}</span>
            <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider block">
              Total Recorded
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Refresh customer reviews from Firestore & server database"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Reviews'}</span>
          </button>

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
                <span className="text-[9.5px] uppercase font-bold text-[#183D27] bg-[#183D27]/10 px-2 py-0.5 rounded-xs truncate max-w-[180px]">
                  {rev.productName}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    if (updateReview) {
                      const nextVal = rev.verifiedPurchase === false ? true : false;
                      await updateReview(rev.id, { verifiedPurchase: nextVal });
                      showToast(nextVal ? `Review by "${rev.name}" marked as Genuine Verified!` : `Review by "${rev.name}" marked as Unverified.`);
                    }
                  }}
                  className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 transition-all cursor-pointer ${
                    rev.verifiedPurchase !== false
                      ? 'bg-[#183D27] text-[#D4B66A] border border-[#B88A32]/40'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                  }`}
                  title="Click to toggle genuine verified status"
                >
                  <ShieldCheck className={`w-3 h-3 ${rev.verifiedPurchase !== false ? 'text-[#25D366]' : 'text-gray-400'}`} />
                  <span>{rev.verifiedPurchase !== false ? '✓ Genuine' : 'Unverified'}</span>
                </button>
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
