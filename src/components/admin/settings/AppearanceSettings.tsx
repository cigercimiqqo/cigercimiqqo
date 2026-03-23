'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/upload';
import { toast } from 'sonner';
import { Loader2, ImagePlus, X, Plus } from 'lucide-react';
import type { SiteSettings } from '@/types';

const THEMES = [
  { value: 'classic', label: 'Klasik', description: 'Geleneksel restoran görünümü' },
  { value: 'modern', label: 'Modern', description: 'Minimalist ve şık' },
  { value: 'minimal', label: 'Minimal', description: 'Temiz ve sade' },
  { value: 'luxury', label: 'Lüks', description: 'Premium görünüm' },
] as const;

export function AppearanceSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);

  useEffect(() => {
    getSettings().then((s) => { setSettings(s); setIsLoading(false); });
  }, []);

  async function handleSave() {
    const appearance = (settings?.appearance ?? {}) as Partial<SiteSettings['appearance']>;
    setIsSaving(true);
    try {
      await updateSettings({ appearance } as Partial<SiteSettings>);
      toast.success('Görünüm ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function updateAppearance(field: string, value: unknown) {
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const current = base.appearance ?? ({} as Partial<SiteSettings['appearance']>);
      return { ...base, appearance: { ...current, [field]: value } } as SiteSettings;
    });
  }

  async function handleHeroUpload(file: File) {
    setHeroUploading(true);
    try {
      const result = await uploadFile(file, 'hero');
      const current = settings?.appearance?.heroImages || [];
      updateAppearance('heroImages', [...current, result.url]);
    } catch {
      toast.error('Yükleme başarısız');
    } finally {
      setHeroUploading(false);
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;

  const appearance = settings?.appearance || {} as SiteSettings['appearance'];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Theme */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Tema Seçimi</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.value}
              onClick={() => updateAppearance('theme', theme.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                appearance.theme === theme.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-sm text-gray-900">{theme.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{theme.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Renkler</h3>
        {[
          { key: 'primaryColor' as const, label: 'Ana Renk', default: '#e85d04' },
          { key: 'secondaryColor' as const, label: 'İkincil Renk', default: '#1a1a2e' },
          { key: 'accentColor' as const, label: 'Vurgu Rengi', default: '#ffd60a' },
        ].map((c) => (
          <div key={c.key} className="flex items-center gap-4">
            <input
              type="color"
              value={appearance[c.key] || c.default}
              onChange={(e) => updateAppearance(c.key, e.target.value)}
              className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{c.label}</p>
              <p className="text-xs text-gray-400 font-mono">{appearance[c.key] || c.default}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hero images */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Hero Banner Görselleri</h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap">
            {(appearance.heroImages || []).map((img, i) => (
              <div key={i} className="relative w-28 h-20 rounded-xl overflow-hidden">
                <Image src={img} alt="" fill className="object-cover" />
                <button
                  onClick={() => updateAppearance('heroImages', (appearance.heroImages || []).filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <label className="w-28 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-orange-400 transition-colors">
              {heroUploading ? <Loader2 size={18} className="animate-spin text-orange-500" /> : <Plus size={18} className="text-gray-400" />}
              <span className="text-xs text-gray-400">Ekle</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleHeroUpload(e.target.files[0])} />
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="veya görsel linki yapıştır"
              id="hero-url"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const url = input.value.trim();
                  if (url) { updateAppearance('heroImages', [...(appearance.heroImages || []), url]); input.value = ''; }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('hero-url') as HTMLInputElement;
                const url = input?.value?.trim();
                if (url) { updateAppearance('heroImages', [...(appearance.heroImages || []), url]); input.value = ''; }
              }}
              className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200"
            >
              Link Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Story / Stats / CTA / Gallery images */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900 mb-4">Ek Görseller</h3>
        {[
          { key: 'storyImage' as const, label: 'Hikaye Bölümü Görseli' },
          { key: 'statsImage' as const, label: 'İstatistik Arka Plan' },
          { key: 'ctaImage' as const, label: 'CTA Arka Plan' },
        ].map(({ key, label }) => (
          <div key={key}>
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                {(appearance[key] && typeof appearance[key] === 'string') && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                    <Image src={appearance[key] as string} alt="" fill className="object-cover" />
                  </div>
                )}
                <label className="border-2 border-dashed border-gray-200 rounded-lg px-4 py-2 text-sm cursor-pointer hover:border-orange-400">
                  {appearance[key] ? 'Değiştir' : 'Yükle'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const result = await uploadFile(file, 'general');
                        updateAppearance(key, result.url);
                      } catch {
                        toast.error('Yükleme başarısız');
                      }
                    }}
                  />
                </label>
                {appearance[key] && (
                  <button
                    onClick={() => updateAppearance(key, '')}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Kaldır
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder="veya görsel linki yapıştır"
                value={(appearance[key] as string) || ''}
                onChange={(e) => updateAppearance(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>
        ))}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Galeri Görselleri</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 flex-wrap">
              {(appearance.galleryImages || []).map((img: string, i: number) => (
                <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button
                    onClick={() =>
                      updateAppearance(
                        'galleryImages',
                        (appearance.galleryImages || []).filter((_: string, idx: number) => idx !== i)
                      )
                    }
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-400">
                <Plus size={16} className="text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const result = await uploadFile(file, 'general');
                      updateAppearance('galleryImages', [...(appearance.galleryImages || []), result.url]);
                    } catch {
                      toast.error('Yükleme başarısız');
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="veya görsel linki yapıştır"
                id="gallery-url"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    const url = input.value.trim();
                    if (url) { updateAppearance('galleryImages', [...(appearance.galleryImages || []), url]); input.value = ''; }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('gallery-url') as HTMLInputElement;
                  const url = input?.value?.trim();
                  if (url) { updateAppearance('galleryImages', [...(appearance.galleryImages || []), url]); input.value = ''; }
                }}
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200"
              >
                Link Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-2">Özel CSS</h3>
        <p className="text-xs text-gray-500 mb-3">İleri düzey kullanıcılar için</p>
        <textarea
          value={appearance.customCss || ''}
          onChange={(e) => updateAppearance('customCss', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-orange-500/30 resize-y"
          placeholder="/* Özel CSS kuralları */"
        />
      </div>

      <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        Kaydet
      </button>
    </div>
  );
}
