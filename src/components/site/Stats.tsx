'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { getDefaultContent } from '@/lib/defaultContent';
import type { StatItem } from '@/types';

function Counter({ item }: { item: StatItem }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const target = item.value;
  const min = item.min ?? 0;
  const max = item.max ?? target;

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const range = Math.min(max, Math.max(min, target));
    const increment = range / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target, min, max]);

  return (
    <span ref={ref} className="font-heading text-4xl md:text-5xl font-bold text-white">
      {item.decimal ? count.toFixed(1) : Math.floor(count)}
      {item.suffix}
    </span>
  );
}

export function Stats() {
  const { settings } = useSettingsStore();
  const content = settings?.content ?? getDefaultContent();
  const stats = content.stats;
  const statsImage = settings?.appearance?.statsImage;

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        {statsImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${statsImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-stone-950" />
        )}
        <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-28 border-y border-stone-700/20 py-16">
          {stats.items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <Counter item={item} />
              <span className="text-stone-400 font-medium tracking-widest uppercase text-xs block mt-2">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
