'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useVisitorPreferences } from '@/context/VisitorPreferencesContext';
import { mergeLayoutWithDefaults, HOME_SECTION_IDS } from '@/lib/defaultLayout';
import type { HomeSectionId, LayoutSettings } from '@/types';
import { HeroBanner } from './HeroBanner';
import { Features } from './Features';
import { BestSellers } from './BestSellers';
import { FeaturedProducts } from './FeaturedProducts';
import { CategoryNav } from './CategoryNav';
import { Story } from './Story';
import { Stats } from './Stats';
import { GalleryPreview } from './GalleryPreview';
import { ReviewsSection } from './ReviewsSection';
import { RestaurantInfo } from './RestaurantInfo';
import { BlogPreview } from './BlogPreview';
import { CTA } from './CTA';

const SECTION_COMPONENTS: Record<HomeSectionId, React.ComponentType> = {
  hero: HeroBanner,
  features: Features,
  bestSellers: BestSellers,
  featured: FeaturedProducts,
  categoryNav: CategoryNav,
  story: Story,
  stats: Stats,
  galleryPreview: GalleryPreview,
  reviews: ReviewsSection,
  restaurantInfo: RestaurantInfo,
  blogPreview: BlogPreview,
  cta: CTA,
};

function useDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setDevice('mobile');
      else if (w < 1024) setDevice('tablet');
      else setDevice('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return device;
}

const VISITOR_SECTION_PREFS: Partial<Record<HomeSectionId, keyof import('@/context/VisitorPreferencesContext').VisitorPreferences>> = {
  features: 'showFeatures',
  stats: 'showStats',
  reviews: 'showTestimonials',
  galleryPreview: 'showGallery',
};

export function HomeSections() {
  const { settings } = useSettingsStore();
  const { preferences } = useVisitorPreferences();
  const device = useDeviceType();
  const layout: LayoutSettings = mergeLayoutWithDefaults(settings?.layout);
  const deviceConfig = layout[device];

  const sections = HOME_SECTION_IDS.map((id) => ({
    id,
    ...deviceConfig[id],
  }))
    .filter((s) => {
      if (!s.visible) return false;
      const prefKey = VISITOR_SECTION_PREFS[s.id];
      if (prefKey && !preferences[prefKey]) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  // Arka arkaya gelen ana bölümleri tek container'da grupla
  type Run = { type: 'hero'; id: HomeSectionId } | { type: 'main'; ids: HomeSectionId[] };
  const runs: Run[] = [];
  let currentMain: HomeSectionId[] = [];

  for (const { id } of sections) {
    if (id === 'hero') {
      if (currentMain.length) {
        runs.push({ type: 'main', ids: [...currentMain] });
        currentMain = [];
      }
      runs.push({ type: 'hero', id });
    } else {
      currentMain.push(id as HomeSectionId);
    }
  }
  if (currentMain.length) runs.push({ type: 'main', ids: currentMain });

  return (
    <>
      {runs.map((run, i) =>
        run.type === 'hero' ? (
          <div key={`hero-${i}`}>
            <SECTION_COMPONENTS.hero />
          </div>
        ) : (
          <div key={`main-${i}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {run.ids.map((id) => {
              const Comp = SECTION_COMPONENTS[id];
              return Comp ? <Comp key={id} /> : null;
            })}
          </div>
        )
      )}
    </>
  );
}
