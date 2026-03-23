'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews } from '@/lib/firebase/firestore';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Review } from '@/types';

/** Gerçek tarihe göre akıllı format: yakınsa göreli, uzaksa tam tarih */
function formatReviewDate(ts: { toDate: () => Date } | null): string {
  if (!ts) return '';
  const d = ts.toDate();
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays < 1) return 'bugün';
  if (diffDays === 1) return 'dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffWeeks === 1) return 'bir hafta önce';
  if (diffWeeks < 5) return `${diffWeeks} hafta önce`;
  if (diffMonths === 1) return 'bir ay önce';
  if (diffMonths < 12) return `${diffMonths} ay önce`;
  if (diffYears === 1) return 'bir yıl önce';
  if (diffYears < 5) return `${diffYears} yıl önce`;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getReviews(true).then(setReviews).catch(() => {});
  }, []);

  const item = reviews[current];
  const next = () => setCurrent((p) => (p + 1) % reviews.length);
  const prev = () => setCurrent((p) => (p - 1 + reviews.length) % reviews.length);

  const hasReviews = reviews.length > 0;
  const dateStr = item?.createdAt ? formatReviewDate(item.createdAt) : '';

  return (
    <section className="py-20 md:py-28 bg-surface-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Misafirlerimizden" subtitle="Yorumlar" />

        <div className="relative">
          {!hasReviews ? (
            <div className="bg-surface-900 border border-surface-800/50 rounded-2xl p-8 md:p-12 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-heading font-semibold text-surface-200 mb-2">Henüz yorum yok</h3>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Müşteri yorumları burada görünecek. Admin panelinden yorum ekleyebilirsiniz.
              </p>
            </div>
          ) : (
          <>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-900 border border-surface-800/50 rounded-2xl p-6 md:p-8 text-left"
            >
              {/* Google tarzı üst: avatar + isim + rozet */}
              <div className="flex items-start gap-4 mb-5">
                {item?.authorAvatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-surface-700">
                    <Image src={item.authorAvatar} alt={item.authorName ?? ''} fill className="object-cover" sizes="48px" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-heading font-bold text-lg shrink-0">
                    {item?.authorName?.[0] ?? '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-surface-100">{item?.authorName ?? ''}</p>
                  {item?.badge ? <p className="text-surface-500 text-xs mt-0.5">{item.badge}</p> : null}
                </div>
                {item?.platform === 'google' && (
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center" title="Google">
                    <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Yıldız + tarih + etiketler */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex gap-0.5" role="img" aria-label={`${item?.rating ?? 0}/5 puan`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < (item?.rating ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-surface-600'}
                    />
                  ))}
                </div>
                {dateStr ? <span className="text-surface-500 text-sm">{dateStr}</span> : null}
                {item?.tags?.length ? item.tags.map((t) => <span key={t} className="text-xs bg-surface-800 text-surface-400 px-2 py-0.5 rounded">{t}</span>) : null}
              </div>

              {item?.priceRange ? <p className="text-surface-400 text-sm mb-3">{item.priceRange}</p> : null}

              <p className="text-surface-200 text-base md:text-lg leading-relaxed">
                &ldquo;{item?.text ?? ''}&rdquo;
              </p>
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
          </>
          )}
        </div>
      </div>
    </section>
  );
}
