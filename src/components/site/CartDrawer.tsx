'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, items, closeCart, removeItem, updateQuantity, subtotal, total, discountAmount, couponCode } = useCartStore();
  const subTotal = useCartStore((s) => s.subtotal());
  const totalAmount = useCartStore((s) => s.total());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-orange-500" />
                <h2 className="font-bold text-gray-900 text-lg">Sepetim</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag size={48} className="text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">Sepetiniz boş</p>
                  <p className="text-gray-400 text-sm mt-1">Menüden ürün ekleyin</p>
                  <Link
                    href="/menu"
                    onClick={closeCart}
                    className="mt-6 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Menüye Git
                  </Link>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                    {item.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      {item.variants.map((v, i) => (
                        <p key={i} className="text-xs text-gray-500">{v.variantName}: {v.optionLabel}</p>
                      ))}
                      <p className="text-orange-500 font-bold text-sm mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.productId, item.variants)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variants)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-orange-400 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variants)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-orange-400 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                {discountAmount > 0 && (
                  <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm text-green-700 font-medium">{couponCode}</span>
                    <span className="ml-auto text-sm font-bold text-green-700">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span className="font-semibold">{formatPrice(subTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">İndirim</span>
                    <span className="font-semibold text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base">
                  <span>Toplam</span>
                  <span className="text-orange-500">{formatPrice(totalAmount)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Siparişi Tamamla
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
