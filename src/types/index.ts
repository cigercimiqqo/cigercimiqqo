import { Timestamp } from 'firebase/firestore';

// ─── Settings ──────────────────────────────────────────────────────────────

export interface WorkingHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  favicon: string;
  logo: string;
  phone: string[];
  address: string;
  socialMedia: SocialMedia;
  ga4TrackingId: string;
  maintenanceMode: boolean;
}

export interface AppearanceSettings {
  theme: 'classic' | 'modern' | 'minimal' | 'luxury';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  heroImages: string[];
  heroTransitionSpeed: number;
  customCss: string;
  galleryImages?: string[];
  storyImage?: string;
  statsImage?: string;
  ctaImage?: string;
  /** Admin'den yönetilen site görünümü (ziyaretçiye ayar gösterilmez) */
  siteTheme?: 'light' | 'dark';
  sitePrimaryColor?: string;
  heroStyle?: 'full' | 'split';
  menuLayout?: 'grid' | 'list';
  showFeatures?: boolean;
  showStats?: boolean;
  showTestimonials?: boolean;
  showGallery?: boolean;
}

export interface OrderingSettings {
  isOnline: boolean;
  workingHours: {
    mon: WorkingHours;
    tue: WorkingHours;
    wed: WorkingHours;
    thu: WorkingHours;
    fri: WorkingHours;
    sat: WorkingHours;
    sun: WorkingHours;
  };
  closedDates: string[];
  minOrderAmount: number;
  busyMessage: string;
}

export interface DeliveryDistrict {
  il: string;
  ilce: string;
  mahalle: string;
  minOrder: number;
}

export interface MapPolygon {
  coordinates: { lat: number; lng: number }[];
  minOrder: number;
}

export interface DeliverySettings {
  districts: DeliveryDistrict[];
  mapPolygons: MapPolygon[];
}

export interface NotificationSettings {
  smsEnabled: boolean;
  smsApiKey: string;
  smsProvider: 'netgsm' | 'iletimerkezi';
  smsNumbers: string[];
  smsTriggers: {
    onNew: boolean;
    onConfirmed: boolean;
    onOnTheWay: boolean;
    onDelivered: boolean;
  };
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappTemplate: string;
}

/** Medya yükleme sağlayıcısı – Firestore’da saklanır */
export type MediaUploadProvider = 'cloudinary' | 'imgbb';

export interface IntegrationSettings {
  mediaProvider: MediaUploadProvider;
}

export interface HeroContentSettings {
  tagline: string;
  headline: string;
  headlineAccent: string;
  description: string;
  buttonMenu: string;
  buttonReservation: string;
}

export interface StoryContentSettings {
  sectionLabel: string;
  title: string;
  titleAccent: string;
  paragraph1: string;
  paragraph2: string;
  yearsValue: string;
  yearsLabel: string;
  signature: string;
  linkText: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  min: number;
  max: number;
  decimal: boolean;
}

export interface StatsContentSettings {
  sectionLabel: string;
  items: StatItem[];
}

export interface CtaContentSettings {
  tagline: string;
  title: string;
  description: string;
  buttonCall: string;
  buttonOrder: string;
}

export interface FooterContentSettings {
  tagline: string;
  description: string;
  quickLinksLabel: string;
  supportLabel: string;
  newsletterLabel: string;
  newsletterPlaceholder: string;
  copyrightText: string;
}

export interface AboutPageContent {
  tagline: string;
  title: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionTitleAccent: string;
  valuesLabel: string;
  values: { title: string; desc: string }[];
}

export interface ContactPageContent {
  tagline: string;
  title: string;
  infoLabel: string;
  formTitle: string;
  formSuccessTitle: string;
  formSuccessMessage: string;
}

export interface ContentSettings {
  hero: HeroContentSettings;
  story: StoryContentSettings;
  stats: StatsContentSettings;
  cta: CtaContentSettings;
  footer: FooterContentSettings;
  aboutPage?: AboutPageContent;
  contactPage?: ContactPageContent;
}

/** Ana sayfa bölüm ID’leri – sıra ve görünürlük için */
export type HomeSectionId =
  | 'hero'
  | 'features'
  | 'bestSellers'
  | 'featured'
  | 'categoryNav'
  | 'story'
  | 'stats'
  | 'galleryPreview'
  | 'reviews'
  | 'restaurantInfo'
  | 'blogPreview'
  | 'cta';

export interface SectionLayoutConfig {
  order: number;
  visible: boolean;
}

export interface LayoutSettings {
  mobile: Record<HomeSectionId, SectionLayoutConfig>;
  tablet: Record<HomeSectionId, SectionLayoutConfig>;
  desktop: Record<HomeSectionId, SectionLayoutConfig>;
  headerStyle: 'full' | 'compact' | 'minimal';
  footerColumns: 2 | 3 | 4;
}

export interface SiteSettings {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  ordering: OrderingSettings;
  delivery: DeliverySettings;
  notifications: NotificationSettings;
  integrations?: IntegrationSettings;
  layout?: LayoutSettings;
  content?: ContentSettings;
}

// ─── Category ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Product ──────────────────────────────────────────────────────────────

export type ProductBadge = 'bestseller' | 'new' | 'featured' | 'spicy';
export type DiscountType = 'none' | 'amount' | 'percent';

export interface ProductVariantOption {
  label: string;
  priceModifier: number;
}

export interface ProductVariant {
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  comparePrice: number | null;
  discountType: DiscountType;
  discountValue: number;
  badges: ProductBadge[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: number | null;
  orderCount: number;
  variants: ProductVariant[];
  allergens: string[];
  createdAt: Timestamp;
}

// ─── Order ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'rejected';

export type PaymentMethod = 'cash' | 'card_at_door';

export interface OrderAddress {
  il: string;
  ilce: string;
  mahalle: string;
  detay: string;
  fullText: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variants: { variantName: string; optionLabel: string; priceModifier: number }[];
  image: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: Timestamp;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address: OrderAddress;
  };
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  note: string;
  visitorId: string;
  isBlacklisted: boolean;
  statusHistory: StatusHistory[];
  internalNote?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: Timestamp;
}

// ─── Visitor ───────────────────────────────────────────────────────────────

export interface VisitorSession {
  sessionId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number;
  pageViews: number;
  referrer: string;
}

export interface CartEvent {
  type: 'add' | 'remove' | 'update';
  productId: string;
  timestamp: Timestamp;
}

export interface Visitor {
  id: string;
  visitorId: string;
  ip: string;
  userAgent: string;
  sessions: VisitorSession[];
  totalVisits: number;
  lastVisit: Timestamp;
  cartEvents: CartEvent[];
  orders: string[];
  isBlacklisted: boolean;
}

// ─── Blog ──────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  isPublished: boolean;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
}

// ─── Review ────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  platform: 'google' | 'custom';
  isVisible: boolean;
  order: number;
  createdAt: Timestamp;
  /** Google: Yerel Rehber · 48 yorum · 4 fotoğraf */
  badge?: string;
  /** Google: ₺400–₺600 */
  priceRange?: string;
  /** Google: Yeni, vb. */
  tags?: string[];
  /** Gri kutu: Yiyecek: 5/5 | Önerilen yemekler: X | Gürültü: X | Bekleme: X */
  detailsBlock?: string;
}

// ─── Page ──────────────────────────────────────────────────────────────────

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  order: number;
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItemVariantSelection {
  variantName: string;
  optionLabel: string;
  priceModifier: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variants: CartItemVariantSelection[];
  image: string;
}

// ─── Realtime ─────────────────────────────────────────────────────────────

export interface ActiveOrder {
  status: OrderStatus;
  updatedAt: number;
  customerName: string;
}

export interface Notification {
  type: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}

// ─── Coupon ───────────────────────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  discountType: 'amount' | 'percent';
  discountValue: number;
  minOrderAmount: number;
  maxUsage: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
}

// ─── District Data ────────────────────────────────────────────────────────

export interface DistrictData {
  il: string;
  ilceler: {
    ilce: string;
    mahalleler: string[];
  }[];
}
