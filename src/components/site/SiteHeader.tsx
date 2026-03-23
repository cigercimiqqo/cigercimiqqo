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
import { useVisitorPreferences } from '@/context/VisitorPreferencesContext';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const siteName = settings?.general?.siteName || 'Restoran';
  const logo = settings?.general?.logo;
  const phones = settings?.general?.phone || [];
  const phone = phones[0];
  const { preferences } = useVisitorPreferences();
  const isLight = preferences.theme === 'light';

  const headerBg = scrolled
    ? isLight
      ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 py-3'
      : 'bg-surface-950/90 backdrop-blur-xl shadow-2xl shadow-black/20 py-3'
    : 'bg-transparent py-5';

  const navLinkClass = (isActive: boolean) =>
    isActive
      ? 'text-brand-500'
      : scrolled && isLight
        ? 'text-surface-700 hover:text-surface-900'
        : 'text-surface-200 hover:text-white';

  const siteNameClass = scrolled && isLight ? 'text-surface-900' : 'text-white';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              {logo ? (
                <Image src={logo} alt={siteName} width={40} height={40} className="object-contain rounded-full" />
              ) : (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                    <span className="text-white font-heading font-bold text-lg">{siteName[0]}</span>
                  </div>
                  <div className="absolute -inset-1 rounded-full bg-brand-500/20 group-hover:bg-brand-500/30 transition-colors -z-10" />
                </div>
              )}
              <div className="flex flex-col">
                <span className={`font-heading text-xl font-bold leading-tight tracking-wide ${siteNameClass}`}>
                  {siteName}
                </span>
                <span className="text-gold-400 text-[10px] tracking-[0.25em] uppercase font-medium leading-none">
                  Lezzet
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${navLinkClass(isActive)}`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-full transition-all hover:shadow-lg hover:shadow-brand-500/25"
                >
                  <Phone size={14} />
                  <span>Sipariş Ver</span>
                </a>
              )}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                aria-label="Sepet"
              >
                <ShoppingCart size={18} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-surface-950 text-xs rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors ${
                  scrolled && isLight ? 'text-surface-700 hover:text-surface-900' : 'text-surface-200 hover:text-white'
                }`}
                aria-label="Menüyü aç"
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
