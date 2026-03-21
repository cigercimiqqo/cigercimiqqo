'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { SiteSettings } from '@/types';

export function NotificationSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getSettings().then((s) => { setSettings(s); setIsLoading(false); });
  }, []);

  async function handleSave() {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSettings({ notifications: settings.notifications });
      toast.success('Bildirim ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function updateNotif(field: string, value: unknown) {
    setSettings((prev) => prev ? { ...prev, notifications: { ...prev.notifications, [field]: value } } : prev);
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;

  const n = settings?.notifications || {} as SiteSettings['notifications'];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* SMS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">SMS Bildirimleri</h3>
          <button onClick={() => updateNotif('smsEnabled', !n.smsEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${n.smsEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${n.smsEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {n.smsEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SMS Sağlayıcı</label>
              <select value={n.smsProvider || 'netgsm'} onChange={(e) => updateNotif('smsProvider', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white">
                <option value="netgsm">Netgsm</option>
                <option value="iletimerkezi">İleti Merkezi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key (user:pass formatında)</label>
              <input type="password" value={n.smsApiKey || ''} onChange={(e) => updateNotif('smsApiKey', e.target.value)}
                placeholder="kullanıcıadı:şifre"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SMS Gönderilecek Numaralar (virgülle)</label>
              <input type="text" value={(n.smsNumbers || []).join(', ')} onChange={(e) => updateNotif('smsNumbers', e.target.value.split(',').map((s) => s.trim()))}
                placeholder="0555000000, 0544000000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">SMS Tetikleyicileri</p>
              {[
                { key: 'onNew', label: 'Yeni sipariş alındığında' },
                { key: 'onConfirmed', label: 'Sipariş onaylandığında' },
                { key: 'onOnTheWay', label: 'Sipariş yola çıktığında' },
                { key: 'onDelivered', label: 'Sipariş teslim edildiğinde' },
              ].map((t) => (
                <label key={t.key} className="flex items-center gap-2 py-1.5">
                  <input type="checkbox"
                    checked={(n.smsTriggers as Record<string, boolean>)?.[t.key] || false}
                    onChange={(e) => updateNotif('smsTriggers', { ...(n.smsTriggers || {}), [t.key]: e.target.checked })}
                    className="rounded border-gray-300 text-orange-500" />
                  <span className="text-sm text-gray-700">{t.label}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">WhatsApp</h3>
          <button onClick={() => updateNotif('whatsappEnabled', !n.whatsappEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${n.whatsappEnabled ? 'bg-green-500' : 'bg-gray-200'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${n.whatsappEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>
        {n.whatsappEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Numarası (+90 ile başlayın)</label>
            <input type="text" value={n.whatsappNumber || ''} onChange={(e) => updateNotif('whatsappNumber', e.target.value)}
              placeholder="+905551234567"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        Kaydet
      </button>
    </div>
  );
}
