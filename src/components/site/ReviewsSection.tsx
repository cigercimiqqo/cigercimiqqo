'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

function ReviewCard({ review }: { review: Review }) {
  const dateStr = review.createdAt ? formatReviewDate(review.createdAt) : '';
  return (
    <div className="shrink-0 w-[min(320px,85vw)] snap-center">
      <div className="bg-surface-900 border border-surface-800/50 rounded-2xl p-6 h-full flex flex-col text-left">
        <div className="flex items-start gap-3 mb-4">
          {review.authorAvatar ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-surface-700">
              <Image src={review.authorAvatar} alt={review.authorName} fill className="object-cover" sizes="44px" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-heading font-bold shrink-0">
              {review.authorName?.[0] ?? '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-surface-100 text-sm">{review.authorName}</p>
            {review.badge ? <p className="text-surface-500 text-xs mt-0.5">{review.badge}</p> : null}
          </div>
          {review.platform === 'google' && (
            <div className="shrink-0 w-6 h-6" title="Google">
              <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex gap-0.5" role="img" aria-label={`${review.rating}/5 puan`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-600'} />
            ))}
          </div>
          {dateStr ? <span className="text-surface-500 text-xs">{dateStr}</span> : null}
          {review.tags?.map((t) => (
            <span key={t} className="text-xs bg-surface-800 text-surface-400 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
        {review.priceRange ? <p className="text-surface-400 text-xs mb-2">{review.priceRange}</p> : null}
        <p className="text-surface-200 text-sm leading-relaxed line-clamp-4 flex-1">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getReviews(true).then(setReviews).catch(() => {});
  }, []);

  const hasReviews = reviews.length > 0;

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = Math.min(320, window.innerWidth * 0.85) + 16;
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  }

  return (
    <section className="py-20 md:py-28 bg-surface-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Misafirlerimizden" subtitle="Yorumlar" />

        {!hasReviews ? (
          <div className="bg-surface-900 border border-surface-800/50 rounded-2xl p-8 md:p-12 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-heading font-semibold text-surface-200 mb-2">Henüz yorum yok</h3>
            <p className="text-surface-400 text-sm max-w-md mx-auto">
              Müşteri yorumları burada görünecek. Admin panelinden yorum ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-300 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all shadow-lg"
              aria-label="Sola kaydır"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-300 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all shadow-lg"
              aria-label="Sağa kaydır"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
