'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/firebase/firestore';
import { Calendar, ArrowLeft } from 'lucide-react';
import { estimateReadingTime, truncateText } from '@/lib/utils';
import type { BlogPost } from '@/types';

function formatDate(ts: { toDate: () => Date } | null): string {
  if (!ts) return '';
  return ts.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function BlogPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setLoading(true);
    if (slug) {
      getBlogPostBySlug(slug)
        .then((p) => {
          setPost(p);
          setPosts([]);
        })
        .catch(() => {
          setPost(null);
          setPosts([]);
        })
        .finally(() => setLoading(false));
    } else {
      getBlogPosts(true)
        .then((p) => {
          setPosts(p);
          setPost(null);
        })
        .catch(() => {
          setPosts([]);
          setPost(null);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-surface-400 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  if (slug) {
    if (!post) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-surface-400 mb-4">Yazı bulunamadı.</p>
          <Link href="/blog" className="text-brand-500 font-medium hover:text-brand-400">
            ← Tüm yazılar
          </Link>
        </div>
      );
    }

    return (
      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-brand-500 mb-8 hover:text-brand-400"
        >
          <ArrowLeft size={16} />
          Tüm yazılar
        </Link>
        {post.coverImage && (
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-surface-400 mb-4">
          <Calendar size={14} />
          {formatDate(post.publishedAt)}
          <span>·</span>
          <span>{estimateReadingTime(post.content)} dk okuma</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-100 mb-6">{post.title}</h1>
        {post.excerpt ? <p className="text-lg text-surface-400 mb-8">{post.excerpt}</p> : null}
        <div
          className="prose prose-invert prose-gray max-w-none text-surface-300 [&_strong]:text-surface-100"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    );
  }

  if (!posts.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-heading font-bold text-surface-200 mb-2">Henüz yayınlanmış yazı yok</h2>
        <p className="text-surface-400 text-sm">Admin panelinden blog yazıları ekleyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-surface-100 mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((item) => (
          <Link key={item.id} href={`/blog?slug=${item.slug}`} className="group">
            <article className="bg-surface-900 rounded-2xl overflow-hidden border border-surface-800/50 shadow-sm hover:border-brand-500/30 hover:shadow-md transition-all">
              {item.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-surface-400 mb-2">
                  <Calendar size={12} />
                  {formatDate(item.publishedAt)}
                  <span>·</span>
                  <span>{estimateReadingTime(item.content)} dk okuma</span>
                </div>
                <h2 className="font-semibold text-surface-100 mb-2 line-clamp-2 group-hover:text-brand-500 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-surface-400 line-clamp-2">{truncateText(item.excerpt, 100)}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
