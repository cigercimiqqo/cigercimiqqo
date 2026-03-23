'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { useSettingsStore } from '@/store/settingsStore';

export function GalleryPreview() {
  const { settings } = useSettingsStore();
  const galleryImages = settings?.appearance?.galleryImages || [];
  const hasImages = galleryImages.length >= 5;
  const images = hasImages
    ? galleryImages.slice(0, 5).map((src, i) => ({
        src,
        span: i === 0 ? 'col-span-2 row-span-2' : '',
      }))
    : [];

  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Mekanımızdan Kareler" subtitle="Galeri" />

        {!hasImages ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-surface-400 text-sm max-w-md mx-auto">
              Galeri henüz boş. Admin paneli &gt; Görünüm ayarlarından fotoğraf ekleyebilirsiniz.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${img.span}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/galeri"
            className="group inline-flex items-center gap-2 text-brand-500 font-medium hover:text-brand-400 transition-colors"
          >
            Tüm Galeriyi Gör
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
