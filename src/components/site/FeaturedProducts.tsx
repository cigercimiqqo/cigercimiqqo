'use client';

import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '@/lib/firebase/firestore';
import { ProductCard } from './ProductCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setProducts).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Öne Çıkan Lezzetler" subtitle="Menümüz" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 px-8 py-3.5 border border-brand-500 text-brand-500 font-medium rounded-full hover:bg-brand-500 hover:text-white transition-all duration-300"
          >
            Tüm Menüyü Gör
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
