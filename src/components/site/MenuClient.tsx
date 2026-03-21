'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { AiCartButton } from './AiCartButton';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types';

interface MenuClientProps {
  categories: Category[];
  products: Product[];
  initialCategory?: string;
}

export function MenuClient({ categories, products, initialCategory }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const tabsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sticky tab scroll observer
  useEffect(() => {
    const categoryRefs = new Map<string, HTMLElement>();
    const sectionEls = document.querySelectorAll('[data-category-section]');
    sectionEls.forEach((el) => {
      const id = el.getAttribute('data-category-section');
      if (id) categoryRefs.set(id, el as HTMLElement);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-category-section');
            if (id) setActiveCategory(id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    categoryRefs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToCategory(slug: string) {
    setActiveCategory(slug);
    const el = document.querySelector(`[data-category-section="${slug}"]`);
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const bestSellers = products.filter((p) => p.badges.includes('bestseller'));

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + sort row */}
          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
            >
              <option value="default">Varsayılan</option>
              <option value="price-asc">Fiyat ↑</option>
              <option value="price-desc">Fiyat ↓</option>
            </select>
            <AiCartButton products={products} />
          </div>

          {/* Category tabs */}
          <div ref={tabsRef} className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.slug)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
                  activeCategory === cat.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search results */}
        {searchQuery ? (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              &quot;<strong>{searchQuery}</strong>&quot; için {sortedProducts.length} sonuç
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {!sortedProducts.length && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">Ürün bulunamadı</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {/* Best sellers section */}
            {bestSellers.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">⭐ En Çok Satanlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {bestSellers.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Category sections */}
            {categories.map((cat) => {
              const catProducts = sortedProducts.filter((p) => p.categoryId === cat.id);
              if (!catProducts.length) return null;
              return (
                <section key={cat.id} data-category-section={cat.slug}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-gray-500 text-sm mb-4">{cat.description}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {catProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
