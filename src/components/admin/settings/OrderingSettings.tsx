'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { toast } from '@/lib/toast';
import { Loader2, Plus, X, Clock, Calendar } from 'lucide-react';
import type { SiteSettings, OrderingSettings, WorkingHours, SpecialDate } from '@/types';
import { mergeOrderingWithDefaults } from '@/lib/defaultOrdering';

const DAY_LABELS: Record<keyof OrderingSettings['workingHours'], string> = {
  mon: 'Pazartesi',
  tue: 'Salı',
  wed: 'Çarşamba',
  thu: 'Perşembe',
  fri: 'Cuma',
  sat: 'Cumartesi',
  sun: 'Pazar',
};

export function OrderingSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newIsClosed, setNewIsClosed] = useState(true);
  const [newOpen, setNewOpen] = useState('10:00');
  const [newClose, setNewClose] = useState('14:00');

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  async function handleSave() {
    const ordering = settings?.ordering;
    if (!ordering) return;
    setIsSaving(true);
    try {
      await updateSettings({ ordering } as Partial<SiteSettings>);
      toast.success('Sipariş ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function updateOrdering(partial: Partial<OrderingSettings>) {
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const current = mergeOrderingWithDefaults(base.ordering);
      return { ...base, ordering: { ...current, ...partial } } as SiteSettings;
    });
  }

  function updateDay(day: keyof OrderingSettings['workingHours'], wh: Partial<WorkingHours>) {
    const ordering = mergeOrderingWithDefaults(settings?.ordering);
    const hours = { ...ordering.workingHours, [day]: { ...ordering.workingHours[day], ...wh } };
    updateOrdering({ workingHours: hours });
  }

  function addSpecialDate() {
    if (!newDate) {
      toast.error('Tarih seçin');
      return;
    }
    const ordering = mergeOrderingWithDefaults(settings?.ordering);
    const existing = ordering.specialDates ?? [];
    if (existing.some((s) => s.date === newDate)) {
      toast.error('Bu tarih zaten ekli');
      return;
    }
    const entry: SpecialDate = newIsClosed
      ? { date: newDate, isClosed: true }
      : { date: newDate, isClosed: false, open: newOpen, close: newClose };
    const updated = [...existing, entry].sort((a, b) => a.date.localeCompare(b.date));
    updateOrdering({ specialDates: updated });
    setNewDate('');
    setNewIsClosed(true);
    setNewOpen('10:00');
    setNewClose('14:00');
  }

  function removeSpecialDate(date: string) {
    const ordering = mergeOrderingWithDefaults(settings?.ordering);
    const updated = (ordering.specialDates ?? []).filter((s) => s.date !== date);
    updateOrdering({ specialDates: updated });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    );
  }

  const ordering = mergeOrderingWithDefaults(settings?.ordering);
  const specialDates = ordering.specialDates ?? [];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Online sipariş */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Online Sipariş</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ordering.isOnline ?? true}
            onChange={(e) => updateOrdering({ isOnline: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Online sipariş al</span>
        </label>
      </div>

      {/* Çalışma saatleri */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Clock size={18} />
          Çalışma Saatleri
        </h3>
        <p className="text-sm text-gray-500 mb-4">Her gün için açılış ve kapanış saatlerini belirleyin.</p>

        <div className="space-y-3">
          {(Object.keys(DAY_LABELS) as (keyof OrderingSettings['workingHours'])[]).map((day) => {
            const wh = ordering.workingHours[day];
            const isClosed = wh?.isClosed ?? false;
            return (
              <div key={day} className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="w-28 text-sm font-medium text-gray-700">{DAY_LABELS[day]}</span>
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={isClosed}
                    onChange={(e) => updateDay(day, { isClosed: e.target.checked })}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  Kapalı
                </label>
                {!isClosed && (
                  <>
                    <input
                      type="time"
                      value={wh?.open ?? '11:00'}
                      onChange={(e) => updateDay(day, { open: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="time"
                      value={wh?.close ?? '23:00'}
                      onChange={(e) => updateDay(day, { close: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Özel tatil / özel saat günleri */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar size={18} />
          Özel Tarihler
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Tarih ekleyerek tam tatil (kapalı) veya yarım gün gibi farklı çalışma saatleri tanımlayabilirsiniz.
        </p>

        <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
            />
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={newIsClosed}
                onChange={(e) => setNewIsClosed(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              Kapalı
            </label>
            {!newIsClosed && (
              <>
                <input
                  type="time"
                  value={newOpen}
                  onChange={(e) => setNewOpen(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="time"
                  value={newClose}
                  onChange={(e) => setNewClose(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
                />
              </>
            )}
            <button
              onClick={addSpecialDate}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600"
            >
              <Plus size={15} />
              Ekle
            </button>
          </div>
        </div>

        {specialDates.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Henüz özel tarih eklenmedi</p>
        ) : (
          <div className="space-y-2">
            {specialDates.map((s) => (
              <div
                key={s.date}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  s.isClosed ? 'bg-amber-50 border border-amber-100' : 'bg-sky-50 border border-sky-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{s.date}</span>
                  {s.isClosed ? (
                    <span className="text-xs font-medium text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Kapalı</span>
                  ) : (
                    <span className="text-xs font-medium text-sky-700 bg-sky-200/60 px-2 py-0.5 rounded">
                      {s.open} – {s.close}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeSpecialDate(s.date)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Min sipariş & mesaj */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Ek Ayarlar</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum sipariş tutarı (₺)</label>
          <input
            type="number"
            min={0}
            step={1}
            value={ordering.minOrderAmount ?? 0}
            onChange={(e) => updateOrdering({ minOrderAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Yoğunluk mesajı</label>
          <input
            type="text"
            value={ordering.busyMessage ?? ''}
            onChange={(e) => updateOrdering({ busyMessage: e.target.value })}
            placeholder="Şu an sipariş alamıyoruz..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60"
      >
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        Kaydet
      </button>
    </div>
  );
}
