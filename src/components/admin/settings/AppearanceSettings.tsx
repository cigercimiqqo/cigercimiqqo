'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/upload';
import { addToRecentUploads } from '@/lib/mediaLibrary';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { toast } from 'sonner';
import { Loader2, ImagePlus, X, Plus, Sun, Moon, LayoutGrid, List } from 'lucide-react';
import { SitePreview } from '@/components/admin/SitePreview';
import type { SiteSettings } from '@/types';

const SITE_COLORS = [
  { name: 'Kırmızı', value: '#c8102e' },
  { name: 'Bordo', value: '#800020' },
  { name: 'Turuncu', value: '#ea580c' },
  { name: 'Koyu Yeşil', value: '#2d5016' },
  { name: 'Lacivert', value: '#1b2a4a' },
];

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
  const [pickerTarget, setPickerTarget] = useState<'hero' | 'storyImage' | 'statsImage' | 'ctaImage' | 'gallery' | null>(null);

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
      addToRecentUploads(result.url, 'hero');
      const current = settings?.appearance?.heroImages || [];
      updateAppearance('heroImages', [...current, result.url]);
    } catch {
      toast.error('Yükleme başarısız');
    } finally {
      setHeroUploading(false);
    }
  }

  function handlePickerSelect(url: string) {
    if (!pickerTarget) return;
    if (pickerTarget === 'hero') {
      updateAppearance('heroImages', [...(appearance.heroImages || []), url]);
    } else if (pickerTarget === 'gallery') {
      updateAppearance('galleryImages', [...(appearance.galleryImages || []), url]);
    } else {
      updateAppearance(pickerTarget, url);
    }
    setPickerTarget(null);
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;

  const appearance = settings?.appearance || {} as SiteSettings['appearance'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
      {/* Site Tercihleri - Ziyaretçiye ayar gösterilmez, admin'den yönetilir */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Site Tercihleri</h3>
        <p className="text-sm text-gray-500 mb-4">Tema, renk ve bölüm görünürlüğü. Ziyaretçilere ayar paneli gösterilmez.</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Açık / Koyu Tema</p>
            <div className="flex gap-2">
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateAppearance('siteTheme', t)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    (appearance.siteTheme ?? 'light') === t
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                  {t === 'light' ? 'Açık' : 'Koyu'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Ana Renk</p>
            <div className="flex gap-2 flex-wrap">
              {SITE_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateAppearance('sitePrimaryColor', c.value)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    (appearance.sitePrimaryColor || appearance.primaryColor || '#c8102e') === c.value
                      ? 'border-orange-500 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Hero Stili</p>
            <div className="flex gap-2">
              {(['full', 'split'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateAppearance('heroStyle', s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    (appearance.heroStyle ?? 'full') === s
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'full' ? 'Tam Ekran' : 'Bölünmüş'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Menü Düzeni</p>
            <div className="flex gap-2">
              {(['grid', 'list'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => updateAppearance('menuLayout', l)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    (appearance.menuLayout ?? 'grid') === l
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {l === 'grid' ? <LayoutGrid size={18} /> : <List size={18} />}
                  {l === 'grid' ? 'Izgara' : 'Liste'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Bölümler</p>
            <div className="space-y-2">
              {[
                { key: 'showFeatures' as const, label: 'Özellikler Barı' },
                { key: 'showStats' as const, label: 'İstatistikler' },
                { key: 'showTestimonials' as const, label: 'Müşteri Yorumları' },
                { key: 'showGallery' as const, label: 'Galeri Önizleme' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <input
                    type="checkbox"
                    checked={appearance[key] !== false}
                    onChange={(e) => updateAppearance(key, e.target.checked)}
                    className="rounded border-gray-300 text-orange-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

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
            <button
              type="button"
              onClick={() => setPickerTarget('hero')}
              className="w-28 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-orange-400 text-xs text-gray-500"
            >
              Yüklü olanlardan seç
            </button>
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
                <div className="flex gap-2">
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
                          addToRecentUploads(result.url, 'general');
                          updateAppearance(key, result.url);
                        } catch {
                          toast.error('Yükleme başarısız');
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setPickerTarget(key)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-orange-400"
                  >
                    Yüklü olanlardan seç
                  </button>
                </div>
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
                      addToRecentUploads(result.url, 'general');
                      updateAppearance('galleryImages', [...(appearance.galleryImages || []), result.url]);
                    } catch {
                      toast.error('Yükleme başarısız');
                    }
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => setPickerTarget('gallery')}
                className="w-20 h-16 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-0.5 hover:border-orange-400 text-[10px] text-gray-500 leading-tight px-1 text-center"
              >
                Yüklü olanlardan seç
              </button>
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

      {/* Önizleme */}
      <div className="xl:col-span-1">
        <SitePreview />
      </div>

      <MediaPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={handlePickerSelect}
        title={pickerTarget ? `Görsel seç${pickerTarget === 'hero' ? ' (Hero)' : pickerTarget === 'gallery' ? ' (Galeri)' : ''}` : 'Görsel seç'}
      />
    </div>
  );
}
