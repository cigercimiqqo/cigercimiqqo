'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { getOrCreateVisitorId } from '@/lib/visitor';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Loader2, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { DistrictData } from '@/types';

interface OrderFormProps {
  onBack: () => void;
}

interface FormData {
  name: string;
  phone: string;
  il: string;
  ilce: string;
  mahalle: string;
  detay: string;
  paymentMethod: 'cash' | 'card_at_door';
  note: string;
  couponCode: string;
}

export function OrderForm({ onBack }: OrderFormProps) {
  const router = useRouter();
  const { items, total, subtotal, discountAmount, couponCode, applyCoupon, removeCoupon, clearCart } = useCartStore();
  const totalAmount = useCartStore((s) => s.total());
  const subTotal = useCartStore((s) => s.subtotal());

  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    il: '',
    ilce: '',
    mahalle: '',
    detay: '',
    paymentMethod: 'cash',
    note: '',
    couponCode: '',
  });

  useEffect(() => {
    fetch('/districts/tr-districts.json')
      .then((r) => r.json())
      .then(setDistricts)
      .catch(() => {});
  }, []);

  const selectedIl = districts.find((d) => d.il === form.il);
  const selectedIlce = selectedIl?.ilceler.find((i) => i.ilce === form.ilce);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'il') { next.ilce = ''; next.mahalle = ''; }
      if (field === 'ilce') { next.mahalle = ''; }
      return next;
    });
  }

  async function handleCoupon() {
    if (!couponInput.trim()) return;
    setIsCouponLoading(true);
    try {
      const { getCouponByCode } = await import('@/lib/firebase/firestore');
      const coupon = await getCouponByCode(couponInput);
      if (!coupon) throw new Error('Geçersiz kupon kodu');
      if (!coupon.isActive) throw new Error('Bu kupon aktif değil');
      if (coupon.maxUsage !== null && coupon.usageCount >= coupon.maxUsage) throw new Error('Kupon kullanım limiti dolmuş');
      if (subTotal < coupon.minOrderAmount) throw new Error(`Minimum sipariş tutarı ${formatPrice(coupon.minOrderAmount)}`);

      const discount = coupon.discountType === 'percent'
        ? (subTotal * coupon.discountValue) / 100
        : coupon.discountValue;

      applyCoupon(coupon.code, discount);
      toast.success(`Kupon uygulandı! ${formatPrice(discount)} indirim kazandınız.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Kupon uygulanamadı');
    } finally {
      setIsCouponLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.il || !form.ilce || !form.mahalle || !form.detay) {
      toast.error('Tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const { createOrder, incrementProductOrderCount, incrementCouponUsage } = await import('@/lib/firebase/firestore');
      const { Timestamp } = await import('firebase/firestore');
      const { generateOrderNumber } = await import('@/lib/utils');

      const visitorId = getOrCreateVisitorId();
      const fullText = `${form.mahalle}, ${form.ilce}, ${form.il} - ${form.detay}`;
      const orderNumber = generateOrderNumber();

      const orderId = await createOrder({
        orderNumber,
        customer: {
          name: form.name,
          phone: form.phone,
          address: { il: form.il, ilce: form.ilce, mahalle: form.mahalle, detay: form.detay, fullText },
        },
        items,
        subtotal: subTotal,
        total: totalAmount,
        discountAmount,
        couponCode: couponCode || undefined,
        paymentMethod: form.paymentMethod,
        note: form.note,
        status: 'new',
        statusHistory: [{ status: 'new', timestamp: Timestamp.now(), note: '' }],
        visitorId,
        isBlacklisted: false,
        createdAt: Timestamp.now(),
      });

      items.forEach((item) => incrementProductOrderCount(item.productId).catch(() => {}));
      if (couponCode) {
        const coupon = await import('@/lib/firebase/firestore').then((m) => m.getCouponByCode(couponCode));
        if (coupon) incrementCouponUsage(coupon.id).catch(() => {});
      }

      clearCart();
      toast.success(`Sipariş alındı! #${orderNumber}`);
      router.push(`/order?id=${orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sipariş verilemedi');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Customer info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Müşteri Bilgileri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                placeholder="Ad Soyad"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                required
                placeholder="0555 555 55 55"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Teslimat Adresi</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">İl *</label>
                <select
                  value={form.il}
                  onChange={(e) => update('il', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white"
                >
                  <option value="">İl seçin</option>
                  {districts.map((d) => (
                    <option key={d.il} value={d.il}>{d.il}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">İlçe *</label>
                <select
                  value={form.ilce}
                  onChange={(e) => update('ilce', e.target.value)}
                  required
                  disabled={!form.il}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white disabled:opacity-50"
                >
                  <option value="">İlçe seçin</option>
                  {selectedIl?.ilceler.map((i) => (
                    <option key={i.ilce} value={i.ilce}>{i.ilce}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mahalle *</label>
                <select
                  value={form.mahalle}
                  onChange={(e) => update('mahalle', e.target.value)}
                  required
                  disabled={!form.ilce}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white disabled:opacity-50"
                >
                  <option value="">Mahalle seçin</option>
                  {selectedIlce?.mahalleler.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adres Detayı *</label>
              <textarea
                value={form.detay}
                onChange={(e) => update('detay', e.target.value)}
                required
                rows={3}
                placeholder="Cadde, sokak, bina no, daire no..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Ödeme Yöntemi</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'cash', label: 'Kapıda Nakit' },
              { value: 'card_at_door', label: 'Kapıda Kart' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('paymentMethod', opt.value)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.paymentMethod === opt.value
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Sipariş Notu (Opsiyonel)</h3>
          <textarea
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
            rows={2}
            placeholder="Özel istekleriniz..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Sipariş Özeti</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-600 truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          {!couponCode ? (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Kupon kodu"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <button
                type="button"
                onClick={handleCoupon}
                disabled={isCouponLoading}
                className="px-3 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isCouponLoading ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 mb-4">
              <Tag size={14} className="text-green-600" />
              <span className="text-sm text-green-700 font-medium flex-1">{couponCode}</span>
              <button type="button" onClick={() => removeCoupon()} className="text-green-600 hover:text-green-800">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ara Toplam</span>
              <span className="font-semibold">{formatPrice(subTotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim</span>
                <span className="font-semibold">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Toplam</span>
              <span className="text-orange-500">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 size={18} className="animate-spin" /> Sipariş Veriliyor...</>
          ) : (
            `Sipariş Ver — ${formatPrice(totalAmount)}`
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Sepete Dön
        </button>
      </div>
    </form>
  );
}
