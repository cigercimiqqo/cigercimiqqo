import { getBlogPosts } from '@/lib/firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { estimateReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';
import type { Timestamp } from 'firebase/firestore/lite';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Haberler, tarifler ve daha fazlası',
};

function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
  return ts.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BlogPage() {
  const posts = await getBlogPosts(true).catch(() => []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-500 mt-2">Haberler, tarifler ve ipuçları</p>
          </div>

          {posts.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Henüz yazı yok.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    {post.coverImage && (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2.5">
                        <Calendar size={12} />
                        {formatDate(post.publishedAt)}
                        <span>·</span>
                        {estimateReadingTime(post.content)} dk okuma
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1.5 mb-2.5 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
