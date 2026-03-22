'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Flame, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn, formatPrice, getEffectivePrice } from '@/lib/utils';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary';
import { toast } from 'sonner';
import type { Product } from '@/types';

const badgeConfig = {
  bestseller: { label: 'En Çok Satan', icon: TrendingUp, color: 'bg-amber-500' },
  new: { label: 'Yeni', icon: Sparkles, color: 'bg-green-500' },
  featured: { label: 'Öne Çıkan', icon: Star, color: 'bg-blue-500' },
  spicy: { label: 'Acılı', icon: Flame, color: 'bg-red-500' },
};

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
}

export function ProductCard({ product, showAddButton = true }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const effectivePrice = getEffectivePrice(product);
  const hasDiscount = product.discountType !== 'none' && product.discountValue > 0;
  const mainImage = product.images[imgIndex] || product.images[0];
  const blurUrl = mainImage ? getCloudinaryBlurUrl(mainImage) : '';

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 0) {
      // Varyant varsa ürün detayına git
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      quantity: 1,
      variants: [],
      image: product.images[0] || '',
    });
    openCart();
    toast.success(`${product.name} sepete eklendi`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-shadow"
    >
      {/* Image */}
      <Link href={`/menu?slug=${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {mainImage ? (
            <>
              {!imgLoaded && blurUrl && (
                <Image
                  src={blurUrl}
                  alt=""
                  fill
                  className="object-cover"
                  aria-hidden
                />
              )}
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className={cn(
                  'object-cover transition-all duration-500 group-hover:scale-105',
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImgLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges.slice(0, 2).map((badge) => {
              const config = badgeConfig[badge];
              return (
                <span key={badge} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white', config.color)}>
                  <config.icon size={10} />
                  {config.label}
                </span>
              );
            })}
          </div>

          {/* Multiple image dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all',
                    i === imgIndex ? 'bg-white' : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          )}

          {/* Out of stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">Tükendi</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/menu?slug=${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-orange-500">{formatPrice(effectivePrice)}</span>
            {hasDiscount && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {showAddButton && product.stock !== 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all hover:scale-110 active:scale-95"
              aria-label="Sepete ekle"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
