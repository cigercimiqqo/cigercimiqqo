'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/lib/firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { slugify, estimateReadingTime } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ImagePlus, ArrowLeft } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import type { BlogPost } from '@/types';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false, loading: () => <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center"><Loader2 size={20} className="animate-spin text-gray-400" /></div> });

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  isPublished: boolean;
}

const defaultForm: BlogForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  isPublished: false,
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setIsLoading(true);
    try {
      const data = await getBlogPosts(false);
      setPosts(data);
    } catch {
      toast.error('Blog yazıları yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }

  function update(field: keyof BlogForm, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCoverUpload(file: File) {
    setCoverUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'blog');
      update('coverImage', result.secure_url);
    } catch {
      toast.error('Kapak görseli yüklenemedi');
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleSubmit(publish: boolean) {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Başlık ve içerik zorunludur');
      return;
    }
    setIsSubmitting(true);

    try {
      const data = {
        title: form.title,
        slug: slugify(form.title),
        excerpt: form.excerpt || form.content.replace(/<[^>]+>/g, '').slice(0, 160),
        content: form.content,
        coverImage: form.coverImage,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        seoTitle: form.seoTitle || form.title,
        seoDescription: form.seoDescription || form.excerpt,
        seoKeywords: form.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        isPublished: publish,
        publishedAt: publish ? Timestamp.now() : null,
      };

      if (editingId) {
        await updateBlogPost(editingId, data);
        setPosts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...data } : p));
        toast.success('Yazı güncellendi');
      } else {
        const id = await createBlogPost(data);
        setPosts((prev) => [{ id, ...data, createdAt: Timestamp.now() }, ...prev]);
        toast.success(publish ? 'Yazı yayınlandı' : 'Taslak kaydedildi');
      }

      setForm(defaultForm);
      setEditingId(null);
      setView('list');
    } catch {
      toast.error('İşlem başarısız');
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(post: BlogPost) {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      tags: post.tags.join(', '),
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords.join(', '),
      isPublished: post.isPublished,
    });
    setEditingId(post.id);
    setView('form');
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Yazı silindi');
    } catch {
      toast.error('Silinemedi');
    }
  }

  async function togglePublish(post: BlogPost) {
    try {
      const data = { isPublished: !post.isPublished, publishedAt: !post.isPublished ? Timestamp.now() : null };
      await updateBlogPost(post.id, data);
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, ...data } : p));
    } catch {
      toast.error('Güncellenemedi');
    }
  }

  if (view === 'form') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => { setView('list'); setEditingId(null); setForm(defaultForm); }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Yazılara Dön
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Yazı Düzenle' : 'Yeni Yazı'}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Özet (meta description ~160 karakter)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              rows={2}
              maxLength={160}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
            />
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kapak Görseli</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {form.coverImage && (
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden">
                    <Image src={form.coverImage} alt="" fill className="object-cover" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">
                  {coverUploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                  {coverUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
                </label>
              </div>
              <input
                type="url"
                placeholder="veya görsel linki yapıştır"
                value={form.coverImage || ''}
                onChange={(e) => update('coverImage', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Content editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">İçerik *</label>
            <RichEditor value={form.content} onChange={(v) => update('content', v)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiketler (virgülle ayır)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="tarif, pizza, özel"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {/* SEO */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">SEO Ayarları</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Başlığı</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => update('seoTitle', e.target.value)}
                placeholder="Varsayılan: yazı başlığı"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Açıklaması</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => update('seoDescription', e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Anahtar Kelimeler</label>
              <input
                type="text"
                value={form.seoKeywords}
                onChange={(e) => update('seoKeywords', e.target.value)}
                placeholder="pizza, tarif, hamur"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              Yayınla
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
            >
              Taslak Kaydet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{posts.length} yazı</p>
        <button
          onClick={() => { setView('form'); setEditingId(null); setForm(defaultForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600"
        >
          <Plus size={16} />
          Yeni Yazı
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Henüz yazı yok</div>
            ) : posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                {post.coverImage && (
                  <div className="w-14 h-10 rounded-xl overflow-hidden shrink-0">
                    <Image src={post.coverImage} alt={post.title} width={56} height={40} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{post.title}</p>
                  <p className="text-xs text-gray-400">{estimateReadingTime(post.content)} dk okuma</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => togglePublish(post)} className={`p-1.5 rounded-lg transition-colors ${post.isPublished ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}>
                    {post.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => startEdit(post)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
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
