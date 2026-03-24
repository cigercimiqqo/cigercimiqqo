'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebase/firestore';
import { CheckCircle2, ExternalLink, Image, Video, Map, MessageSquare, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { PROVIDER_INFO, type UploadProvider } from '@/lib/upload';
import toast from 'react-hot-toast';
import type { SiteSettings } from '@/types';

type SectionKey = 'media' | 'maps' | 'sms' | 'video';

export function IntegrationSettings() {
  const [expanded, setExpanded] = useState<SectionKey>('media');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const mediaProvider = (settings?.integrations?.mediaProvider ?? 'imgbb') as UploadProvider;

  const toggle = (key: SectionKey) => setExpanded((p) => (p === key ? ('' as SectionKey) : key));

  async function handleProviderChange(p: UploadProvider) {
    setSettings((prev) => ({
      ...(prev || {}),
      integrations: { ...(prev?.integrations || {}), mediaProvider: p },
    } as SiteSettings));
    try {
      await updateSettings({ integrations: { mediaProvider: p } });
      if (typeof window !== 'undefined') localStorage.setItem('miqqo_upload_provider', p);
      toast.success('Medya sağlayıcısı kaydedildi');
    } catch {
      toast.error('Kaydedilemedi');
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">

      {/* ── Medya Yükleme ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggle('media')}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-orange-50 rounded-xl"><Image className="w-4 h-4 text-orange-500" /></span>
            <div>
              <h3 className="font-bold text-gray-900">Medya Yükleme</h3>
              <p className="text-sm text-gray-500">Görsel yükleme sağlayıcısı seçin</p>
            </div>
          </div>
          {expanded === 'media' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expanded === 'media' && (
          <div className="px-6 pb-6 space-y-4">
            {/* Provider Seçim Kartları */}
            <div className="grid grid-cols-2 gap-3">
              {(['cloudinary', 'imgbb'] as UploadProvider[]).map((p) => {
                const info = PROVIDER_INFO[p];
                const selected = mediaProvider === p;
                return (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                      selected ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {selected && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-orange-500" />
                    )}
                    <p className="font-semibold text-sm text-gray-900">{info.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{info.freeLimit}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {info.supportsVideo ? '✓ Video desteği' : '✗ Sadece görsel'}
                    </p>
                    <a
                      href={info.signup}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-orange-500 mt-2 hover:underline"
                    >
                      Ücretsiz kayıt <ExternalLink className="w-3 h-3" />
                    </a>
                  </button>
                );
              })}
            </div>

            {/* Cloudinary Detayları */}
            {mediaProvider === 'cloudinary' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cloudinary Yapılandırması</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cloud Name</label>
                  <input
                    type="text"
                    placeholder="örn: my-restaurant-abc123"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Preset (unsigned)</label>
                  <input
                    type="text"
                    placeholder="örn: miqqo_unsigned"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
                  />
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 space-y-1">
                  <p className="font-semibold">Kurulum adımları:</p>
                  <p>1. Cloudinary Dashboard → Settings → Upload → Add upload preset</p>
                  <p>2. Signing Mode: <strong>Unsigned</strong> seçin</p>
                  <p>3. Preset adını ve Cloud Name'i .env.local'e yazın</p>
                  <p className="font-mono bg-blue-100 p-1 rounded mt-1">
                    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx<br />
                    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=yyy
                  </p>
                </div>
              </div>
            )}

            {/* ImgBB Detayları */}
            {mediaProvider === 'imgbb' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">ImgBB Yapılandırması</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
                  <input
                    type="text"
                    placeholder="ImgBB API Key..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
                  />
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-800 space-y-1">
                  <p className="font-semibold">ImgBB kurulum:</p>
                  <p>1. <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">imgbb.com</a>'a ücretsiz kayıt olun</p>
                  <p>2. Account → API → API Key kopyalayın</p>
                  <p>3. .env.local dosyasına ekleyin:</p>
                  <p className="font-mono bg-yellow-100 p-1 rounded mt-1">NEXT_PUBLIC_IMGBB_API_KEY=xxxxx</p>
                  <p className="text-yellow-700 mt-1">⚠️ ImgBB video desteklemez. Video için YouTube linki kullanın.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Video Desteği ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggle('video')}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-50 rounded-xl"><Video className="w-4 h-4 text-red-500" /></span>
            <div>
              <h3 className="font-bold text-gray-900">Video Desteği</h3>
              <p className="text-sm text-gray-500">YouTube, Vimeo veya Cloudinary</p>
            </div>
          </div>
          {expanded === 'video' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expanded === 'video' && (
          <div className="px-6 pb-6 space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: 'YouTube (Önerilen)', desc: 'Sınırsız depolama, ücretsiz. Ürün tanıtım videolarınızı YouTube\'a yükleyin.', color: 'red', free: true },
                { name: 'Vimeo', desc: '5GB ücretsiz, reklamsız oynatıcı.', color: 'blue', free: true },
                { name: 'Cloudinary Video', desc: 'Aynı hesabınızdaki video alanı. Kredi tüketir, dikkatli kullanın.', color: 'orange', free: false },
              ].map((v) => (
                <div key={v.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className={`mt-0.5 w-2 h-2 rounded-full bg-${v.color}-400 shrink-0`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{v.name} {v.free && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-1">Ücretsiz</span>}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
              <p className="font-semibold mb-1">Nasıl kullanılır?</p>
              <p>Ürün eklerken "Video URL" alanına YouTube/Vimeo linkini yapıştırın. Sistem otomatik olarak embed'e çevirir.</p>
              <p className="mt-1">Örnek: <span className="font-mono">https://youtube.com/watch?v=ABC123</span></p>
            </div>
          </div>
        )}
      </div>

      {/* ── Google Maps ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggle('maps')}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-green-50 rounded-xl"><Map className="w-4 h-4 text-green-500" /></span>
            <div>
              <h3 className="font-bold text-gray-900">Google Maps</h3>
              <p className="text-sm text-gray-500">Teslimat bölgesi haritası</p>
            </div>
          </div>
          {expanded === 'maps' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expanded === 'maps' && (
          <div className="px-6 pb-6 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
              <p className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...</p>
            </div>
          </div>
        )}
      </div>

      {/* ── SMS / WhatsApp ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggle('sms')}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-purple-50 rounded-xl"><MessageSquare className="w-4 h-4 text-purple-500" /></span>
            <div>
              <h3 className="font-bold text-gray-900">SMS & Bildirim</h3>
              <p className="text-sm text-gray-500">Netgsm veya İleti Merkezi</p>
            </div>
          </div>
          {expanded === 'sms' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expanded === 'sms' && (
          <div className="px-6 pb-6 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SMS API Endpoint</label>
              <input
                type="url"
                placeholder="https://api.netgsm.com.tr/sms/send/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
              <p className="font-mono">SMS_API_URL=https://...</p>
              <p className="font-mono">SMS_API_KEY=xxx</p>
              <p className="font-mono">SMS_SENDER=RESTORAN</p>
              <p className="text-gray-400 mt-1">⚠️ Bu değerler .env.local dosyasında sunucu-tarafı olarak saklanmalıdır.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Önemli Hatırlatma</p>
        <p>Tüm API key'leri <strong>.env.local</strong> dosyasında saklayın. Bu değerleri asla kod içine veya git'e commit etmeyin.</p>
      </div>
    </div>
  );
}
