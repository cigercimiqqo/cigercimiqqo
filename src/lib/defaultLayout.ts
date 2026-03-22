import type { LayoutSettings, HomeSectionId, SectionLayoutConfig } from '@/types';

export const HOME_SECTION_IDS: HomeSectionId[] = [
  'hero',
  'bestSellers',
  'featured',
  'categoryNav',
  'reviews',
  'restaurantInfo',
  'blogPreview',
];

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Hero Banner',
  bestSellers: 'Çok Satanlar',
  featured: 'Öne Çıkanlar',
  categoryNav: 'Kategori Menüsü',
  reviews: 'Yorumlar',
  restaurantInfo: 'Restoran Bilgisi',
  blogPreview: 'Blog Önizleme',
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
    footerColumns: 3,
  };
}
