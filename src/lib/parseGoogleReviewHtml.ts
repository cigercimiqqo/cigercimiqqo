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
  detailsBlock?: string;
  badge?: string;
  priceRange?: string;
  tags: string[];
  createdAt: Date;
}

const JUNK_STRINGS = [
  'Yorumu bildir',
  'Yanıtla',
  'Tepki eklemek için imleçle üzerine gelin',
  'Tepki ver',
  'Diğer',
  '_',
  'Paylaş',
  'report',
  'Reply',
  'React',
];

function removeJunk(s: string): string {
  let out = s;
  for (const j of JUNK_STRINGS) {
    out = out.replace(new RegExp(j.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Ana yorum metnini detay bloğundan ayırır. Export edildi - display'de eski veri için kullanılır. */
export function splitReviewText(raw: string): { mainText: string; detailsBlock?: string } {
  const cleaned = removeJunk(raw);
  const detailsStart = cleaned.search(/Yiyecek\s*:\s*\d+/i);
  if (detailsStart >= 0) {
    return {
      mainText: removeJunk(cleaned.slice(0, detailsStart)).trim(),
      detailsBlock: removeJunk(cleaned.slice(detailsStart)).trim(),
    };
  }
  return { mainText: cleaned };
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

/** Yorum metni benzeri uzun metin bloklarını bulur (50+ karakter) */
function extractLongTextBlocks(html: string): string[] {
  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const matches = stripped.matchAll(/>([^<]{50,500})</g);
  const results: string[] = [];
  for (const m of matches) {
    const t = m[1].replace(/\s+/g, ' ').trim();
    if (t && !t.startsWith('http') && /[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(t)) results.push(t);
  }
  return results;
}

export function parseGoogleReviewHtml(html: string): ParsedGoogleReview | null {
  if (!html || typeof html !== 'string' || html.length < 50) return null;

  const cleanHtml = html.replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  // ─── Author name ───
  let authorName = '';
  const vpcMatch = cleanHtml.match(/class="[^"]*Vpc5Fe[^"]*"[^>]*>([^<]+)/);
  if (vpcMatch) authorName = vpcMatch[1].trim();
  if (!authorName) {
    const ariaMatch = cleanHtml.match(/aria-label="([^"]+?)\s+tarafından/);
    if (ariaMatch) authorName = ariaMatch[1].trim();
  }
  if (!authorName && cleanHtml.includes('Yerel Rehber')) {
    const beforeBadge = cleanHtml.split('Yerel Rehber')[0];
    const nameMatch = beforeBadge.match(/>([A-Za-zğüşıöçĞÜŞİÖÇ\s]{2,30})</);
    if (nameMatch) authorName = nameMatch[1].trim();
  }
  if (!authorName) {
    const contribMatch = cleanHtml.match(/maps\/contrib\/[^/]+\/reviews[^"]*"[^>]*>[\s\S]*?<div[^>]*>([^<]{2,40})</);
    if (contribMatch) authorName = contribMatch[1].trim();
  }

  // ─── Avatar ───
  let authorAvatar = '';
  const urlMatch = cleanHtml.match(/background-image:\s*url\s*\(\s*["']?([^"')]+)["']?\s*\)/);
  if (urlMatch) authorAvatar = urlMatch[1].trim();
  if (!authorAvatar && cleanHtml.includes('googleusercontent.com')) {
    const gMatch = cleanHtml.match(/https:\/\/[^"'\s]+googleusercontent\.com[^"'\s]*/);
    if (gMatch) authorAvatar = gMatch[0];
  }

  // ─── Badge (sadece Yerel Rehber · X yorum · X fotoğraf) ───
  let badge: string | undefined;
  const badgeMatch = cleanHtml.match(/(Yerel Rehber\s*·\s*\d+\s*yorum\s*·\s*\d+\s*fotoğraf)/);
  if (badgeMatch) badge = badgeMatch[1].replace(/\s+/g, ' ').trim();

  // ─── Date ───
  let dateText = '';
  const dateMatch = cleanHtml.match(/class="[^"]*y3Ibjb[^"]*"[^>]*>([^<]+)/);
  if (dateMatch) dateText = dateMatch[1].trim();
  if (!dateText) {
    const relDates = ['bir gün önce', 'dün', 'bugün', 'bir hafta önce', '2 hafta önce', 'bir ay önce', '2 ay önce', 'bir yıl önce', '2 yıl önce', '1 gün önce', '3 gün önce'];
    for (const rd of relDates) {
      if (cleanHtml.includes(rd)) { dateText = rd; break; }
    }
  }
  if (!dateText) {
    const altDate = cleanHtml.match(/>\s*(bir\s+gün\s+önce|\d+\s+gün\s+önce|dün|bugün|bir\s+hafta\s+önce|\d+\s+hafta\s+önce|bir\s+ay\s+önce|\d+\s+ay\s+önce|bir\s+yıl\s+önce|\d+\s+yıl\s+önce)\s*</);
    if (altDate) dateText = altDate[1].trim();
  }

  // ─── Price ───
  let priceRange: string | undefined;
  const priceAria = cleanHtml.match(/aria-label="(₺[^"]+)"/);
  if (priceAria && priceAria[1].length < 30) priceRange = priceAria[1];
  if (!priceRange && cleanHtml.includes('₺')) {
    const tlMatch = cleanHtml.match(/₺[\d,\s]+[–\-]\s*₺[\d,\s]+/);
    if (tlMatch) priceRange = tlMatch[0].trim();
  }

  // ─── Tags ───
  const tags: string[] = [];
  const tagMatches = cleanHtml.matchAll(/class="[^"]*t5YfZe[^"]*"[^>]*>\s*<span[^>]*>([^<]+)</g);
  for (const m of tagMatches) {
    const t = m[1].trim();
    if (t && t.length < 20 && !tags.includes(t)) tags.push(t);
  }
  if (tags.length === 0 && cleanHtml.includes('>Yeni<')) tags.push('Yeni');

  // ─── Review text (öncelik: OA1nbd, sonra uzun metin blokları) ───
  let text = '';
  const textBlock = cleanHtml.match(/class="[^"]*OA1nbd[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (textBlock) {
    const raw = textBlock[1]
      .replace(/<a[\s\S]*?<\/a>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (raw.length > 20) text = raw;
  }
  if (!text) {
    const fallback = cleanHtml.match(/class="[^"]*OA1nbd[^"]*"[^>]*>([^<]{20,})/);
    if (fallback) text = fallback[1].trim();
  }
  if (!text) {
    const blocks = extractLongTextBlocks(cleanHtml);
    const best = blocks.find((b) => b.length > 30 && (b.includes('.') || b.includes('!') || b.includes('?')));
    if (best) text = best;
  }
  if (!text) {
    const generic = cleanHtml.match(/Ciğer[^<]{20,200}|lezzetli[^<]{20,200}|çorba[^<]{20,200}/);
    if (generic) text = generic[0].replace(/\s+/g, ' ').trim();
  }
  if (!text) {
    const anySentence = cleanHtml.match(/>([^<]{40,300}[.!?])</);
    if (anySentence) text = anySentence[1].replace(/\s+/g, ' ').trim();
  }

  // En az metin veya isim olmalı
  if (!text && !authorName) return null;

  const { mainText, detailsBlock } = splitReviewText(text);
  const rating = parseRating(cleanHtml);
  const createdAt = parseRelativeDateTR(dateText || 'bugün');

  return {
    authorName: authorName || 'Anonim',
    authorAvatar,
    rating,
    text: mainText || '(Yorum metni bulunamadı - lütfen manuel girin)',
    detailsBlock: detailsBlock || undefined,
    badge: badge || undefined,
    priceRange: priceRange || undefined,
    tags,
    createdAt,
  };
}
