'use client';

import { useState, useEffect } from 'react';
import { getBlogPosts } from '@/lib/firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { estimateReadingTime, truncateText } from '@/lib/utils';
import type { BlogPost } from '@/types';

export function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getBlogPosts(true)
      .then((p) => setPosts(p.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  function formatDate(ts: { toDate: () => Date } | null): string {
    if (!ts) return '';
    return ts.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-surface-100">Blog</h2>
            <p className="text-surface-400 mt-1 text-sm">Haberler ve tarifler</p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-500 hover:text-brand-400 transition-colors"
          >
            Tümünü gör →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog?slug=${post.slug}`} className="group">
              <article className="bg-surface-900 rounded-2xl overflow-hidden border border-surface-800/50 hover:border-brand-500/30 transition-all">
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
                  <div className="flex items-center gap-2 text-xs text-surface-500 mb-2">
                    <Calendar size={12} />
                    {formatDate(post.publishedAt)}
                    <span>·</span>
                    <span>{estimateReadingTime(post.content)} dk okuma</span>
                  </div>
                  <h3 className="font-heading font-semibold text-surface-100 mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-surface-400 line-clamp-2">{truncateText(post.excerpt, 100)}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
