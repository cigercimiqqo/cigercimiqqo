import { getBlogPostBySlug, getBlogPosts } from '@/lib/firebase/firestore';
import { SiteHeader } from '@/components/site/SiteHeader';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { estimateReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';
import type { Timestamp } from 'firebase/firestore';

function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
  return ts.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const posts = await getBlogPosts(true).catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords?.join(', '),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toDate().toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post || !post.isPublished) notFound();

  const readTime = estimateReadingTime(post.content);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        {/* Cover */}
        {post.coverImage && (
          <div className="relative h-[50vh] max-h-[500px] overflow-hidden bg-gray-900">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover opacity-80" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6 transition-colors">
            <ArrowLeft size={16} />
            Tüm Yazılar
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} dk okuma
            </span>
          </div>

          {/* Content */}
          <div
            className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-orange-500 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Schema.org */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.excerpt,
                image: post.coverImage,
                datePublished: post.publishedAt?.toDate().toISOString(),
                wordCount: post.content.split(/\s+/).length,
                timeRequired: `PT${readTime}M`,
              }),
            }}
          />
        </article>
      </main>
    </>
  );
}
