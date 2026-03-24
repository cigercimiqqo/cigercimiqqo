'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrders,
} from '@/lib/firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { slugify } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { Plus, GripVertical, Pencil, Trash2, Loader2, Eye, EyeOff, ImagePlus } from 'lucide-react';
import type { Category } from '@/types';
import { Timestamp } from 'firebase/firestore';

interface SortableCategoryProps {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  onToggle: (cat: Category) => void;
}

function SortableCategory({ category, onEdit, onDelete, onToggle }: SortableCategoryProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
      <button {...attributes} {...listeners} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </button>

      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {category.image ? (
          <Image src={category.image} alt={category.name} width={48} height={48} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🍴</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{category.name}</p>
        <p className="text-xs text-gray-400">/{category.slug}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={() => onToggle(category)} className={`p-1.5 rounded-lg transition-colors ${category.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}>
          {category.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button onClick={() => onEdit(category)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={() => onDelete(category.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

interface FormState {
  name: string;
  description: string;
  isActive: boolean;
  image: string;
}

const defaultForm: FormState = { name: '', description: '', isActive: true, image: '' };

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch {
      toast.error('Kategoriler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex).map((c, i) => ({ ...c, order: i }));
    setCategories(reordered);

    try {
      await updateCategoryOrders(reordered.map((c) => ({ id: c.id, order: c.order })));
    } catch {
      toast.error('Sıralama kaydedilemedi');
    }
  }

  async function handleImageUpload(file: File) {
    setImageUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'categories');
      setForm((prev) => ({ ...prev, image: result.secure_url }));
      toast.success('Görsel yüklendi');
    } catch {
      toast.error('Görsel yüklenemedi');
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSubmitting(true);

    try {
      const data = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        image: form.image,
        isActive: form.isActive,
        order: categories.length,
      };

      if (editingId) {
        await updateCategory(editingId, data);
        setCategories((prev) => prev.map((c) => c.id === editingId ? { ...c, ...data } : c));
        toast.success('Kategori güncellendi');
      } else {
        const id = await createCategory({ ...data, createdAt: Timestamp.now() });
        setCategories((prev) => [...prev, { id, ...data, createdAt: Timestamp.now() }]);
        toast.success('Kategori eklendi');
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

  function startEdit(cat: Category) {
    setForm({ name: cat.name, description: cat.description, isActive: cat.isActive, image: cat.image });
    setEditingId(cat.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Kategori silindi');
    } catch {
      toast.error('Silinemedi');
    }
  }

  async function handleToggle(cat: Category) {
    try {
      await updateCategory(cat.id, { isActive: !cat.isActive });
      setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, isActive: !c.isActive } : c));
    } catch {
      toast.error('Güncellenemedi');
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories.length} kategori</p>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(defaultForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          <Plus size={16} />
          Yeni Kategori
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">{editingId ? 'Kategori Düzenle' : 'Yeni Kategori'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Adı *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="Örn: Pizzalar"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Kısa açıklama"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Görseli</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {form.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <Image src={form.image} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">
                  {imageUploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                  {imageUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                </label>
              </div>
              <input
                type="url"
                placeholder="veya görsel linki yapıştır"
                value={form.image || ''}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktif</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-300" />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {categories.map((cat) => (
                <SortableCategory
                  key={cat.id}
                  category={cat}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
