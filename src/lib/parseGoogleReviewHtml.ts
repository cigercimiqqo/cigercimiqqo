/**
 * Google Maps yorum HTML'inden veri ayıklama.
 * Kullanıcı HTML yapıştırır → authorName, avatar, rating, date, badge, priceRange, tags, text çıkarılır.
 * Tarih metni ("bir gün önce") gerçek Date'e çevrilir.
 */

export interface ParsedGoogleReview {
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  badge?: string;
  priceRange?: string;
  tags: string[];
  createdAt: Date;
}

/** Türkçe göreli tarih metnini gerçek tarihe çevirir */
function parseRelativeDateTR(text: string, now: Date = new Date()): Date {
  const t = text.trim().toLowerCase();
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);

  // bugün → şimdi
  if (t.includes('bugün')) return now;

  // dün, bir gün önce, 1 gün önce
  const gunMatch = t.match(/(?:dün|bir\s+gün\s+önce|(\d+)\s+gün\s+önce)/);
  if (gunMatch) {
    const n = gunMatch[1] ? parseInt(gunMatch[1], 10) : 1;
    d.setDate(d.getDate() - n);
    return d;
  }

  // bir hafta önce, 2 hafta önce
  const haftaMatch = t.match(/(?:bir\s+hafta\s+önce|(\d+)\s+hafta\s+önce)/);
  if (haftaMatch) {
    const n = haftaMatch[1] ? parseInt(haftaMatch[1], 10) : 1;
    d.setDate(d.getDate() - n * 7);
    return d;
  }

  // bir ay önce, 2 ay önce
  const ayMatch = t.match(/(?:bir\s+ay\s+önce|(\d+)\s+ay\s+önce)/);
  if (ayMatch) {
    const n = ayMatch[1] ? parseInt(ayMatch[1], 10) : 1;
    d.setMonth(d.getMonth() - n);
    return d;
  }

  // bir yıl önce, 2 yıl önce
  const yilMatch = t.match(/(?:bir\s+yıl\s+önce|(\d+)\s+yıl\s+önce)/);
  if (yilMatch) {
    const n = yilMatch[1] ? parseInt(yilMatch[1], 10) : 1;
    d.setFullYear(d.getFullYear() - n);
    return d;
  }

  // Tam tarih: 15 Ocak 2025
  const months: Record<string, number> = {
    ocak: 0, şubat: 1, mart: 2, nisan: 3, mayıs: 4, haziran: 5,
    temmuz: 6, ağustos: 7, eylül: 8, ekim: 9, kasım: 10, aralık: 11,
  };
  const fullDateMatch = t.match(/(\d{1,2})\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s+(\d{4})/);
  if (fullDateMatch) {
    const [, day, month, year] = fullDateMatch;
    const m = months[month];
    if (m !== undefined) {
      d.setFullYear(parseInt(year!, 10));
      d.setMonth(m);
      d.setDate(parseInt(day!, 10));
      return d;
    }
  }

  // Bilinmiyorsa bugün
  return now;
}

/** Yıldız sayısını HTML'den hesaplar (dolu yıldız) */
function parseRating(html: string): number {
  // fill="#fabb05" veya fill="#fab305" dolu (sarı), fill="#dadce0" boş
  const filled = (html.match(/fill="#f[aA]b[bB][05]"/g) || []).length;
  if (filled > 0 && filled <= 5) return filled;
  // Alternatif: aria-label="3,0/5 puan aldı"
  const aria = html.match(/aria-label="([\d,]+)\/(\d+)\s*puan/);
  if (aria) {
    const n = parseFloat(aria[1].replace(',', '.'));
    return Math.round(n);
  }
  return 5;
}

export function parseGoogleReviewHtml(html: string): ParsedGoogleReview | null {
  if (!html || typeof html !== 'string') return null;

  // Author name: Vpc5Fe veya aria-label="X tarafından..." veya benzeri
  let authorName = '';
  const vpcMatch = html.match(/class="[^"]*Vpc5Fe[^"]*"[^>]*>([^<]+)</);
  if (vpcMatch) authorName = vpcMatch[1].trim();
  if (!authorName) {
    const ariaMatch = html.match(/aria-label="([^"]+)\s+tarafından/);
    if (ariaMatch) authorName = ariaMatch[1].trim();
  }

  // Avatar: background-image: url("...")
  let authorAvatar = '';
  const urlMatch = html.match(/background-image:\s*url\s*\(\s*["']?([^"')]+)["']?\s*\)/);
  if (urlMatch) authorAvatar = urlMatch[1].replace(/&quot;/g, '"').trim();

  // Badge: Yerel Rehber · 48 yorum · 4 fotoğraf (GSM50 vb.)
  let badge: string | undefined;
  const gsmMatch = html.match(/class="[^"]*GSM50[^"]*"[^>]*>([^<]+(?:<[^>]+>[^<]*)*)/);
  if (gsmMatch) {
    badge = gsmMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Date: y3Ibjb veya "bir gün önce"
  let dateText = '';
  const dateMatch = html.match(/class="[^"]*y3Ibjb[^"]*"[^>]*>([^<]+)/);
  if (dateMatch) dateText = dateMatch[1].trim();
  if (!dateText) {
    const altDate = html.match(/>\s*(bir\s+gün\s+önce|\d+\s+gün\s+önce|dün|bugün|bir\s+hafta\s+önce|\d+\s+hafta\s+önce|bir\s+ay\s+önce|\d+\s+ay\s+önce|bir\s+yıl\s+önce|\d+\s+yıl\s+önce)\s*</);
    if (altDate) dateText = altDate[1].trim();
  }

  // Price: ME0dBc veya aria-label="₺400-₺600" veya ₺400–₺600
  let priceRange: string | undefined;
  const priceAria = html.match(/aria-label="(₺[\d,\-–]+)"/);
  if (priceAria) priceRange = priceAria[1];
  if (!priceRange && html.includes('₺')) {
    const tlMatch = html.match(/₺[\d,]+[–\-]\s*₺[\d,]+/);
    if (tlMatch) priceRange = tlMatch[0];
  }

  // Tags: t5YfZe "Yeni" vb.
  const tags: string[] = [];
  const tagMatches = html.matchAll(/class="[^"]*t5YfZe[^"]*"[^>]*>\s*<span[^>]*>([^<]+)</g);
  for (const m of tagMatches) {
    const t = m[1].trim();
    if (t && !tags.includes(t)) tags.push(t);
  }

  // Review text: OA1nbd - içindeki metin (önce <a> gelene kadar)
  let text = '';
  const textBlock = html.match(/class="[^"]*OA1nbd[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (textBlock) {
    const raw = textBlock[1]
      .replace(/<a[\s\S]*?<\/a>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (raw) text = raw;
  }
  if (!text) {
    const fallback = html.match(/class="[^"]*OA1nbd[^"]*"[^>]*>([^<]+)/);
    if (fallback) text = fallback[1].trim();
  }

  if (!authorName && !text) return null;

  const rating = parseRating(html);
  const createdAt = parseRelativeDateTR(dateText || 'bugün');

  return {
    authorName: authorName || 'Anonim',
    authorAvatar,
    rating,
    text: text || '(Yorum metni bulunamadı)',
    badge: badge || undefined,
    priceRange: priceRange || undefined,
    tags,
    createdAt,
  };
}
