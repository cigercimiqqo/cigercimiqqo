'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/upload';
import { toast } from 'sonner';
import { Loader2, Plus, X, ImagePlus } from 'lucide-react';
import type { SiteSettings } from '@/types';

const DEFAULT_SOCIAL = { instagram: '', facebook: '', youtube: '', twitter: '', tiktok: '' };

export function GeneralSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  async function handleSave() {
    const general = (settings?.general ?? {}) as Partial<SiteSettings['general']>;
    setIsSaving(true);
    try {
      await updateSettings({ general } as Partial<SiteSettings>);
      toast.success('Genel ayarlar kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function updateGeneral(field: string, value: unknown) {
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const currentGeneral = base.general ?? ({} as Partial<SiteSettings['general']>);
      return { ...base, general: { ...currentGeneral, [field]: value } } as SiteSettings;
    });
  }

  function updateSocial(field: string, value: string) {
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const currentGeneral = base.general ?? ({} as Partial<SiteSettings['general']>);
      const social = currentGeneral.socialMedia ?? DEFAULT_SOCIAL;
      return {
        ...base,
        general: { ...currentGeneral, socialMedia: { ...social, [field]: value } },
      } as SiteSettings;
    });
  }

  async function handleLogoUpload(file: File, type: 'logo' | 'favicon') {
    type === 'logo' ? setLogoUploading(true) : setFaviconUploading(true);
    try {
      const result = await uploadFile(file, 'logo');
      updateGeneral(type, result.url);
      toast.success('Görsel yüklendi');
    } catch {
      toast.error('Yükleme başarısız');
    } finally {
      type === 'logo' ? setLogoUploading(false) : setFaviconUploading(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;
  }

  const general = settings?.general || {} as SiteSettings['general'];
  const social = general.socialMedia || DEFAULT_SOCIAL;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Site Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Site Bilgileri</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Adı</label>
          <input
            type="text"
            value={general.siteName || ''}
            onChange={(e) => updateGeneral('siteName', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Açıklaması</label>
          <textarea
            value={general.siteDescription || ''}
            onChange={(e) => updateGeneral('siteDescription', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Anahtar Kelimeler</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {(general.siteKeywords || []).map((kw, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                {kw}
                <button onClick={() => updateGeneral('siteKeywords', (general.siteKeywords || []).filter((_, idx) => idx !== i))}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newKeyword.trim()) {
                  updateGeneral('siteKeywords', [...(general.siteKeywords || []), newKeyword.trim()]);
                  setNewKeyword('');
                  e.preventDefault();
                }
              }}
              placeholder="Kelime ekle + Enter"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Analytics 4 ID</label>
          <input
            type="text"
            value={general.ga4TrackingId || ''}
            onChange={(e) => updateGeneral('ga4TrackingId', e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
          />
        </div>
      </div>

      {/* Logo & Favicon */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Logo & Favicon</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Logo</p>
            <div className="flex items-center gap-3">
              {general.logo && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                  <Image src={general.logo} alt="Logo" width={48} height={48} className="object-contain" />
                </div>
              )}
              <label className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">
                {logoUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                {logoUploading ? 'Yükleniyor...' : 'Seç'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0], 'logo')} />
              </label>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Favicon</p>
            <div className="flex items-center gap-3">
              {general.favicon && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                  <Image src={general.favicon} alt="Favicon" width={48} height={48} className="object-contain" />
                </div>
              )}
              <label className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">
                {faviconUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                {faviconUploading ? 'Yükleniyor...' : 'Seç'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0], 'favicon')} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">İletişim</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon Numaraları</label>
          <div className="space-y-2 mb-2">
            {(general.phone || []).map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const phones = [...(general.phone || [])];
                    phones[i] = e.target.value;
                    updateGeneral('phone', phones);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                <button onClick={() => updateGeneral('phone', (general.phone || []).filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="0555 555 55 55"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <button
              type="button"
              onClick={() => { if (newPhone.trim()) { updateGeneral('phone', [...(general.phone || []), newPhone.trim()]); setNewPhone(''); } }}
              className="px-3 py-2.5 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Adres</label>
          <textarea
            value={general.address || ''}
            onChange={(e) => updateGeneral('address', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Sosyal Medya</h3>
        {(['instagram', 'facebook', 'youtube', 'twitter', 'tiktok'] as const).map((platform) => (
          <div key={platform}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">{platform}</label>
            <input
              type="url"
              value={social[platform] || ''}
              onChange={(e) => updateSocial(platform, e.target.value)}
              placeholder={`https://${platform}.com/...`}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        ))}
      </div>

      {/* Maintenance mode */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Bakım Modu</p>
            <p className="text-sm text-gray-500 mt-0.5">Aktifken müşteriler siteyi göremez</p>
          </div>
          <button
            onClick={() => updateGeneral('maintenanceMode', !general.maintenanceMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${general.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${general.maintenanceMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        Kaydet
      </button>
    </div>
  );
}
