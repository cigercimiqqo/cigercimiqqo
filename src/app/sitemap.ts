import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/menu`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const { getProducts, getBlogPosts, getPages } = await import('@/lib/firebase/firestore');
    const { where } = await import('firebase/firestore');

    const [products, posts, pages] = await Promise.all([
      getProducts([where('isActive', '==', true)]),
      getBlogPosts(true),
      getPages(true),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/menu/${p.slug}`,
      lastModified: p.createdAt.toDate(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt?.toDate() || p.createdAt.toDate(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
      url: `${BASE_URL}/pages/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes, ...pageRoutes];
  } catch {
    return staticRoutes;
  }
}
