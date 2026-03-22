export type CloudinaryFolder =
  | 'products'
  | 'blog'
  | 'hero'
  | 'logo'
  | 'categories'
  | 'reviews'
  | 'avatars';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export async function uploadToCloudinary(
  file: File,
  folder: CloudinaryFolder = 'products',
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary yapılandırması eksik');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `restaurant/${cloudName}/${folder}`);
  formData.append('quality', 'auto:best');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
      } else {
        reject(new Error('Yükleme başarısız: ' + xhr.statusText));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Ağ hatası')));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  });
}

export async function uploadMultiple(
  files: File[],
  folder: CloudinaryFolder = 'products',
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<CloudinaryUploadResult[]> {
  return Promise.all(
    files.map((file, index) =>
      uploadToCloudinary(file, folder, (p) => onProgress?.(index, p))
    )
  );
}

export function getCloudinaryBlurUrl(url: string): string {
  if (!url) return '';
  return url.replace('/upload/', '/upload/w_20,q_1,e_blur:100/');
}

export function getCloudinaryResizedUrl(url: string, width: number): string {
  if (!url) return '';
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export function deleteFromCloudinary(_publicId: string): Promise<void> {
  console.warn('Cloudinary silme işlemi sunucu taraflı API gerektirir. Dashboard üzerinden silin.');
  return Promise.resolve();
}
