import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreContentProvider } from './context/StoreContentContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SearchModal } from './components/SearchModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { SplashIntro } from './components/SplashIntro';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WhyTitanPage } from './pages/WhyTitanPage';
import { ShilajitGuidePage } from './pages/ShilajitGuidePage';
import { WellnessAssessmentPage } from './pages/WellnessAssessmentPage';
import { AboutPage } from './pages/AboutPage';
import { PolicyPage } from './pages/PolicyPage';
import { AdminDeskPage } from './pages/AdminDeskPage';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <StoreContentProvider>
        <CartProvider>
          {/* First time opening splash intro screen */}
          <SplashIntro />

          <div className="min-h-screen bg-[#F7F3E8] text-[#10110F] flex flex-col font-sans selection:bg-[#183D27] selection:text-[#D4B66A]">
            {/* Sticky Header (Hidden on dedicated admin desk for maximum workspace) */}
            {!isAdmin && (
              <Header
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenAdvisor={() => setIsAdvisorOpen(true)}
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
                <Route path="/shipping-policy" element={<PolicyPage />} />
                <Route path="/refund-policy" element={<PolicyPage />} />
                <Route path="/privacy-policy" element={<PolicyPage />} />
                <Route path="/terms-and-conditions" element={<PolicyPage />} />
                <Route path="/disclaimer" element={<PolicyPage />} />
                <Route path="/admin" element={<AdminDeskPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Global Footer (Hidden on dedicated admin desk) */}
            {!isAdmin && <Footer />}

            {/* Slide-over Cart Drawer */}
            <CartDrawer />

            {/* Global Floating WhatsApp Concierge Pill & Back-to-top */}
            {!isAdmin && <FloatingWhatsApp />}

            {/* Global Search Modal */}
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />

            {/* Wellness Advisor Dialog */}
            <AIAssistantModal
              isOpen={isAdvisorOpen}
              onClose={() => setIsAdvisorOpen(false)}
            />
          </div>
        </CartProvider>
      </StoreContentProvider>
    </AuthProvider>
  );
};

export default App;

