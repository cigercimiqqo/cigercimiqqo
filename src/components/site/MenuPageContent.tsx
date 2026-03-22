'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCategories, getProducts, getProductBySlug } from '@/lib/firebase/firestore';
import { where } from 'firebase/firestore';
import { MenuClient } from './MenuClient';
import { ProductDetail } from './ProductDetail';
import { Loader2 } from 'lucide-react';
import type { Category, Product } from '@/types';

export function MenuPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const categoryParam = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getProductBySlug(slug)
        .then(async (product) => {
          if (product) {
            setSelectedProduct(product);
            const related = await getProducts([
              where('categoryId', '==', product.categoryId),
              where('isActive', '==', true),
            ]).catch(() => []);
            setRelatedProducts(related.filter((p) => p.id !== product.id).slice(0, 4));
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);
      Promise.all([
        getCategories().catch(() => []),
        getProducts([where('isActive', '==', true)]).catch(() => []),
      ])
        .then(([cats, prods]) => {
          setCategories(cats.filter((c) => c.isActive));
          setProducts(prods);
        })
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (slug && selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetail product={selectedProduct} relatedProducts={relatedProducts} />
      </div>
    );
  }

  return (
    <MenuClient
      categories={categories}
      products={products}
      initialCategory={categoryParam || undefined}
    />
  );
}
