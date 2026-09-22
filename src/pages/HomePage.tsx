import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { TrustStrip } from '../components/TrustStrip';
import { BrandStorySection } from '../components/BrandStorySection';
import { LaunchProductBanner } from '../components/LaunchProductBanner';
import { ProductShowcaseSection } from '../components/ProductShowcaseSection';
import { BenefitsSection } from '../components/BenefitsSection';
import { ReviewSection } from '../components/ReviewSection';
import { QualityTrustSection } from '../components/QualityTrustSection';
import { CTASection } from '../components/CTASection';

export const HomePage: React.FC = () => {
  return (
    <div id="home-page" className="min-h-screen flex flex-col">
      <HeroSection />
      <ProductShowcaseSection />
      <TrustStrip />
      <BrandStorySection />
      <LaunchProductBanner />
      <BenefitsSection />
      <ReviewSection />
      <QualityTrustSection />
      <CTASection />
    </div>
  );
};
