'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, RotateCcw } from 'lucide-react';
import { useVisitorPreferences } from '@/context/VisitorPreferencesContext';

const COLOR_OPTIONS = [
  { name: 'Kırmızı', value: '#c8102e' },
  { name: 'Bordo', value: '#800020' },
  { name: 'Turuncu', value: '#d2691e' },
  { name: 'Koyu Yeşil', value: '#2d5016' },
  { name: 'Lacivert', value: '#1b2a4a' },
];

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { preferences, updatePreferences, resetPreferences } = useVisitorPreferences();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center hover:bg-brand-600 transition-colors"
        aria-label="Ayarları aç"
      >
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <Settings size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-surface-950 border-l border-surface-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading text-lg font-semibold text-surface-100">
                    Site Ayarları
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Tema</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['dark', 'light'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => updatePreferences({ theme: t })}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            preferences.theme === t
                              ? 'bg-brand-500 text-white'
                              : 'bg-surface-900 text-surface-400 hover:bg-surface-800'
                          }`}
                        >
                          {t === 'dark' ? 'Koyu' : 'Açık'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Ana Renk</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => updatePreferences({ primaryColor: c.value })}
                          className={`w-9 h-9 rounded-full border-2 transition-all ${
                            preferences.primaryColor === c.value
                              ? 'border-white scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Hero Stili</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['full', 'split'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updatePreferences({ heroStyle: s })}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            preferences.heroStyle === s
                              ? 'bg-brand-500 text-white'
                              : 'bg-surface-900 text-surface-400 hover:bg-surface-800'
                          }`}
                        >
                          {s === 'full' ? 'Tam Ekran' : 'Bölünmüş'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Menü Düzeni</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['grid', 'list'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => updatePreferences({ menuLayout: l })}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            preferences.menuLayout === l
                              ? 'bg-brand-500 text-white'
                              : 'bg-surface-900 text-surface-400 hover:bg-surface-800'
                          }`}
                        >
                          {l === 'grid' ? 'Izgara' : 'Liste'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Bölümler</label>
                    <div className="space-y-2">
                      {[
                        { key: 'showFeatures' as const, label: 'Özellikler Barı' },
                        { key: 'showStats' as const, label: 'İstatistikler' },
                        { key: 'showTestimonials' as const, label: 'Müşteri Yorumları' },
                        { key: 'showGallery' as const, label: 'Galeri Önizleme' },
                      ].map((s) => (
                        <label
                          key={s.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-900 cursor-pointer hover:bg-surface-800 transition-colors"
                        >
                          <span className="text-sm text-surface-300">{s.label}</span>
                          <div
                            className={`w-10 h-6 rounded-full relative transition-colors ${
                              preferences[s.key] ? 'bg-brand-500' : 'bg-surface-700'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              updatePreferences({ [s.key]: !preferences[s.key] });
                            }}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                preferences[s.key] ? 'left-5' : 'left-1'
                              }`}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      resetPreferences();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-surface-700 text-surface-400 text-sm rounded-xl hover:bg-surface-900 hover:text-surface-200 transition-all"
                  >
                    <RotateCcw size={14} />
                    Varsayılana Sıfırla
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
