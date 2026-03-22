'use client';

import { useState, useEffect } from 'react';
import { getReviews } from '@/lib/firebase/firestore';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Review } from '@/types';

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getReviews(true).then(setReviews).catch(() => {});
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Müşteri Yorumları</h2>
        <p className="text-gray-500 mt-2 text-sm">Gerçek müşteri deneyimleri</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {review.platform === 'google' && (
              <div className="flex items-center gap-1.5 mb-3">
                <Image src="/google-logo.svg" alt="Google" width={14} height={14} />
                <span className="text-xs text-gray-500 font-medium">Google Yorumu</span>
              </div>
            )}

            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                />
              ))}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-4">&ldquo;{review.text}&rdquo;</p>

            <div className="flex items-center gap-2.5">
              {review.authorAvatar ? (
                <Image
                  src={review.authorAvatar}
                  alt={review.authorName}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                  {review.authorName[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{review.authorName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
