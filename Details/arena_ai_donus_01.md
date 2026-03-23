


# Ciğerci Miqqo — Komple Site Tasarımı & Kodu

Aşağıda sıfırdan, profesyonel, her cihaza uyumlu, kişiselleştirilebilir bir restoran sitesi var. Her dosyayı oluştur, görselleri kendi fotoğraflarınla değiştir, hazırsın.

---

## Paket Kurulumu

```bash
npm install framer-motion lucide-react
```

---

## Proje Yapısı

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── menu/page.tsx
│   ├── hakkimizda/page.tsx
│   ├── galeri/page.tsx
│   └── iletisim/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MobileNav.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── FeaturedMenu.tsx
│   │   ├── Story.tsx
│   │   ├── Stats.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTA.tsx
│   ├── ui/
│   │   ├── SectionHeading.tsx
│   │   └── AnimateOnScroll.tsx
│   └── customization/
│       └── SettingsPanel.tsx
├── config/
│   └── site.ts
├── context/
│   └── SiteContext.tsx
├── data/
│   └── menu.ts
└── types/
    └── index.ts
```

---

## 1. Konfigürasyon

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FEF2F2",
          100: "#FDE6E6",
          200: "#F9BABA",
          300: "#F28B8B",
          400: "#E04545",
          500: "#C8102E",
          600: "#A80D25",
          700: "#88091C",
          800: "#680614",
          900: "#4A040E",
          950: "#2D0208",
        },
        gold: {
          50: "#FDF9F0",
          100: "#F9EFD9",
          200: "#F0D9A8",
          300: "#E4BF73",
          400: "#C9A96E",
          500: "#B8944A",
          600: "#9A7A38",
          700: "#7A5F2C",
          800: "#5C4621",
          900: "#3E2F16",
        },
        surface: {
          50: "#FAFAF9",
          100: "#F5F0EB",
          200: "#E8E0D8",
          800: "#1C1C1C",
          850: "#161616",
          900: "#111111",
          950: "#0A0A0A",
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ember: {
          "0%": { opacity: "0", transform: "translateY(0) scale(0)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-120px) scale(1)" },
        },
      },
      animation: {
        "slow-zoom": "slow-zoom 20s ease-in-out infinite alternate",
        "fade-up": "fade-up 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        ember: "ember 3s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 2. Global Stiller

### `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  --font-heading: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;

  --color-brand-50: #FEF2F2;
  --color-brand-100: #FDE6E6;
  --color-brand-200: #F9BABA;
  --color-brand-300: #F28B8B;
  --color-brand-400: #E04545;
  --color-brand-500: #C8102E;
  --color-brand-600: #A80D25;
  --color-brand-700: #88091C;
  --color-brand-800: #680614;
  --color-brand-900: #4A040E;
  --color-brand-950: #2D0208;

  --color-gold-50: #FDF9F0;
  --color-gold-100: #F9EFD9;
  --color-gold-200: #F0D9A8;
  --color-gold-300: #E4BF73;
  --color-gold-400: #C9A96E;
  --color-gold-500: #B8944A;

  --color-surface-50: #FAFAF9;
  --color-surface-100: #F5F0EB;
  --color-surface-200: #E8E0D8;
  --color-surface-800: #1C1C1C;
  --color-surface-850: #161616;
  --color-surface-900: #111111;
  --color-surface-950: #0A0A0A;
}

/* ---- Base ---- */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--color-surface-950);
  color: var(--color-surface-100);
  overflow-x: hidden;
}

.light body {
  background: var(--color-surface-50);
  color: var(--color-surface-900);
}

::selection {
  background: var(--color-brand-500);
  color: #fff;
}

/* ---- Grain overlay ---- */
.grain::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* ---- Scrollbar ---- */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-surface-950);
}
::-webkit-scrollbar-thumb {
  background: var(--color-brand-700);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-brand-500);
}

/* ---- Menu dot leader ---- */
.dot-leader::after {
  content: "";
  flex: 1;
  border-bottom: 2px dotted var(--color-surface-800);
  margin: 0 12px;
  position: relative;
  top: -4px;
}

.light .dot-leader::after {
  border-color: var(--color-surface-200);
}

/* ---- Animations ---- */
@keyframes slow-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes ember-rise {
  0% { opacity: 0; transform: translateY(0) scale(0); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-150px) scale(1.2); }
}

.animate-slow-zoom {
  animation: slow-zoom 20s ease-in-out infinite alternate;
}
```

---

## 3. Types & Data

### `src/types/index.ts`

```ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  featured?: boolean;
  spicy?: boolean;
  popular?: boolean;
}

export type MenuCategory =
  | "ciger"
  | "kebap"
  | "pide-lahmacun"
  | "mezeler"
  | "tatlilar"
  | "icecekler";

export interface CategoryInfo {
  slug: MenuCategory;
  name: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface SiteConfig {
  theme: "dark" | "light";
  primaryColor: string;
  heroStyle: "full" | "split";
  showFeatures: boolean;
  showStats: boolean;
  showTestimonials: boolean;
  showGallery: boolean;
  menuLayout: "grid" | "list";
  headerStyle: "fixed" | "static";
}
```

### `src/config/site.ts`

```ts
import { SiteConfig, CategoryInfo, Testimonial } from "@/types";

export const defaultConfig: SiteConfig = {
  theme: "dark",
  primaryColor: "#C8102E",
  heroStyle: "full",
  showFeatures: true,
  showStats: true,
  showTestimonials: true,
  showGallery: true,
  menuLayout: "grid",
  headerStyle: "fixed",
};

export const siteInfo = {
  name: "Ciğerci Miqqo",
  tagline: "Ateşte Pişen Efsane Lezzet",
  description:
    "Kuşaktan kuşağa aktarılan tariflerle, en taze malzemelerden hazırlanan eşsiz ciğer kebabı deneyimi.",
  phone: "+90 555 123 45 67",
  email: "info@cigercimiqqo.com",
  address: "Lezzet Sokak No:1, Şehir Merkezi",
  workingHours: {
    weekdays: "11:00 - 23:00",
    weekend: "10:00 - 00:00",
  },
  social: {
    instagram: "https://instagram.com/cigercimiqqo",
    facebook: "https://facebook.com/cigercimiqqo",
    twitter: "https://twitter.com/cigercimiqqo",
  },
};

export const categories: CategoryInfo[] = [
  { slug: "ciger", name: "Ciğer Çeşitleri", description: "Ustaca pişirilen özel ciğer lezzetlerimiz" },
  { slug: "kebap", name: "Kebaplar", description: "Mangalda pişen geleneksel kebaplar" },
  { slug: "pide-lahmacun", name: "Pide & Lahmacun", description: "Fırından sıcacık" },
  { slug: "mezeler", name: "Meze & Salata", description: "Taze ve lezzetli başlangıçlar" },
  { slug: "tatlilar", name: "Tatlılar", description: "Yemek sonrası tatlı keyfi" },
  { slug: "icecekler", name: "İçecekler", description: "Serinleten lezzetler" },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ahmet Y.",
    text: "Şehirdeki en iyi ciğer burada. Pişirme tekniği ve sunum harika. Her geldiğimde aynı kaliteyi buluyorum.",
    rating: 5,
    date: "2024-12-15",
  },
  {
    id: "2",
    name: "Elif K.",
    text: "Ailecek geliyoruz, çocuklar bile çok seviyor. Mekanın ambiyansı da yemekleri kadar güzel.",
    rating: 5,
    date: "2025-01-08",
  },
  {
    id: "3",
    name: "Murat D.",
    text: "Acılı ciğer şişi efsane. Yanında gelen ezme ve soğan sarması mükemmel tamamlıyor.",
    rating: 5,
    date: "2025-02-20",
  },
  {
    id: "4",
    name: "Zeynep A.",
    text: "Paket siparişte bile sıcacık ve lezzetli geldi. Porsiyonlar gayet doyurucu.",
    rating: 4,
    date: "2025-03-05",
  },
];
```

### `src/data/menu.ts`

```ts
import { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Ciğer Şiş",
    description: "Özel baharatlarla marine edilmiş taze kuzu ciğeri, kömür ateşinde pişirilir",
    price: 280,
    image: "/images/menu/ciger-sis.jpg",
    category: "ciger",
    featured: true,
    popular: true,
  },
  {
    id: "2",
    name: "Acılı Ciğer",
    description: "Pul biber ve özel sos eşliğinde, ateşte közlenmiş ciğer porsiyon",
    price: 300,
    image: "/images/menu/acili-ciger.jpg",
    category: "ciger",
    featured: true,
    spicy: true,
  },
  {
    id: "3",
    name: "Ciğer Kavurma",
    description: "Mevsim sebzeleri ve tereyağı ile kavrulan doğal ciğer lezzeti",
    price: 260,
    image: "/images/menu/ciger-kavurma.jpg",
    category: "ciger",
    featured: true,
  },
  {
    id: "4",
    name: "Ciğer Sarma",
    description: "İnce ciğer dilimleri, iç yağ sarımıyla mangalda pişirilir",
    price: 320,
    image: "/images/menu/ciger-sarma.jpg",
    category: "ciger",
  },
  {
    id: "5",
    name: "Adana Kebap",
    description: "El çekme kıyma, pul biber ve kuyruk yağıyla, geniş şişte",
    price: 320,
    image: "/images/menu/adana-kebap.jpg",
    category: "kebap",
    featured: true,
    spicy: true,
  },
  {
    id: "6",
    name: "Urfa Kebap",
    description: "Acısız kıyma kebabı, yumuşak dokusu ve zengin lezzetiyle",
    price: 320,
    image: "/images/menu/urfa-kebap.jpg",
    category: "kebap",
  },
  {
    id: "7",
    name: "Beyti Kebap",
    description: "Lavaş sarılı özel kıyma kebabı, yoğurt ve sos eşliğinde",
    price: 360,
    image: "/images/menu/beyti-kebap.jpg",
    category: "kebap",
    featured: true,
  },
  {
    id: "8",
    name: "Kuşbaşılı Pide",
    description: "Dana kuşbaşı, sivri biber ve domates ile fırında",
    price: 240,
    image: "/images/menu/kusbasi-pide.jpg",
    category: "pide-lahmacun",
  },
  {
    id: "9",
    name: "Lahmacun",
    description: "İnce hamur, özel harç, maydanoz ve limonla servis edilir",
    price: 90,
    image: "/images/menu/lahmacun.jpg",
    category: "pide-lahmacun",
    popular: true,
  },
  {
    id: "10",
    name: "Acılı Ezme",
    description: "Taze domates, biber ve baharatlarla hazırlanan yanık ezme",
    price: 60,
    image: "/images/menu/acili-ezme.jpg",
    category: "mezeler",
    spicy: true,
  },
  {
    id: "11",
    name: "Mevsim Salata",
    description: "Taze mevsim yeşillikleri, nar ekşisi soslu",
    price: 70,
    image: "/images/menu/mevsim-salata.jpg",
    category: "mezeler",
  },
  {
    id: "12",
    name: "Soğan Sarması",
    description: "Sumak ve pul biberli, ince doğranmış soğan sarması",
    price: 40,
    image: "/images/menu/sogan-sarmasi.jpg",
    category: "mezeler",
  },
  {
    id: "13",
    name: "Künefe",
    description: "Antep fıstıklı, peynirli, şerbetli sıcak künefe",
    price: 160,
    image: "/images/menu/kunefe.jpg",
    category: "tatlilar",
    featured: true,
  },
  {
    id: "14",
    name: "Ayran",
    description: "Yayık ayranı, geleneksel bakır bardakta",
    price: 30,
    image: "/images/menu/ayran.jpg",
    category: "icecekler",
  },
  {
    id: "15",
    name: "Şalgam",
    description: "Acılı veya acısız, taze sıkım şalgam suyu",
    price: 35,
    image: "/images/menu/salgam.jpg",
    category: "icecekler",
  },
];
```

---

## 4. Context (Kişiselleştirme Sistemi)

### `src/context/SiteContext.tsx`

```tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SiteConfig } from "@/types";
import { defaultConfig } from "@/config/site";

interface SiteContextType {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("miqqo-config");
    if (saved) {
      try {
        setConfig({ ...defaultConfig, ...JSON.parse(saved) });
      } catch {
        /* ignore */
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("miqqo-config", JSON.stringify(config));

    const root = document.documentElement;
    root.classList.toggle("light", config.theme === "light");
    root.style.setProperty("--color-primary", config.primaryColor);
  }, [config, mounted]);

  const updateConfig = (updates: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("miqqo-config");
  };

  if (!mounted) return null;

  return (
    <SiteContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSiteConfig must be used within SiteProvider");
  return context;
}
```

---

## 5. UI Bileşenleri

### `src/components/ui/SectionHeading.tsx`

```tsx
"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionHeading({ title, subtitle, light, center = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}
    >
      <div className={`flex items-center gap-4 mb-4 ${center ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-brand-500" />
        <span className="text-brand-500 font-body text-sm tracking-[0.2em] uppercase font-medium">
          {subtitle}
        </span>
        <span className="h-px w-8 bg-brand-500" />
      </div>
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold ${
          light
            ? "text-surface-900 light:text-surface-900"
            : "text-surface-100"
        }`}
      >
        {title}
      </h2>
      <div className={`mt-4 flex ${center ? "justify-center" : ""}`}>
        <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
      </div>
    </motion.div>
  );
}
```

### `src/components/ui/AnimateOnScroll.tsx`

```tsx
"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

interface Props {
  children: ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimateOnScroll({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

## 6. Layout Bileşenleri

### `src/components/layout/Header.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface-950/90 backdrop-blur-xl shadow-2xl shadow-black/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                  <span className="text-white font-heading font-bold text-lg">M</span>
                </div>
                <div className="absolute -inset-1 rounded-full bg-brand-500/20 group-hover:bg-brand-500/30 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-surface-100 font-heading text-xl font-bold leading-tight tracking-wide">
                  Ciğerci Miqqo
                </span>
                <span className="text-gold-400 text-[10px] tracking-[0.25em] uppercase font-medium leading-none">
                  Est. 1990
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-brand-500"
                        : "text-surface-200 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-500 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+905551234567"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-full transition-all hover:shadow-lg hover:shadow-brand-500/25"
              >
                <Phone size={14} />
                <span>Sipariş Ver</span>
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-surface-200 hover:text-white transition-colors"
                aria-label="Menüyü aç"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && <MobileNav links={navLinks} onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
```

### `src/components/layout/MobileNav.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Clock } from "lucide-react";
import { siteInfo } from "@/config/site";

interface Props {
  links: { href: string; label: string }[];
  onClose: () => void;
}

export default function MobileNav({ links, onClose }: Props) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 lg:hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.nav
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface-950 border-l border-surface-800 flex flex-col"
      >
        <div className="flex-1 pt-24 px-6 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-brand-500/10 text-brand-500"
                        : "text-surface-200 hover:bg-surface-900 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 pt-8 border-t border-surface-800 space-y-4"
          >
            <a href={`tel:${siteInfo.phone}`} className="flex items-center gap-3 text-surface-200 hover:text-brand-400 transition-colors">
              <Phone size={16} className="text-brand-500" />
              <span className="text-sm">{siteInfo.phone}</span>
            </a>
            <div className="flex items-start gap-3 text-surface-300">
              <MapPin size={16} className="text-brand-500 mt-0.5 shrink-0" />
              <span className="text-sm">{siteInfo.address}</span>
            </div>
            <div className="flex items-center gap-3 text-surface-300">
              <Clock size={16} className="text-brand-500" />
              <span className="text-sm">{siteInfo.workingHours.weekdays}</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6 border-t border-surface-800">
          <a
            href={`tel:${siteInfo.phone}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition-colors"
          >
            <Phone size={16} />
            Hemen Ara
          </a>
        </div>
      </motion.nav>
    </motion.div>
  );
}
```

### `src/components/layout/Footer.tsx`

```tsx
"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, ArrowUp } from "lucide-react";
import { siteInfo } from "@/config/site";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-surface-950 border-t border-surface-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="text-surface-100 font-heading text-lg font-bold">Ciğerci Miqqo</h3>
                <p className="text-gold-400 text-[10px] tracking-[0.2em] uppercase">Est. 1990</p>
              </div>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed mb-6">
              {siteInfo.description}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: siteInfo.social.instagram },
                { icon: Facebook, href: siteInfo.social.facebook },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="text-surface-100 font-heading text-base font-semibold mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-brand-500" />
              Hızlı Erişim
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Ana Sayfa" },
                { href: "/menu", label: "Menümüz" },
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/galeri", label: "Galeri" },
                { href: "/iletisim", label: "İletişim" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 hover:text-brand-400 text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-brand-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-surface-100 font-heading text-base font-semibold mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-brand-500" />
              İletişim
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteInfo.phone}`} className="flex items-center gap-3 text-surface-400 hover:text-brand-400 text-sm transition-colors">
                  <Phone size={15} className="text-brand-500 shrink-0" />
                  {siteInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-3 text-surface-400 hover:text-brand-400 text-sm transition-colors">
                  <Mail size={15} className="text-brand-500 shrink-0" />
                  {siteInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-surface-400 text-sm">
                <MapPin size={15} className="text-brand-500 shrink-0 mt-0.5" />
                {siteInfo.address}
              </li>
            </ul>
          </div>

          {/* Çalışma Saatleri */}
          <div>
            <h4 className="text-surface-100 font-heading text-base font-semibold mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-brand-500" />
              Çalışma Saatleri
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Clock size={15} className="text-brand-500 shrink-0" />
                <div>
                  <p className="text-surface-300 font-medium">Hafta İçi</p>
                  <p className="text-surface-500">{siteInfo.workingHours.weekdays}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock size={15} className="text-brand-500 shrink-0" />
                <div>
                  <p className="text-surface-300 font-medium">Hafta Sonu</p>
                  <p className="text-surface-500">{siteInfo.workingHours.weekend}</p>
                </div>
              </li>
            </ul>

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              className="mt-8 w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
              aria-label="Yukarı çık"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface-500">
          <p>&copy; {new Date().getFullYear()} Ciğerci Miqqo. Tüm hakları saklıdır.</p>
          <p>Sevgiyle tasarlandı.</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 7. Ana Sayfa Bileşenleri

### `src/components/home/Hero.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: "url('/images/hero/hero-bg.jpg')",
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-surface-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Ember Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-500/60"
            style={{
              left: `${15 + Math.random() * 70}%`,
              bottom: `${Math.random() * 30}%`,
              animation: `ember-rise ${3 + Math.random() * 4}s ease-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-3 text-gold-400 text-sm tracking-[0.3em] uppercase font-medium">
            <span className="h-px w-10 bg-gold-400/50" />
            1990&apos;dan Beri
            <span className="h-px w-10 bg-gold-400/50" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-6"
        >
          Ciğerci{" "}
          <span className="text-brand-500">Miqqo</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-surface-300 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Ateşte pişen efsane lezzet. Kuşaktan kuşağa aktarılan
          geleneksel tariflerle, unutulmaz bir sofra deneyimi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/menu"
            className="group relative px-8 py-4 bg-brand-500 text-white font-medium rounded-full overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            <span className="relative z-10">Menüyü İncele</span>
            <div className="absolute inset-0 bg-brand-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <a
            href="tel:+905551234567"
            className="flex items-center gap-2 px-8 py-4 border border-surface-400/30 text-surface-200 font-medium rounded-full hover:bg-white/10 hover:border-surface-300/50 transition-all"
          >
            <Phone size={16} />
            Sipariş Ver
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-surface-400"
        >
          <span className="text-xs tracking-widest uppercase">Keşfet</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
    </section>
  );
}
```

### `src/components/home/Features.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, Clock, Truck } from "lucide-react";

const features = [
  { icon: Flame, title: "Kömür Ateşi", desc: "Geleneksel mangal pişirme" },
  { icon: Leaf, title: "Taze Malzeme", desc: "Günlük taze tedarik" },
  { icon: Clock, title: "1990'dan Beri", desc: "35 yıllık tecrübe" },
  { icon: Truck, title: "Paket Servis", desc: "Kapınıza kadar lezzet" },
];

export default function Features() {
  return (
    <section className="relative -mt-1 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-900/50 border border-surface-800/50 hover:border-brand-500/30 hover:bg-surface-900 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors shrink-0">
                <f.icon size={20} className="text-brand-500" />
              </div>
              <div className="min-w-0">
                <p className="text-surface-100 font-medium text-sm">{f.title}</p>
                <p className="text-surface-500 text-xs mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### `src/components/home/FeaturedMenu.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { menuItems } from "@/data/menu";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedMenu() {
  const featured = menuItems.filter((item) => item.featured).slice(0, 6);

  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Öne Çıkan Lezzetler" subtitle="Menümüz" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-surface-900 rounded-2xl overflow-hidden border border-surface-800/50 hover:border-brand-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/5"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.spicy && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      <Flame size={12} />
                      Acılı
                    </span>
                  )}
                  {item.popular && (
                    <span className="px-2.5 py-1 bg-gold-400/90 backdrop-blur-sm text-surface-900 text-xs font-medium rounded-full">
                      Popüler
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 pt-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-heading text-lg font-semibold text-surface-100 group-hover:text-brand-400 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-brand-500 font-heading font-bold text-lg whitespace-nowrap">
                    {item.price} ₺
                  </span>
                </div>
                <p className="text-surface-400 text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 px-8 py-3.5 border border-brand-500 text-brand-500 font-medium rounded-full hover:bg-brand-500 hover:text-white transition-all duration-300"
          >
            Tüm Menüyü Gör
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

### `src/components/home/Story.tsx`

```tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Story() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-surface-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <motion.div
                style={{ y }}
                className="absolute inset-0 -top-[10%] -bottom-[10%] bg-cover bg-center"
                aria-hidden
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/story/story-1.jpg')" }}
                />
              </motion.div>
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-brand-500/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-500/10 rounded-full -z-10 blur-2xl" />

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-brand-500 text-white p-6 rounded-2xl shadow-xl"
            >
              <span className="block font-heading text-4xl font-bold">35+</span>
              <span className="text-sm text-brand-100">Yıllık Tecrübe</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-brand-500" />
              <span className="text-brand-500 text-sm tracking-[0.2em] uppercase font-medium">
                Hikayemiz
              </span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-surface-100 mb-6 leading-tight">
              Ateşin Ustalığı,{" "}
              <span className="text-brand-500">Lezzetin Adresi</span>
            </h2>

            <div className="space-y-4 text-surface-400 leading-relaxed">
              <p>
                1990 yılında küçük bir dükkanla başlayan yolculuğumuz, bugün ciğer
                kebabının en nadide adreslerinden biri haline geldi. Her kuşakta
                geleneklerimizi koruyarak, ateşle olan bağımızı hiç koparmadan
                yolumuza devam ediyoruz.
              </p>
              <p>
                Ustalarımız her sabah en taze malzemeleri özenle seçer, özel
                baharatlarımızla harmanlayarak kömür ateşinde ustaca pişirir.
                Ciğerci Miqqo&apos;da her tabak, bir geleneğin ve tutkuyla yapılan
                işçiliğin eseridir.
              </p>
            </div>

            <Link
              href="/hakkimizda"
              className="group inline-flex items-center gap-2 mt-8 text-brand-500 font-medium hover:text-brand-400 transition-colors"
            >
              Daha Fazla Bilgi
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

### `src/components/home/Stats.tsx`

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 35, suffix: "+", label: "Yıllık Deneyim" },
  { value: 500, suffix: "K+", label: "Mutlu Müşteri" },
  { value: 15, suffix: "+", label: "Çeşit Lezzet" },
  { value: 4.9, suffix: "", label: "Ortalama Puan", decimal: true },
];

function Counter({ target, decimal, suffix }: { target: number; decimal?: boolean; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-heading text-4xl md:text-5xl font-bold text-white">
      {decimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/parallax/parallax-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-950/85 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Counter target={stat.value} decimal={stat.decimal} suffix={stat.suffix} />
              <p className="text-brand-200/70 text-sm mt-2 tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### `src/components/home/GalleryPreview.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const images = [
  { src: "/images/gallery/g1.jpg", span: "col-span-2 row-span-2" },
  { src: "/images/gallery/g2.jpg", span: "" },
  { src: "/images/gallery/g3.jpg", span: "" },
  { src: "/images/gallery/g4.jpg", span: "" },
  { src: "/images/gallery/g5.jpg", span: "" },
];

export default function GalleryPreview() {
  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Mekanımızdan Kareler" subtitle="Galeri" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${img.span}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/galeri"
            className="group inline-flex items-center gap-2 text-brand-500 font-medium hover:text-brand-400 transition-colors"
          >
            Tüm Galeriyi Gör
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

### `src/components/home/Testimonials.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const item = testimonials[current];

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 md:py-28 bg-surface-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Misafirlerimizden" subtitle="Yorumlar" />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-900 border border-surface-800/50 rounded-2xl p-8 md:p-12 text-center"
            >
              <Quote size={40} className="text-brand-500/20 mx-auto mb-6" />

              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < item.rating ? "text-gold-400 fill-gold-400" : "text-surface-700"}
                  />
                ))}
              </div>

              <p className="text-surface-200 text-lg md:text-xl leading-relaxed italic mb-8 max-w-2xl mx-auto">
                &ldquo;{item.text}&rdquo;
              </p>

              <div>
                <p className="text-surface-100 font-heading font-semibold text-lg">{item.name}</p>
                <p className="text-surface-500 text-sm mt-1">{item.date}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
              aria-label="Önceki yorum"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-brand-500 w-6" : "bg-surface-700 hover:bg-surface-600"
                  }`}
                  aria-label={`Yorum ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-surface-700 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
              aria-label="Sonraki yorum"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### `src/components/home/CTA.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import { siteInfo } from "@/config/site";

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cta/cta-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 to-surface-950/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-3 text-gold-400 text-sm tracking-[0.3em] uppercase font-medium mb-6">
            <span className="h-px w-8 bg-gold-400/50" />
            Sizi Bekliyoruz
            <span className="h-px w-8 bg-gold-400/50" />
          </span>

          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Lezzet Bir Telefon Kadar Yakın
          </h2>

          <p className="text-surface-300 text-lg max-w-xl mx-auto mb-10">
            Rezervasyon yapmak veya paket sipariş vermek için bizi hemen arayın.
            Taze ve sıcacık lezzetlerimizle sizi ağırlamaya hazırız.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${siteInfo.phone}`}
              className="group flex items-center gap-3 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition-all hover:shadow-xl hover:shadow-brand-500/30"
            >
              <Phone size={18} />
              {siteInfo.phone}
            </a>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 border border-surface-400/30 text-surface-200 font-medium rounded-full hover:bg-white/10 transition-all"
            >
              <MapPin size={18} />
              Yol Tarifi Al
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

---

## 8. Kişiselleştirme Paneli

### `src/components/customization/SettingsPanel.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, RotateCcw } from "lucide-react";
import { useSiteConfig } from "@/context/SiteContext";

const colorOptions = [
  { name: "Kırmızı", value: "#C8102E" },
  { name: "Bordo", value: "#800020" },
  { name: "Turuncu", value: "#D2691E" },
  { name: "Koyu Yeşil", value: "#2D5016" },
  { name: "Lacivert", value: "#1B2A4A" },
];

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { config, updateConfig, resetConfig } = useSiteConfig();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center hover:bg-brand-600 transition-colors"
        aria-label="Ayarları aç"
      >
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <Settings size={20} />
        </motion.div>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-surface-950 border-l border-surface-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading text-lg font-semibold text-surface-100">
                    Site Ayarları
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Tema</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["dark", "light"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => updateConfig({ theme: t })}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            config.theme === t
                              ? "bg-brand-500 text-white"
                              : "bg-surface-900 text-surface-400 hover:bg-surface-800"
                          }`}
                        >
                          {t === "dark" ? "Koyu" : "Açık"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Ana Renk</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => updateConfig({ primaryColor: c.value })}
                          className={`w-9 h-9 rounded-full border-2 transition-all ${
                            config.primaryColor === c.value
                              ? "border-white scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hero Style */}
                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Hero Stili</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["full", "split"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateConfig({ heroStyle: s })}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            config.heroStyle === s
                              ? "bg-brand-500 text-white"
                              : "bg-surface-900 text-surface-400 hover:bg-surface-800"
                          }`}
                        >
                          {s === "full" ? "Tam Ekran" : "Bölünmüş"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Layout */}
                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Menü Düzeni</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["grid", "list"] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => updateConfig({ menuLayout: l })}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            config.menuLayout === l
                              ? "bg-brand-500 text-white"
                              : "bg-surface-900 text-surface-400 hover:bg-surface-800"
                          }`}
                        >
                          {l === "grid" ? "Izgara" : "Liste"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Sections */}
                  <div>
                    <label className="text-sm text-surface-400 font-medium mb-3 block">Bölümler</label>
                    <div className="space-y-2">
                      {[
                        { key: "showFeatures" as const, label: "Özellikler Barı" },
                        { key: "showStats" as const, label: "İstatistikler" },
                        { key: "showTestimonials" as const, label: "Müşteri Yorumları" },
                        { key: "showGallery" as const, label: "Galeri Önizleme" },
                      ].map((s) => (
                        <label
                          key={s.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-900 cursor-pointer hover:bg-surface-800 transition-colors"
                        >
                          <span className="text-sm text-surface-300">{s.label}</span>
                          <div
                            className={`w-10 h-6 rounded-full relative transition-colors ${
                              config[s.key] ? "bg-brand-500" : "bg-surface-700"
                            }`}
                            onClick={() => updateConfig({ [s.key]: !config[s.key] })}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                config[s.key] ? "left-5" : "left-1"
                              }`}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  <button
                    onClick={resetConfig}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-surface-700 text-surface-400 text-sm rounded-xl hover:bg-surface-900 hover:text-surface-200 transition-all"
                  >
                    <RotateCcw size={14} />
                    Varsayılana Sıfırla
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## 9. App Layout

### `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SiteProvider } from "@/context/SiteContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettingsPanel from "@/components/customization/SettingsPanel";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ciğerci Miqqo | Ateşte Pişen Efsane Lezzet",
  description:
    "Kuşaktan kuşağa aktarılan tariflerle, en taze malzemelerden hazırlanan eşsiz ciğer kebabı deneyimi. 1990'dan beri hizmetinizdeyiz.",
  keywords: "ciğerci, ciğer kebap, kebap, restoran, miqqo, ciğerci miqqo",
  openGraph: {
    title: "Ciğerci Miqqo",
    description: "Ateşte pişen efsane lezzet",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="grain font-body antialiased">
        <SiteProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <SettingsPanel />
        </SiteProvider>
      </body>
    </html>
  );
}
```

---

## 10. Sayfalar

### `src/app/page.tsx` — Ana Sayfa

```tsx
"use client";

import { useSiteConfig } from "@/context/SiteContext";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FeaturedMenu from "@/components/home/FeaturedMenu";
import Story from "@/components/home/Story";
import Stats from "@/components/home/Stats";
import GalleryPreview from "@/components/home/GalleryPreview";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  const { config } = useSiteConfig();

  return (
    <>
      <Hero />
      {config.showFeatures && <Features />}
      <FeaturedMenu />
      <Story />
      {config.showStats && <Stats />}
      {config.showGallery && <GalleryPreview />}
      {config.showTestimonials && <Testimonials />}
      <CTA />
    </>
  );
}
```

### `src/app/menu/page.tsx` — Menü

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { menuItems } from "@/data/menu";
import { categories } from "@/config/site";
import { useSiteConfig } from "@/context/SiteContext";
import type { MenuCategory } from "@/types";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
  const { config } = useSiteConfig();

  const filtered =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-surface-950">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero/menu-bg.jpg')" }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
              Lezzetlerimiz
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
              Menümüz
            </h1>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-[68px] z-30 bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-brand-500 text-white"
                  : "bg-surface-900 text-surface-400 hover:bg-surface-800 hover:text-surface-200"
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-brand-500 text-white"
                    : "bg-surface-900 text-surface-400 hover:bg-surface-800 hover:text-surface-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-12 md:py-16 bg-surface-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {config.menuLayout === "grid" ? (
            /* ── GRID Layout ── */
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-surface-900 rounded-2xl overflow-hidden border border-surface-800/50 hover:border-brand-500/30 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1.5 bg-brand-500 text-white text-sm font-bold rounded-full">
                          {item.price} ₺
                        </span>
                      </div>
                      {item.spicy && (
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-600/90 text-white text-xs rounded-full">
                            <Flame size={11} /> Acılı
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold text-surface-100 mb-1.5">
                        {item.name}
                      </h3>
                      <p className="text-surface-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ── LIST Layout ── */
            <motion.div layout className="max-w-3xl mx-auto divide-y divide-surface-800/50">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-5 py-5 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center dot-leader">
                        <h3 className="font-heading font-semibold text-surface-100 flex items-center gap-2">
                          {item.name}
                          {item.spicy && <Flame size={14} className="text-red-500" />}
                        </h3>
                        <span className="text-brand-500 font-heading font-bold whitespace-nowrap">
                          {item.price} ₺
                        </span>
                      </div>
                      <p className="text-surface-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-surface-500">Bu kategoride ürün bulunmuyor.</div>
          )}
        </div>
      </section>
    </>
  );
}
```

### `src/app/hakkimizda/page.tsx` — Hakkımızda

```tsx
"use client";

import { motion } from "framer-motion";
import { Flame, Users, Award, Heart } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const values = [
  {
    icon: Flame,
    title: "Geleneksel Pişirme",
    desc: "Kömür ateşinde, sabırla ve ustalıkla pişirme geleneğimizi sürdürüyoruz.",
  },
  {
    icon: Heart,
    title: "Taze Malzeme",
    desc: "Her gün en taze malzemeleri tedarik ediyor, kaliteden asla ödün vermiyoruz.",
  },
  {
    icon: Users,
    title: "Aile Mirası",
    desc: "Kuşaktan kuşağa aktarılan tarifler ve değişmeyen lezzet anlayışı.",
  },
  {
    icon: Award,
    title: "Kalite Taahhüdü",
    desc: "Her tabağımız, misafirlerimize olan saygımızın ve kalite anlayışımızın yansımasıdır.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-surface-950">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero/about-bg.jpg')" }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
              Bizi Tanıyın
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
              Hakkımızda
            </h1>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimateOnScroll variant="fadeLeft">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/about/about-1.jpg')" }}
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeRight" delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-brand-500" />
                <span className="text-brand-500 text-sm tracking-[0.2em] uppercase font-medium">
                  Hikayemiz
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-surface-100 mb-6">
                Bir Tutkunun <span className="text-brand-500">Hikayesi</span>
              </h2>
              <div className="space-y-4 text-surface-400 leading-relaxed">
                <p>
                  1990 yılında, küçük bir esnaf dükkanında başlayan hikayemiz, ciğer
                  kebabına olan tutkumuzun ve geleneksel pişirme sanatına olan
                  bağlılığımızın bir yansımasıdır.
                </p>
                <p>
                  Kurucumuz, yılların birikimi ve ustalardan öğrendiği tekniklerle
                  ciğer kebabını bir sanata dönüştürdü. Her gün taze seçilen
                  malzemeler, özel baharat karışımımız ve kömür ateşinin
                  büyüsüyle hazırlanan lezzetlerimiz, bugün binlerce damağın
                  favorisi olmaya devam ediyor.
                </p>
                <p>
                  Ciğerci Miqqo olarak, geleneklerimizi korurken modern hizmet
                  anlayışını benimsiyoruz. Her misafirimize evinde hissettirecek
                  bir atmosfer, her tabakta ise kuşakların biriktirdiği lezzeti
                  sunuyoruz.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-surface-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-surface-100">
              Değerlerimiz
            </h2>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <AnimateOnScroll key={v.title} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800/50 text-center hover:border-brand-500/30 transition-all group h-full">
                  <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
                    <v.icon size={24} className="text-brand-500" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-surface-100 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

### `src/app/galeri/page.tsx` — Galeri

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const galleryImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `/images/gallery/gallery-${i + 1}.jpg`,
  alt: `Ciğerci Miqqo - Fotoğraf ${i + 1}`,
}));

export default function GalleryPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-surface-950">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
              Kareler
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
              Galeri
            </h1>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16 bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => setSelected(img.src)}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    className="bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${img.src})`,
                      paddingBottom: `${60 + (i % 3) * 20}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelected(null)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full h-[70vh] bg-contain bg-center bg-no-repeat rounded-xl"
                style={{ backgroundImage: `url(${selected})` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

### `src/app/iletisim/page.tsx` — İletişim

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { siteInfo } from "@/config/site";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactInfo = [
    { icon: Phone, label: "Telefon", value: siteInfo.phone, href: `tel:${siteInfo.phone}` },
    { icon: Mail, label: "E-posta", value: siteInfo.email, href: `mailto:${siteInfo.email}` },
    { icon: MapPin, label: "Adres", value: siteInfo.address },
    { icon: Clock, label: "Çalışma Saatleri", value: `Hafta içi: ${siteInfo.workingHours.weekdays} / Hafta sonu: ${siteInfo.workingHours.weekend}` },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-surface-950">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-500 text-sm tracking-[0.3em] uppercase font-medium">
              Bize Ulaşın
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-surface-100 mt-3">
              İletişim
            </h1>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-brand-500 to-gold-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              <AnimateOnScroll>
                <h2 className="font-heading text-2xl font-bold text-surface-100 mb-6">
                  İletişim Bilgileri
                </h2>
              </AnimateOnScroll>
              {contactInfo.map((info, i) => (
                <AnimateOnScroll key={info.label} delay={i * 0.1}>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-900 border border-surface-800/50">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                      <info.icon size={18} className="text-brand-500" />
                    </div>
                    <div>
                      <p className="text-surface-500 text-xs uppercase tracking-wider mb-1">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-surface-200 hover:text-brand-400 transition-colors text-sm">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-surface-200 text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Form */}
            <AnimateOnScroll variant="fadeRight" className="lg:col-span-3">
              <div className="bg-surface-900 rounded-2xl border border-surface-800/50 p-6 md:p-8">
                <h2 className="font-heading text-2xl font-bold text-surface-100 mb-6">
                  Bize Yazın
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-surface-100 font-heading text-xl font-semibold mb-2">
                      Mesajınız Alındı
                    </h3>
                    <p className="text-surface-400">En kısa sürede size dönüş yapacağız.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-surface-400 mb-2">Ad Soyad</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
                          placeholder="Adınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-surface-400 mb-2">Telefon</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
                          placeholder="05xx xxx xx xx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-surface-400 mb-2">E-posta</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="ornek@mail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-surface-400 mb-2">Konu</label>
                      <select className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-brand-500 transition-colors">
                        <option value="">Seçiniz</option>
                        <option value="rezervasyon">Rezervasyon</option>
                        <option value="siparis">Sipariş</option>
                        <option value="oneri">Öneri / Şikayet</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-surface-400 mb-2">Mesajınız</label>
                      <textarea
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-surface-950 border border-surface-800 rounded-xl text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-brand-500/25"
                    >
                      <Send size={16} />
                      Gönder
                    </button>
                  </form>
                )}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Map Placeholder */}
          <AnimateOnScroll className="mt-12">
            <div className="h-80 md:h-96 rounded-2xl overflow-hidden bg-surface-900 border border-surface-800/50 flex items-center justify-center">
              <div className="text-center text-surface-500">
                <MapPin size={32} className="mx-auto mb-3 text-surface-600" />
                <p className="text-sm">
                  Buraya Google Maps embed kodu eklenecek
                </p>
                <p className="text-xs mt-1 text-surface-600">
                  iframe src=&quot;https://maps.google.com/maps?q=...&quot;
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
```

---

## 11. Görseller İçin Placeholder Yapısı

`public/images/` altına şu klasörleri oluştur:

```
public/
└── images/
    ├── hero/
    │   ├── hero-bg.jpg        ← Ana sayfa hero (1920x1080, karanlık ortam, mangal/ateş)
    │   ├── menu-bg.jpg        ← Menü sayfası hero arkaplan
    │   └── about-bg.jpg       ← Hakkımızda arkaplan
    ├── menu/
    │   ├── ciger-sis.jpg      ← Her menü öğesi için (800x600)
    │   ├── acili-ciger.jpg
    │   ├── ciger-kavurma.jpg
    │   ├── ciger-sarma.jpg
    │   ├── adana-kebap.jpg
    │   ├── urfa-kebap.jpg
    │   ├── beyti-kebap.jpg
    │   ├── kusbasi-pide.jpg
    │   ├── lahmacun.jpg
    │   ├── acili-ezme.jpg
    │   ├── mevsim-salata.jpg
    │   ├── sogan-sarmasi.jpg
    │   ├── kunefe.jpg
    │   ├── ayran.jpg
    │   └── salgam.jpg
    ├── story/
    │   └── story-1.jpg        ← Hikaye bölümü (800x1000, dikey, mekan/usta fotosu)
    ├── about/
    │   └── about-1.jpg        ← Hakkımızda (800x1000)
    ├── gallery/
    │   ├── g1.jpg - g5.jpg    ← Ana sayfa galeri (çeşitli boyutlar)
    │   └── gallery-1.jpg      ← Galeri sayfası (12 adet, çeşitli boyutlar)
    │       ...gallery-12.jpg
    ├── parallax/
    │   └── parallax-bg.jpg    ← Stats bölümü arkaplan (1920x800)
    └── cta/
        └── cta-bg.jpg         ← CTA bölümü arkaplan (1920x800)
```

---

## Kullanım Notları

**Geliştirmeyi başlat:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
```

**Deploy:**
Build çıktısı `out/` klasöründe olacak, bunu GitHub Pages'e push et.

---

**Kişiselleştirme nasıl çalışıyor:**
- Sağ alttaki dişli çark ikonuna tıkla
- Tema (koyu/açık), ana renk, hero stili, menü düzeni, bölüm açma/kapama ayarlarını değiştir
- Ayarlar `localStorage`'da saklanır, sayfa yenilenince de kalır
- "Varsayılana Sıfırla" ile her şeyi başa döndür

**Site içeriğini değiştirmek için:**
- `src/config/site.ts` → Restoran bilgileri, telefon, adres, çalışma saatleri
- `src/data/menu.ts` → Menü öğeleri, fiyatlar, açıklamalar
- `public/images/` → Tüm görseller

**Yeni sayfa eklemek için:**
- `src/app/yeni-sayfa/page.tsx` oluştur, mevcut sayfaları referans al
- Header'daki `navLinks` dizisine ekle

Bu yapı tamamen modüler: her bileşen bağımsız, her bölüm açılıp kapatılabilir, renkler ve düzen anında değiştirilebilir. Görselleri kendi fotoğraflarınla değiştirdiğinde site hazır.