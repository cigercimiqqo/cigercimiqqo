'use client';

import { Loader2 } from 'lucide-react';

export function IntegrationSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-1">Cloudinary</h3>
        <p className="text-sm text-gray-500 mb-4">Görsel yükleme için Cloudinary bilgilerinizi girin</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cloud Name</label>
            <input type="text" placeholder="örn: my-restaurant" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Preset</label>
            <input type="text" placeholder="örn: restaurant-preset" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Bu değerler .env.local dosyasında tanımlanmalıdır.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-1">Google Maps</h3>
        <p className="text-sm text-gray-500 mb-4">Teslimat bölgesi haritası için API key</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
          <input type="text" placeholder="AIza..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono" />
        </div>
        <p className="text-xs text-gray-400 mt-3">Bu değer .env.local dosyasında NEXT_PUBLIC_GOOGLE_MAPS_API_KEY olarak tanımlanmalıdır.</p>
      </div>
    </div>
  );
}
