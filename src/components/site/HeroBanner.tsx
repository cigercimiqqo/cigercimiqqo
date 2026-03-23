'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function HeroBanner() {
  const { settings } = useSettingsStore();
  const images = settings?.appearance?.heroImages || [];
  const bgImage = images[0];
  const siteName = settings?.general?.siteName || 'Restoran';
  const description = settings?.general?.siteDescription || 'Ateşte pişen efsane lezzet. Kuşaktan kuşağa aktarılan geleneksel tariflerle, unutulmaz bir sofra deneyimi.';
  const phone = settings?.general?.phone?.[0];

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {bgImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-surface-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-500/60"
            style={{
              left: `${15 + (i * 5) % 70}%`,
              bottom: `${(i * 7) % 30}%`,
              animation: `ember-rise ${3 + (i % 4)}s ease-out infinite`,
              animationDelay: `${(i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-3 text-gold-400 text-sm tracking-[0.3em] uppercase font-medium">
            <span className="h-px w-10 bg-gold-400/50" />
            Lezzetin Adresi
            <span className="h-px w-10 bg-gold-400/50" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-6"
        >
          {siteName.split(' ').length > 1 ? (
            <>
              {siteName.split(' ')[0]}{' '}
              <span className="text-brand-500">{siteName.split(' ').slice(1).join(' ')}</span>
            </>
          ) : (
            <>
              <span className="text-brand-500">{siteName}</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-surface-300 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/menu"
            className="group relative px-8 py-4 bg-brand-500 text-white font-medium rounded-full overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            <span className="relative z-10">Menüyü İncele</span>
            <div className="absolute inset-0 bg-brand-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-8 py-4 border border-surface-400/30 text-surface-200 font-medium rounded-full hover:bg-white/10 hover:border-surface-300/50 transition-all"
            >
              <Phone size={16} />
              Sipariş Ver
            </a>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-surface-400"
        >
          <span className="text-xs tracking-widest uppercase">Keşfet</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
    </section>
  );
}
