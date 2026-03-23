import type { LayoutSettings, HomeSectionId, SectionLayoutConfig } from '@/types';

export const HOME_SECTION_IDS: HomeSectionId[] = [
  'hero',
  'features',
  'bestSellers',
  'featured',
  'categoryNav',
  'story',
  'stats',
  'galleryPreview',
  'reviews',
  'restaurantInfo',
  'blogPreview',
  'cta',
];

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Hero Banner',
  features: 'Özellikler',
  bestSellers: 'Çok Satanlar',
  featured: 'Öne Çıkanlar',
  categoryNav: 'Kategori Menüsü',
  story: 'Hikayemiz',
  stats: 'İstatistikler',
  galleryPreview: 'Galeri Önizleme',
  reviews: 'Yorumlar',
  restaurantInfo: 'Restoran Bilgisi',
  blogPreview: 'Blog Önizleme',
  cta: 'Çağrı Bölümü',
};

function defaultSectionConfig(): Record<HomeSectionId, SectionLayoutConfig> {
  return HOME_SECTION_IDS.reduce(
    (acc, id, i) => {
      acc[id] = { order: i, visible: true };
      return acc;
    },
    {} as Record<HomeSectionId, SectionLayoutConfig>
  );
}

export function getDefaultLayoutSettings(): LayoutSettings {
  return {
    mobile: defaultSectionConfig(),
    tablet: defaultSectionConfig(),
    desktop: defaultSectionConfig(),
    headerStyle: 'full',
    footerColumns: 4,
  };
}

export function mergeLayoutWithDefaults(partial: Partial<LayoutSettings> | null | undefined): LayoutSettings {
  const defaults = getDefaultLayoutSettings();
  if (!partial) return defaults;
  const result: LayoutSettings = { ...defaults, ...partial };
  const defSection = defaultSectionConfig();
  for (const device of ['mobile', 'tablet', 'desktop'] as const) {
    const devConf = result[device] ?? {};
    result[device] = HOME_SECTION_IDS.reduce(
      (acc, id) => {
        acc[id] = devConf[id] ?? defSection[id];
        return acc;
      },
      {} as Record<HomeSectionId, SectionLayoutConfig>
    );
  }
  return result;
}
