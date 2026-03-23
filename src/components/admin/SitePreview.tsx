'use client';

import { ExternalLink } from 'lucide-react';

/** Admin ayar sayfalarında kullanılan site önizleme kartı. Iframe GitHub Pages'da çalışmıyor, görsel mockup gösterir. */
export function SitePreview() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const previewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${basePath}/`
    : basePath ? `${basePath}/` : '/';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-4 overflow-hidden">
      <h3 className="font-bold text-gray-900 mb-3">Site Önizleme</h3>
      <p className="text-xs text-gray-500 mb-3">
        Deploy edilmiş siteyi yeni sekmede açarak canlı önizleme yapın.
      </p>

      {/* Görsel mockup - sığar, scroll yok */}
      <div
        className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden w-full"
        style={{ aspectRatio: '9/16', maxHeight: 320 }}
      >
        <div className="h-full flex flex-col bg-white">
          <div className="h-10 flex items-center gap-2 px-3 border-b border-gray-100 shrink-0">
            <div className="w-6 h-6 rounded-full bg-orange-500/80" />
            <div className="h-2 flex-1 max-w-[60%] rounded bg-gray-200" />
          </div>
          <div className="flex-1 p-2 space-y-2">
            <div className="h-16 rounded-lg bg-gradient-to-br from-orange-200 to-orange-300" />
            <div className="grid grid-cols-2 gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 rounded bg-gray-100" />
              ))}
            </div>
            <div className="h-8 rounded bg-gray-100" />
          </div>
        </div>
      </div>

      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
      >
        <ExternalLink size={16} />
        Yeni sekmede aç
      </a>
    </div>
  );
}
