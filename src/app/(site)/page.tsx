import { Suspense } from 'react';
import { getSettings } from '@/lib/firebase/firestore';
import { HeroBanner } from '@/components/site/HeroBanner';

export const dynamic = 'force-dynamic';
import { FeaturedProducts } from '@/components/site/FeaturedProducts';
import { BestSellers } from '@/components/site/BestSellers';
import { CategoryNav } from '@/components/site/CategoryNav';
import { ReviewsSection } from '@/components/site/ReviewsSection';
import { RestaurantInfo } from '@/components/site/RestaurantInfo';
import { BlogPreview } from '@/components/site/BlogPreview';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  return {
    title: settings?.general?.siteName || 'Restoran',
    description: settings?.general?.siteDescription || 'Online sipariş platformu',
    keywords: settings?.general?.siteKeywords?.join(', '),
    openGraph: {
      title: settings?.general?.siteName || 'Restoran',
      description: settings?.general?.siteDescription || '',
      images: settings?.general?.logo ? [settings.general.logo] : [],
    },
  };
}

export default async function HomePage() {
  const settings = await getSettings().catch(() => null);
  const heroImages = settings?.appearance?.heroImages || [];

  return (
    <>
      <SiteHeader />
      <main>
        <HeroBanner images={heroImages} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="py-16 text-center text-gray-400">Yükleniyor...</div>}>
            <BestSellers />
          </Suspense>
          <Suspense fallback={null}>
            <FeaturedProducts />
          </Suspense>
          <Suspense fallback={null}>
            <CategoryNav />
          </Suspense>
          <Suspense fallback={null}>
            <ReviewsSection />
          </Suspense>
          <Suspense fallback={null}>
            <RestaurantInfo settings={settings} />
          </Suspense>
          <Suspense fallback={null}>
            <BlogPreview />
          </Suspense>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
