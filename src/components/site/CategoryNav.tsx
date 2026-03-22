'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';

export function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats.filter((c) => c.isActive)))
      .catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoriler</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/menu?category=${cat.slug}`}
            className="flex-shrink-0 group"
          >
            <div className="flex flex-col items-center gap-2 text-center w-20">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-orange-50 border-2 border-transparent group-hover:border-orange-400 transition-all">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🍴</div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-orange-500 transition-colors line-clamp-2">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
