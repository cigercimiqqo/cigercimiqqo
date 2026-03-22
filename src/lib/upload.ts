/**
 * Merkezi Medya Yükleme Sistemi
 * Desteklenen sağlayıcılar: Cloudinary, ImgBB
 * Sağlayıcı seçimi: Admin Ayarlar → Entegrasyonlar
 */

export type UploadProvider = 'cloudinary' | 'imgbb';

export interface UploadResult {
  url: string;
  deleteUrl?: string;
  provider: UploadProvider;
  width?: number;
  height?: number;
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export type UploadFolder = 'products' | 'blog' | 'hero' | 'logo' | 'categories' | 'reviews' | 'avatars';

// ─── Aktif Provider Tespiti ────────────────────────────────────────────────

export function getActiveProvider(): UploadProvider {
  // Önce admin tercihi (Firestore/IntegrationSettings → localStorage’a senkron)
  if (typeof window !== 'undefined') {
    const pref = localStorage.getItem('miqqo_upload_provider') as UploadProvider | null;
    if (pref === 'cloudinary' || pref === 'imgbb') return pref;
  }

  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (cloudinaryName && cloudinaryPreset) return 'cloudinary';
  if (imgbbKey) return 'imgbb';

  return 'cloudinary';
}

// ─── Cloudinary Upload ─────────────────────────────────────────────────────

async function uploadToCloudinary(
  file: File,
  folder: UploadFolder,
  onProgress?: (p: UploadProgress) => void
): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) throw new Error('Cloudinary yapılandırması eksik');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `miqqo/${folder}`);
  formData.append('quality', 'auto:best');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({ percent: Math.round((e.loaded / e.total) * 100), loaded: e.loaded, total: e.total });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          provider: 'cloudinary',
          width: data.width,
          height: data.height,
        });
      } else {
        reject(new Error(`Cloudinary hatası: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Ağ hatası')));
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  });
}

// ─── ImgBB Upload (base64 ile tam kalite) ───────────────────────────────────

async function uploadToImgBB(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<UploadResult> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error('ImgBB API key eksik. Ayarlar → Entegrasyonlar bölümünden ekleyin.');

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.includes(',') ? result.split(',')[1]! : result);
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });

  onProgress?.({ percent: 50, loaded: 0, total: 100 });

  const body = new URLSearchParams();
  body.append('key', apiKey);
  body.append('image', base64);
  body.append('name', file.name);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json();

  if (!data.success) {
    const msg = data.error?.message || data.status_txt || 'ImgBB yükleme başarısız';
    throw new Error(msg);
  }

  onProgress?.({ percent: 100, loaded: 100, total: 100 });

  return {
    url: data.data.url,
    deleteUrl: data.data.delete_url,
    provider: 'imgbb',
    width: data.data.width,
    height: data.data.height,
  };
}

// ─── Ana Upload Fonksiyonu ─────────────────────────────────────────────────

export async function uploadFile(
  file: File,
  folder: UploadFolder = 'products',
  options?: {
    provider?: UploadProvider;
    onProgress?: (p: UploadProgress) => void;
  }
): Promise<UploadResult> {
  const provider = options?.provider ?? getActiveProvider();

  if (provider === 'imgbb') {
    return uploadToImgBB(file, options?.onProgress);
  }

  return uploadToCloudinary(file, folder, options?.onProgress);
}

export async function uploadMultipleFiles(
  files: File[],
  folder: UploadFolder = 'products',
  options?: {
    provider?: UploadProvider;
    onProgress?: (index: number, p: UploadProgress) => void;
  }
): Promise<UploadResult[]> {
  return Promise.all(
    files.map((file, i) =>
      uploadFile(file, folder, {
        provider: options?.provider,
        onProgress: options?.onProgress ? (p) => options.onProgress!(i, p) : undefined,
      })
    )
  );
}

// ─── Blur Placeholder (sadece Cloudinary'de mevcut) ───────────────────────

export function getBlurUrl(url: string): string {
  if (!url) return '';
  // Cloudinary URL'si ise blur transformation uygula
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_20,q_1,e_blur:100/');
  }
  // ImgBB'de transformation yok, orijinal URL
  return url;
}

export function getResizedUrl(url: string, width: number): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  return url;
}

// ─── Provider Bilgisi ─────────────────────────────────────────────────────

export const PROVIDER_INFO = {
  cloudinary: {
    name: 'Cloudinary',
    freeLimit: '25 kredi/ay (~25GB transfer)',
    storageLimit: 'Sınırsız (25 kredi dahilinde)',
    supportsBlur: true,
    supportsVideo: true,
    docs: 'https://cloudinary.com/documentation',
    signup: 'https://cloudinary.com/users/register/free',
  },
  imgbb: {
    name: 'ImgBB',
    freeLimit: 'Sınırsız (32MB/görsel max)',
    storageLimit: 'Sınırsız (reklamlı ücretsiz)',
    supportsBlur: false,
    supportsVideo: false,
    docs: 'https://api.imgbb.com',
    signup: 'https://imgbb.com',
  },
} as const;
