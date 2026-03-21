'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
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
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSettings({ appearance: settings.appearance });
      toast.success('Görünüm ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function updateAppearance(field: string, value: unknown) {
    setSettings((prev) => prev ? { ...prev, appearance: { ...prev.appearance, [field]: value } } : prev);
  }

  async function handleHeroUpload(file: File) {
    setHeroUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'hero');
      const current = settings?.appearance?.heroImages || [];
      updateAppearance('heroImages', [...current, result.secure_url]);
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
