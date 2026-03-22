'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import { Loader2, Smartphone, Tablet, Monitor, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import {
  getDefaultLayoutSettings,
  HOME_SECTION_IDS,
  HOME_SECTION_LABELS,
} from '@/lib/defaultLayout';
import type { SiteSettings, HomeSectionId, LayoutSettings } from '@/types';

type DeviceKey = 'mobile' | 'tablet' | 'desktop';

const DEVICE_LABELS: Record<DeviceKey, string> = {
  mobile: 'Mobil',
  tablet: 'Tablet',
  desktop: 'Masaüstü',
};

const DEVICE_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

export function LayoutSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceKey>('desktop');

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const layout: LayoutSettings =
    settings?.layout ?? getDefaultLayoutSettings();
  const deviceConfig = layout[activeDevice];

  async function handleSave() {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSettings({ layout });
      toast.success('Düzen ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  function updateLayout(updater: (prev: LayoutSettings) => LayoutSettings) {
    setSettings((prev) =>
      prev ? { ...prev, layout: updater(prev.layout ?? getDefaultLayoutSettings()) } : prev
    );
  }

  function moveSection(id: HomeSectionId, dir: 'up' | 'down') {
    const entries = HOME_SECTION_IDS.map((sid) => ({
      id: sid,
      ...deviceConfig[sid],
    })).sort((a, b) => a.order - b.order);
    const idx = entries.findIndex((e) => e.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= entries.length) return;
    [entries[idx].order, entries[swapIdx].order] = [entries[swapIdx].order, entries[idx].order];
    const next = { ...deviceConfig };
    entries.forEach((e) => {
      next[e.id as HomeSectionId] = { order: e.order, visible: next[e.id as HomeSectionId].visible };
    });
    updateLayout((prev) => ({ ...prev, [activeDevice]: next }));
  }

  function toggleVisibility(id: HomeSectionId) {
    const cfg = deviceConfig[id];
    if (!cfg) return;
    updateLayout((prev) => ({
      ...prev,
      [activeDevice]: {
        ...prev[activeDevice],
        [id]: { ...cfg, visible: !cfg.visible },
      },
    }));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    );
  }

  const sortedSections = [...HOME_SECTION_IDS]
    .map((id) => ({ id, ...deviceConfig[id] }))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Cihaz Seçimi</h3>
        <p className="text-sm text-gray-500 mb-4">
          Mobil, tablet ve masaüstü için bölüm sırası ve görünürlüğünü ayrı ayrı ayarlayın.
        </p>
        <div className="flex gap-2">
          {(['mobile', 'tablet', 'desktop'] as DeviceKey[]).map((d) => {
            const Icon = DEVICE_ICONS[d];
            return (
              <button
                key={d}
                onClick={() => setActiveDevice(d)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeDevice === d
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {DEVICE_LABELS[d]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-2">{DEVICE_LABELS[activeDevice]} Düzeni</h3>
        <p className="text-xs text-gray-500 mb-4">
          Bölümlerin sırasını değiştirin veya gizleyin.
        </p>
        <div className="space-y-2">
          {sortedSections.map(({ id }, i) => (
            <div
              key={id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200"
            >
              <button
                onClick={() => moveSection(id as HomeSectionId, 'up')}
                disabled={i === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => moveSection(id as HomeSectionId, 'down')}
                disabled={i === sortedSections.length - 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
              <span className="flex-1 text-sm font-medium text-gray-900">
                {HOME_SECTION_LABELS[id as HomeSectionId]}
              </span>
              <button
                onClick={() => toggleVisibility(id as HomeSectionId)}
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceConfig[id as HomeSectionId].visible
                    ? 'text-green-500 hover:bg-green-50'
                    : 'text-gray-300 hover:bg-gray-50'
                }`}
                title={deviceConfig[id as HomeSectionId].visible ? 'Gizle' : 'Göster'}
              >
                {deviceConfig[id as HomeSectionId].visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Header & Footer</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header Stili</label>
          <select
            value={layout.headerStyle}
            onChange={(e) =>
              updateLayout((prev) => ({
                ...prev,
                headerStyle: e.target.value as 'full' | 'compact' | 'minimal',
              }))
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
          >
            <option value="full">Tam (Logo + Menü + Sepet)</option>
            <option value="compact">Kompakt</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Footer Sütun Sayısı</label>
          <select
            value={layout.footerColumns}
            onChange={(e) =>
              updateLayout((prev) => ({
                ...prev,
                footerColumns: Number(e.target.value) as 2 | 3 | 4,
              }))
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
          >
            <option value={2}>2 Sütun</option>
            <option value={3}>3 Sütun</option>
            <option value={4}>4 Sütun</option>
          </select>
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
