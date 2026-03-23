

🍽️

**RESTORAN SaaS PLATFORMU**

*Kapsamlı Proje Dökümanı & Mimari Rehberi*

Versiyon 1.0  •  Mart 2026  •  Phase 1 & 2

| Özellik | Değer |
| :---- | :---- |
| Proje Adı | Restoran SaaS Platformu (White-label) |
| Frontend | Next.js 14 (App Router, TypeScript) |
| Backend | Firebase (Firestore \+ Auth \+ Realtime DB) |
| Medya Depolama | Cloudinary (ücretsiz tier) |
| Hosting | Cloudflare Pages (ücretsiz, SSR destekli) |
| Deployment | Ayrı deploy (Her restoran kendi instance'ı) |
| Dil | Türkçe (Phase 2'de çoklu dil hazırlığı) |
| Ödeme | Kapıda nakit / kart (Phase 2'de online) |
| AI Özelliği | Pollinations.ai (tamamen ücretsiz) |
| Çoklu Dil Desteği | Phase 2 |
| Online Ödeme | Phase 2 (iyzico/PayTR altyapısı hazır) |

# **📋 İçindekiler**

1\.  Proje Genel Bakış & Amaçlar

2\.  Teknoloji Stack & Mimari Kararlar

3\.  Dosya & Klasör Yapısı

4\.  Firebase Veritabanı Şeması

5\.  Müşteri (Frontend) Modülleri

6\.  Admin Panel Modülleri

7\.  API & Servis Entegrasyonları

8\.  SEO & Performans Stratejisi

9\.  Güvenlik & Yetkilendirme

10\. Deployment & Kurulum Adımları

11\. Geliştirme Fazları & Task Listesi

12\. White-Label Satış Rehberi

# **1\. Proje Genel Bakış & Amaçlar**

## **1.1 Vizyon**

Bu platform, herhangi bir restoran işletmesine dakikalar içinde kurulabilen, tamamen özelleştirilebilir, modern ve yüksek performanslı bir web sipariş & vitrin sistemidir. White-label yapısı sayesinde tek bir kod tabanı, farklı restoranlara tekrar tekrar satılabilir.

## **1.2 Temel Prensipler**

* Sıfır maliyet altyapı (Firebase Spark \+ Cloudinary Free \+ Cloudflare Pages Free)

* Kod tabanında restoran adı yok — her şey admin panelinden yapılandırılır

* Mobil öncelikli (Mobile-first) tasarım

* SEO-first yaklaşım — Next.js SSR ile Google sıralamalarında öne çıkış

* Console.log yok — üretim ortamında temiz konsol

* Asenkron medya yükleme — fotoğraf hazır olmadan kullanıcıya gösterilmez

* Orijinal kalite medya — Cloudinary'de hiçbir kalite kaybı yok

## **1.3 Hedef Kitle (Satış Hedefi)**

| Segment | Açıklama | Öncelik |
| :---- | :---- | :---- |
| Küçük Restoranlar | 10-50 masa, yerel teslimat | Yüksek |
| Orta Ölçekli İşletmeler | Birden fazla şube, online varlık | Orta |
| Fast Food & Paket Servis | Hızlı sipariş, yüksek hacim | Yüksek |
| Kafe & Pastaneler | Menü vitrini \+ blog içerik | Orta |

# **2\. Teknoloji Stack & Mimari Kararlar**

## **2.1 Frontend**

| Teknoloji | Versiyon | Kullanım Amacı | Neden? |
| :---- | :---- | :---- | :---- |
| Next.js | 14 (App Router) | Ana framework | SSR/SSG ile SEO, Image Optimization built-in |
| TypeScript | 5.x | Tip güvenliği | Büyük projede hata önleme |
| Tailwind CSS | 3.x | Styling | Hızlı geliştirme, tema sistemi kolaylığı |
| Zustand | 4.x | State yönetimi | Sepet, kullanıcı state'i — Redux'tan hafif |
| React Query | 5.x | Server state | Firebase veri çekme, cache, loading states |
| Framer Motion | 11.x | Animasyonlar | Scroll efektleri, geçişler, banner animasyonu |
| next-seo | latest | SEO meta yönetimi | Her sayfa için otomatik meta tag üretimi |
| next-intl | latest | i18n altyapısı | Phase 2 çoklu dil için şimdiden hazırlık |

## **2.2 Backend & Altyapı**

| Servis | Plan | Kullanım | Limit |
| :---- | :---- | :---- | :---- |
| Firebase Firestore | Spark (Ücretsiz) | Ana veritabanı | 50K okuma/20K yazma/gün |
| Firebase Auth | Spark (Ücretsiz) | Admin girişi | 10K/ay |
| Firebase Realtime DB | Spark (Ücretsiz) | Canlı siparişler, bildirimler | 1GB depolama |
| Firebase Storage | Spark (Ücretsiz) | Sadece küçük dosyalar | 5GB (medya Cloudinary'de) |
| Cloudinary | Free (25 kredi/ay) | Tüm görseller | 25GB depolama, orijinal kalite |
| Cloudflare Pages | Free | Hosting \+ CDN | Sınırsız bant genişliği |
| Pollinations.ai | Tamamen Ücretsiz | AI sepet önerisi | API key gerektirmez |
| Google Maps API | Kullandıkça öde | Teslimat bölgesi haritası | Admin kendi key'ini girer |

## **2.3 Mimari Diyagram**

Sistemin genel akışı şu şekildedir:

Kullanıcı Tarayıcısı

    ↕  (HTTPS)

Cloudflare Pages (CDN \+ Edge)

    ↕  (Next.js SSR/SSG)

Next.js App

    ├── Firebase Firestore  (ürünler, siparişler, ayarlar)

    ├── Firebase Realtime   (canlı siparişler, bildirimler)

    ├── Firebase Auth       (admin kimlik doğrulama)

    ├── Cloudinary CDN      (medya dosyaları)

    ├── Pollinations.ai     (AI sepet)

    └── Google Maps API     (teslimat bölgesi)

## **2.4 Multi-Tenancy Modeli**

Phase 1: Ayrı Deploy — Her restoran için ayrı GitHub reposu fork'lanır, ayrı Firebase projesi ve Cloudinary hesabı bağlanır. Kurulum 15 dakika sürer.

Phase 3 (İleride): Custom Domain \+ Tek Altyapı — Tüm restoranlar tek Firebase'de, tenant\_id ile izole edilir. Subdomain veya özel domain bağlanır.

| Ortam Değişkeni | Açıklama |
| :---- | :---- |
| NEXT\_PUBLIC\_FIREBASE\_API\_KEY | Firebase proje API key |
| NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN | Firebase auth domain |
| NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID | Firebase proje ID |
| NEXT\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET | Firebase storage bucket |
| NEXT\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID | FCM sender ID |
| NEXT\_PUBLIC\_FIREBASE\_APP\_ID | Firebase app ID |
| NEXT\_PUBLIC\_CLOUDINARY\_CLOUD\_NAME | Cloudinary cloud adı |
| NEXT\_PUBLIC\_CLOUDINARY\_UPLOAD\_PRESET | Cloudinary upload preset (unsigned) |
| NEXT\_PUBLIC\_GOOGLE\_MAPS\_API\_KEY | Google Maps API anahtarı |
| NEXT\_PUBLIC\_GA4\_MEASUREMENT\_ID | Google Analytics 4 ID |

# **3\. Dosya & Klasör Yapısı**

/

├── src/

│   ├── app/                          \# Next.js App Router

│   │   ├── (site)/                   \# Müşteri arayüzü route grubu

│   │   │   ├── page.tsx              \# Ana sayfa (SSG)

│   │   │   ├── menu/page.tsx         \# Menü sayfası (SSG)

│   │   │   ├── cart/page.tsx         \# Sepet sayfası

│   │   │   ├── order/\[id\]/page.tsx   \# Sipariş takip

│   │   │   ├── blog/

│   │   │   │   ├── page.tsx          \# Blog listesi (SSG)

│   │   │   │   └── \[slug\]/page.tsx   \# Blog detay (SSG, SEO kritik)

│   │   │   └── pages/\[slug\]/page.tsx \# Dinamik sayfalar

│   │   │

│   │   ├── (admin)/                  \# Admin panel route grubu

│   │   │   ├── admin/

│   │   │   │   ├── login/page.tsx

│   │   │   │   ├── dashboard/page.tsx

│   │   │   │   ├── orders/page.tsx

│   │   │   │   ├── products/page.tsx

│   │   │   │   ├── categories/page.tsx

│   │   │   │   ├── blog/page.tsx

│   │   │   │   ├── visitors/page.tsx

│   │   │   │   ├── analytics/page.tsx

│   │   │   │   ├── settings/

│   │   │   │   │   ├── general/page.tsx

│   │   │   │   │   ├── appearance/page.tsx

│   │   │   │   │   ├── delivery/page.tsx

│   │   │   │   │   ├── notifications/page.tsx

│   │   │   │   │   └── integrations/page.tsx

│   │   │   │   └── pages/page.tsx

│   │   │

│   │   ├── api/                      \# Next.js API Routes

│   │   │   ├── visitors/route.ts     \# Ziyaretçi kayıt endpoint

│   │   │   ├── orders/route.ts       \# Sipariş endpoint

│   │   │   └── ai-cart/route.ts      \# AI sepet endpoint

│   │   │

│   │   ├── layout.tsx                \# Root layout

│   │   ├── not-found.tsx

│   │   └── sitemap.ts                \# Otomatik sitemap

│   │

│   ├── components/

│   │   ├── site/                     \# Müşteri bileşenleri

│   │   │   ├── HeroBanner.tsx

│   │   │   ├── MenuGrid.tsx

│   │   │   ├── ProductCard.tsx

│   │   │   ├── Cart.tsx

│   │   │   ├── AiCartButton.tsx

│   │   │   ├── ReviewsSection.tsx

│   │   │   └── BlogCard.tsx

│   │   ├── admin/                    \# Admin bileşenleri

│   │   │   ├── OrderCard.tsx

│   │   │   ├── StatsWidget.tsx

│   │   │   ├── ProductForm.tsx

│   │   │   └── VisitorTable.tsx

│   │   └── ui/                       \# Ortak UI (shadcn/ui tabanlı)

│   │

│   ├── lib/

│   │   ├── firebase/

│   │   │   ├── client.ts             \# Firebase init

│   │   │   ├── firestore.ts          \# Firestore helpers

│   │   │   └── realtime.ts           \# Realtime DB helpers

│   │   ├── cloudinary.ts             \# Upload helpers

│   │   ├── pollinations.ts           \# AI sepet client

│   │   └── visitor.ts                \# Ziyaretçi tracking

│   │

│   ├── hooks/                        \# Custom React hooks

│   ├── store/                        \# Zustand store'ları

│   ├── types/                        \# TypeScript tipleri

│   └── config/                       \# Site config tipler

│

├── public/

│   ├── districts/tr-districts.json   \# Türkiye il/ilçe/mahalle verisi

│   └── sounds/new-order.mp3          \# Yeni sipariş sesi

│

├── .env.local                        \# Geliştirme ortam değişkenleri

├── .env.example                      \# Şablon (repoya dahil edilir)

├── next.config.ts

├── tailwind.config.ts

└── firebase.json                     \# Firebase yapılandırması

# **4\. Firebase Veritabanı Şeması**

Tüm veriler Firebase Firestore'da tutulur. Gerçek zamanlı sipariş akışı için Firebase Realtime Database kullanılır.

## **4.1 Firestore Koleksiyonları**

### **settings (Tek döküman: doc ID \= 'config')**

settings/config

  ├── general

  │   ├── siteName: string

  │   ├── siteDescription: string

  │   ├── siteKeywords: string\[\]

  │   ├── favicon: string (Cloudinary URL)

  │   ├── logo: string (Cloudinary URL)

  │   ├── phone: string\[\]

  │   ├── address: string

  │   ├── socialMedia: { instagram, facebook, youtube, twitter, tiktok }

  │   └── ga4TrackingId: string

  ├── appearance

  │   ├── theme: 'classic' | 'modern' | 'minimal' | 'luxury'

  │   ├── primaryColor: string (hex)

  │   ├── secondaryColor: string

  │   ├── accentColor: string

  │   ├── fontFamily: string

  │   ├── heroImages: string\[\] (Cloudinary URLs)

  │   └── customCss: string

  ├── ordering

  │   ├── isOnline: boolean

  │   ├── workingHours: { mon-sun: { open, close, isClosed } }

  │   ├── closedDates: string\[\] (YYYY-MM-DD)

  │   ├── minOrderAmount: number

  │   └── busyMessage: string

  ├── delivery

  │   ├── districts: Array\<{ il, ilce, mahalle, minOrder }\>

  │   └── mapPolygons: Array\<{ coordinates: LatLng\[\], minOrder }\>

  └── notifications

      ├── smsEnabled: boolean

      ├── smsApiKey: string (şifreli)

      ├── smsProvider: 'netgsm' | 'iletimerkezi'

      ├── smsNumbers: string\[\]

      ├── whatsappEnabled: boolean

      └── whatsappNumber: string

### **categories**

categories/{categoryId}

  ├── name: string

  ├── slug: string

  ├── description: string

  ├── image: string (Cloudinary URL)

  ├── order: number

  ├── isActive: boolean

  └── createdAt: Timestamp

### **products**

products/{productId}

  ├── categoryId: string

  ├── name: string

  ├── slug: string

  ├── description: string

  ├── images: string\[\] (Cloudinary URLs, max 5\)

  ├── price: number

  ├── comparePrice: number | null (karşılaştırmalı fiyat)

  ├── discountType: 'none' | 'amount' | 'percent'

  ├── discountValue: number

  ├── badges: ('bestseller' | 'new' | 'featured' | 'spicy')\[\]

  ├── tags: string\[\]

  ├── isActive: boolean

  ├── isFeatured: boolean

  ├── stock: number | null (null \= sınırsız)

  ├── orderCount: number (en çok satanlar için)

  ├── variants: Array\<{ name, options: Array\<{ label, priceModifier }\> }\>

  ├── allergens: string\[\]

  └── createdAt: Timestamp

### **orders**

orders/{orderId}

  ├── orderNumber: string (ORD-2026-XXXX)

  ├── status: 'new' | 'confirmed' | 'preparing' | 'on\_the\_way' | 'delivered' | 'rejected'

  ├── customer

  │   ├── name: string

  │   ├── phone: string

  │   └── address: { il, ilce, mahalle, detay, fullText }

  ├── items: Array\<{ productId, name, price, quantity, variants, image }\>

  ├── subtotal: number

  ├── total: number

  ├── paymentMethod: 'cash' | 'card\_at\_door'

  ├── note: string

  ├── visitorId: string (Visitor\_XXXX ID)

  ├── isBlacklisted: boolean

  ├── statusHistory: Array\<{ status, timestamp, note }\>

  └── createdAt: Timestamp

### **visitors**

visitors/{visitorId}

  ├── visitorId: string (Visitor\_1000, Visitor\_1001, ...)

  ├── ip: string (hash'lenmiş)

  ├── userAgent: string

  ├── sessions: Array\<{

  │   ├── sessionId: string

  │   ├── startTime: Timestamp

  │   ├── endTime: Timestamp

  │   ├── duration: number (saniye)

  │   ├── pageViews: number

  │   └── referrer: string

  │   }\>

  ├── totalVisits: number

  ├── lastVisit: Timestamp

  ├── cartEvents: Array\<{ type, productId, timestamp }\>

  ├── orders: string\[\] (orderId listesi)

  └── isBlacklisted: boolean

### **blog\_posts**

blog\_posts/{postId}

  ├── title: string

  ├── slug: string (SEO dostu, unique)

  ├── excerpt: string (160 karakter — meta description)

  ├── content: string (HTML/Markdown)

  ├── coverImage: string (Cloudinary URL)

  ├── tags: string\[\]

  ├── seoTitle: string

  ├── seoDescription: string

  ├── seoKeywords: string\[\]

  ├── isPublished: boolean

  ├── publishedAt: Timestamp

  └── createdAt: Timestamp

### **reviews (Manuel Yorum Girişi)**

reviews/{reviewId}

  ├── authorName: string

  ├── authorAvatar: string (Cloudinary URL)

  ├── rating: number (1-5)

  ├── text: string

  ├── platform: 'google' | 'custom'

  ├── isVisible: boolean

  └── createdAt: Timestamp

### **pages (Dinamik Sayfalar)**

pages/{pageId}

  ├── title: string

  ├── slug: string

  ├── content: string

  ├── isPublished: boolean

  └── order: number

## **4.2 Firebase Realtime Database Yapısı**

Realtime Database sadece gerçek zamanlı akış gerektiren veriler için kullanılır:

realtime/

├── active\_orders/

│   └── {orderId}: { status, updatedAt, customer.name }

├── notifications/

│   └── {visitorId}/

│       └── {notifId}: { type, message, isRead, createdAt }

└── counter/

    └── nextVisitorId: number (1000'den başlar)

# **5\. Müşteri (Frontend) Modülleri**

## **5.1 Ana Sayfa**

* Hero banner: tam ekran kayan fotoğraflar (Framer Motion), admin'den değiştirilebilir

* Öne çıkan ürünler bölümü (isFeatured \= true olan ürünler)

* En çok satanlar bölümü (orderCount'a göre sıralı ilk 6 ürün)

* Kategoriler hızlı navigasyonu

* Google yorumları bölümü (manuel eklenen yorumlar, Google ekran görüntüsü tarzı UI)

* Restoran hakkında kısa bilgi \+ adres \+ harita

* Blog'dan son yazılar (3 adet)

## **5.2 Menü Sayfası**

* Kategori tabları — sticky olarak sayfada kalır, scroll ile aktif kategori değişir

* Ürün kartları: fotoğraf (lazy-load blur placeholder), isim, fiyat, indirim rozeti

* Çoklu fotoğraf desteği: kart üzerinde hover'da küçük galeri noktaları

* Filtre: Fiyata göre, Kategoriye göre, Arama

* 'En Çok Satanlar' özel bölümü (sayfanın üstünde)

* "Bunu alanlar şunu da aldı" — ürün detayında related products

* AI Sepet butonu: 'Sepetini AI Yapsın' — kullanıcıya ne önerilsin sorar

## **5.3 Ürün Detay**

* Çoklu fotoğraf galerisi (lightbox ile tam ekran)

* Varyant seçimi (boyut, pişirme tercihi vb.)

* Miktar seçici

* Sepete ekle butonu (çalışma saatleri dışındaysa devre dışı)

* İlgili ürünler carousel'i

## **5.4 Sepet & Sipariş**

Sepet, sağ taraftan açılan drawer (mobil: alt sayfadan açılır). Aşağıdaki akış izlenir:

1. Sepet görüntüleme — ürünler, miktarlar, toplam

2. Müşteri bilgileri — ad soyad, telefon

3. Adres seçimi — il \> ilçe \> mahalle cascading dropdown (Türkiye verisi), adres detay

4. Ödeme yöntemi — Kapıda Nakit / Kapıda Kart

5. Sipariş notu (opsiyonel)

6. Sipariş özeti ve onay

Çalışma saatleri dışındaysa: 'Şu an sipariş alamıyoruz — \[mesaj\]' ekranı gösterilir, sepete eklenebilir ama sipariş verilemez.

## **5.5 AI Sepet Özelliği**

Kullanıcı 'Sepetimi AI Yapsın' butonuna tıkladığında:

7. Kullanıcıya 'Ne yemek istersin?' diye sohbet balonu açılır

8. Kullanıcı cevap yazar (örn: 'Akşam yemeği için hafif bir şeyler')

9. Pollinations.ai'ya ürün listesi \+ fiyatlar \+ kullanıcı isteği gönderilir

10. Gelen cevaba göre sepet otomatik dolar

11. Sepette: Bütçemi Artır / Azalt / Tamamen Değiştir butonları

API çağrısı başarısız olursa: 'Öneri şu an yüklenemiyor, manuel eklemeye devam edebilirsin' mesajı gösterilir.

## **5.6 Sipariş Takip Sayfası**

Müşteri sipariş verdikten sonra /order/\[orderId\] sayfasına yönlendirilir:

* Firebase Realtime DB ile canlı durum güncelleme

* Durum çizgisi: Yeni → Onaylandı → Hazırlanıyor → Yola Çıktı → Teslim Edildi

* Site açıksa: push notification ile durum değişikliği bildirimi

## **5.7 Blog**

* Blog listesi: responsive kart grid, kategori/etiket filtresi

* Blog detay: full SSG, Schema.org Article markup, okuma süresi tahmini

* İlgili yazılar bölümü

* Sosyal paylaşım butonları

* Otomatik sitemap.xml'e dahil edilir

# **6\. Admin Panel Modülleri**

## **6.1 Giriş & Kimlik Doğrulama**

* Firebase Authentication — Email/şifre ile giriş

* 'Beni hatırla' seçeneği

* Şifremi unuttum akışı

* Yetkisiz erişimde /admin/login'e yönlendirme

* Oturum süresi: 7 gün (kalıcı oturum opsiyonu)

## **6.2 Dashboard (Ana Ekran)**

### **Aktif Siparişler Paneli**

* Firebase Realtime ile canlı güncelleme — yeni sipariş gelince sesli bildirim \+ browser push notification

* Her sipariş için: Müşteri adı, ürünler, toplam, sipariş zamanı, durum

* Hızlı eylem butonları: Onayla / Reddet / Hazırlanıyor / Yola Çıktı

* Sipariş onaylandığında müşteriye Realtime DB üzerinden anlık bildirim

### **İstatistik Widget'ları**

| Widget | Veri Kaynağı | Güncelleme |
| :---- | :---- | :---- |
| Bugünkü siparişler | Firestore orders sorgusu | Gerçek zamanlı |
| Bugünkü gelir | orders.total toplamı | Gerçek zamanlı |
| Bugünkü ziyaretçi | visitors koleksiyonu | Gerçek zamanlı |
| Sepete eklenme (bugün) | visitors.cartEvents | Gerçek zamanlı |
| Dönüşüm oranı | Sipariş / Ziyaretçi oranı | Hesaplanan |
| Popüler ürünler | products.orderCount | Saatlik güncelleme |
| Haftalık sipariş grafiği | Firestore aggregation | Günlük |
| Firebase limit kullanımı | Firebase REST API | Saatlik |

## **6.3 Sipariş Yönetimi**

* Tüm siparişler tablosu: sipariş no, tarih, müşteri, ürünler, toplam, durum

* Filtreler: Tarihe göre, Duruma göre, Müşteri adına göre, Ödeme yöntemine göre

* Sipariş detay modalı: tam sipariş bilgisi, durum geçmişi, PDF olarak indir/yazdır

* Durum güncelleme: Dropdown ile tek tıkla güncelleme

* Her durum değişikliğinde SMS/WhatsApp gönderimi (ayarlara göre)

* Müşteriyi kara listeye ekle: adres veya telefon bazlı engelleme

* Kara liste yönetimi: engelli adresleri/telefonları görme ve kaldırma

* Sipariş notları ekleme (dahili not, müşteriye gösterilmez)

## **6.4 Ürün & Kategori Yönetimi**

### **Kategori Yönetimi**

* Kategori ekle/düzenle/sil

* Sürükle-bırak ile sıralama

* Kategori görseli (Cloudinary upload)

* Aktif/pasif toggle

### **Ürün Yönetimi**

* Ürün ekle/düzenle/sil

* Çoklu fotoğraf yükleme (max 5\) — Cloudinary'e asenkron yükleme, yükleme göstergesi

* Fiyat ayarları: Normal fiyat, Karşılaştırmalı fiyat, İndirim tipi (tutar/yüzde)

* Rozet ataması: En Çok Satan, Yeni, Öne Çıkan, Acılı

* Varyant ekleme (boyut, pişirme tercihi vb. — her seçeneğe fiyat farkı eklenebilir)

* Allerjen bilgisi

* Stok takibi (opsiyonel — null \= sınırsız)

* Toplu işlemler: Çoklu seçim → aktif/pasif yap, toplu sil

* Ürün önizleme: Admin panelde müşteri gözünden nasıl görüneceğini önizle

## **6.5 Blog Yönetimi**

* Zengin metin editörü (TipTap veya Quill tabanlı)

* SEO alanları: Meta title, meta description, anahtar kelimeler

* Slug otomatik oluşturma (başlıktan) \+ manuel düzenleme

* Kapak fotoğrafı yükleme (Cloudinary)

* Etiket yönetimi

* Taslak olarak kaydet / Yayınla

* Yayınlanma tarihi zamanlaması

* Blog yazısı önizlemesi

## **6.6 Ziyaretçi Yönetimi**

* Tüm ziyaretçiler tablosu: ID (Visitor\_XXXX), IP hash, ilk ziyaret, son ziyaret, toplam ziyaret

* Ziyaretçi detay: tüm oturumlar, süreleri, sepet eylemleri, verdikleri siparişler

* Aynı IP'den tekrar gelen ziyaretçiler güncellenir, yeni ziyaretçi oluşturulmaz

* Ziyaretçi ID'si 1000'den başlar ve artar

* Filtreler: Tarihe göre, Sipariş verenlere göre

## **6.7 Site Ayarları**

### **Genel Ayarlar**

* Site adı, açıklama, anahtar kelimeler

* Logo ve favicon yükleme (Cloudinary)

* İletişim: Telefon numaraları (çoklu), adres

* Sosyal medya linkleri: Instagram, Facebook, YouTube, Twitter/X, TikTok (logo'lar ile)

* Google Analytics 4 Tracking ID

* Bakım modu toggle'ı

### **Sipariş & Çalışma Saatleri**

* Online sipariş durumu: Açık / Kapalı / Mesai saatlerine göre otomatik

* Çalışma saatleri: Her gün için ayrı ayrı (açılış/kapanış saati, kapalı günler)

* Yoğunluk mesajı: Meşgul görünümde müşteriye gösterilecek mesaj

* Resmi tatil / kapalı gün ekleme (takvim ile seçim)

### **Teslimat Bölgesi**

* İl \> İlçe \> Mahalle seçimi (Türkiye verisi — public/districts/ JSON)

* Her mahalle için minimum sipariş tutarı

* Google Maps ile polygon çizimi (admin kendi Maps API key'ini girer)

* Aktif teslimat bölgeleri listesi

### **Bildirim Ayarları**

* SMS sağlayıcı seçimi: Netgsm / İleti Merkezi

* SMS API key girişi (şifreli saklanır)

* SMS gönderilecek firma numaraları (virgülle ayrılmış)

* Hangi durumlarda SMS gönderileceği toggle'ları (Sipariş alındı, Onaylandı, Yola çıktı, Teslim)

* WhatsApp Business: otomatik yönlendirme numarası (wa.me formatı)

### **Görünüm & Tema Ayarları**

* Hazır temalar: Klasik, Modern, Minimal, Lüks (önizleme ile seçim)

* Özelleştirmeler: Ana renk, ikincil renk, vurgu rengi (renk seçici)

* Font ailesi seçimi: Sistem fontları \+ Google Fonts listesi

* Hero banner yönetimi: fotoğraf ekle/çıkar/sırala, geçiş hızı

* Özel CSS alanı (ileri düzey kullanıcılar için)

* Değişiklikler anlık önizleme ile gösterilir, Kaydet ile uygulanır

### **Entegrasyonlar**

* Cloudinary: Cloud Name ve Upload Preset girişi

* Google Maps API Key

* GA4 Measurement ID

* SMS API bilgileri

## **6.8 Sayfalar Yönetimi**

* Yeni statik sayfa oluşturma (Hakkımızda, KVKK, vb.)

* Zengin metin editörü

* Sayfa sıralaması (footer navigasyonunda görünür)

* Yayınla / Taslak durumu

## **6.9 Yorum Yönetimi**

* Yeni yorum ekleme: Yazar adı, fotoğrafı, puan, metin, platform etiketi (Google)

* Google yorum görünümü: Google logo'su, yıldız puanı, tarih ile otantik görünüm

* Görünür/gizli toggle

* Yorum sıralaması

# **7\. API & Servis Entegrasyonları**

## **7.1 Cloudinary Medya Yönetimi**

Cloudinary, tüm görsellerin depolandığı ve sunulduğu platformdur. Hiçbir kalite kaybı olmadan orijinal kalitede saklanır.

* Upload: Unsigned upload preset kullanılır (API key frontend'de gizli kalmaz)

* Klasör yapısı: /restaurant/{cloud\_name}/products/, /blog/, /hero/, /logo/

* Asenkron yükleme: Fotoğraf yüklenirken blur placeholder gösterilir, yükleme tamamlanınca net fotoğraf görünür

* Lazy loading: Ekrana girmeden önce yüklenmez (Intersection Observer)

* Responsive: Cloudinary transformation URL'leri ile farklı cihazlar için otomatik boyut

* Admin panelde upload: Drag & drop, çoklu dosya seçimi, yükleme progress bar

## **7.2 Pollinations.ai (AI Sepet)**

Tamamen ücretsiz, API key gerektirmez. Endpoint: https://text.pollinations.ai/

POST https://text.pollinations.ai/

Body: {

  "messages": \[

    { "role": "system", "content": "Sen bir restoran asistanısın...

      Menüdeki ürünler: \[ürün listesi JSON\]" },

    { "role": "user", "content": "Kullanıcı isteği" }

  \],

  "model": "openai",

  "seed": 42,

  "json": true

}

Dönen yanıt: { items: \[{ productId, quantity }\] } formatında JSON. Hata durumunda kullanıcıya mesaj gösterilir, sessizce başarısız olmaz.

## **7.3 SMS Entegrasyonu**

Admin panelde sağlayıcı seçilir ve API bilgileri girilir. Desteklenen sağlayıcılar:

| Sağlayıcı | API Tipi | Türkiye Desteği |
| :---- | :---- | :---- |
| Netgsm | REST API | Tam destek, en yaygın |
| İleti Merkezi | REST API | Tam destek |

Her sipariş durumu değişikliğinde ilgili toggle aktifse SMS gönderilir. Şablonlar admin panelden özelleştirilebilir.

## **7.4 WhatsApp Yönlendirmesi**

wa.me/NUMARA?text=MESAJ formatı kullanılır. Sipariş onaylandığında veya müşteri istediğinde tek tıkla WhatsApp'a yönlendirilir. Otomatik mesaj şablonu admin panelden ayarlanır.

## **7.5 Google Maps Entegrasyonu**

Admin kendi API key'ini girer. Harita üzerinde polygon çizme ile teslimat bölgesi belirlenir. Müşteri adres seçiminde ise sadece dropdown (il/ilçe/mahalle) kullanılır — Maps API'ye gerek yoktur.

## **7.6 Google Analytics 4**

Admin panelden GA4 Measurement ID girilir. next/script ile performans etkilenmeden yüklenir (strategy: 'afterInteractive'). Sayfa görüntüleme, sepet olayları, sipariş tamamlama otomatik izlenir.

# **8\. SEO & Performans Stratejisi**

## **8.1 Teknik SEO**

* Next.js App Router ile her sayfa SSG/SSR — Google bot tam içeriği görür

* Otomatik sitemap.xml (ürünler, kategoriler, blog yazıları, sayfalar)

* robots.txt — admin sayfaları hariç tut, site sayfaları dahil et

* Canonical URL'ler — her sayfada tek ve doğru URL

* Schema.org markup: Restaurant, Menu, BlogPosting, BreadcrumbList

* Open Graph \+ Twitter Card meta tag'leri (sosyal paylaşım önizlemesi)

* Hreflang — Phase 2'de çoklu dil için hazır

## **8.2 Blog SEO (En Kritik Alan)**

* Her blog yazısı SSG ile build time'da üretilir — anlık yükleme

* SEO title, meta description, keywords admin panelden girilir

* Schema.org Article markup otomatik eklenir

* Slug SEO dostu: Türkçe karakter dönüşümü (ğ→g, ş→s, vb.)

* Okuma süresi hesaplama ve Schema'ya ekleme

* İç linkleme kolaylığı — editörde ürün/blog yazısı linkleri

## **8.3 Core Web Vitals Optimizasyonu**

| Metrik | Hedef | Strateji |
| :---- | :---- | :---- |
| LCP (Largest Contentful Paint) | \< 2.5s | Hero görsel preload, Cloudinary CDN |
| FID/INP (Interaction to Next Paint) | \< 200ms | Zustand ile hafif state, code splitting |
| CLS (Cumulative Layout Shift) | \< 0.1 | Görsel placeholder'ları, sabit boyutlar |
| TTFB (Time to First Byte) | \< 800ms | Cloudflare CDN, SSG sayfalar |

## **8.4 Görsel Optimizasyon**

* next/image bileşeni — otomatik WebP dönüşümü, lazy loading

* Cloudinary URL transformasyonları — cihaz genişliğine göre doğru boyut

* Blur placeholder — yüklenmeden önce bulanık önizleme (renk tabanlı)

* Priority prop — ekranda görünür olan ilk görsel için

# **9\. Güvenlik & Yetkilendirme**

## **9.1 Firebase Security Rules**

// Firestore Rules

rules\_version \= '2';

service cloud.firestore {

  match /databases/{database}/documents {

    // Public read — settings, products, categories, blog, reviews, pages

    match /settings/{doc} {

      allow read: if true;

      allow write: if request.auth \!= null;

    }

    match /products/{doc} {

      allow read: if true;

      allow write: if request.auth \!= null;

    }

    // Orders — müşteri yazabilir, admin okuyabilir/güncelleyebilir

    match /orders/{doc} {

      allow create: if true;

      allow read, update: if request.auth \!= null;

    }

    // Visitors — API route üzerinden yazılır

    match /visitors/{doc} {

      allow read, write: if request.auth \!= null;

    }

  }

}

## **9.2 Ortam Değişkeni Güvenliği**

* Firebase API key'ler public olabilir (Firebase security rules koruyor)

* SMS API key'leri Firebase'de şifreli saklanır (admin panelden girilir)

* Cloudinary upload preset: unsigned (frontend'de güvenli)

* Google Maps API key: Cloudflare Pages environment variables'da

* .env.local asla Git'e commit edilmez — .gitignore'a eklenir

## **9.3 Ziyaretçi Tracking Gizliliği**

* IP adresleri asla düz metin saklanmaz — SHA-256 hash kullanılır

* KVKK uyumluluğu için gizlilik politikası sayfası otomatik dahil edilir

# **10\. Deployment & Kurulum Adımları**

Yeni bir restoran için kurulum sırası aşağıdaki gibidir. Tahmini süre: 15-20 dakika.

## **Adım 1: Firebase Projesi Oluştur**

12. console.firebase.google.com → Yeni proje oluştur

13. Firestore Database → Üretim modunda başlat

14. Authentication → Email/Şifre sağlayıcısını etkinleştir

15. Realtime Database → Üretim modunda başlat

16. Proje Ayarları → Web uygulaması ekle → SDK yapılandırmasını kopyala

17. Admin hesabı oluştur: Firebase Auth → Kullanıcı ekle

## **Adım 2: Cloudinary Hesabı Oluştur**

18. cloudinary.com → Ücretsiz hesap aç

19. Settings → Upload → Add upload preset → Unsigned seç

20. Cloud Name ve Upload Preset adını not et

## **Adım 3: Repoyu Fork'la / Klonla**

git clone https://github.com/\[REPO\_URL\] restoran-adi

cd restoran-adi

npm install

## **Adım 4: Cloudflare Pages'e Deploy Et**

21. dash.cloudflare.com → Pages → Create a project → Connect to Git

22. GitHub reposunu bağla

23. Framework preset: Next.js seç

24. Environment Variables bölümüne tüm .env değerlerini ekle:

    NEXT\_PUBLIC\_FIREBASE\_API\_KEY=...

    NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN=...

    NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID=...

    NEXT\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET=...

    NEXT\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID=...

    NEXT\_PUBLIC\_FIREBASE\_APP\_ID=...

    NEXT\_PUBLIC\_CLOUDINARY\_CLOUD\_NAME=...

    NEXT\_PUBLIC\_CLOUDINARY\_UPLOAD\_PRESET=...

25. Save and Deploy — ilk deploy 2-3 dakika sürer

## **Adım 5: Özel Domain Bağla**

26. Cloudflare Pages → Custom Domains → Add custom domain

27. Domain sağlayıcıda DNS'i Cloudflare'e yönlendir

28. SSL otomatik etkinleşir

## **Adım 6: Firebase Security Rules Yükle**

npm install \-g firebase-tools

firebase login

firebase use \--add  (projeyi seç)

firebase deploy \--only firestore:rules,database:rules

## **Adım 7: Admin Panelden İlk Kurulum**

29. yoursite.com/admin/login → Giriş yap

30. Ayarlar → Genel: Site adı, logo, iletişim bilgilerini doldur

31. Ayarlar → Cloudinary: Cloud Name ve Upload Preset gir

32. Kategoriler: İlk kategoriyi oluştur

33. Ürünler: Ürünleri ekle

34. Ayarlar → Sipariş: Çalışma saatlerini ayarla

Kurulum tamamlandı\! Site yayında.

# **11\. Geliştirme Fazları & Task Listesi**

## **Phase 1 — Temel Sistem (4-6 Hafta)**

### **Sprint 1 — Altyapı & Admin Girişi (Hafta 1\)**

* Next.js 14 \+ TypeScript \+ Tailwind kurulumu

* Firebase entegrasyonu (Firestore, Auth, Realtime DB)

* Cloudinary entegrasyonu

* Admin login sayfası \+ koruma middleware'i

* Temel layout'lar (site \+ admin)

* Firebase security rules

### **Sprint 2 — Ürün & Kategori Yönetimi (Hafta 2\)**

* Kategori CRUD \+ drag-drop sıralama

* Ürün CRUD \+ çoklu fotoğraf yükleme

* Fiyat & indirim mantığı

* Ürün rozet sistemi

* Varyant yönetimi

### **Sprint 3 — Müşteri Arayüzü (Hafta 3\)**

* Ana sayfa — hero banner, öne çıkanlar, en çok satanlar

* Menü sayfası — kategori tabları, ürün kartları

* Ürün detay sayfası — galeri, varyant seçimi

* Responsive tasarım — mobil/tablet/desktop

* Lazy load \+ blur placeholder

### **Sprint 4 — Sepet & Sipariş (Hafta 4\)**

* Sepet state yönetimi (Zustand)

* Sipariş formu — müşteri bilgileri, adres seçimi

* İl/İlçe/Mahalle dropdown (Türkiye verisi)

* Sipariş oluşturma (Firestore)

* Sipariş takip sayfası (Realtime DB)

* Çalışma saatleri kontrolü

### **Sprint 5 — Admin Dashboard & Siparişler (Hafta 5\)**

* Dashboard istatistik widget'ları

* Canlı sipariş paneli (Realtime DB)

* Sesli bildirim \+ browser push notification

* Sipariş yönetimi — durum güncelleme, filtreleme

* Kara liste yönetimi

* Ziyaretçi tracking sistemi

### **Sprint 6 — Ayarlar, SEO & Deploy (Hafta 6\)**

* Tüm ayarlar sayfaları (Genel, Görünüm, Teslimat, Bildirimler)

* Tema sistemi (4 hazır tema \+ özelleştirme)

* Blog yönetimi \+ blog sayfaları

* sitemap.xml, robots.txt, Schema.org markup

* Google Analytics 4 entegrasyonu

* Cloudflare Pages deploy \+ test

## **Phase 2 — Gelişmiş Özellikler (3-4 Hafta)**

* AI Sepet (Pollinations.ai)

* SMS entegrasyonu (Netgsm / İleti Merkezi)

* WhatsApp yönlendirmesi

* Google Maps teslimat bölgesi

* Yorum yönetimi \+ müşteri arayüzünde gösterim

* QR kod menü oluşturucu

* Kupon/indirim kodu sistemi

* Müşteri giriş sistemi (telefon ile)

* Dinamik sayfalar yönetimi

## **Phase 3 — SaaS Platformu (İleride)**

* Multi-tenant mimari (tek Firebase, tenant\_id ile izolasyon)

* Merkezi yönetim paneli

* Otomatik onboarding

* Çoklu şube desteği

* Online ödeme (iyzico/PayTR)

* Çoklu dil desteği

# **12\. White-Label Satış Rehberi**

## **12.1 Her Yeni Müşteri İçin Kontrol Listesi**

| \# | Adım | Süre | Kim Yapar? |
| :---- | :---- | :---- | :---- |
| 1 | Firebase projesi oluştur | 3 dk | Geliştirici |
| 2 | Cloudinary hesabı oluştur | 2 dk | Geliştirici |
| 3 | Repoyu fork'la ve Cloudflare'e deploy et | 5 dk | Geliştirici |
| 4 | Ortam değişkenlerini Cloudflare'e gir | 3 dk | Geliştirici |
| 5 | Özel domain bağla | 2 dk | Geliştirici |
| 6 | Admin hesabı oluştur ve müşteriye teslim et | 1 dk | Geliştirici |
| 7 | Müşteri ilk içerikleri girer (ürünler, logo vb.) | Müşteriye bağlı | Müşteri |

## **12.2 Müşteriye Teslim Edilecekler**

* Admin panel URL'si ve giriş bilgileri

* Admin panel kullanım kılavuzu (bu döküman referans alınarak hazırlanır)

* Cloudinary dashboard erişimi (kendi medyalarını yönetmeleri için)

* Firebase limitleri hakkında bilgi notu

## **12.3 Kod Tabanında Restoran Adı Kullanımı**

Kod tabanında hiçbir yerde özel restoran adı bulunmaz. Tüm metinler Firebase'deki settings/config dökümanından çekilir. Sitenin adı, logosu, renkleri, mesajları tamamen admin panelden yönetilir.

## **12.4 Önerilen Fiyatlandırma Modeli**

| Paket | Kapsam | Önerilen Fiyat |
| :---- | :---- | :---- |
| Başlangıç | Kurulum \+ Phase 1 özellikleri | Müzakereye açık |
| Profesyonel | Phase 1 \+ Phase 2 özellikleri | Müzakereye açık |
| Premium | Tüm özellikler \+ 1 yıl destek | Müzakereye açık |

*Bu döküman, geliştirme sürecinin canlı referansıdır.*

Restoran SaaS Platformu  •  Versiyon 1.0  •  Mart 2026