/**
 * Video Embed Yardımcıları
 * Desteklenen: YouTube, Vimeo, Cloudinary Video
 * Müşteri için öneri: Ürün tanıtım videolarını YouTube'a yükleyin, linki yapıştırın
 */

export type VideoProvider = 'youtube' | 'vimeo' | 'cloudinary' | 'direct';

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  originalUrl: string;
}

// ─── URL Parser ───────────────────────────────────────────────────────────

export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      provider: 'youtube',
      videoId: id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      originalUrl: trimmed,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      provider: 'vimeo',
      videoId: id,
      embedUrl: `https://player.vimeo.com/video/${id}?byline=0&portrait=0&title=0`,
      thumbnailUrl: `https://vumbnail.com/${id}.jpg`,
      originalUrl: trimmed,
    };
  }

  // Cloudinary video
  if (trimmed.includes('res.cloudinary.com') && /\.(mp4|webm|mov|avi)/.test(trimmed)) {
    return {
      provider: 'cloudinary',
      videoId: trimmed,
      embedUrl: trimmed,
      thumbnailUrl: trimmed.replace(/\.(mp4|webm|mov|avi)/, '.jpg').replace('/video/', '/image/'),
      originalUrl: trimmed,
    };
  }

  // Direkt MP4/WebM link
  if (/\.(mp4|webm|mov)(\?.*)?$/.test(trimmed)) {
    return {
      provider: 'direct',
      videoId: trimmed,
      embedUrl: trimmed,
      thumbnailUrl: '',
      originalUrl: trimmed,
    };
  }

  return null;
}

// ─── Provider bilgisi ─────────────────────────────────────────────────────

export const VIDEO_PROVIDER_INFO = {
  youtube: {
    name: 'YouTube',
    free: true,
    limit: 'Sınırsız (15dk/video ücretsiz)',
    recommended: true,
    tip: 'Ürün tanıtım videolarını YouTube\'a yükleyip linkini yapıştırın.',
  },
  vimeo: {
    name: 'Vimeo',
    free: true,
    limit: '5GB depolama (ücretsiz)',
    recommended: false,
    tip: 'Daha profesyonel görünüm için Vimeo kullanabilirsiniz.',
  },
  cloudinary: {
    name: 'Cloudinary Video',
    free: true,
    limit: '25 kredi dahilinde video da kullanılır (dikkatli kullanın)',
    recommended: false,
    tip: 'Cloudinary kredinizi harcamak istemiyorsanız YouTube tercih edin.',
  },
  direct: {
    name: 'Direkt MP4 Link',
    free: true,
    limit: 'Bant genişliği sunucunuza bağlıdır',
    recommended: false,
    tip: 'Kendi sunucunuzdaki MP4 dosyaları için kullanın.',
  },
} as const;

// ─── Cloudinary video upload ──────────────────────────────────────────────

export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary yapılandırması eksik. Video için YouTube kullanmanızı öneririz.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'miqqo/videos');
  formData.append('resource_type', 'video');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url as string);
      } else {
        reject(new Error(`Video yükleme hatası: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Ağ hatası')));
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    xhr.send(formData);
  });
}
