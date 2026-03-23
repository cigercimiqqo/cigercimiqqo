'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function CTA() {
  const { settings } = useSettingsStore();
  const phone = settings?.general?.phone?.[0];
  const address = settings?.general?.address || '';
  const ctaImage = settings?.appearance?.ctaImage;

  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : 'https://maps.google.com';

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        {ctaImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ctaImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-surface-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 to-surface-950/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-3 text-gold-400 text-sm tracking-[0.3em] uppercase font-medium mb-6">
            <span className="h-px w-8 bg-gold-400/50" />
            Sizi Bekliyoruz
            <span className="h-px w-8 bg-gold-400/50" />
          </span>

          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Lezzet Bir Telefon Kadar Yakın
          </h2>

          <p className="text-surface-300 text-lg max-w-xl mx-auto mb-10">
            Rezervasyon yapmak veya paket sipariş vermek için bizi hemen arayın. Taze ve sıcacık
            lezzetlerimizle sizi ağırlamaya hazırız.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="group flex items-center gap-3 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                <Phone size={18} />
                {phone}
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 border border-surface-400/30 text-surface-200 font-medium rounded-full hover:bg-white/10 transition-all"
            >
              <MapPin size={18} />
              Yol Tarifi Al
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
