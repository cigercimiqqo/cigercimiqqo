import { getPageBySlug } from '@/lib/firebase/firestore';
import { SiteHeader } from '@/components/site/SiteHeader';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);
  return { title: page?.title || 'Sayfa' };
}

export default async function DynamicPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);
  if (!page || !page.isPublished) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>
    </>
  );
}
