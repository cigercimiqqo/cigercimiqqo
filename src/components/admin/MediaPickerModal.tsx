'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Loader2, ImageIcon } from 'lucide-react';
import { getRecentUploads } from '@/lib/mediaLibrary';
import { getUsedImageUrls } from '@/lib/getUsedImages';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaPickerModal({ isOpen, onClose, onSelect, title = 'Görsel Seç' }: MediaPickerModalProps) {
  const [tab, setTab] = useState<'recent' | 'used'>('recent');
  const [recent, setRecent] = useState<{ url: string; ts: number }[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setRecent(getRecentUploads().map((x) => ({ url: x.url, ts: x.ts })));
    if (tab === 'used') {
      setLoading(true);
      getUsedImageUrls()
        .then(setUsed)
        .finally(() => setLoading(false));
    }
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const images = tab === 'recent' ? recent.map((x) => x.url) : used;
  const isEmpty = !loading && images.length === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="flex border-b">
          <button
            onClick={() => setTab('recent')}
            className={`px-4 py-3 text-sm font-medium ${tab === 'recent' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
          >
            Son yüklemeler
          </button>
          <button
            onClick={() => setTab('used')}
            className={`px-4 py-3 text-sm font-medium ${tab === 'used' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}
          >
            Sitede kullanılanlar
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1 min-h-[200px]">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-orange-500" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ImageIcon size={48} className="mb-3" />
              <p className="text-sm">
                {tab === 'recent' ? 'Henüz yükleme yok. Önce bir görsel yükleyin.' : 'Sitede kullanılan görsel yok.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {images.map((url) => (
                <button
                  key={url}
                  onClick={() => {
                    onSelect(url);
                    onClose();
                  }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-gray-100 hover:border-orange-400 hover:scale-[1.02] transition-all"
                >
                  <Image src={url} alt="" width={100} height={100} className="w-full h-full object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
