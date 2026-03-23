'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
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
        .catch(() => setError('Ürün yüklenemedi.'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);
      let cleared = false;
      const timeout = setTimeout(() => {
        if (!cleared) {
          cleared = true;
          setError('Menü yüklenemedi. Lütfen tekrar deneyin.');
          setIsLoading(false);
        }
      }, 12000);

      Promise.all([
        getCategories().catch(() => []),
        getProducts([where('isActive', '==', true)]).catch(() => []),
      ])
        .then(([cats, prods]) => {
          cleared = true;
          clearTimeout(timeout);
          setError(null);
          setCategories((cats || []).filter((c) => c?.isActive));
          setProducts(prods || []);
        })
        .catch(() => {
          cleared = true;
          clearTimeout(timeout);
          setError('Menü yüklenemedi. Lütfen tekrar deneyin.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-surface-400 mb-6">{error}</p>
        <button
          onClick={() => { setError(null); setIsLoading(true); window.location.reload(); }}
          className="px-6 py-3 bg-brand-500 text-white rounded-2xl font-medium hover:bg-brand-600 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-surface-400 text-sm">Menü yükleniyor...</p>
      </div>
    );
  }

  if (slug && selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-surface-950">
        <ProductDetail product={selectedProduct} relatedProducts={relatedProducts} />
      </div>
    );
  }

  if (slug && !selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-surface-400 mb-4">Ürün bulunamadı.</p>
        <Link href="/menu" className="text-brand-500 hover:text-brand-400 font-medium">
          ← Menüye dön
        </Link>
      </div>
    );
  }

  if (!categories.length && !products.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-xl font-heading font-bold text-surface-200 mb-2">Henüz menü eklenmemiş</h2>
        <p className="text-surface-400 text-sm max-w-md mx-auto">
          Admin panelinden kategori ve ürün ekleyerek menüyü oluşturabilirsiniz.
        </p>
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
