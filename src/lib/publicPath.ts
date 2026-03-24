/**
 * Static export'ta basePath (örn. GitHub Pages project site) ile public dosya URL'i.
 */
export function getPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
