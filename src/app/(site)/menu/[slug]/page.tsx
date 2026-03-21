import { getProductBySlug, getProducts } from '@/lib/firebase/firestore';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ProductDetail } from '@/components/site/ProductDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const products = await getProducts([where('isActive', '==', true)]).catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product || !product.isActive) notFound();

  const relatedProducts = await getProducts([
    where('categoryId', '==', product.categoryId),
    where('isActive', '==', true),
  ]).catch(() => []);
  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductDetail product={product} relatedProducts={related} />
        </div>
      </main>
    </>
  );
}
