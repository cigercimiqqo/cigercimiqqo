'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { getReviews } from '@/lib/firebase/firestore';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Review } from '@/types';

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getReviews(true).then(setReviews).catch(() => {});
  }, []);

  const item = reviews[current];
  const next = () => setCurrent((p) => (p + 1) % reviews.length);
  const prev = () => setCurrent((p) => (p - 1 + reviews.length) % reviews.length);

  if (!reviews.length) return null;

  function formatDate(ts: { toDate: () => Date } | null): string {
    if (!ts) return '';
    return ts.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <section className="py-20 md:py-28 bg-surface-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Misafirlerimizden" subtitle="Yorumlar" />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-900 border border-surface-800/50 rounded-2xl p-8 md:p-12 text-center"
            >
              <Quote size={40} className="text-brand-500/20 mx-auto mb-6" />

              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < (item?.rating ?? 0) ? 'text-gold-400 fill-gold-400' : 'text-surface-700'
                    }
                  />
                ))}
              </div>

              <p className="text-surface-200 text-lg md:text-xl leading-relaxed italic mb-8 max-w-2xl mx-auto">
                &ldquo;{item?.text ?? ''}&rdquo;
              </p>

              <div>
                <p className="text-surface-100 font-heading font-semibold text-lg">{item?.authorName ?? ''}</p>
                <p className="text-surface-500 text-sm mt-1">
                  {item?.createdAt ? formatDate(item.createdAt) : ''}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
              aria-label="Önceki yorum"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-brand-500 w-6' : 'bg-surface-700 hover:bg-surface-600'
                  }`}
                  aria-label={`Yorum ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
              aria-label="Sonraki yorum"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
