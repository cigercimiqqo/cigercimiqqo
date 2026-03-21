# Miqqo — Restoran SaaS Kurulum Rehberi

> **Kime göre:** Yazılımcı (sen) — terminal bilgisi gerekmez  
> **Nerede test ederiz:** Direkt Cloudflare Pages'te (`.env.local` gerekmez)  
> **Veriler nerede saklanır:** Cloudflare Pages ortam değişkenlerinde (secret güvende)

---

## Yeni Müşteri Eklerken Yapacakların (Sırasıyla)

---

### ADIM 1 — Firebase Projesi Aç

**Tarayıcıdan yap, terminal yok.**

1. [console.firebase.google.com](https://console.firebase.google.com) → Google hesabıyla giriş
2. **"Add project"** → Proje adı: `miqqo-[musteri-adi]` (örn: `miqqo-pizza-mondo`)
3. Google Analytics: kapalı bırakabilirsin → **Create project**

---

### ADIM 2 — Firebase Servislerini Aç

Proje açılınca sol menüden sırasıyla:

#### Authentication
1. Sol menü → **Authentication** → **Get started**
2. **Sign-in method** sekmesi → **Email/Password** → Enable → **Save**

#### Firestore
1. Sol menü → **Firestore Database** → **Create database**
2. **Production mode** → **Next**
3. Bölge: `europe-west1 (Belgium)` → **Enable**

#### Realtime Database
1. Sol menü → **Realtime Database** → **Create database**
2. Bölge: `europe-west1 (Belgium)` → **Next**
3. **Locked mode** → **Enable**

#### Storage (opsiyonel, genelde Cloudinary kullanırız)
1. Sol menü → **Storage** → **Get started** → **Next** → **Done**

---

### ADIM 3 — Firestore Güvenlik Kurallarını Yapıştır

1. Sol menü → **Firestore Database** → **Rules** sekmesi
2. Mevcut kuralları sil, aşağıdakini yapıştır → **Publish**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Ayarlar, kategoriler, ürünler, blog, sayfalar — herkese okunabilir
    match /settings/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /categories/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /products/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /blog_posts/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /pages/{doc} { allow read: if true; allow write: if request.auth != null; }

    // Siparişler — herkes yazabilir (müşteri), sadece admin okuyabilir
    match /orders/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Yorumlar — herkes ekleyebilir, sadece admin yönetebilir
    match /reviews/{doc} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if request.auth != null;
    }

    // Ziyaretçiler, kuponlar — sadece admin
    match /visitors/{doc} { allow read, write: if request.auth != null; }
    match /coupons/{doc} { allow read: if true; allow write: if request.auth != null; }
  }
}
```

---

### ADIM 4 — Realtime Database Kurallarını Yapıştır

1. Sol menü → **Realtime Database** → **Rules** sekmesi
2. Mevcut içeriği sil, aşağıdakini yapıştır → **Publish**

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

### ADIM 5 — İlk Admin Kullanıcısı Oluştur

1. Sol menü → **Authentication** → **Users** sekmesi
2. **Add user** → Email + şifre gir → **Add user**
3. Bu bilgileri bir yere not al (müşteriye vereceksin)

---

### ADIM 6 — Firebase Bağlantı Bilgilerini Al

1. Sol menü → **Project settings** (⚙️ ikonu)
2. Aşağı kaydır → **Your apps** → Web uygulaması yok ise: **</>** ikonuna tıkla
3. App nickname: `miqqo-web` → **Register app**
4. Şu değerleri kopyala/not al:

```
apiKey:               → FIREBASE_API_KEY
authDomain:           → FIREBASE_AUTH_DOMAIN
projectId:            → FIREBASE_PROJECT_ID
storageBucket:        → FIREBASE_STORAGE_BUCKET
messagingSenderId:    → FIREBASE_MESSAGING_SENDER_ID
appId:                → FIREBASE_APP_ID
```

5. Aynı sayfada biraz aşağıda **Realtime Database** URL'sini bul:
```
https://miqqo-pizza-mondo-default-rtdb.europe-west1.firebasedatabase.app
→ FIREBASE_DATABASE_URL
```

---

### ADIM 7 — Görsel Yükleme Hesabı Aç

**Cloudinary (önerilen — video da destekler):**

1. [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free) → Ücretsiz kayıt
2. Dashboard → Sol üstteki **Cloud Name**'i not al (örn: `dxyz123abc`)
3. Sağ üst ⚙️ → **Settings** → **Upload** sekmesi
4. Sayfanın altına kaydır → **Add upload preset**
5. **Signing mode:** `Unsigned` seç → **Save**
6. Preset adını not al (örn: `miqqo_unsigned`)

**ImgBB (alternatif — sadece görsel, sınırsız ücretsiz):**

1. [imgbb.com](https://imgbb.com) → Sign up
2. Kullanıcı adına tıkla → **About** → **API**
3. API Key'i not al

---

### ADIM 8 — Cloudflare Pages Projesi Oluştur

> **GitHub gerekmez.** Kodun kendi bilgisayarındaki klasörden build yapıp Cloudflare'e direkt gönderebilirsin.

#### 8a — Cloudflare Hesabı Aç

1. [dash.cloudflare.com](https://dash.cloudflare.com) → ücretsiz kayıt

#### 8b — Pages Projesi Oluştur

1. Sol menü → **Workers & Pages** → **Pages** → **Create a project**
2. **"Connect to Git"** yerine → **"Upload assets"** seç

#### 8c — Projeyi Build Et ve Yükle

Projeni derlemek için **tek seferlik** şunları yap:

```bash
# Projenin bulunduğu klasörde terminali aç ve çalıştır:
npm run build
```

> Sonuç: `.next` klasörü oluşur — bunu Cloudflare'e yükleyeceğiz.

Cloudflare'de **Upload assets** ekranında:
- Project name: `miqqo-pizza-mondo`
- `.next` klasörünü sürükle-bırak veya seç → **Deploy site**

---

### ADIM 9 — Ortam Değişkenlerini Cloudflare'e Gir

> Burası en kritik adım. Tüm secret key'ler **sadece burada** saklanır.  
> Hiçbir şeyi kod içine veya `.env.local` dosyasına yazmana gerek yok.

1. Cloudflare Pages → Projen → **Settings** → **Environment variables**
2. **Production** sekmesinde **Add variable** butonuna bas
3. Aşağıdaki değerleri tek tek ekle:

| Değişken Adı | Değeri |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase'den kopyaladığın apiKey |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase authDomain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase projectId |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storageBucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messagingSenderId |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase appId |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Realtime DB URL'si |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary preset adı |

ImgBB kullanıyorsan sadece bunu ekle:

| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key |

4. Tüm değerleri girdikten sonra → **Save**
5. Siteyi tekrar deploy et: **Deployments** sekmesi → **Retry deployment**

---

### ADIM 10 — Müşteri Domainini Bağla

#### Domain Cloudflare'de Kayıtlıysa (en kolay):

1. Cloudflare Pages → Projen → **Custom domains** → **Set up a custom domain**
2. Domain adını yaz → **Continue** → Otomatik ayarlanır

#### Domain Başka Yerde (GoDaddy, Natro, İsimtescil vb.):

1. Cloudflare Pages → Projen → **Custom domains** → **Set up a custom domain**
2. Domain adını yaz → Sana bir CNAME değeri gösterecek, örn:
   ```
   miqqo-pizza-mondo.pages.dev
   ```
3. Domain sağlayıcısına git → DNS yönetimi → CNAME kaydı ekle:
   ```
   Type:   CNAME
   Name:   @ (veya www)
   Value:  miqqo-pizza-mondo.pages.dev
   ```
4. 1-24 saat içinde aktif olur

---

### ADIM 11 — Test Et

1. `https://[proje-adi].pages.dev/admin/login` adresine git
2. Adım 5'te oluşturduğun email+şifre ile giriş yap
3. Giriş olduysa kurulum tamamdır 🎉

---

## Müşteriye Teslim Listesi

Her müşteri kurulumunda bunları müşteriye ilet:

```
🌐 Web sitesi:  https://pizzamondo.com
🔧 Admin panel: https://pizzamondo.com/admin/login
📧 Admin email: admin@pizzamondo.com
🔑 Admin şifre: [oluşturduğun güçlü şifre]
```

---

## Kontrol Listesi (Her Müşteri İçin)

```
[ ] Firebase projesi oluşturuldu
[ ] Authentication → Email/Password açıldı
[ ] Firestore oluşturuldu (europe-west1) + güvenlik kuralları yapıştırıldı
[ ] Realtime Database oluşturuldu (europe-west1) + kurallar yapıştırıldı
[ ] Firebase bağlantı bilgileri (apiKey vb.) not alındı
[ ] Admin kullanıcısı oluşturuldu
[ ] Cloudinary veya ImgBB hesabı açıldı, bilgiler not alındı
[ ] Cloudflare Pages projesi oluşturuldu
[ ] Tüm env değişkenleri Cloudflare Pages'e girildi
[ ] Redeploy yapıldı
[ ] Admin login test edildi
[ ] Müşteri domaini bağlandı
[ ] Müşteriye teslim yapıldı
```

---

## Sık Karşılaşılan Sorunlar

### ❌ Admin login çalışmıyor

Firestore Rules yanlış yapıştırılmış olabilir.  
→ Firebase Console → Firestore → Rules → tekrar yapıştır → Publish

### ❌ Görseller yüklenmiyor

Cloudinary preset "Signed" modunda.  
→ Cloudinary → Settings → Upload → preset → Signing mode: **Unsigned** yap

### ❌ Site açılıyor ama veri gelmiyor

Cloudflare'deki env değişkenleri eksik veya yanlış girilmiş.  
→ Cloudflare Pages → Settings → Environment variables → kontrol et → redeploy

### ❌ Domain bağlanmıyor

DNS yayılımı henüz tamamlanmamış.  
→ [dnschecker.org](https://dnschecker.org) → domain gir → CNAME'in yayıldığını gör → 24 saat bekle

---

## Güvenli ZIP Arşivi (Kaynak Kodu Yedekle)

```bash
cd /Users/furkangunduz/CursorProjects
zip -r MiqqoSite_backup_$(date +%Y%m%d).zip MiqqoSite \
  --exclude "MiqqoSite/node_modules/*" \
  --exclude "MiqqoSite/.next/*" \
  --exclude "MiqqoSite/.env.local"
```

> `.env.local` kasıtlı hariç tutulur — içinde key olursa paylaşma.

---

*Bu rehber Miqqo SaaS platformu için hazırlanmıştır.*
