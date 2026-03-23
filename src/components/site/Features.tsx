'use client';

import { motion } from 'framer-motion';
import { Flame, Leaf, Clock, Truck } from 'lucide-react';

const FEATURES = [
  { icon: Flame, title: 'Kömür Ateşi', desc: 'Geleneksel mangal pişirme' },
  { icon: Leaf, title: 'Taze Malzeme', desc: 'Günlük taze tedarik' },
  { icon: Clock, title: 'Yıllardır', desc: 'Tecrübeli ustalar' },
  { icon: Truck, title: 'Paket Servis', desc: 'Kapınıza kadar lezzet' },
];

export function Features() {
  return (
    <section className="relative -mt-1 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-900/50 border border-surface-800/50 hover:border-brand-500/30 hover:bg-surface-900 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors shrink-0">
                <f.icon size={20} className="text-brand-500" />
              </div>
              <div className="min-w-0">
                <p className="text-surface-100 font-medium text-sm">{f.title}</p>
                <p className="text-surface-500 text-xs mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
