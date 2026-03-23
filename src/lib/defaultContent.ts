import type { ContentSettings, HeroContentSettings, StoryContentSettings, StatsContentSettings, CtaContentSettings, FooterContentSettings, AboutPageContent, ContactPageContent, StatItem } from '@/types';

export const DEFAULT_HERO: HeroContentSettings = {
  tagline: 'Lezzetinin Adresi',
  headline: 'Başlık Buraya',
  headlineAccent: 'Alt başlık italik',
  description: 'Ateşte pişen efsane lezzet. Kuşaktan kuşağa aktarılan geleneksel tariflerle, unutulmaz bir sofra deneyimi.',
  buttonMenu: 'Menüyü İncele',
  buttonReservation: 'Rezervasyon Yap',
};

export const DEFAULT_STORY: StoryContentSettings = {
  sectionLabel: 'Mirasımız',
  title: 'Ateşin Ustalığı',
  titleAccent: 'Lezzetin Adresi',
  paragraph1: 'Kuşaktan kuşağa aktarılan tariflerle, ateşle olan bağımızı hiç koparmadan yolumuza devam ediyoruz.',
  paragraph2: 'Her tabak, bir geleneğin ve tutkuyla yapılan işçiliğin eseridir. Misafirlerimize evinde hissettirecek bir atmosfer sunuyoruz.',
  yearsValue: '35',
  yearsLabel: 'Yıllık Ustalık',
  signature: 'Usta',
  linkText: 'Daha Fazla Bilgi',
};

export const DEFAULT_STATS_ITEMS: StatItem[] = [
  { value: 35, suffix: '+', label: 'Yıllık Deneyim', min: 30, max: 50, decimal: false },
  { value: 500, suffix: 'K+', label: 'Mutlu Müşteri', min: 400, max: 600, decimal: false },
  { value: 15, suffix: '+', label: 'Çeşit Lezzet', min: 10, max: 25, decimal: false },
  { value: 4.9, suffix: '', label: 'Ortalama Puan', min: 4.5, max: 5, decimal: true },
];

export const DEFAULT_STATS: StatsContentSettings = {
  sectionLabel: 'Keşfedin',
  items: DEFAULT_STATS_ITEMS,
};

export const DEFAULT_CTA: CtaContentSettings = {
  tagline: 'Sizi Bekliyoruz',
  title: 'Lezzet Bir Telefon Kadar Yakın',
  description: 'Rezervasyon yapmak veya sipariş vermek için hemen arayın. Taze lezzetlerimizle sizi ağırlamaya hazırız.',
  buttonCall: 'Hemen Ara',
  buttonOrder: 'Sipariş Ver',
};

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  tagline: 'Bizi Tanıyın',
  title: 'Hakkımızda',
  sectionLabel: 'Hikayemiz',
  sectionTitle: 'Bir Tutkunun',
  sectionTitleAccent: 'Hikayesi',
  valuesLabel: 'Değerlerimiz',
  values: [
    { title: 'Geleneksel Pişirme', desc: 'Kömür ateşinde, sabırla ve ustalıkla pişirme geleneğimizi sürdürüyoruz.' },
    { title: 'Taze Malzeme', desc: 'Her gün en taze malzemeleri tedarik ediyor, kaliteden asla ödün vermiyoruz.' },
    { title: 'Aile Mirası', desc: 'Kuşaktan kuşağa aktarılan tarifler ve değişmeyen lezzet anlayışı.' },
    { title: 'Kalite Taahhüdü', desc: 'Her tabağımız, misafirlerimize olan saygımızın ve kalite anlayışımızın yansımasıdır.' },
  ],
};

export const DEFAULT_CONTACT_PAGE: ContactPageContent = {
  tagline: 'Bize Ulaşın',
  title: 'İletişim',
  infoLabel: 'İletişim Bilgileri',
  formTitle: 'Bize Yazın',
  formSuccessTitle: 'Mesajınız Alındı',
  formSuccessMessage: 'En kısa sürede size dönüş yapacağız.',
};

export const DEFAULT_FOOTER: FooterContentSettings = {
  tagline: 'Site Adı',
  description: 'Geleneksel lezzetlerimizi modern sunumlarla birleştirerek en kaliteli hizmeti vermeyi amaçlıyoruz.',
  quickLinksLabel: 'Hızlı Linkler',
  supportLabel: 'Destek',
  newsletterLabel: 'Bize Katılın',
  newsletterPlaceholder: 'E-posta Adresi',
  copyrightText: '© 2024. Tüm hakları saklıdır.',
};

export function getDefaultContent(): ContentSettings {
  return {
    hero: { ...DEFAULT_HERO },
    story: { ...DEFAULT_STORY },
    stats: { ...DEFAULT_STATS, items: DEFAULT_STATS_ITEMS.map((i) => ({ ...i })) },
    cta: { ...DEFAULT_CTA },
    footer: { ...DEFAULT_FOOTER },
    aboutPage: { ...DEFAULT_ABOUT_PAGE },
    contactPage: { ...DEFAULT_CONTACT_PAGE },
  };
}

export function mergeContentWithDefaults(partial: Partial<ContentSettings> | null | undefined, generalSiteName?: string): ContentSettings {
  const defaults = getDefaultContent();
  if (!partial) return defaults;
  const result: ContentSettings = { ...defaults, ...partial };
  result.hero = { ...defaults.hero, ...partial.hero };
  result.story = { ...defaults.story, ...partial.story };
  const defItems = defaults.stats.items;
  const partItems = partial.stats?.items ?? defItems;
  result.stats = {
    ...defaults.stats,
    ...partial.stats,
    items: partItems.map((item, idx) => ({
      ...(defItems[idx] ?? { value: 0, suffix: '', label: '', min: 0, max: 100, decimal: false }),
      ...item,
    })),
  };
  result.cta = { ...defaults.cta, ...partial.cta };
  result.footer = {
    ...defaults.footer,
    ...partial.footer,
    tagline: partial.footer?.tagline ?? generalSiteName ?? defaults.footer.tagline,
  };
  const defAbout = defaults.aboutPage ?? DEFAULT_ABOUT_PAGE;
  const partAbout: Partial<AboutPageContent> = partial.aboutPage ?? {};
  const partValues = partAbout.values ?? defAbout.values ?? [];
  result.aboutPage = {
    ...defAbout,
    ...partAbout,
    values: partValues.map((v, i) => ({
      ...(defAbout.values?.[i] ?? { title: '', desc: '' }),
      ...v,
    })),
  };
  result.contactPage = { ...(defaults.contactPage ?? DEFAULT_CONTACT_PAGE), ...partial.contactPage };
  return result;
}
