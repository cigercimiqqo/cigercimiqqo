# Miqqo Site — Müşteri Kurulum Rehberi (GitHub Pages)

Her müşteri için ayrı bir Firebase projesi + GitHub Pages sitesi oluşturulur. Bu rehber adım adım her şeyi anlatır.

---

## 1. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com) → **Proje Ekle**
2. Proje adı: `miqqo-musteri-adi` (örn. `miqqo-kofteci-ahmet`)
3. Google Analytics → İsteğe bağlı → **Proje Oluştur**

### 1a. Firestore Database

1. Sol menü → **Firestore Database** → **Veritabanı oluştur**
2. Konum: `europe-west1` (veya en yakın) → **Üretim modunda başla**
3. **Kurallar** sekmesi → şu kuralları yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /products/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{doc} {
      allow read, write: if true;
    }
    match /visitors/{doc} {
      allow read, write: if true;
    }
    match /blog_posts/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reviews/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pages/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /coupons/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Yayınla** butonuna tıkla.

### 1b. Realtime Database

1. Sol menü → **Realtime Database** → **Veritabanı oluştur**
2. Konum: `europe-west1` → **Kilitli modda başla**
3. **Kurallar** sekmesi:

```json
{
  "rules": {
    "activeOrders": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. **Yayınla**.

### 1c. Authentication

1. Sol menü → **Authentication** → **Başlayın**
2. **E-posta/Şifre** sağlayıcısını etkinleştir → **Kaydet**
3. **Users** sekmesi → **Kullanıcı ekle** → admin e-posta ve şifresi gir

### 1d. Firebase Web Uygulaması

1. Proje ayarları (⚙️ ikonu) → **Genel** → alta kaydır → **Web uygulaması ekle** (`</>`)
2. Uygulama adı: `miqqo-web` → **Kaydet**
3. Çıkan `firebaseConfig` bilgilerini not al:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `databaseURL` (Realtime Database sekmesinden al)

---

## 2. Proje Dosyalarını Hazırla

1. Proje klasörünü bilgisayarına kopyala (ZIP'i aç veya `git clone`)
2. Klasörün içinde terminal aç
3. Bağımlılıkları yükle:

```bash
npm install
```

4. `.env.local` dosyası oluştur (bu dosya sadece **local geliştirme** içindir, GitHub'a gitmez):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=miqqo-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=miqqo-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=miqqo-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://miqqo-xxx-default-rtdb.europe-west1.firebasedatabase.app

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## 3. Görsel/Video Yükleme Ayarları (Cloudinary veya ImgBB)

### Seçenek A: Cloudinary (önerilen — görsel + video, 25 kredi/ay ücretsiz)

1. [cloudinary.com](https://cloudinary.com/users/register/free) → Ücretsiz hesap
2. Dashboard → **Cloud Name** → `.env.local`'e yaz
3. Settings → Upload → **Add upload preset** → Signing Mode: **Unsigned** → Kaydet
4. Preset adını `.env.local`'e yaz

### Seçenek B: ImgBB (sadece görsel, sınırsız ücretsiz)

1. [imgbb.com](https://imgbb.com) → Hesap oluştur
2. Account → API → API Key al
3. `.env.local`'e ekle: `NEXT_PUBLIC_IMGBB_API_KEY=xxx`
4. **Deploy için:** GitHub Secrets'a da `NEXT_PUBLIC_IMGBB_API_KEY` ekle

### AI Sepet (isteğe bağlı)

Menüdeki "AI Sepet" butonu müşterilere metinle sipariş önermesi yapar. Çalışması için:

1. [enter.pollinations.ai](https://enter.pollinations.ai) → Ücretsiz kayıt
2. Publishable key al (`pk_` ile başlar — client-side için)
3. `.env.local`'e ekle: `NEXT_PUBLIC_POLLINATIONS_API_KEY=pk_xxx`
4. **Deploy için:** GitHub Secrets'a `NEXT_PUBLIC_POLLINATIONS_API_KEY` ekle

Key yoksa AI Sepet butonu hata verir; diğer özellikler çalışır.

---

## 4. Local Test

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` aç. Admin paneli: `http://localhost:3000/admin/login`

---

## 5. GitHub Repository Oluştur

1. [github.com/new](https://github.com/new) → Yeni repo oluştur
2. Repo adı: `miqqo-musteri-adi` (örn. `miqqo-kofteci-ahmet`)
3. **Private** seç → **Create repository**
4. Terminalde:

```bash
git init
git add .
git commit -m "ilk kurulum"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
git push -u origin main
```

### 5a. Farklı Hesaba Push — Token ile Yetkilendirme

Eğer müşterinin GitHub hesabına kendi bilgisayarından push yapıyorsan ve **"Permission denied"** veya **"403"** hatası alıyorsan:

**Token Oluşturma:**
1. Müşterinin GitHub hesabıyla giriş yap
2. Profil → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)** → Not: `miqqo-deploy`
4. Expiration: **No expiration**
5. Scopes: **repo** kutusunu işaretle
6. **Generate token** → çıkan token'ı hemen kopyala! (bir kere gösterilir, `ghp_` ile başlar)

**Token ile Push:**

```bash
git remote set-url origin https://MUSTERI_KULLANICI:TOKEN@github.com/MUSTERI_KULLANICI/REPO_ADI.git
git push -u origin main
```

Örnek: Müşteri `cigercimiqqo`, token `ghp_abc123...` ise:
```
git remote set-url origin https://cigercimiqqo:ghp_abc123@github.com/cigercimiqqo/cigercimiqqo.git
```

Token bir kere URL'e eklendikten sonra sonraki push'lar otomatik çalışır.

---

## 6. GitHub Pages ile Deploy

### Yöntem A: GitHub Actions (Otomatik — Önerilen)

1. Repo'da `.github/workflows/deploy.yml` dosyası oluştur:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_FIREBASE_DATABASE_URL: ${{ secrets.NEXT_PUBLIC_FIREBASE_DATABASE_URL }}
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ secrets.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
          NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: ${{ secrets.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET }}
        run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Her bir environment variable için secret ekle:
   - `NEXT_PUBLIC_BASE_PATH` — GitHub Pages alt dizin (örn. `/repo-adi`)
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (Cloudinary kullanıyorsan)
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (Cloudinary kullanıyorsan)
   - `NEXT_PUBLIC_IMGBB_API_KEY` (ImgBB kullanıyorsan — [imgbb.com](https://imgbb.com) API)
   - `NEXT_PUBLIC_POLLINATIONS_API_KEY` (AI Sepet için — [enter.pollinations.ai](https://enter.pollinations.ai) ücretsiz key)

4. GitHub repo → **Settings** → **Pages** → Source: **GitHub Actions** seç

5. `main` branch'e push yap → otomatik deploy başlar!

### Yöntem B: Manuel Deploy (Terminal)

1. Build al:

```bash
npm run build
```

2. `out/` klasörü oluşur. Bunu GitHub Pages'a deploy etmek için:

```bash
npx gh-pages -d out
```

> `gh-pages` paketi yoksa: `npm install -D gh-pages`

---

## 7. Custom Domain Bağlama

1. GitHub repo → **Settings** → **Pages** → **Custom domain**
2. Domain adını yaz (örn. `siparis.kofteciaahmet.com`)
3. DNS ayarları (domain sağlayıcında):
   - **CNAME** kaydı: `siparis` → `KULLANICI_ADIN.github.io`
   - VEYA **A** kayıtları (apex domain için):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
4. **Enforce HTTPS** kutusunu işaretle
5. DNS yayılması 5-30 dakika sürebilir

---

## 8. Firebase Auth Domain Güncelle

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Custom domain'i ekle (örn. `siparis.kofteciaahmet.com`)
3. GitHub Pages domain'i de ekle (örn. `kullaniciadi.github.io`)

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Sayfa beyaz kalıyor | Tarayıcı konsolunu kontrol et (F12). Firebase config doğru mu? |
| Admin giriş yapamıyor | Firebase Auth'ta kullanıcı oluşturuldu mu? Authorized domains doğru mu? |
| Görseller yüklenmiyor | Cloudinary/ImgBB ayarları doğru mu? Upload preset **unsigned** mı? |
| Build hatası | `npm run build` çıktısını oku. Genellikle env variable eksik. |
| 404 hatası (custom domain) | DNS ayarları doğru mu? CNAME kaydı var mı? 24 saat bekle. |
| GitHub Actions başarısız | Settings → Secrets'ta tüm env variable'lar doğru yazılmış mı? |

---

## Özet: Her Müşteri İçin Yapılacaklar

1. ✅ Firebase projesi oluştur (Firestore + Realtime DB + Auth)
2. ✅ Proje dosyalarını kopyala
3. ✅ `.env.local` dosyasını doldur
4. ✅ Cloudinary veya ImgBB ayarla
5. ✅ GitHub repo oluştur + push
6. ✅ GitHub Actions secrets ekle
7. ✅ GitHub Pages'ı etkinleştir (Source: GitHub Actions)
8. ✅ Custom domain bağla (opsiyonel)
9. ✅ Firebase Auth'a domain ekle
