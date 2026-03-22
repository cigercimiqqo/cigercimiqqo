'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPageBySlug } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { DynamicPage } from '@/types';

export function DynamicPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [page, setPage] = useState<DynamicPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getPageBySlug(slug)
      .then((p) => {
        if (p && p.isPublished) setPage(p);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="py-20 text-center text-gray-400">
        Sayfa bulunamadı.
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </article>
  );
}
