# Miqqo — Restoran SaaS Kurulum Rehberi

> **Hedef kitleler:** Yazılımcı (sen) + Müşteri (restoran sahibi)  
> **Son güncelleme:** Mart 2026

---

## İÇİNDEKİLER

1. [Sistem Mimarisi Özeti](#1-sistem-mimarisi-özeti)
2. [Yazılımcı: Yeni Müşteri Ekleme Adımları](#2-yazılımcı-yeni-müşteri-ekleme-adımları)
3. [Müşteri: Cloudflare Pages'e Deploy](#3-müşteri-cloudflare-pagese-deploy)
4. [Medya Yükleme Seçenekleri](#4-medya-yükleme-seçenekleri)
5. [Video Kullanımı](#5-video-kullanımı)
6. [Sık Karşılaşılan Sorunlar](#6-sık-karşılaşılan-sorunlar)
7. [Yedekleme ve ZIP Arşivleme](#7-yedekleme-ve-zip-arşivleme)

---

## 1. Sistem Mimarisi Özeti

Her müşteri için **tamamen bağımsız** bir kurulum yapılır:

```
Müşteri A → Firebase Projesi A + Cloudflare Pages A → pizza.com
Müşteri B → Firebase Projesi B + Cloudflare Pages B → burger.com.tr
Müşteri C → Firebase Projesi C + Cloudflare Pages C → sushi.com.tr
```

- Verileri birbirini **kesinlikle görmez**
- Her birinin ayrı `.env.local` dosyası vardır
- Aynı kaynak kodu, farklı env değerleriyle çalışır

---

## 2. Yazılımcı: Yeni Müşteri Ekleme Adımları

### Adım 1 — Firebase Projesi Oluştur

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Proje adı: `miqqo-[musteri-adi]` (örn: `miqqo-pizza-mondo`)
3. Google Analytics: açık veya kapalı, fark etmez
4. Proje oluşturulunca sol menüden:
   - **Authentication** → Sign-in method → **Email/Password** → Enable
   - **Firestore Database** → Create database → **Production mode** → Bölge: `europe-west1`
   - **Realtime Database** → Create database → **Locked mode** → Bölge: `europe-west1`
   - **Storage** → Get started → `europe-west1`

5. Sol menü → **Project settings** → **Your apps** → Web app ekle → Config değerlerini kopyala:

```js
// Firebase config değerleri (örnek)
apiKey: "AIzaSy..."
authDomain: "miqqo-pizza-mondo.firebaseapp.com"
projectId: "miqqo-pizza-mondo"
storageBucket: "miqqo-pizza-mondo.appspot.com"
messagingSenderId: "123456789"
appId: "1:123:web:abc"
databaseURL: "https://miqqo-pizza-mondo-default-rtdb.europe-west1.firebasedatabase.app"
```

### Adım 2 — Firebase Security Rules Yükle

Firebase Console yerine CLI ile yap:

```bash
# Firebase CLI yoksa kur
npm install -g firebase-tools

# Giriş yap
firebase login

# Proje klasörüne git
cd /Users/furkangunduz/CursorProjects/MiqqoSite

# Hangi Firebase projesini kullanacağını seç
firebase use miqqo-pizza-mondo

# Kuralları deploy et
firebase deploy --only firestore:rules,database
```

### Adım 3 — İlk Admin Kullanıcısı Oluştur

Firebase Console → Authentication → Users → **Add user**:
- Email: `admin@pizzamondo.com`
- Password: güçlü bir şifre seç

### Adım 4 — Cloudinary veya ImgBB Hesabı Aç

**Seçenek A — Cloudinary (önerilen, video desteği var):**
1. [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Dashboard → Settings → Upload → **Add upload preset**
3. Signing mode: **Unsigned**
4. Preset adını not al (örn: `miqqo_unsigned`)
5. Sol üstteki Cloud Name'i not al (örn: `dxyz123`)

**Seçenek B — ImgBB (alternatif, sadece görsel):**
1. [imgbb.com](https://imgbb.com) → ücretsiz kayıt
2. Account → API → **API Key** kopyala

### Adım 5 — `.env.local` Dosyası Hazırla

Proje kök dizinindeki `.env.example` dosyasını kopyala:

```bash
cp .env.example .env.local
```

Ardından `.env.local` dosyasını doldur:

```env
# ── Firebase ──────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=miqqo-pizza-mondo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=miqqo-pizza-mondo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=miqqo-pizza-mondo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://miqqo-pizza-mondo-default-rtdb.europe-west1.firebasedatabase.app

# ── Cloudinary (Seçenek A) ────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=miqqo_unsigned

# ── ImgBB (Seçenek B — Cloudinary yoksa) ─
# NEXT_PUBLIC_IMGBB_API_KEY=abc123...

# ── Google Maps (opsiyonel) ───────────────
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# ── SMS (opsiyonel, sunucu taraflı) ───────
# SMS_API_URL=https://api.netgsm.com.tr/...
# SMS_API_KEY=...
# SMS_SENDER=RESTORAN
```

> ⚠️ `.env.local` dosyasını **asla git'e commit etme!** `.gitignore`'da zaten mevcut.

### Adım 6 — Lokal Test

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000/admin/login` → admin hesabıyla giriş yap.

### Adım 7 — Cloudflare Pages'e Deploy

Adımlar bir sonraki bölümde detaylı anlatılmış.

---

## 3. Müşteri: Cloudflare Pages'e Deploy

### 3.1 — GitHub'a Kod Yükle

> Yazılımcı olarak bu adımı sen yaparsın, müşteriye ayrı GitHub reposu hazırlarsın.

```bash
# Her müşteri için ayrı GitHub reposu oluştur
# github.com → New repository → miqqo-pizza-mondo (private)

git init
git remote add origin https://github.com/KULLANICI/miqqo-pizza-mondo.git
git add .
git commit -m "🚀 initial deploy"
git push -u origin main
```

### 3.2 — Cloudflare Pages Hesabı

1. [pages.cloudflare.com](https://pages.cloudflare.com) → ücretsiz kayıt
2. **Create a project** → **Connect to Git**
3. GitHub hesabını bağla → ilgili repoyu seç
4. Build ayarları:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
   - **Node.js version:** 20.x

### 3.3 — Environment Variables (Cloudflare'de)

Cloudflare Pages → Settings → **Environment variables** → Add variable:

```
NEXT_PUBLIC_FIREBASE_API_KEY          = AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN      = miqqo-pizza-mondo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID       = miqqo-pizza-mondo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET   = miqqo-pizza-mondo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
NEXT_PUBLIC_FIREBASE_APP_ID           = 1:123:web:abc
NEXT_PUBLIC_FIREBASE_DATABASE_URL     = https://miqqo-pizza-mondo-default-rtdb.europe-west1.firebasedatabase.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME     = dxyz123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET  = miqqo_unsigned
```

> Sunucu-tarafı değerler (SMS_API_KEY gibi) için Production ve Preview ortamlarına ayrı ayrı ekle.

### 3.4 — Müşteri Domainini Bağla

Cloudflare Pages → Custom domains → **Set up a custom domain**

**Seçenek A — Domain zaten Cloudflare'de:**
- Direkt subdomain veya root domain seç → Otomatik ayarlanır

**Seçenek B — Domain başka yerde (GoDaddy, Natro vb.):**
1. Domain sağlayıcısında CNAME kaydı ekle:
   ```
   Type:  CNAME
   Name:  @ veya www
   Value: miqqo-pizza-mondo.pages.dev
   TTL:   Auto
   ```
2. Cloudflare'de custom domain doğrulamasını bekle (1-24 saat)

**Seçenek C — Domain'i Cloudflare'e taşı (en iyi performans):**
1. Cloudflare → Add a Site → domain gir
2. Nameserver'ları domain sağlayıcısında güncelle
3. Cloudflare Pages'te custom domain ekle

---

## 4. Medya Yükleme Seçenekleri

### Karşılaştırma

| Özellik | Cloudinary | ImgBB |
|---|---|---|
| Ücretsiz depolama | 25 kredi/ay | Sınırsız |
| Max dosya boyutu | 100MB | 32MB |
| Video desteği | ✅ Evet | ❌ Hayır |
| Blur placeholder | ✅ Evet | ❌ Hayır |
| Resize/transform | ✅ Evet | ❌ Hayır |
| Kayıt linki | [cloudinary.com](https://cloudinary.com/users/register/free) | [imgbb.com](https://imgbb.com) |

### Cloudinary Kurulum (5 dakika)

```
1. cloudinary.com/users/register/free → Ücretsiz kayıt
2. Dashboard → Settings (⚙️) → Upload sekmesi
3. "Add upload preset" → Signing mode: Unsigned
4. Preset adını kaydet
5. Sol üstteki Cloud Name'i kaydet
```

### ImgBB Kurulum (2 dakika)

```
1. imgbb.com → Sign up (ücretsiz)
2. Username'e tıkla → About ImgBB → API
3. API Key'i kopyala
4. .env.local → NEXT_PUBLIC_IMGBB_API_KEY=...
```

### Provider Öncelik Sırası

Sistem şu sıraya göre provider seçer:
1. Cloudinary env var varsa → Cloudinary
2. ImgBB env var varsa → ImgBB
3. Admin Ayarlar → Entegrasyonlar'daki seçim

---

## 5. Video Kullanımı

### Önerilen Yöntem: YouTube (Ücretsiz + Sınırsız)

```
1. YouTube'a ürün tanıtım videosu yükle
2. Video URL'sini kopyala: https://youtube.com/watch?v=XXXX
3. Admin → Ürünler → Ürün Düzenle → Video URL alanına yapıştır
4. Sistem otomatik olarak embed'e çevirir
```

### Vimeo

```
1. vimeo.com → ücretsiz hesap (5GB)
2. Video yükle → Share → Copy link
3. Admin → Ürün → Video URL alanına yapıştır
```

### Cloudinary Video (dikkatli kullan)

Cloudinary'in 25 kredi limitini video da tüketir. Büyük video dosyaları için YouTube tercih et.

```
Cloudinary Dashboard → Media Library → Upload → Video seç
Yüklenen videonun URL'sini kopyala
Admin → Ürün → Video URL alanına yapıştır
```

---

## 6. Sık Karşılaşılan Sorunlar

### ❌ "Firebase: Error (auth/invalid-api-key)"

**Sebep:** `.env.local` dosyası eksik veya Firebase değerleri yanlış.

**Çözüm:**
```bash
# Değerlerin doğru olduğunu kontrol et
cat .env.local | grep FIREBASE

# Dev sunucusunu yeniden başlat
npm run dev
```

### ❌ "Görsel yüklenemedi"

**Sebep:** Cloudinary preset "Signed" modunda veya ImgBB key yanlış.

**Çözüm (Cloudinary):**
1. Cloudinary Dashboard → Settings → Upload
2. Upload preset → Signing mode → **Unsigned** seç
3. Kaydedip sayfayı yenile

**Çözüm (ImgBB):**
1. API key'in doğru kopyalandığını kontrol et
2. imgbb.com → Account → API → Regenerate key → yeni key'i .env.local'e yaz

### ❌ Build sırasında Firebase hatası

**Sebep:** Cloudflare'de environment variables eksik.

**Çözüm:**
1. Cloudflare Pages → Settings → Environment variables
2. Tüm `NEXT_PUBLIC_FIREBASE_*` değerlerini ekle
3. Redeploy

### ❌ Domain bağlanmıyor

**Sebep:** DNS yayılımı tamamlanmamış.

**Çözüm:**
- [dnschecker.org](https://dnschecker.org) → CNAME kaydını kontrol et
- 24 saate kadar bekle

### ❌ Admin login çalışmıyor

**Sebep:** Firebase Authentication'da kullanıcı oluşturulmamış.

**Çözüm:**
```
Firebase Console → Authentication → Users → Add user
Email + şifre gir → Kaydet
```

---

## 7. Yedekleme ve ZIP Arşivleme

### Kaynak Kodu ZIP'le (her büyük değişiklikten önce)

```bash
cd /Users/furkangunduz/CursorProjects
zip -r MiqqoSite_backup_$(date +%Y%m%d).zip MiqqoSite \
  --exclude "MiqqoSite/node_modules/*" \
  --exclude "MiqqoSite/.next/*" \
  --exclude "MiqqoSite/.env.local"
```

Bu komut şunu oluşturur: `MiqqoSite_backup_20260322.zip`

> ⚠️ `.env.local` kasıtlı olarak hariç tutulur — içinde API key var!

### Firestore Verilerini Yedekle

```bash
# Firebase CLI gerekli
firebase use miqqo-pizza-mondo
firebase firestore:export gs://miqqo-pizza-mondo.appspot.com/backups/$(date +%Y%m%d)
```

### Yeni Müşteri için Hızlı Kontrol Listesi

```
[ ] Firebase projesi oluşturuldu
[ ] Authentication → Email/Password aktif
[ ] Firestore Database oluşturuldu (europe-west1)
[ ] Realtime Database oluşturuldu (europe-west1)
[ ] Security rules yüklendi (firebase deploy --only firestore:rules,database)
[ ] İlk admin kullanıcısı oluşturuldu
[ ] Cloudinary veya ImgBB hesabı açıldı
[ ] .env.local dolduruldu ve test edildi
[ ] GitHub reposuna kod yüklendi
[ ] Cloudflare Pages projesi oluşturuldu
[ ] Cloudflare'e environment variables eklendi
[ ] İlk deploy başarılı
[ ] Müşteri domaini bağlandı
[ ] Admin paneli test edildi (login, ürün ekle, sipariş)
[ ] Müşteriye admin bilgileri teslim edildi
```

---

## Müşteriye Teslim Edilecek Bilgiler

Müşteriye şu bilgileri ver:

```
🌐 Web sitesi: https://pizzamondo.com
🔧 Admin panel: https://pizzamondo.com/admin/login
📧 Admin email: admin@pizzamondo.com
🔑 Admin şifre: [güvenli şifre]

📞 Destek: [senin iletişim bilgilerin]
```

---

*Bu rehber Miqqo SaaS platformu için hazırlanmıştır. Her müşteri kurulumu için ayrı Firebase projesi kullanılır.*
