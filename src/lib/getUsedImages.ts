/**
 * Sitede kullanılan tüm görsel URL'lerini toplar.
 * "Yüklü olanlardan seç" için kullanılır.
 */

import { getSettings, getProducts, getCategories, getBlogPosts } from '@/lib/firebase/firestore';

function extractUrls(obj: unknown): string[] {
  const urls: string[] = [];
  if (!obj) return urls;

  const add = (u: string) => {
    if (typeof u === 'string' && u.startsWith('http') && !urls.includes(u)) urls.push(u);
  };

  if (typeof obj === 'string') {
    add(obj);
    return urls;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => extractUrls(item).forEach(add));
    return urls;
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) extractUrls(v).forEach(add);
  }
  return urls;
}

export async function getUsedImageUrls(): Promise<string[]> {
  const [settings, products, categories, posts] = await Promise.all([
    getSettings(),
    getProducts([]),
    getCategories(),
    getBlogPosts(false),
  ]);

  const urls = new Set<string>();

  if (settings) {
    extractUrls(settings.general).forEach((u) => urls.add(u));
    extractUrls(settings.appearance).forEach((u) => urls.add(u));
  }
  products.forEach((p) => extractUrls(p.images).forEach((u) => urls.add(u)));
  categories.forEach((c) => {
    if (c.image?.startsWith('http')) urls.add(c.image);
  });
  posts.forEach((p) => {
    if (p.coverImage?.startsWith('http')) urls.add(p.coverImage);
  });

  return Array.from(urls);
}
