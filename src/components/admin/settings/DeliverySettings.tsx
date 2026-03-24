'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import { Loader2, Plus, X } from 'lucide-react';
import type { SiteSettings, DeliveryDistrict } from '@/types';
import type { DistrictData } from '@/types';

export function DeliverySettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newDistrict, setNewDistrict] = useState({ il: '', ilce: '', mahalle: '', minOrder: '' });

  useEffect(() => {
    Promise.all([
      getSettings(),
      fetch('/districts/tr-districts.json').then((r) => r.json()).catch(() => []),
    ]).then(([s, d]) => {
      setSettings(s);
      setDistricts(d);
      setIsLoading(false);
    });
  }, []);

  async function handleSave() {
    const delivery = (settings?.delivery ?? {}) as Partial<SiteSettings['delivery']>;
    setIsSaving(true);
    try {
      await updateSettings({ delivery } as Partial<SiteSettings>);
      toast.success('Teslimat ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function addDistrict() {
    if (!newDistrict.il || !newDistrict.ilce) {
      toast.error('İl ve ilçe seçin');
      return;
    }
    const entry: DeliveryDistrict = {
      il: newDistrict.il,
      ilce: newDistrict.ilce,
      mahalle: newDistrict.mahalle,
      minOrder: parseFloat(newDistrict.minOrder) || 0,
    };
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const delivery = base.delivery ?? ({} as Partial<SiteSettings['delivery']>);
      const districts = delivery.districts ?? [];
      return { ...base, delivery: { ...delivery, districts: [...districts, entry] } } as SiteSettings;
    });
    setNewDistrict({ il: '', ilce: '', mahalle: '', minOrder: '' });
  }

  function removeDistrict(i: number) {
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const delivery = base.delivery ?? ({} as Partial<SiteSettings['delivery']>);
      const districts = (delivery.districts ?? []).filter((_, idx) => idx !== i);
      return { ...base, delivery: { ...delivery, districts } } as SiteSettings;
    });
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;

  const deliveryDistricts = settings?.delivery?.districts || [];
  const selectedIl = districts.find((d) => d.il === newDistrict.il);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Teslimat Bölgeleri</h3>
        <p className="text-sm text-gray-500 mb-4">Teslimat yapılacak bölgeleri ve minimum sipariş tutarlarını belirleyin.</p>

        {/* Add district form */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <select value={newDistrict.il} onChange={(e) => setNewDistrict((p) => ({ ...p, il: e.target.value, ilce: '', mahalle: '' }))}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white">
            <option value="">İl</option>
            {districts.map((d) => <option key={d.il} value={d.il}>{d.il}</option>)}
          </select>
          <select value={newDistrict.ilce} onChange={(e) => setNewDistrict((p) => ({ ...p, ilce: e.target.value, mahalle: '' }))} disabled={!newDistrict.il}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white disabled:opacity-50">
            <option value="">İlçe</option>
            {selectedIl?.ilceler.map((i) => <option key={i.ilce} value={i.ilce}>{i.ilce}</option>)}
          </select>
          <input type="number" step="0.01" value={newDistrict.minOrder} onChange={(e) => setNewDistrict((p) => ({ ...p, minOrder: e.target.value }))}
            placeholder="Min sipariş (₺)" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
          <button onClick={addDistrict} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">
            <Plus size={15} />Ekle
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {deliveryDistricts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Henüz bölge eklenmedi</p>
          ) : deliveryDistricts.map((d, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{d.il} / {d.ilce} {d.mahalle && `/ ${d.mahalle}`}</p>
                <p className="text-xs text-gray-500">Min sipariş: {d.minOrder > 0 ? `${d.minOrder} ₺` : 'Yok'}</p>
              </div>
              <button onClick={() => removeDistrict(i)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        Kaydet
      </button>
    </div>
  );
}
