'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { OrderForm } from '@/components/site/OrderForm';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const hydrated = useHydrated();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const total = useCartStore((s) => s.total());
  const discountAmount = useCartStore((s) => s.discountAmount);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  if (!hydrated || items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag size={64} className="text-surface-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-surface-100 mb-2">Sepetiniz Boş</h2>
            <p className="text-surface-400 text-sm mb-6">Menüden ürün ekleyerek başlayın</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors"
            >
              <ArrowLeft size={18} />
              Menüye Git
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-surface-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-2xl font-bold text-surface-100 mb-8">
            {step === 'cart' ? 'Sepetim' : 'Sipariş Bilgileri'}
          </h1>

          {step === 'cart' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-surface-900 rounded-2xl p-4 flex gap-4 border border-surface-800/50">
                    {item.image && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-surface-100">{item.name}</p>
                      {item.variants.map((v, i) => (
                        <p key={i} className="text-xs text-surface-400">{v.variantName}: {v.optionLabel} {v.priceModifier > 0 && `(+${formatPrice(v.priceModifier)})`}</p>
                      ))}
                      <p className="text-orange-500 font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeItem(item.productId, item.variants)} className="text-surface-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variants)} className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200 hover:bg-surface-700">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-surface-100">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variants)} className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200 hover:bg-surface-700">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-surface-900 rounded-2xl p-6 border border-surface-800/50 h-fit sticky top-24">
                <h3 className="font-bold text-surface-100 mb-4">Sipariş Özeti</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-400">Ara Toplam</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim</span>
                      <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-surface-800 pt-3 flex justify-between font-bold text-base">
                    <span className="text-surface-100">Toplam</span>
                    <span className="text-brand-500">{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full mt-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Devam Et
                </button>
                <button
                  onClick={() => clearCart()}
                  className="w-full mt-2 py-2.5 text-sm text-surface-400 hover:text-red-500 transition-colors"
                >
                  Sepeti Temizle
                </button>
              </div>
            </div>
          ) : (
            <OrderForm onBack={() => setStep('cart')} />
          )}
        </div>
      </main>
    </>
  );
}
