'use client';

import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/firebase/firestore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import type { Coupon } from '@/types';

const defaultForm = { code: '', discountType: 'percent' as 'percent' | 'amount', discountValue: '', minOrderAmount: '', maxUsage: '', isActive: true };

export function CouponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { getCoupons().then((c) => { setCoupons(c); setIsLoading(false); }); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data: Omit<Coupon, 'id' | 'createdAt'> = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        maxUsage: form.maxUsage ? parseInt(form.maxUsage) : null,
        usageCount: 0,
        isActive: form.isActive,
        expiresAt: null,
      };
      if (editingId) {
        await updateCoupon(editingId, data);
        setCoupons((prev) => prev.map((c) => c.id === editingId ? { ...c, ...data } : c));
        toast.success('Kupon güncellendi');
      } else {
        const id = await createCoupon(data);
        setCoupons((prev) => [{ id, ...data, createdAt: Timestamp.now() }, ...prev]);
        toast.success('Kupon oluşturuldu');
      }
      setForm(defaultForm); setEditingId(null); setShowForm(false);
    } catch { toast.error('İşlem başarısız'); } finally { setIsSubmitting(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{coupons.length} kupon</p>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(defaultForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">
          <Plus size={16} />Yeni Kupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editingId ? 'Kupon Düzenle' : 'Yeni Kupon'}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kod</label>
              <input type="text" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} required placeholder="HOSGELDIN" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tür</label>
              <select value={form.discountType} onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as 'percent' | 'amount' }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white">
                <option value="percent">Yüzde (%)</option>
                <option value="amount">Tutar (₺)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Değer</label>
              <input type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))} required placeholder={form.discountType === 'percent' ? '10 (%10)' : '25 (₺25)'} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Sipariş (₺)</label>
              <input type="number" step="0.01" value={form.minOrderAmount} onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))} placeholder="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Kullanım (boş = sınırsız)</label>
              <input type="number" value={form.maxUsage} onChange={(e) => setForm((p) => ({ ...p, maxUsage: e.target.value }))} placeholder="Sınırsız" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input type="checkbox" id="couponActive" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded border-gray-300 text-orange-500" />
              <label htmlFor="couponActive" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}{editingId ? 'Güncelle' : 'Oluştur'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">İptal</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {coupons.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Kupon yok</div>
            ) : coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Tag size={18} className="text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold font-mono text-gray-900">{coupon.code}</p>
                  <p className="text-xs text-gray-500">{coupon.discountType === 'percent' ? `%${coupon.discountValue}` : formatPrice(coupon.discountValue)} · {coupon.usageCount}/{coupon.maxUsage ?? '∞'} kullanım</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setForm({ code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue.toString(), minOrderAmount: coupon.minOrderAmount.toString(), maxUsage: coupon.maxUsage?.toString() || '', isActive: coupon.isActive }); setEditingId(coupon.id); setShowForm(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => { if (confirm('Sil?')) deleteCoupon(coupon.id).then(() => setCoupons((prev) => prev.filter((c) => c.id !== coupon.id))); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
