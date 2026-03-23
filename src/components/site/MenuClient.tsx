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
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? 'all');
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
    if (slug === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
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
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-surface-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900 to-surface-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
            Lezzetlerimiz
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
            Menümüz
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Sticky header */}
      <div className="sticky top-[72px] z-30 bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-surface-900 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-500 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-surface-900 border border-surface-800 rounded-xl px-3 py-2.5 text-surface-200 outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="default">Varsayılan</option>
                <option value="price-asc">Fiyat ↑</option>
                <option value="price-desc">Fiyat ↓</option>
              </select>
              <AiCartButton products={products} />
            </div>

            <div ref={tabsRef} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => scrollToCategory('all')}
                className={cn(
                  'shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === 'all' || !categories.find((c) => c.slug === activeCategory)
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-900 text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                )}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={cn(
                    'shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all',
                    activeCategory === cat.slug
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-900 text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {searchQuery ? (
          <div>
            <p className="text-sm text-surface-400 mb-6">
              &quot;<strong className="text-surface-200">{searchQuery}</strong>&quot; için {sortedProducts.length} sonuç
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {!sortedProducts.length && (
              <div className="text-center py-20">
                <p className="text-surface-500 text-lg">Ürün bulunamadı</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            <div data-category-section="all" className="h-20 -mt-20 pointer-events-none" aria-hidden />
            {bestSellers.length > 0 && (
              <section>
                <h2 className="font-heading text-xl font-bold text-surface-100 mb-6">⭐ En Çok Satanlar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestSellers.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {categories.map((cat) => {
              const catProducts = sortedProducts.filter((p) => p.categoryId === cat.id);
              if (!catProducts.length) return null;
              return (
                <section key={cat.id} data-category-section={cat.slug}>
                  <h2 className="font-heading text-xl font-bold text-surface-100 mb-6">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-surface-400 text-sm mb-4">{cat.description}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
