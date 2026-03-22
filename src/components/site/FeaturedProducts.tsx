'use client';

import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '@/lib/firebase/firestore';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setProducts).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
          <p className="text-gray-500 mt-1 text-sm">Özel seçkimiz</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
