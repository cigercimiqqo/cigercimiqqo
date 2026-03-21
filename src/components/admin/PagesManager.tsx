'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getPages, createPage, updatePage, deletePage } from '@/lib/firebase/firestore';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import type { DynamicPage } from '@/types';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false, loading: () => <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center"><Loader2 size={20} className="animate-spin text-gray-400" /></div> });

const defaultForm = { title: '', slug: '', content: '', isPublished: false, order: 0 };

export function PagesManager() {
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getPages(false).then((p) => { setPages(p); setIsLoading(false); });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = { ...form, slug: form.slug || slugify(form.title) };
      if (editingId) {
        await updatePage(editingId, data);
        setPages((prev) => prev.map((p) => p.id === editingId ? { ...p, ...data } : p));
        toast.success('Sayfa güncellendi');
      } else {
        const id = await createPage(data);
        setPages((prev) => [...prev, { id, ...data }]);
        toast.success('Sayfa oluşturuldu');
      }
      setForm(defaultForm); setEditingId(null); setView('list');
    } catch { toast.error('İşlem başarısız'); } finally { setIsSubmitting(false); }
  }

  if (view === 'form') {
    return (
      <div className="space-y-5">
        <button onClick={() => { setView('list'); setForm(defaultForm); setEditingId(null); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} />Sayfalara Dön
        </button>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editingId ? 'Sayfa Düzenle' : 'Yeni Sayfa'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">İçerik</label>
            <RichEditor value={form.content} onChange={(v) => setForm((p) => ({ ...p, content: v }))} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} className="rounded border-gray-300 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Yayınla</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}{editingId ? 'Güncelle' : 'Oluştur'}
            </button>
            <button type="button" onClick={() => { setView('list'); setForm(defaultForm); setEditingId(null); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">İptal</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{pages.length} sayfa</p>
        <button onClick={() => { setView('form'); setEditingId(null); setForm(defaultForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">
          <Plus size={16} />Yeni Sayfa
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {pages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Sayfa yok</div>
            ) : pages.map((page) => (
              <div key={page.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{page.title}</p>
                  <p className="text-xs text-gray-400 font-mono">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => updatePage(page.id, { isPublished: !page.isPublished }).then(() => setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, isPublished: !p.isPublished } : p)))} className={`p-1.5 rounded-lg transition-colors ${page.isPublished ? 'text-green-500' : 'text-gray-300'}`}>
                    {page.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => { setForm({ title: page.title, slug: page.slug, content: page.content, isPublished: page.isPublished, order: page.order }); setEditingId(page.id); setView('form'); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => { if (confirm('Sil?')) deletePage(page.id).then(() => setPages((prev) => prev.filter((p) => p.id !== page.id))); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
