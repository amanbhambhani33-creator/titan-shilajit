import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, MessageCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_CONTACT } from '../data/content';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAdvisor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAdvisor }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Why Titan', path: '/why-titan' },
    { name: 'Shilajit Guide', path: '/shilajit-guide' },
    { name: 'Wellness Assessment', path: '/wellness-assessment', highlight: true },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? 'bg-[#F7F3E8]/95 backdrop-blur-md shadow-xs border-b border-[#10110F]/5 text-[#10110F]'
            : 'bg-[#F7F3E8] border-b border-[#10110F]/5 text-[#10110F]'
        }`}
      >
        {/* Top Gold & White Mixed Headline Announcement Strip */}
        <div className="bg-[#10110F] text-[#F7F3E8] border-b border-[#B88A32]/30 py-1.5 px-3 sm:px-4 text-center text-[9px] sm:text-xs tracking-widest uppercase flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden shadow-inner">
          <span className="text-[#F7F3E8] font-bold truncate">100% PURE HIMALAYAN RESIN</span>
          <span className="text-[#D4B66A] font-semibold hidden xs:inline">• 16,000+ FT •</span>
          <span className="text-[#F7F3E8] font-light hidden md:inline">FREE EXPRESS PAN-INDIA DELIVERY</span>
          <a
            href={getGeneralConciergeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-[#D4B66A] hover:text-[#FFFFFF] underline font-bold tracking-wider transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <span>ORDER DIRECT</span>
          </a>
        </div>

        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          {/* Logo with Gold & White Mixed Headline Typography */}
          <Link
            to="/"
            id="brand-logo-link"
            className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none min-h-[44px]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#183D27] border border-[#B88A32]/40 flex items-center justify-center rounded-sm shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <span className="text-[#D4B66A] font-serif text-lg sm:text-xl font-bold">T</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-xl font-bold tracking-tight uppercase leading-none">
                <span className="text-[#10110F] group-hover:text-[#183D27] transition-colors">TITAN </span>
                <span className="text-[#B88A32] drop-shadow-xs">SHILAJIT</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#183D27] font-semibold mt-0.5 opacity-80 block">
                Himalayan Apothecary
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase opacity-85">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors hover:text-[#B88A32] ${
                  location.pathname === link.path
                    ? 'text-[#B88A32] font-bold opacity-100'
                    : 'text-[#10110F]'
                } ${
                  link.highlight
                    ? 'flex items-center gap-1 text-[#183D27] font-bold'
                    : ''
                }`}
              >
                {link.highlight && <ShieldCheck className="w-3 h-3 text-[#B88A32]" />}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-5">
            {/* Wellness Advisor Button */}
            <button
              id="header-advisor-btn"
              onClick={onOpenAdvisor}
              aria-label="Ask Titan Himalayan Wellness Advisor"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase bg-[#183D27]/10 text-[#183D27] border border-[#183D27]/20 hover:bg-[#183D27] hover:text-[#F7F3E8] transition-all min-h-[36px]"
            >
              <MessageCircle className="w-3 h-3 text-[#B88A32]" />
              <span>Wellness Advisor</span>
            </button>

            {/* Search Icon */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              aria-label="Search products and guides"
              className="opacity-80 hover:opacity-100 transition-opacity p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-black/5"
            >
              <Search className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              aria-label={`Shopping Cart with ${totalItems} items`}
              className="opacity-80 hover:opacity-100 relative transition-opacity p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-black/5"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#183D27] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* WhatsApp Order Button */}
            <a
              id="header-whatsapp-order-btn"
              href={getGeneralConciergeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex bg-[#183D27] text-[#F7F3E8] px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-[#10110F] transition-all shadow-xs items-center gap-1.5 min-h-[38px]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Order on WhatsApp</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              id="header-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity rounded-sm"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-[#10110F]/95 backdrop-blur-md lg:hidden flex flex-col justify-between p-5 sm:p-6 pt-20 overflow-y-auto no-scrollbar animate-in fade-in duration-200"
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-4 p-2.5 text-[#F7F3E8] rounded-full bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-4 mt-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4B66A] font-semibold">
              Explore Titan Shilajit
            </span>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg sm:text-xl font-serif tracking-wide py-3 border-b border-white/10 flex items-center justify-between min-h-[48px] ${
                    location.pathname === link.path ? 'text-[#D4B66A] font-semibold' : 'text-[#F7F3E8]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="text-[9px] uppercase font-sans tracking-widest px-2.5 py-0.5 rounded-full bg-[#B88A32]/20 text-[#D4B66A] border border-[#B88A32]/40">
                      Free Guide
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-white/15">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisor();
              }}
              className="w-full py-3.5 rounded-sm bg-[#183D27] text-[#F7F3E8] font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 border border-[#B88A32]/30 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 text-[#D4B66A]" />
              <span>Ask Himalayan Advisor</span>
            </button>

            <a
              href={getGeneralConciergeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-sm bg-[#25D366] text-[#10110F] font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp ({BRAND_CONTACT.phoneDisplay})</span>
            </a>

            <div className="text-center text-[11px] text-[#EEE8D7]/60 pt-2 font-sans">
              Delhi, India • 100% Pure Himalayan Shilajit
            </div>
          </div>
        </div>
      )}
    </>
  );
};
