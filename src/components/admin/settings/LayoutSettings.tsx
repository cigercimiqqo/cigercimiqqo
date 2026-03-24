'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import { Loader2, Smartphone, Tablet, Monitor, Eye, EyeOff, GripVertical } from 'lucide-react';
import {
  mergeLayoutWithDefaults,
  getDefaultLayoutSettings,
  HOME_SECTION_IDS,
  HOME_SECTION_LABELS,
} from '@/lib/defaultLayout';
import { SitePreview } from '@/components/admin/SitePreview';
import type { SiteSettings, HomeSectionId, LayoutSettings } from '@/types';

type DeviceKey = 'mobile' | 'tablet' | 'desktop';

const DEVICE_LABELS: Record<DeviceKey, string> = {
  mobile: 'Mobil',
  tablet: 'Tablet',
  desktop: 'Masaüstü',
};

const DEVICE_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

interface SortableSectionProps {
  id: HomeSectionId;
  label: string;
  visible: boolean;
  onToggle: () => void;
}

function SortableSection({ id, label, visible, onToggle }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        isDragging ? 'border-orange-400 bg-orange-50 shadow-lg' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical size={18} />
      </button>
      <span className="flex-1 text-sm font-medium text-gray-900">{label}</span>
      <button
        onClick={onToggle}
        className={`p-1.5 rounded-lg transition-colors ${
          visible ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-50'
        }`}
        title={visible ? 'Gizle' : 'Göster'}
      >
        {visible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
}

export function LayoutSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceKey>('desktop');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const layout: LayoutSettings = mergeLayoutWithDefaults(settings?.layout);
  const deviceConfig = layout[activeDevice];

  async function handleSave() {
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
    setSettings((prev) => {
      const base = prev ?? ({} as Partial<SiteSettings>);
      const merged = mergeLayoutWithDefaults(base.layout);
      return { ...base, layout: updater(merged) } as SiteSettings;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const entries = HOME_SECTION_IDS.map((sid) => ({
      id: sid,
      ...deviceConfig[sid],
    })).sort((a, b) => a.order - b.order);

    const oldIdx = entries.findIndex((e) => e.id === active.id);
    const newIdx = entries.findIndex((e) => e.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;

    const reordered = arrayMove(entries, oldIdx, newIdx);
    reordered.forEach((e, i) => {
      e.order = i;
    });

    const next = { ...deviceConfig };
    reordered.forEach((e) => {
      next[e.id as HomeSectionId] = { order: e.order, visible: next[e.id].visible };
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{DEVICE_LABELS[activeDevice]} Düzeni</h3>
              <p className="text-xs text-gray-500">
                Bölümleri sürükleyip bırakarak sıralayın. Göz ikonu ile göster/gizle.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateLayout(() => getDefaultLayoutSettings());
                toast('Varsayılana sıfırlandı. Kaydet\'e basarak uygulayın.');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Sıfırla
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sortedSections.map(({ id, visible }) => (
                  <SortableSection
                    key={id}
                    id={id}
                    label={HOME_SECTION_LABELS[id]}
                    visible={visible}
                    onToggle={() => toggleVisibility(id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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

      {/* Önizleme */}
      <div className="xl:col-span-1">
        <SitePreview />
      </div>
    </div>
  );
}
