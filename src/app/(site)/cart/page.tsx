'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { OrderForm } from '@/components/site/OrderForm';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const total = useCartStore((s) => s.total());
  const discountAmount = useCartStore((s) => s.discountAmount);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-500 text-sm mb-6">Menüden ürün ekleyerek başlayın</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
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
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            {step === 'cart' ? 'Sepetim' : 'Sipariş Bilgileri'}
          </h1>

          {step === 'cart' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100">
                    {item.image && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      {item.variants.map((v, i) => (
                        <p key={i} className="text-xs text-gray-500">{v.variantName}: {v.optionLabel} {v.priceModifier > 0 && `(+${formatPrice(v.priceModifier)})`}</p>
                      ))}
                      <p className="text-orange-500 font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeItem(item.productId, item.variants)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variants)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variants)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Sipariş Özeti</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ara Toplam</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim</span>
                      <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                    <span>Toplam</span>
                    <span className="text-orange-500">{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full mt-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Devam Et
                </button>
                <button
                  onClick={() => clearCart()}
                  className="w-full mt-2 py-2.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
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
