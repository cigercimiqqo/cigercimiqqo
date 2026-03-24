/**
 * Google Maps URL'ini iframe embed src'ye çevirir.
 * - Zaten embed?pb= içeriyorsa: doğrudan kullan
 * - Place URL (@lat,lng) içeriyorsa: koordinatları çıkar, output=embed ile kullan
 * - Adres/place name: q= ile kullan
 */
export function getGoogleMapsEmbedSrc(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes('/embed') || trimmed.includes('embed?pb=')) {
    return trimmed.startsWith('http') ? trimmed : `https:${trimmed}`;
  }

  const coordMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    const [, lat, lng] = coordMatch;
    return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  const placeMatch = trimmed.match(/\/place\/([^/]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
  }

  if (trimmed.includes('google.com/maps') || trimmed.startsWith('http')) {
    try {
      const u = new URL(trimmed);
      const q = u.searchParams.get('q') || u.pathname.split('/').pop();
      if (q) {
        return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(q))}&output=embed`;
      }
    } catch {
      /* ignore */
    }
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}
