'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { getDefaultContent } from '@/lib/defaultContent';

export function HeroBanner() {
  const { settings } = useSettingsStore();
  const content = settings?.content ?? getDefaultContent();
  const hero = content.hero;
  const images = settings?.appearance?.heroImages || [];
  const bgImage = images[0];
  const phone = settings?.general?.phone?.[0];

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {bgImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center text-white">
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-shadow-sm">
          {hero.headline}
          {hero.headlineAccent ? (
            <>
              <br />
              <span className="text-gold-400 italic">{hero.headlineAccent}</span>
            </>
          ) : null}
        </h1>
        <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto text-stone-200">
          {hero.description}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/menu"
            className="w-full md:w-auto px-10 py-4 bg-brand-500 text-white rounded-xl text-lg font-semibold hover:bg-brand-600 transition-all shadow-xl shadow-black/20"
          >
            {hero.buttonMenu}
          </Link>
          <Link
            href="/iletisim"
            className="w-full md:w-auto px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-all"
          >
            {hero.buttonReservation}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white w-8 h-8" />
      </div>
    </section>
  );
}
