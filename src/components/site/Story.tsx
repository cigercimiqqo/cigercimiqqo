'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { getDefaultContent } from '@/lib/defaultContent';

export function Story() {
  const { settings } = useSettingsStore();
  const content = settings?.content ?? getDefaultContent();
  const story = content.story;
  const storyImage = settings?.appearance?.storyImage;

  return (
    <section className="py-28 bg-stone-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="relative z-10 rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
              {storyImage ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${storyImage})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-800 to-stone-900" />
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gold-400 text-stone-900 p-8 rounded-xl z-20 shadow-xl hidden md:block">
              <p className="font-heading text-3xl font-bold">{story.yearsValue}+</p>
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">{story.yearsLabel}</p>
            </div>
          </div>

          <div className="text-white">
            <h2 className="text-gold-400 font-heading text-lg tracking-[0.3em] uppercase mb-4">
              {story.sectionLabel}
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold mb-8 leading-tight">
              {story.title}, <br />
              <span className="text-gold-400">{story.titleAccent}</span>
            </h3>
            <p className="text-stone-400 text-lg leading-relaxed mb-8">{story.paragraph1}</p>
            <p className="text-stone-400 text-lg leading-relaxed mb-10">{story.paragraph2}</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-[1px] bg-brand-500" />
              <span className="font-heading italic text-xl text-gold-400">{story.signature}</span>
            </div>
            <Link
              href="/hakkimizda"
              className="group inline-flex items-center gap-2 mt-8 text-brand-400 font-medium hover:text-brand-300 transition-colors"
            >
              {story.linkText}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
