'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/firebase/firestore';
import { uploadMultipleFiles } from '@/lib/upload';
import { parseVideoUrl } from '@/lib/video';
import { slugify, formatPrice, getEffectivePrice } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from 'lucide-react';
import type { Category, Product, ProductBadge, DiscountType } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { where } from 'firebase/firestore';

const BADGES: { value: ProductBadge; label: string }[] = [
  { value: 'bestseller', label: 'En Çok Satan' },
  { value: 'new', label: 'Yeni' },
  { value: 'featured', label: 'Öne Çıkan' },
  { value: 'spicy', label: 'Acılı' },
];

const ALLERGENS = ['Gluten', 'Süt', 'Yumurta', 'Fıstık', 'Kabuklu Deniz Ürünleri', 'Balık', 'Soya', 'Susam'];

interface ProductForm {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  discountType: DiscountType;
  discountValue: string;
  badges: ProductBadge[];
  tags: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: string;
  allergens: string[];
  images: string[];
  videoUrl: string;
  variants: { name: string; options: { label: string; priceModifier: string }[] }[];
}

const defaultForm: ProductForm = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  discountType: 'none',
  discountValue: '',
  badges: [],
  tags: '',
  isActive: true,
  isFeatured: false,
  stock: '',
  allergens: [],
  images: [],
  videoUrl: '',
  variants: [],
};

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      toast.error('Veriler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = products.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.categoryId === filterCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  function update(field: keyof ProductForm, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleBadge(badge: ProductBadge) {
    setForm((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges.filter((b) => b !== badge) : [...prev.badges, badge],
    }));
  }

  function toggleAllergen(allergen: string) {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  }

  function addVariant() {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', options: [{ label: '', priceModifier: '0' }] }],
    }));
  }

  function removeVariant(i: number) {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }));
  }

  function addVariantOption(variantIdx: number) {
    setForm((prev) => {
      const variants = [...prev.variants];
      variants[variantIdx].options.push({ label: '', priceModifier: '0' });
      return { ...prev, variants };
    });
  }

  async function handleImageFiles(files: FileList) {
    const fileArr = Array.from(files).slice(0, 5 - form.images.length);
    if (!fileArr.length) return;

    try {
      const results = await uploadMultipleFiles(fileArr, 'products', {
        onProgress: (idx, progress) => {
          setUploadProgress((prev) => ({ ...prev, [idx]: progress.percent }));
        },
      });
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...results.map((r) => r.url)].slice(0, 5),
      }));
      setUploadProgress({});
    } catch {
      toast.error('Görsel yüklenemedi');
      setUploadProgress({});
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error('Ürün adı, kategori ve fiyat zorunludur');
      return;
    }
    setIsSubmitting(true);

    try {
      const data: Omit<Product, 'id' | 'createdAt'> & { videoUrl?: string } = {
        categoryId: form.categoryId,
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        images: form.images,
        ...(form.videoUrl ? { videoUrl: form.videoUrl } : {}),
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        discountType: form.discountType,
        discountValue: form.discountValue ? parseFloat(form.discountValue) : 0,
        badges: form.badges,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        stock: form.stock ? parseInt(form.stock) : null,
        orderCount: 0,
        variants: form.variants.map((v) => ({
          name: v.name,
          options: v.options.map((o) => ({
            label: o.label,
            priceModifier: parseFloat(o.priceModifier) || 0,
          })),
        })),
        allergens: form.allergens,
      };

      if (editingId) {
        await updateProduct(editingId, data);
        setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...data } : p));
        toast.success('Ürün güncellendi');
      } else {
        const id = await createProduct(data);
        setProducts((prev) => [...prev, { id, ...data, createdAt: Timestamp.now() }]);
        toast.success('Ürün eklendi');
      }

      setForm(defaultForm);
      setEditingId(null);
      setShowForm(false);
    } catch {
      toast.error('İşlem başarısız');
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(product: Product) {
    setForm({
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      discountType: product.discountType,
      discountValue: product.discountValue.toString(),
      badges: product.badges,
      tags: product.tags.join(', '),
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      stock: product.stock?.toString() || '',
      allergens: product.allergens,
      images: product.images,
      videoUrl: (product as Product & { videoUrl?: string }).videoUrl ?? '',
      variants: product.variants.map((v) => ({
        name: v.name,
        options: v.options.map((o) => ({ label: o.label, priceModifier: o.priceModifier.toString() })),
      })),
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Ürün silindi');
    } catch {
      toast.error('Silinemedi');
    }
  }

  async function handleBulkToggle(active: boolean) {
    try {
      await Promise.all(Array.from(selectedIds).map((id) => updateProduct(id, { isActive: active })));
      setProducts((prev) => prev.map((p) => selectedIds.has(p.id) ? { ...p, isActive: active } : p));
      setSelectedIds(new Set());
      toast.success('Toplu güncelleme yapıldı');
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`${selectedIds.size} ürünü silmek istiyor musunuz?`)) return;
    try {
      await Promise.all(Array.from(selectedIds).map((id) => deleteProduct(id)));
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      toast.success('Ürünler silindi');
    } catch {
      toast.error('İşlem başarısız');
    }
  }

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(defaultForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shrink-0"
        >
          <Plus size={16} />
          Yeni Ürün
        </button>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3 text-sm">
          <span className="font-medium text-orange-700">{selectedIds.size} ürün seçili</span>
          <button onClick={() => handleBulkToggle(true)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold">Aktif Yap</button>
          <button onClick={() => handleBulkToggle(false)} className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs font-semibold">Pasif Yap</button>
          <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold">Sil</button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-gray-500 hover:text-gray-700"><X size={16} /></button>
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Ürün Düzenle' : 'Yeni Ürün'}</h3>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ürün Adı *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
              <select
                value={form.categoryId}
                onChange={(e) => update('categoryId', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
              >
                <option value="">Seçin</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fiyat (₺) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Karşılaştırma (₺)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.comparePrice}
                onChange={(e) => update('comparePrice', e.target.value)}
                placeholder="Üstü çizili fiyat"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">İndirim Tipi</label>
              <select
                value={form.discountType}
                onChange={(e) => update('discountType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
              >
                <option value="none">Yok</option>
                <option value="amount">Tutar (₺)</option>
                <option value="percent">Yüzde (%)</option>
              </select>
            </div>
            {form.discountType !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">İndirim Değeri</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.discountValue}
                  onChange={(e) => update('discountValue', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ürün Görselleri (max 5)</label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {form.images.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-orange-400 transition-colors">
                    {Object.keys(uploadProgress).length > 0 ? (
                      <Loader2 size={20} className="animate-spin text-orange-500" />
                    ) : (
                      <ImagePlus size={20} className="text-gray-400" />
                    )}
                    <span className="text-xs text-gray-400">Ekle</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageFiles(e.target.files)}
                    />
                  </label>
                )}
              </div>
              {form.images.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="product-image-url"
                    placeholder="veya görsel linki yapıştır"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        const url = input.value.trim();
                        if (url && form.images.length < 5) { setForm((p) => ({ ...p, images: [...p.images, url] })); input.value = ''; }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('product-image-url') as HTMLInputElement;
                      const url = input?.value?.trim();
                      if (url && form.images.length < 5) { setForm((p) => ({ ...p, images: [...p.images, url] })); input.value = ''; }
                    }}
                    className="px-4 py-2.5 bg-orange-100 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-200"
                  >
                    Link Ekle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Video URL
              <span className="ml-2 text-xs text-gray-400 font-normal">YouTube, Vimeo veya MP4 linki</span>
            </label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => update('videoUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            {form.videoUrl && (() => {
              const parsed = parseVideoUrl(form.videoUrl);
              return parsed ? (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                  ✓ {parsed.provider === 'youtube' ? 'YouTube' : parsed.provider === 'vimeo' ? 'Vimeo' : 'Video'} linki tanındı
                </p>
              ) : (
                <p className="text-xs text-red-500 mt-1.5">Geçersiz video URL&apos;si</p>
              );
            })()}
          </div>

          {/* Badges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rozetler</label>
            <div className="flex gap-2 flex-wrap">
              {BADGES.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => toggleBadge(b.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    form.badges.includes(b.value)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Varyantlar</label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600"
              >
                <PlusCircle size={14} />
                Varyant Ekle
              </button>
            </div>
            {form.variants.map((variant, vi) => (
              <div key={vi} className="border border-gray-100 rounded-xl p-4 mb-3 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => {
                      const v = [...form.variants];
                      v[vi].name = e.target.value;
                      setForm((p) => ({ ...p, variants: v }));
                    }}
                    placeholder="Varyant adı (Boyut, Pişirme tercihi...)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                  <button type="button" onClick={() => removeVariant(vi)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
                {variant.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 pl-4">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const v = [...form.variants];
                        v[vi].options[oi].label = e.target.value;
                        setForm((p) => ({ ...p, variants: v }));
                      }}
                      placeholder="Seçenek (Küçük, Orta, Büyük...)"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={opt.priceModifier}
                      onChange={(e) => {
                        const v = [...form.variants];
                        v[vi].options[oi].priceModifier = e.target.value;
                        setForm((p) => ({ ...p, variants: v }));
                      }}
                      placeholder="+₺"
                      className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = [...form.variants];
                        v[vi].options = v[vi].options.filter((_, idx) => idx !== oi);
                        setForm((p) => ({ ...p, variants: v }));
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addVariantOption(vi)}
                  className="ml-4 text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <Plus size={12} />
                  Seçenek Ekle
                </button>
              </div>
            ))}
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alerjenler</label>
            <div className="flex gap-2 flex-wrap">
              {ALLERGENS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergen(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    form.allergens.includes(a) ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Stock + flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok (boş = sınırsız)</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                placeholder="Sınırsız"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiketler</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="pizza, et, özel (virgülle ayır)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} className="rounded border-gray-300 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} className="rounded border-gray-300 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Öne Çıkan</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {editingId ? 'Güncelle' : 'Ürün Ekle'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{filtered.length} ürün</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={(e) => setSelectedIds(e.target.checked ? new Set(filtered.map((p) => p.id)) : new Set())}
                    className="rounded border-gray-300 text-orange-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ürün</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fiyat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stok</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Yükleniyor...</td></tr>
              ) : filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        e.target.checked ? next.add(product.id) : next.delete(product.id);
                        setSelectedIds(next);
                      }}
                      className="rounded border-gray-300 text-orange-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">🍽️</div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {product.badges.map((b) => (
                            <span key={b} className="text-xs bg-orange-50 text-orange-500 px-1.5 rounded">{b}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getCategoryName(product.categoryId)}</td>
                  <td className="px-4 py-3 font-semibold text-orange-500">{formatPrice(getEffectivePrice(product))}</td>
                  <td className="px-4 py-3">
                    {product.stock === null ? (
                      <span className="text-xs text-gray-400">Sınırsız</span>
                    ) : product.stock === 0 ? (
                      <span className="text-xs text-red-500 font-semibold">Tükendi</span>
                    ) : (
                      <span className="text-xs text-gray-700">{product.stock} adet</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => updateProduct(product.id, { isActive: !product.isActive }).then(() => setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, isActive: !p.isActive } : p)))}
                        className={`p-1.5 rounded-lg transition-colors ${product.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}
                      >
                        {product.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button onClick={() => startEdit(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
