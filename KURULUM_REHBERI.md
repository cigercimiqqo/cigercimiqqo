# Miqqo — Restoran SaaS Kurulum Rehberi

> **Kime göre:** Yazılımcı (sen)  
> **Nerede test ederiz:** Cloudflare Pages canlı URL’sinde (production secret’ları Cloudflare’de)  
> **Veriler nerede saklanır:** Cloudflare Pages ortam değişkenlerinde — `.env.local` zorunlu değil, kodda tutma

---

## Yeni müşteri eklerken yapılacaklar (sırasıyla)

### ADIM 1 — Firebase projesi aç

**Tarayıcıdan; terminal şart değil.**

1. [console.firebase.google.com](https://console.firebase.google.com) → giriş yap  
2. **Add project** → Proje adı: `miqqo-musteri-adi` (örn. `miqqo-pizza-mondo`)  
3. Google Analytics: isteğe bağlı → **Create project**

---

### ADIM 2 — Firebase servislerini aç

#### Authentication

1. **Authentication** → **Get started**  
2. **Sign-in method** → **Email/Password** → Enable → **Save**

#### Firestore

1. **Firestore Database** → **Create database**  
2. **Production mode** → **Next**  
3. Bölge: `europe-west1 (Belgium)` → **Enable**

#### Realtime Database

1. **Realtime Database** → **Create database**  
2. Bölge: `europe-west1 (Belgium)` → **Next**  
3. **Locked mode** → **Enable**

#### Storage (opsiyonel)

1. **Storage** → **Get started** → **Next** → **Done**

---

### ADIM 3 — Firestore güvenlik kuralları

1. **Firestore Database** → **Rules**  
2. Aşağıdakini yapıştır → **Publish**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /settings/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /categories/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /products/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /blog_posts/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /pages/{doc} { allow read: if true; allow write: if request.auth != null; }

    match /orders/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    match /reviews/{doc} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if request.auth != null;
    }

    match /visitors/{doc} { allow read, write: if request.auth != null; }
    match /coupons/{doc} { allow read: if true; allow write: if request.auth != null; }
  }
}
```

---

### ADIM 4 — Realtime Database kuralları

1. **Realtime Database** → **Rules**  
2. Aşağıdakini yapıştır → **Publish**

```json
{
  "rules": {
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "notifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "visitor_count": {
      ".read": true,
      ".write": true
    }
  }
}
```

---

### ADIM 5 — İlk admin kullanıcısı

1. **Authentication** → **Users** → **Add user**  
2. Email + şifre → kaydet, bilgileri not al

---

### ADIM 6 — Firebase bağlantı bilgileri

1. **Project settings** (⚙️) → **Your apps** → Web uygulaması yoksa **&lt;/&gt;** ile ekle  
2. `miqqo-web` gibi bir isim → **Register app**  
3. Şu alanları Cloudflare’de kullanacağın isimlerle eşleştir:

| Firebase alanı | Cloudflare’deki key |
|----------------|---------------------|
| apiKey | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| authDomain | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| projectId | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| storageBucket | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| messagingSenderId | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| appId | `NEXT_PUBLIC_FIREBASE_APP_ID` |

4. **Realtime Database** URL’sini bul → `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

---

### ADIM 7 — Görsel yükleme (Cloudinary veya ImgBB)

**Cloudinary (önerilen — video da var):**

1. [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)  
2. **Cloud Name** ve **Upload preset** (Signing: **Unsigned**) not al  
3. Cloudflare’de: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

**ImgBB (sadece görsel):**

1. [imgbb.com](https://imgbb.com) → API key  
2. Cloudflare’de: `NEXT_PUBLIC_IMGBB_API_KEY`

---

### ADIM 8 — Terminalden build ve Cloudflare’e deploy

GitHub zorunlu değil. Proje klasöründe terminal açıp ilerle.

#### 8a — Bağımlılıkları yükle

- Terminali **proje klasörünün içinde** aç (Finder’da sağ tık / Windows’ta klasörde cmd veya PowerShell / `cd` ile gir).  
- Tam yol yazmana gerek yok; klasördeyken:

```bash
npm install
```

#### 8b — Cloudflare için build

```bash
npm run cf:build
```

Bu komut projeyi Cloudflare Pages formatına derler ve kökte **`cloudflare-pages-dist/`** klasörünü oluşturur (deploy edeceğin çıktı burası).

#### 8c — Deploy — Terminal (Wrangler)

`miqqo-musteri-adi` kısmını kendi proje adınla değiştir:

```bash
npx wrangler pages deploy cloudflare-pages-dist --project-name miqqo-musteri-adi
```

- İlk seferde Cloudflare hesabına tarayıcıdan giriş isteyebilir.  
- Proje yoksa oluşturur; varsa günceller.  
- Örnek URL: `https://miqqo-musteri-adi.pages.dev`

**Sonraki güncellemeler:**

```bash
npm run cf:build
npx wrangler pages deploy cloudflare-pages-dist --project-name miqqo-musteri-adi
```

#### 8d — Deploy — Manuel (Dashboard, Wrangler kullanmadan)

1. Yukarıdaki gibi `npm run cf:build` ile `cloudflare-pages-dist/` oluşsun.  
2. Bu klasörü **ZIP**le (macOS: sağ tık → Sıkıştır; Windows: Sıkıştırılmış klasöre gönder).  
3. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets** / **Direct upload**.  
4. ZIP’i yükle, proje adını gir → **Deploy site**.  
5. Güncellemede: aynı projede **Deployments** üzerinden yeni sürüm / upload (arayüz ifadesi değişebilir; mantık: yeni build ZIP’i).

---

### ADIM 9 — Cloudflare’de `nodejs_compat` (Firebase için)

1. **Workers & Pages** → projen → **Settings** → **Functions**  
2. **Compatibility flags** → **Add** → `nodejs_compat` → **Save**  
3. **Compatibility date** en az `2024-09-23` olsun.  
4. **Deployments** → **Retry deployment**

---

### ADIM 10 — Ortam değişkenleri (Cloudflare)

Tüm secret’lar **sadece** Cloudflare’de; koda ve repoya yazma.

1. Proje → **Settings** → **Environment variables** → **Production**  
2. Aşağıdakileri **Add variable** ile tek tek ekle → **Save**

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase apiKey |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | authDomain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | projectId |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | appId |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Realtime DB URL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary (ImgBB kullanıyorsan atla) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Preset adı |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Sadece ImgBB kullanıyorsan |

3. **Deployments** → **Retry deployment**

---

### ADIM 11 — Müşteri domaini

**Domain Cloudflare’deyse:**  
**Custom domains** → domain ekle → yönlendirme otomatik; SSL Cloudflare’den gelir.

**Domain başka sağlayıcıdaysa:**  
**Custom domains** ile verilen hedefe (örn. `proje-adi.pages.dev`) göre DNS’te **CNAME** ekle; yayılım 1–24 saat sürebilir. Kontrol: [dnschecker.org](https://dnschecker.org)

---

### ADIM 12 — Test

1. `https://[proje-adi].pages.dev/admin/login`  
2. Adım 5’teki admin ile giriş  
3. Çalışıyorsa kurulum tamam

---

## Müşteriye teslim örneği

```
Web:     https://ornek.com
Admin:   https://ornek.com/admin/login
E-posta: admin@ornek.com
Şifre:   [güçlü şifre]
```

---

## Kontrol listesi

- [ ] Firebase projesi + Auth + Firestore + Realtime DB  
- [ ] Firestore ve Realtime kuralları yayınlandı  
- [ ] Admin kullanıcı oluşturuldu  
- [ ] Firebase + medya bilgileri not alındı  
- [ ] `npm install` ve `npm run cf:build` çalıştı  
- [ ] Deploy: Wrangler **veya** Dashboard ZIP  
- [ ] `nodejs_compat` + uygun compatibility date  
- [ ] Tüm env değişkenleri Cloudflare’de + redeploy  
- [ ] Domain bağlandı  
- [ ] Admin login test edildi  
- [ ] Müşteriye bilgiler verildi  

---

## Sık sorunlar

**Admin login olmuyor**  
→ Firestore **Rules** tekrar yapıştır → **Publish**

**Görseller yüklenmiyor**  
→ Cloudinary preset **Unsigned** olmalı

**Sayfa açılıyor, veri yok**  
→ Cloudflare **Environment variables** eksik/yanlış → düzelt → **Retry deployment**

**Domain bağlanmıyor**  
→ DNS yayılımı; dnschecker ile CNAME kontrolü

**`npm run cf:build` hata veriyor**  
→ Önce `npm install`; Node sürümü 20.x önerilir. Hâlâ hata varsa proje `README.md` ve güncel bağımlılıklara bak.

---

## Güvenli ZIP yedek (kaynak kod)

`node_modules`, build çıktıları ve `.env.local` dışarıda kalsın:

```bash
# Kendi üst klasörüne göre düzenle
zip -r MiqqoSite_backup_$(date +%Y%m%d).zip MiqqoSite \
  --exclude "MiqqoSite/node_modules/*" \
  --exclude "MiqqoSite/.next/*" \
  --exclude "MiqqoSite/cloudflare-pages-dist/*" \
  --exclude "MiqqoSite/.env.local"
```

---

*Miqqo SaaS — Cloudflare Pages + Firebase.*
