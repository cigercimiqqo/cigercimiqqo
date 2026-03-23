'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const { settings } = useSettingsStore();
  const description = settings?.general?.siteDescription || '';
  const storyImage = settings?.appearance?.storyImage;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-surface-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <motion.div
                style={{ y }}
                className="absolute inset-0 -top-[10%] -bottom-[10%] bg-cover bg-center"
                aria-hidden
              >
                {storyImage ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${storyImage})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-800 to-surface-900" />
                )}
              </motion.div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-brand-500/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-500/10 rounded-full -z-10 blur-2xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-brand-500 text-white p-6 rounded-2xl shadow-xl"
            >
              <span className="block font-heading text-4xl font-bold">35+</span>
              <span className="text-sm text-brand-100">Yıllık Tecrübe</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-brand-500" />
              <span className="text-brand-500 text-sm tracking-[0.2em] uppercase font-medium">
                Hikayemiz
              </span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-surface-100 mb-6 leading-tight">
              Ateşin Ustalığı, <span className="text-brand-500">Lezzetin Adresi</span>
            </h2>

            <div className="space-y-4 text-surface-400 leading-relaxed">
              <p>
                {description ||
                  'Kuşaktan kuşağa aktarılan tariflerle, ateşle olan bağımızı hiç koparmadan yolumuza devam ediyoruz. Ustalarımız her sabah en taze malzemeleri özenle seçer, özel baharatlarımızla harmanlayarak kömür ateşinde ustaca pişirir.'}
              </p>
              <p>
                Her tabak, bir geleneğin ve tutkuyla yapılan işçiliğin eseridir. Misafirlerimize evinde
                hissettirecek bir atmosfer sunuyoruz.
              </p>
            </div>

            <Link
              href="/hakkimizda"
              className="group inline-flex items-center gap-2 mt-8 text-brand-500 font-medium hover:text-brand-400 transition-colors"
            >
              Daha Fazla Bilgi
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
