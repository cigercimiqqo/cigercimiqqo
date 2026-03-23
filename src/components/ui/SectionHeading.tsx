'use client';

import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  light,
  center = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${center ? 'text-center' : ''}`}
    >
      {subtitle && (
        <div
          className={`flex items-center gap-4 mb-4 ${center ? 'justify-center' : ''}`}
        >
          <span className="h-px w-8 bg-brand-500" />
          <span className="text-brand-500 font-body text-sm tracking-[0.2em] uppercase font-medium">
            {subtitle}
          </span>
          <span className="h-px w-8 bg-brand-500" />
        </div>
      )}
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold ${
          light ? 'text-surface-900' : 'text-surface-100'
        }`}
      >
        {title}
      </h2>
      <div className={`mt-4 flex ${center ? 'justify-center' : ''}`}>
        <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
      </div>
    </motion.div>
  );
}
