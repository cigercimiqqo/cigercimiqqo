# Miqqo — Restoran SaaS

Next.js tabanlı restoran sipariş sitesi ve admin paneli. Firebase (Firestore + Realtime DB + Auth) ile çalışır, GitHub Pages üzerinden deploy edilir.

## Geliştirme

```bash
npm install
npm run dev
```

Tarayıcıda: [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
```

Statik çıktı `out/` klasörüne oluşturulur. GitHub Pages ile otomatik deploy için `.github/workflows/deploy.yml` dosyası hazırdır.

## Yeni Müşteri Kurulumu

Detaylı adım adım rehber: `KURULUM_REHBERI.html` dosyasını tarayıcıda aç.

## Teknolojiler

- **Next.js 16** (Static Export)
- **Firebase** (Firestore, Realtime Database, Authentication)
- **Cloudinary / ImgBB** (Görsel yükleme)
- **GitHub Pages** (Hosting)
- **Tailwind CSS 4** (Styling)
- **Zustand** (State management)
- **Framer Motion** (Animasyonlar)
