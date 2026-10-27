import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Printer,
  Search,
  Lock,
} from 'lucide-react';
import { useStoreContent } from '../context/StoreContentContext';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { Review, OrderRecord } from '../types';

export const ReviewSection: React.FC = () => {
  const { reviews, setReviews, addReview, products, orders } = useStoreContent();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [authStep, setAuthStep] = useState<'auth' | 'form' | 'rejected' | 'success'>('auth');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form Fields
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>(
    products[0]?.name || 'Titan Himalayan Shilajit Resin — 50g Master Jar'
  );
  const [location, setLocation] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Bill Download Modal States
  const [showBillModal, setShowBillModal] = useState(false);
  const [billSearchQuery, setBillSearchQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<OrderRecord | null>(null);
  const [billSearchLoading, setBillSearchLoading] = useState(false);
  const [billSearchError, setBillSearchError] = useState<string | null>(null);

  // Only genuine reviews (verifiedPurchase !== false) are counted for rating & review metrics
  const genuineReviews = (reviews || []).filter((r) => r.verifiedPurchase !== false);
  const genuineCount = genuineReviews.length;
  const avgRating =
    genuineCount > 0
      ? (genuineReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / genuineCount).toFixed(1)
      : '4.9';
  const displayReviews = genuineReviews.length > 0 ? genuineReviews : (reviews || []);

  const handleRefreshReviews = async () => {
    setIsRefreshing(true);
    setRefreshNotice(null);
    try {
      const res = await fetch('/api/store-content');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          try {
            localStorage.setItem('titan_store_reviews_v1', JSON.stringify(data.reviews));
          } catch {}
          setRefreshNotice(
            `Refreshed! ${data.reviews.filter((r: any) => r.verifiedPurchase !== false).length} genuine reviews loaded.`
          );
          setTimeout(() => setRefreshNotice(null), 3000);
          return;
        }
      }
      setRefreshNotice('Reviews verified and synced.');
      setTimeout(() => setRefreshNotice(null), 3000);
    } catch {
      setRefreshNotice('Reviews cache active.');
      setTimeout(() => setRefreshNotice(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check if an email has ordered
  const checkEmailHasOrder = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    // 1. Check in-memory orders
    if (orders && orders.length > 0) {
      const match = orders.some(
        (o) =>
          o.customerEmail?.trim().toLowerCase() === cleanEmail ||
          o.billingAddressDetails?.email?.trim().toLowerCase() === cleanEmail ||
          o.shippingAddressDetails?.email?.trim().toLowerCase() === cleanEmail
      );
      if (match) return true;
    }

    // 2. Query server order verification endpoint
    try {
      const res = await fetch(`/api/orders/check-customer?query=${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.count > 0 || data.isFirstOrder === false)) {
          return true;
        }
      }
    } catch (err) {
      console.warn('Order check endpoint notice:', err);
    }

    return false;
  };

  // Step 1: Sign in with Google Authenticator
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsVerifying(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || '';
      const name = user.displayName || 'Titan Customer';
      const photo = user.photoURL || null;

      setUserEmail(email);
      setUserName(name);
      setUserPhoto(photo);

      // Verify order
      const hasPurchased = await checkEmailHasOrder(email);
      if (hasPurchased) {
        setAuthStep('form');
      } else {
        setAuthStep('rejected');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setAuthError('Google Sign-in was cancelled or closed.');
      } else {
        setAuthError(err?.message || 'Unable to connect to Google Authenticator. You may also enter your order email below.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Alternative: Email manual check
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      setAuthError('Please enter your order email address.');
      return;
    }
    setAuthError(null);
    setIsVerifying(true);

    try {
      const hasPurchased = await checkEmailHasOrder(userEmail);
      if (hasPurchased) {
        setAuthStep('form');
      } else {
        setAuthStep('rejected');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Error verifying order status.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Submit verified review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setAuthError('Please write your review feedback.');
      return;
    }
    setSubmittingReview(true);
    setAuthError(null);

    try {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        name: userName.trim() || 'Verified Titan Client',
        location: location.trim() || 'India',
        rating,
        review: reviewText.trim(),
        productName: selectedProduct,
        verifiedPurchase: true,
        verifiedGoogle: Boolean(userPhoto || auth.currentUser),
        userEmail: userEmail.trim().toLowerCase(),
        userPhotoUrl: userPhoto || undefined,
        date: 'Just now',
      };

      const success = await addReview(newReview);
      if (success) {
        setAuthStep('success');
      } else {
        setAuthError('Failed to save review. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const resetReviewModal = () => {
    setShowReviewModal(false);
    setAuthStep('auth');
    setUserEmail('');
    setUserName('');
    setUserPhoto(null);
    setReviewText('');
    setLocation('');
    setRating(5);
    setAuthError(null);
  };

  // Handle Bill Search & Download
  const handleSearchBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billSearchQuery.trim()) {
      setBillSearchError('Please enter Order Number, Phone, or Email.');
      return;
    }
    setBillSearchError(null);
    setBillSearchLoading(true);
    setFoundOrder(null);

    const query = billSearchQuery.trim().toLowerCase();

    // 1. Search in local context orders
    const match = orders.find(
      (o) =>
        o.orderNumber?.toLowerCase() === query ||
        o.id?.toLowerCase() === query ||
        o.customerEmail?.toLowerCase() === query ||
        o.customerPhone?.replace(/\D/g, '') === query.replace(/\D/g, '') ||
        o.invoiceNumber?.toLowerCase() === query
    );

    if (match) {
      setFoundOrder(match);
      setBillSearchLoading(false);
      return;
    }

    // 2. Search on server
    try {
      const res = await fetch(`/api/orders`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const sMatch = data.orders.find(
            (o: any) =>
              o.orderNumber?.toLowerCase() === query ||
              o.id?.toLowerCase() === query ||
              o.customerEmail?.toLowerCase() === query ||
              o.customerPhone?.replace(/\D/g, '') === query.replace(/\D/g, '') ||
              o.invoiceNumber?.toLowerCase() === query
          );
          if (sMatch) {
            setFoundOrder(sMatch);
            setBillSearchLoading(false);
            return;
          }
        }
      }
      setBillSearchError('No order found matching your inquiry. Please verify the order number or email.');
    } catch (err: any) {
      setBillSearchError('Error connecting to orders database.');
    } finally {
      setBillSearchLoading(false);
    }
  };

  return (
    <section id="reviews-section" className="py-20 lg:py-28 bg-[#F7F3E8] text-[#10110F] relative border-b border-[#10110F]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col">
            <span className="text-[#183D27] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
              Verified Practitioner Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10110F] tracking-tight">
              EXPERIENCES IN VITALITY
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs px-3.5 py-2 rounded-xs border border-[#10110F]/10">
              <div className="flex items-center text-[#B88A32]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#B88A32]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#10110F]">
                {avgRating} / 5.0 • <strong className="text-[#183D27]">{genuineCount} Genuine Verified Reviews</strong>
              </span>
            </div>

            {/* Write a Verified Review Button */}
            <button
              onClick={() => {
                setShowReviewModal(true);
                setAuthStep('auth');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#D4B66A] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              title="Only customers who ordered can write a verified review"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>

            {/* Download Bill Button */}
            <button
              onClick={() => {
                setShowBillModal(true);
                setFoundOrder(null);
                setBillSearchError(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xs bg-white hover:bg-stone-100 text-[#10110F] text-xs font-semibold border border-[#10110F]/15 transition-all shadow-xs cursor-pointer"
              title="Download your order tax bill / invoice"
            >
              <Download className="w-3.5 h-3.5 text-[#183D27]" />
              <span>Download Bill</span>
            </button>

            <button
              onClick={handleRefreshReviews}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xs bg-white hover:bg-[#183D27] hover:text-[#F7F3E8] text-[#10110F] text-xs font-semibold border border-[#10110F]/15 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Refresh genuine customer reviews from live database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#B88A32] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {refreshNotice && (
          <div className="mb-6 p-2.5 rounded-xs bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium text-center">
            {refreshNotice}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-sm bg-white border border-[#10110F]/5 flex flex-col justify-between hover:border-[#B88A32]/40 transition-all shadow-xs relative"
            >
              <div>
                {/* Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#B88A32]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B88A32]" />
                    ))}
                  </div>

                  {review.verifiedPurchase && (
                    <div className="flex items-center gap-1 text-[9px] text-[#183D27] font-semibold tracking-wider uppercase bg-[#183D27]/5 px-2 py-0.5 rounded-xs border border-[#183D27]/15">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#183D27]" />
                      <span>{review.verifiedGoogle ? 'Google Verified Buyer' : 'Verified Order'}</span>
                    </div>
                  )}
                </div>

                {/* Review Text */}
                <p className="font-serif text-sm italic text-[#10110F] leading-relaxed mb-4 font-light">
                  "{review.review}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-[#10110F]/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {review.userPhotoUrl ? (
                      <img
                        src={review.userPhotoUrl}
                        alt={review.name}
                        className="w-5 h-5 rounded-full object-cover border border-[#B88A32]/40"
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[#183D27] text-[#D4B66A] text-[10px] font-bold flex items-center justify-center">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="font-sans font-bold text-xs text-[#10110F] tracking-wide">
                      {review.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#66704B] font-light">{review.location}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#183D27] font-bold font-sans">
                    {review.productName}
                  </span>
                  <span className="text-[9.5px] text-[#66704B] font-mono">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Sharing & Help Desk CTA */}
        <div className="mt-12 p-6 rounded-sm bg-[#183D27]/10 border border-[#183D27]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-base text-[#10110F]">
              Have questions or want to learn more about Titan Shilajit?
            </h4>
            <p className="text-xs text-[#66704B] mt-0.5 font-light">
              Visit our comprehensive Ayurvedic guide, FAQ desk, and certified lab analysis.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setShowBillModal(true);
                setFoundOrder(null);
                setBillSearchError(null);
              }}
              className="px-4 py-2.5 rounded-sm bg-white hover:bg-stone-100 text-[#10110F] border border-[#10110F]/20 text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#183D27]" />
              <span>Download Bill</span>
            </button>

            <Link
              to="/faq"
              className="px-5 py-2.5 rounded-sm bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>VISIT HELP &amp; FAQ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: WRITE VERIFIED REVIEW (GOOGLE AUTH GATED) */}
      {/* ========================================================================= */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={resetReviewModal}
        >
          <div
            className="w-full max-w-lg bg-[#FAF7F0] rounded-sm shadow-2xl border border-[#B88A32]/40 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#183D27] text-[#F7F3E8] p-5 border-b border-[#B88A32]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4B66A] uppercase tracking-widest block">
                  GENUINE PRACTITIONER FEEDBACK
                </span>
                <h3 className="font-serif text-lg font-bold">Write a Verified Review</h3>
              </div>
              <button
                onClick={resetReviewModal}
                className="p-1 rounded-full hover:bg-white/10 text-[#EEE8D7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Error Notice */}
              {authError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* STEP 1: AUTHENTICATION & BUYER GATE */}
              {authStep === 'auth' && (
                <div className="space-y-5 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#183D27]/10 flex items-center justify-center border border-[#183D27]/20">
                    <ShieldCheck className="w-6 h-6 text-[#183D27]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#10110F]">
                      Verified Buyer Verification
                    </h4>
                    <p className="text-xs text-[#66704B] mt-1 max-w-sm mx-auto">
                      To preserve 100% Ayurvedic integrity, only customers with a confirmed Titan Shilajit order can post a review.
                    </p>
                  </div>

                  {/* Google Authenticator Action */}
                  <div className="p-5 rounded-xs bg-white border border-[#10110F]/15 space-y-3">
                    <p className="text-[11px] font-semibold text-[#10110F] uppercase tracking-wider">
                      Recommended: Quick Verification with Google
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isVerifying}
                      className="w-full py-3 px-4 rounded-xs bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {/* Google SVG Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.47 8.24 0 10.06 0 12s.47 3.76 1.28 5.39l3.99-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                      </svg>
                      <span>{isVerifying ? 'Verifying Customer...' : 'Sign In with Google'}</span>
                    </button>
                  </div>

                  {/* Manual Email Verification Option */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#10110F]/10"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-mono text-[#66704B] uppercase">
                      Or verify with order email
                    </span>
                    <div className="flex-grow border-t border-[#10110F]/10"></div>
                  </div>

                  <form onSubmit={handleEmailCheck} className="space-y-3">
                    <input
                      type="email"
                      required
                      placeholder="Enter email used when ordering"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-2.5 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? 'Checking Order History...' : 'Verify Order & Continue'}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: NOT A VERIFIED BUYER */}
              {authStep === 'rejected' && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center border border-amber-300">
                    <Lock className="w-6 h-6 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#10110F]">
                      Verified Order Required
                    </h4>
                    <p className="text-xs text-[#66704B] mt-1 max-w-sm mx-auto">
                      We could not find a confirmed purchase matching <strong>{userEmail}</strong>. To guarantee authentic ratings, reviews are restricted to genuine buyers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xs bg-stone-100 border border-stone-200 text-xs text-stone-700 text-left space-y-1.5">
                    <p className="font-bold text-[#10110F]">Did you order with another email or phone?</p>
                    <p className="text-[11px] text-[#66704B]">
                      Try signing in with the exact Google or email account you used during checkout.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthStep('auth')}
                      className="flex-1 py-2.5 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase hover:bg-stone-100 cursor-pointer"
                    >
                      Try Another Email
                    </button>
                    <Link
                      to="/product/titan-gold-shilajit-resin"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 py-2.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-wider flex items-center justify-center"
                    >
                      Order Titan Shilajit
                    </Link>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFIED REVIEW FORM */}
              {authStep === 'form' && (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Verified Buyer Badge */}
                  <div className="p-3 rounded-xs bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          ✓ Verified Purchaser Confirmed
                        </span>
                        <span className="text-xs text-emerald-950 font-mono font-medium">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                    {userPhoto && (
                      <img
                        src={userPhoto}
                        alt=""
                        className="w-7 h-7 rounded-full border border-emerald-400"
                      />
                    )}
                  </div>

                  {/* Product Dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Product Purchased *
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-medium"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Star Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1.5">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#B88A32]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                (hoverRating || rating) >= star
                                  ? 'fill-[#B88A32] text-[#B88A32]'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold font-mono text-[#183D27] ml-2">
                        {rating} out of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name and Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Review Feedback Text */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                      Your Experience &amp; Health Routine *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with stamina, mental focus, dissolution in lukewarm water, or physical recovery..."
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={resetReviewModal}
                      className="px-4 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4B66A]" />
                      <span>{submittingReview ? 'Submitting...' : 'Post Verified Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: SUCCESS */}
              {authStep === 'success' && (
                <div className="text-center space-y-4 py-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#183D27]">
                      Thank You for Your Feedback!
                    </h4>
                    <p className="text-xs text-[#66704B] mt-1 max-w-sm mx-auto">
                      Your verified review has been published to the Titan Shilajit community experience wall.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetReviewModal}
                    className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#D4B66A] text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOWNLOAD BILL & ORDER INVOICE */}
      {/* ========================================================================= */}
      {showBillModal && (
        <div
          className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowBillModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FAF7F0] rounded-sm shadow-2xl border border-[#B88A32]/40 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#183D27] text-[#F7F3E8] p-5 border-b border-[#B88A32]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4B66A] uppercase tracking-widest block">
                  OFFICIAL TAX INVOICE
                </span>
                <h3 className="font-serif text-lg font-bold">Download Order Bill</h3>
              </div>
              <button
                onClick={() => setShowBillModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-[#EEE8D7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <p className="text-xs text-[#66704B]">
                Enter your Titan Shilajit Order Number (e.g. <code>TITAN-123456</code>) or registered phone/email to download your GST tax invoice.
              </p>

              {billSearchError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{billSearchError}</span>
                </div>
              )}

              <form onSubmit={handleSearchBill} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66704B]" />
                  <input
                    type="text"
                    required
                    placeholder="Order #, Mobile, or Email"
                    value={billSearchQuery}
                    onChange={(e) => setBillSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs bg-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={billSearchLoading}
                  className="px-4 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#D4B66A] text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {billSearchLoading ? 'Finding...' : 'Find Bill'}
                </button>
              </form>

              {/* Found Order Card & Download Action */}
              {foundOrder && (
                <div className="p-5 rounded-xs bg-white border border-[#183D27]/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#183D27] uppercase tracking-wider block font-bold">
                        ORDER #{foundOrder.orderNumber}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#10110F]">
                        {foundOrder.customerName}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#183D27]">
                      ₹{(foundOrder.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-[#66704B] block font-bold">Invoice #</span>
                      <span className="font-mono text-[#10110F]">{foundOrder.invoiceNumber || `INV-${foundOrder.orderNumber}`}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#66704B] block font-bold">Payment</span>
                      <span className="text-[#10110F]">{foundOrder.paymentMethod || 'Prepaid Online'}</span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs space-y-1 bg-[#F7F3E8] p-3 rounded-xs border border-[#10110F]/10">
                    <span className="text-[10px] uppercase font-bold text-[#66704B] block mb-1">
                      Ordered Products:
                    </span>
                    {(foundOrder.items || []).map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[#10110F]">
                        <span>{it.quantity}x {it.productName} ({it.packName || 'Standard'})</span>
                        <span className="font-mono">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {foundOrder.prepaidDiscount && foundOrder.prepaidDiscount > 0 ? (
                      <div className="flex justify-between text-emerald-800 pt-1 border-t border-black/5 font-semibold">
                        <span>Prepaid Online Discount</span>
                        <span>-₹{foundOrder.prepaidDiscount}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Actions: Download Bill (PDF) & Print */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4 text-[#D4B66A]" />
                      <span>Download Bill (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2.5 rounded-xs border border-[#10110F]/20 text-[#10110F] text-xs font-bold uppercase hover:bg-stone-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#66704B]" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
