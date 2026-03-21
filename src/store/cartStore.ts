import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartItemVariantSelection } from '@/types';
import { getEffectivePrice } from '@/lib/utils';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  discountAmount: number;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variants?: CartItemVariantSelection[]) => void;
  updateQuantity: (productId: string, quantity: number, variants?: CartItemVariantSelection[]) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setItems: (items: CartItem[]) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  subtotal: () => number;
  total: () => number;
  itemCount: () => number;
}

function isSameVariants(
  a: CartItemVariantSelection[],
  b: CartItemVariantSelection[]
): boolean {
  if (a.length !== b.length) return false;
  return a.every((va, i) => va.variantName === b[i]?.variantName && va.optionLabel === b[i]?.optionLabel);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      discountAmount: 0,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === newItem.productId &&
              isSameVariants(i.variants, newItem.variants)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId &&
                isSameVariants(i.variants, newItem.variants)
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId, variants = []) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && isSameVariants(i.variants, variants))
          ),
        }));
      },

      updateQuantity: (productId, quantity, variants = []) => {
        if (quantity <= 0) {
          get().removeItem(productId, variants);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && isSameVariants(i.variants, variants)
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: '', discountAmount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setItems: (items) => set({ items }),

      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),
      removeCoupon: () => set({ couponCode: '', discountAmount: 0 }),

      subtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const variantExtra = item.variants.reduce((v, va) => v + va.priceModifier, 0);
          return sum + (item.price + variantExtra) * item.quantity;
        }, 0);
      },

      total: () => {
        const { discountAmount } = get();
        return Math.max(0, get().subtotal() - discountAmount);
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'miqqo-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
