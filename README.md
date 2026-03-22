# Miqqo — Restoran SaaS

Next.js tabanlı restoran sitesi ve admin paneli.

## Geliştirme

```bash
npm install
npm run dev
```

Tarayıcıda: [http://localhost:3000](http://localhost:3000)

## Production build (Cloudflare Pages)

```bash
npm install
npm run cf:build
npx wrangler pages deploy cloudflare-pages-dist --project-name PROJE_ADIN
```

Detaylı adımlar: `KURULUM_REHBERI.html` dosyasını tarayıcıda aç.

## Kaynaklar

- [Next.js dokümantasyonu](https://nextjs.org/docs)
- [Cloudflare Pages — Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
