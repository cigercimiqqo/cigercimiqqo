import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => trMap[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(price);
}

export function calculateDiscountedPrice(
  price: number,
  discountType: 'none' | 'amount' | 'percent',
  discountValue: number
): number {
  if (discountType === 'amount') return Math.max(0, price - discountValue);
  if (discountType === 'percent') return price * (1 - discountValue / 100);
  return price;
}

export function getEffectivePrice(product: {
  price: number;
  discountType: 'none' | 'amount' | 'percent';
  discountValue: number;
}): number {
  return calculateDiscountedPrice(product.price, product.discountType, product.discountValue);
}

export function estimateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

export function formatOrderNumber(num: number): string {
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(num).padStart(4, '0')}`;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${random}`;
}

export async function hashIP(ip: string): Promise<string> {
  const salt =
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      : '';
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API kullanılamıyor');
  }
  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function isRestaurantOpen(
  workingHours: Record<string, { open: string; close: string; isClosed: boolean }>,
  closedDates: string[]
): boolean {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (closedDates.includes(todayStr)) return false;

  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayKey = dayKeys[now.getDay()];
  const hours = workingHours[dayKey];

  if (!hours || hours.isClosed) return false;

  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}
