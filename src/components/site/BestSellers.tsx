import { getBestSellerProducts } from '@/lib/firebase/firestore';
import { ProductCard } from './ProductCard';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export async function BestSellers() {
  const products = await getBestSellerProducts(6).catch(() => []);
  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">En Çok Satanlar</h2>
            <p className="text-gray-500 mt-0.5 text-sm">Müşterilerin favorileri</p>
          </div>
        </div>
        <Link href="/menu" className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
          Tümünü gör →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
