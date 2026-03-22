'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getReviews, createReview, updateReview, deleteReview } from '@/lib/firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Star, ImagePlus } from 'lucide-react';
import { Timestamp } from 'firebase/firestore/lite';
import type { Review } from '@/types';

const defaultForm = { authorName: '', text: '', rating: 5, platform: 'google' as 'google' | 'custom', authorAvatar: '', order: 0, isVisible: true };

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => { loadReviews(); }, []);

  async function loadReviews() {
    setIsLoading(true);
    try { setReviews(await getReviews(false)); } catch { toast.error('Yüklenemedi'); } finally { setIsLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateReview(editingId, form);
        setReviews((prev) => prev.map((r) => r.id === editingId ? { ...r, ...form } : r));
        toast.success('Yorum güncellendi');
      } else {
        const id = await createReview({ ...form, createdAt: Timestamp.now() });
        setReviews((prev) => [...prev, { id, ...form, createdAt: Timestamp.now() }]);
        toast.success('Yorum eklendi');
      }
      setForm(defaultForm); setEditingId(null); setShowForm(false);
    } catch { toast.error('İşlem başarısız'); } finally { setIsSubmitting(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{reviews.length} yorum</p>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(defaultForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">
          <Plus size={16} />Yeni Yorum
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editingId ? 'Düzenle' : 'Yeni Yorum'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
              <input type="text" value={form.authorName} onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
              <select value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value as 'google' | 'custom' }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white">
                <option value="google">Google</option>
                <option value="custom">Özel</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Puan</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm((p) => ({ ...p, rating: n }))}>
                  <Star size={24} className={n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Yorum Metni</label>
            <textarea value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}{editingId ? 'Güncelle' : 'Ekle'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">İptal</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4">
              {review.authorAvatar ? (
                <Image src={review.authorAvatar} alt={review.authorName} width={40} height={40} className="rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">{review.authorName[0]}</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-gray-900">{review.authorName}</p>
                  <div className="flex gap-0.5">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}</div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 rounded">{review.platform}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{review.text}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => updateReview(review.id, { isVisible: !review.isVisible }).then(() => setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, isVisible: !r.isVisible } : r)))} className={`p-1.5 rounded-lg transition-colors ${review.isVisible ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}>
                  {review.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => { setForm({ authorName: review.authorName, text: review.text, rating: review.rating, platform: review.platform, authorAvatar: review.authorAvatar, order: review.order, isVisible: review.isVisible }); setEditingId(review.id); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                  <Pencil size={15} />
                </button>
                <button onClick={() => { if (confirm('Sil?')) deleteReview(review.id).then(() => setReviews((prev) => prev.filter((r) => r.id !== review.id))); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
