import { getCategories, getProducts } from '@/lib/firebase/firestore';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { MenuClient } from '@/components/site/MenuClient';
import { getSettings } from '@/lib/firebase/firestore';
import type { Metadata } from 'next';
import { where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Menü',
  description: 'Tüm ürünlerimiz ve kategorilerimiz',
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [categories, products, settings] = await Promise.all([
    getCategories().catch(() => []),
    getProducts([where('isActive', '==', true)]).catch(() => []),
    getSettings().catch(() => null),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50">
        <MenuClient
          categories={categories.filter((c) => c.isActive)}
          products={products}
          initialCategory={params.category}
        />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
