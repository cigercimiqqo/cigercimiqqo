'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { useSettingsStore } from '@/store/settingsStore';

export default function GalleryPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const { settings } = useSettingsStore();
  const galleryImages = settings?.appearance?.galleryImages || [];
  const hasImages = galleryImages.length > 0;

  const images = hasImages
    ? galleryImages.map((src, i) => ({
        id: i + 1,
        src,
        alt: `Galeri - Fotoğraf ${i + 1}`,
      }))
    : [];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative pt-32 pb-16 bg-surface-950">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
                Kareler
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
                Galeri
              </h1>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-surface-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!hasImages ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📷</div>
                <h2 className="text-xl font-heading font-bold text-surface-200 mb-2">Galeri henüz boş</h2>
                <p className="text-surface-400 text-sm max-w-md mx-auto">
                  Admin paneli > Görünüm ayarlarından galeri fotoğraflarını ekleyebilirsiniz.
                </p>
              </div>
            ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.05 }}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => setSelected(img.src)}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <div
                      className="bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${img.src})`,
                        paddingBottom: `${60 + (i % 3) * 20}%`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelected(null)}
              aria-label="Kapat"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full h-[70vh] bg-contain bg-center bg-no-repeat rounded-xl"
                style={{ backgroundImage: `url(${selected})` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
