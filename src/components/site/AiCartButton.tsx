'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Loader2, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { buildAiCartItems } from '@/lib/pollinations';
import { toast } from '@/lib/toast';
import type { Product } from '@/types';

interface AiCartButtonProps {
  products: Product[];
}

export function AiCartButton({ products }: AiCartButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{ productId: string; quantity: number }[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setItems, openCart } = useCartStore();

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  async function handleSend() {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setSuggestion(null);

    try {
      const { getAiCartSuggestion } = await import('@/lib/pollinations');
      const result = await getAiCartSuggestion(products, message);
      setSuggestion(result.items);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Öneri şu an yüklenemiyor';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function applySuggestion() {
    if (!suggestion) return;
    const cartItems = buildAiCartItems({ items: suggestion }, products);
    setItems(cartItems);
    openCart();
    setIsOpen(false);
    toast.success('AI önerisi sepete eklendi!');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shrink-0"
      >
        <Sparkles size={15} />
        <span className="hidden sm:inline">AI Sepet</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-12 z-50 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">AI Sepet Asistanı</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-3">Ne yemek istersin? Sana özel bir sepet hazırlayayım.</p>

              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hafif bir akşam yemeği..."
                  className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-all"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>

              {suggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 space-y-2"
                >
                  <p className="text-xs text-green-600 font-medium">{suggestion.length} ürün önerildi ✓</p>
                  <div className="flex gap-2">
                    <button
                      onClick={applySuggestion}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-xs font-semibold hover:opacity-90"
                    >
                      Sepete Ekle
                    </button>
                    <button
                      onClick={() => { setSuggestion(null); setMessage(''); }}
                      className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
