'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

export function HeroBanner() {
  const { settings } = useSettingsStore();
  const images = settings?.appearance?.heroImages || [];
  const [current, setCurrent] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (!hasImages || images.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images, hasImages]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-gray-900">
      {hasImages ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt="Hero"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-900" />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Lezzetin Tam
            <br />
            <span className="text-orange-400">Adresi</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-lg mx-auto">
            Taze malzemeler, özenli hazırlık ve kapınıza hızlı teslimat
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={18} />
              Sipariş Ver
            </Link>
          </div>
        </motion.div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'transition-all rounded-full',
                  i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
