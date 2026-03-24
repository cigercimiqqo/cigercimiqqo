'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { toast } from '@/lib/toast';
import { Loader2, Type, BookOpen, BarChart3, Phone, FileText } from 'lucide-react';
import { clearSettingsCache } from '@/lib/settingsLoader';
import type { SiteSettings, ContentSettings } from '@/types';
import { getDefaultContent } from '@/lib/defaultContent';

const TABS = [
  { id: 'hero', label: 'Hero', icon: Type },
  { id: 'story', label: 'Hikaye', icon: BookOpen },
  { id: 'stats', label: 'İstatistikler', icon: BarChart3 },
  { id: 'cta', label: 'CTA', icon: Phone },
  { id: 'footer', label: 'Footer', icon: FileText },
  { id: 'aboutPage', label: 'Hakkımızda', icon: BookOpen },
  { id: 'contactPage', label: 'İletişim', icon: Phone },
] as const;

export function ContentSettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('hero');

  useEffect(() => {
    getSettings().then((s) => {
      const normalized = s ? { ...s, content: { ...getDefaultContent(), ...s.content } } : null;
      setSettings(normalized as SiteSettings);
      setIsLoading(false);
    });
  }, []);

  function updateContent(partial: Partial<ContentSettings>) {
    if (!settings) return;
    setSettings({
      ...settings,
      content: { ...getDefaultContent(), ...settings.content, ...partial },
    });
  }

  async function handleSave() {
    if (!settings?.content) return;
    setIsSaving(true);
    try {
      await updateSettings({ content: settings.content } as Partial<SiteSettings>);
      clearSettingsCache();
      toast.success('İçerik ayarları kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const content = settings?.content ?? getDefaultContent();
  const aboutPage = content.aboutPage ?? { tagline: '', title: '', sectionLabel: '', sectionTitle: '', sectionTitleAccent: '', valuesLabel: '', values: [] };
  const contactPage = content.contactPage ?? { tagline: '', title: '', infoLabel: '', formTitle: '', formSuccessTitle: '', formSuccessMessage: '' };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Hero Bölümü</h3>
          {(['tagline', 'headline', 'headlineAccent', 'description', 'buttonMenu', 'buttonReservation'] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
              <input
                type="text"
                value={content.hero[k] ?? ''}
                onChange={(e) => updateContent({ hero: { ...content.hero, [k]: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'story' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Hikaye Bölümü</h3>
          {(['sectionLabel', 'title', 'titleAccent', 'paragraph1', 'paragraph2', 'yearsValue', 'yearsLabel', 'signature', 'linkText'] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
              {k.includes('paragraph') ? (
                <textarea
                  value={content.story[k] ?? ''}
                  onChange={(e) => updateContent({ story: { ...content.story, [k]: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={content.story[k] ?? ''}
                  onChange={(e) => updateContent({ story: { ...content.story, [k]: e.target.value } })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">İstatistikler</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bölüm Etiketi</label>
            <input
              type="text"
              value={content.stats.sectionLabel ?? ''}
              onChange={(e) => updateContent({ stats: { ...content.stats, sectionLabel: e.target.value } })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          {content.stats.items.map((item, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-3">
              <p className="font-medium text-sm text-gray-700">Kart {i + 1}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Değer</label>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => {
                      const next = [...content.stats.items];
                      next[i] = { ...item, value: Number(e.target.value) || 0 };
                      updateContent({ stats: { ...content.stats, items: next } });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Suffix (+, K+ vb.)</label>
                  <input
                    type="text"
                    value={item.suffix}
                    onChange={(e) => {
                      const next = [...content.stats.items];
                      next[i] = { ...item, suffix: e.target.value };
                      updateContent({ stats: { ...content.stats, items: next } });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Etiket</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const next = [...content.stats.items];
                      next[i] = { ...item, label: e.target.value };
                      updateContent({ stats: { ...content.stats, items: next } });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min / Max</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={item.min}
                      onChange={(e) => {
                        const next = [...content.stats.items];
                        next[i] = { ...item, min: Number(e.target.value) || 0 };
                        updateContent({ stats: { ...content.stats, items: next } });
                      }}
                      className="w-14 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={item.max}
                      onChange={(e) => {
                        const next = [...content.stats.items];
                        next[i] = { ...item, max: Number(e.target.value) || 100 };
                        updateContent({ stats: { ...content.stats, items: next } });
                      }}
                      className="w-14 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.decimal}
                  onChange={(e) => {
                    const next = [...content.stats.items];
                    next[i] = { ...item, decimal: e.target.checked };
                    updateContent({ stats: { ...content.stats, items: next } });
                  }}
                />
                <span className="text-sm">Ondalıklı göster (örn. 4.9)</span>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cta' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">CTA Bölümü</h3>
          {(['tagline', 'title', 'description', 'buttonCall', 'buttonOrder'] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
              {k === 'description' ? (
                <textarea
                  value={content.cta[k] ?? ''}
                  onChange={(e) => updateContent({ cta: { ...content.cta, [k]: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={content.cta[k] ?? ''}
                  onChange={(e) => updateContent({ cta: { ...content.cta, [k]: e.target.value } })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'aboutPage' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Hakkımızda Sayfası</h3>
          {(['tagline', 'title', 'sectionLabel', 'sectionTitle', 'sectionTitleAccent', 'valuesLabel'] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
              <input
                type="text"
                value={aboutPage[k] ?? ''}
                onChange={(e) => updateContent({ aboutPage: { ...aboutPage, [k]: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          ))}
          <p className="font-medium text-sm text-gray-700 mt-6">Değerler</p>
          {(aboutPage.values ?? []).map((v, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-2">
              <input
                type="text"
                placeholder="Başlık"
                value={v.title}
                onChange={(e) => {
                  const next = [...(aboutPage.values ?? [])];
                  next[i] = { ...v, title: e.target.value };
                  updateContent({ aboutPage: { ...aboutPage, values: next } });
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <textarea
                placeholder="Açıklama"
                value={v.desc}
                onChange={(e) => {
                  const next = [...(aboutPage.values ?? [])];
                  next[i] = { ...v, desc: e.target.value };
                  updateContent({ aboutPage: { ...aboutPage, values: next } });
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contactPage' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">İletişim Sayfası</h3>
          {(['tagline', 'title', 'infoLabel', 'formTitle', 'formSuccessTitle', 'formSuccessMessage'] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
              <input
                type="text"
                value={contactPage[k] ?? ''}
                onChange={(e) => updateContent({ contactPage: { ...contactPage, [k]: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Footer Bölümü</h3>
          {(['tagline', 'description', 'quickLinksLabel', 'supportLabel', 'newsletterLabel', 'newsletterPlaceholder', 'copyrightText'] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
              {k === 'description' ? (
                <textarea
                  value={content.footer[k] ?? ''}
                  onChange={(e) => updateContent({ footer: { ...content.footer, [k]: e.target.value } })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={content.footer[k] ?? ''}
                  onChange={(e) => updateContent({ footer: { ...content.footer, [k]: e.target.value } })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-60 flex items-center gap-2"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          Kaydet
        </button>
      </div>
    </div>
  );
}
