import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreContentProvider } from './context/StoreContentContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SearchModal } from './components/SearchModal';
import { SplashIntro } from './components/SplashIntro';
import { trackPageView } from './utils/metaPixel';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WhyTitanPage } from './pages/WhyTitanPage';
import { ShilajitGuidePage } from './pages/ShilajitGuidePage';
import { WellnessAssessmentPage } from './pages/WellnessAssessmentPage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { PolicyPage } from './pages/PolicyPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDeskPage } from './pages/AdminDeskPage';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Scroll to top and track Meta Pixel PageView on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView();
  }, [location.pathname]);

  const isAdmin = location.pathname.startsWith('/supreme-titanadmin');

  return (
    <AuthProvider>
      <StoreContentProvider>
        <CartProvider>
          {/* First time opening splash intro screen */}
          <SplashIntro />

          <div className="min-h-screen bg-[#F7F3E8] text-[#10110F] flex flex-col font-sans selection:bg-[#183D27] selection:text-[#D4B66A]">
            {/* Sticky Header (Hidden on dedicated admin desk for maximum workspace & visual separation) */}
            {!isAdmin && (
              <Header
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}

            {/* Primary Page Content */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/why-titan" element={<WhyTitanPage />} />
                <Route path="/shilajit-guide" element={<ShilajitGuidePage />} />
                <Route path="/wellness-assessment" element={<WellnessAssessmentPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/faqs" element={<FaqPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/billing" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<CheckoutPage />} />
                <Route path="/shipping-policy" element={<PolicyPage />} />
                <Route path="/refund-policy" element={<PolicyPage />} />
                <Route path="/privacy-policy" element={<PolicyPage />} />
                <Route path="/terms-and-conditions" element={<PolicyPage />} />
                <Route path="/disclaimer" element={<PolicyPage />} />
                <Route path="/supreme-titanadmin/*" element={<AdminDeskPage />} />
                <Route path="/supreme-titanadmin" element={<AdminDeskPage />} />
                {/* Obscure and protect admin desk: redirect legacy /admin and /admin-desk to storefront */}
                <Route path="/admin-desk" element={<Navigate to="/" replace />} />
                <Route path="/admin" element={<Navigate to="/" replace />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Global Footer (Hidden on dedicated admin desk) */}
            {!isAdmin && <Footer />}

            {/* Slide-over Cart Drawer */}
            <CartDrawer />

            {/* Global Floating WhatsApp Concierge Pill & Back-to-top (Hidden on admin desk) */}
            {!isAdmin && <FloatingWhatsApp />}

            {/* Global Search Modal */}
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        </CartProvider>
      </StoreContentProvider>
    </AuthProvider>
  );
};

export default App;

