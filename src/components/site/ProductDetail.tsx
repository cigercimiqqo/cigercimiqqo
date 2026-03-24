'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronLeft, Minus, Plus, Flame, Star, Sparkles, TrendingUp, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getEffectivePrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ProductCard } from './ProductCard';
import type { Product, CartItemVariantSelection } from '@/types';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, CartItemVariantSelection>>({});
  const { addItem, openCart } = useCartStore();

  const effectivePrice = getEffectivePrice(product);
  const hasDiscount = product.discountType !== 'none' && product.discountValue > 0;

  const variantExtra = Object.values(selectedVariants).reduce(
    (sum, v) => sum + v.priceModifier, 0
  );
  const finalPrice = effectivePrice + variantExtra;

  function handleVariantSelect(variantName: string, option: { label: string; priceModifier: number }) {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: { variantName, optionLabel: option.label, priceModifier: option.priceModifier },
    }));
  }

  function handleAddToCart() {
    const missingVariants = product.variants.filter((v) => !selectedVariants[v.name]);
    if (missingVariants.length > 0) {
      toast.error(`Lütfen ${missingVariants[0].name} seçin`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      quantity,
      variants: Object.values(selectedVariants),
      image: product.images[0] || '',
    });
    openCart();
    toast.success(`${product.name} sepete eklendi`);
  }

  const badgeIcons = { bestseller: TrendingUp, new: Sparkles, featured: Star, spicy: Flame };
  const badgeColors = { bestseller: 'bg-gold-400/90 text-surface-900', new: 'bg-green-500/90 text-white', featured: 'bg-brand-500/90 text-white', spicy: 'bg-red-600/90 text-white' };

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Link href="/menu" className="hover:text-brand-500 flex items-center gap-1">
          <ChevronLeft size={14} />Menü
        </Link>
        <span>/</span>
        <span className="text-surface-200">{product.name}</span>
      </div>

      {/* Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-surface-800 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            {product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            {!product.images.length && (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">🍽️</div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn('relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all', i === selectedImage ? 'border-brand-500' : 'border-surface-700')}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.badges.map((badge) => {
                const Icon = badgeIcons[badge];
                return (
                  <span key={badge} className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', badgeColors[badge])}>
                    <Icon size={11} />
                    {badge === 'bestseller' ? 'En Çok Satan' : badge === 'new' ? 'Yeni' : badge === 'featured' ? 'Öne Çıkan' : 'Acılı'}
                  </span>
                );
              })}
            </div>
          )}

          <h1 className="font-heading text-3xl font-bold text-surface-100">{product.name}</h1>
          {product.description && <p className="text-surface-400 leading-relaxed">{product.description}</p>}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-heading font-bold text-brand-500">{formatPrice(finalPrice)}</span>
            {hasDiscount && <span className="text-lg text-surface-500 line-through">{formatPrice(product.price)}</span>}
          </div>

          {/* Variants */}
          {product.variants.map((variant) => (
            <div key={variant.name}>
              <p className="text-sm font-semibold text-surface-300 mb-2">{variant.name}</p>
              <div className="flex gap-2 flex-wrap">
                {variant.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleVariantSelect(variant.name, opt)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                      selectedVariants[variant.name]?.optionLabel === opt.label
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-surface-700 text-surface-300 hover:border-surface-600'
                    )}
                  >
                    {opt.label}
                    {opt.priceModifier > 0 && <span className="text-xs ml-1 text-surface-500">+{formatPrice(opt.priceModifier)}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity + Add */}
          {product.stock !== 0 ? (
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-3 bg-surface-900 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200 hover:bg-surface-700 transition-all">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-surface-100">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200 hover:bg-surface-700 transition-all">
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors"
              >
                <ShoppingCart size={18} />
                Sepete Ekle — {formatPrice(finalPrice * quantity)}
              </motion.button>
            </div>
          ) : (
            <div className="py-4 bg-red-500/10 rounded-xl text-center text-red-400 font-semibold">Tükendi</div>
          )}

          {/* Allergens */}
          {product.allergens.length > 0 && (
            <div className="bg-gold-500/10 rounded-xl p-4 border border-gold-500/20">
              <p className="text-sm font-semibold text-gold-400 mb-1">Alerjen Bilgisi</p>
              <p className="text-sm text-surface-300">{product.allergens.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-heading text-xl font-bold text-surface-100 mb-6">Bunları da Beğenebilirsiniz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && product.images[selectedImage] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20">
            <X size={24} />
          </button>
          <div className="relative w-full max-w-2xl aspect-square">
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
