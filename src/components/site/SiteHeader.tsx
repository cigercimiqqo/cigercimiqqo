'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useSettingsStore } from '@/store/settingsStore';
import { CartDrawer } from './CartDrawer';
import { MobileNav } from './MobileNav';

const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/menu', label: 'Menü' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/blog', label: 'Blog' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSettingsStore();
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.itemCount());
  const siteName = settings?.general?.siteName || 'Restoran';
  const logo = settings?.general?.logo;
  const phone = settings?.general?.phone?.[0];
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update(); // ilk yüklemede kontrol
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  // Ana sayfa + en üstte = hero üzerinde (koyu bg, açık text). Diğer tüm durumlar = açık bg, koyu text.
  const isOverHero = pathname === '/' && !scrolled;
  const headerBg = isOverHero
    ? 'bg-black/30 backdrop-blur-sm py-5'
    : 'bg-white/98 backdrop-blur-md shadow-sm py-3';

  const textClass = isOverHero ? 'text-white' : 'text-stone-800';
  const linkClass = (isActive: boolean) => {
    if (isActive) {
      return `font-bold border-b-2 pb-1 ${isOverHero ? 'text-white border-white' : 'text-brand-700 border-brand-600'}`;
    }
    return isOverHero
      ? 'text-white/90 hover:text-white transition-colors'
      : 'text-stone-600 hover:text-brand-700 transition-colors';
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              {logo ? (
                <Image src={logo} alt={siteName} width={36} height={36} className="object-contain rounded-lg" />
              ) : (
                <span className={`text-2xl font-bold font-heading ${textClass}`}>
                  {siteName}
                </span>
              )}
              {logo && (
                <span className={`text-xl font-bold font-heading ${textClass}`}>
                  {siteName}
                </span>
              )}
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm ${linkClass(isActive)}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-medium transition-all shadow-lg shadow-brand-500/20"
                >
                  <Phone size={14} />
                  Sipariş Ver
                </a>
              )}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                aria-label="Sepet"
              >
                <ShoppingCart size={18} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-stone-950 text-xs rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center ${textClass}`}
                aria-label="Menü"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>

      <div className="h-[72px]" />
      <CartDrawer />
    </>
  );
}
