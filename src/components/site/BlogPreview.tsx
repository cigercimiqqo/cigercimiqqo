import { getBlogPosts } from '@/lib/firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { estimateReadingTime, truncateText } from '@/lib/utils';
import type { Timestamp } from 'firebase/firestore/lite';

function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
  const date = ts.toDate();
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function BlogPreview() {
  const posts = await getBlogPosts(true).catch(() => []);
  const recent = posts.slice(0, 3);
  if (!recent.length) return null;

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Blog</h2>
          <p className="text-gray-500 mt-1 text-sm">Haberler ve tarifler</p>
        </div>
        <Link href="/blog" className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
          Tümünü gör →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recent.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden">
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
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar size={12} />
                  {formatDate(post.publishedAt)}
                  <span>·</span>
                  <span>{estimateReadingTime(post.content)} dk okuma</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{truncateText(post.excerpt, 100)}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
