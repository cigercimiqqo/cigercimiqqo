import { getFeaturedProducts } from '@/lib/firebase/firestore';
import { ProductCard } from './ProductCard';

export async function FeaturedProducts() {
  const products = await getFeaturedProducts().catch(() => []);
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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
