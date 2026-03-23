'use client';

import { motion } from 'framer-motion';
import { Phone, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/settingsStore';
import { getDefaultContent } from '@/lib/defaultContent';

export function CTA() {
  const { settings } = useSettingsStore();
  const content = settings?.content ?? getDefaultContent();
  const cta = content.cta;
  const phone = settings?.general?.phone?.[0];
  const ctaImage = settings?.appearance?.ctaImage;

  return (
    <section className="py-28 relative overflow-hidden bg-brand-600">
      {ctaImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${ctaImage})` }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
          {cta.title}
        </h2>
        <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto">
          {cta.description}
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="bg-white text-brand-600 px-10 py-5 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
              <Phone size={24} />
              {cta.buttonCall}
            </a>
          )}
          <Link
            href="/menu"
            className="bg-brand-700 text-white border border-white/30 px-10 py-5 rounded-3xl text-xl font-bold hover:bg-brand-800 transition-all flex items-center justify-center gap-3"
          >
            <ShoppingBag size={24} />
            {cta.buttonOrder}
          </Link>
        </div>
      </div>
    </section>
  );
}
