'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

const DEFAULT_STATS = [
  { value: 35, suffix: '+', label: 'Yıllık Deneyim' },
  { value: 500, suffix: 'K+', label: 'Mutlu Müşteri' },
  { value: 15, suffix: '+', label: 'Çeşit Lezzet' },
  { value: 4.9, suffix: '', label: 'Ortalama Puan', decimal: true },
];

function Counter({
  target,
  decimal,
  suffix,
}: {
  target: number;
  decimal?: boolean;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
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
  }, [inView, target]);

  return (
    <span
      ref={ref}
      className="font-heading text-4xl md:text-5xl font-bold text-white"
    >
      {decimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export function Stats() {
  const { settings } = useSettingsStore();
  const statsImage = settings?.appearance?.statsImage;

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        {statsImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${statsImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-surface-950" />
        )}
        <div className="absolute inset-0 bg-brand-950/85 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
          {DEFAULT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Counter
                target={stat.value}
                decimal={stat.decimal}
                suffix={stat.suffix}
              />
              <p className="text-brand-200/70 text-sm mt-2 tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
