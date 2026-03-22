'use client';

import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { HeroBanner } from '@/components/site/HeroBanner';
import { BestSellers } from '@/components/site/BestSellers';
import { FeaturedProducts } from '@/components/site/FeaturedProducts';
import { CategoryNav } from '@/components/site/CategoryNav';
import { ReviewsSection } from '@/components/site/ReviewsSection';
import { RestaurantInfo } from '@/components/site/RestaurantInfo';
import { BlogPreview } from '@/components/site/BlogPreview';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BestSellers />
          <FeaturedProducts />
          <CategoryNav />
          <ReviewsSection />
          <RestaurantInfo />
          <BlogPreview />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
