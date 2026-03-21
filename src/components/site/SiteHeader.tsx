'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSettingsStore();
  const { itemCount, openCart } = useCartStore();
  const count = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const siteName = settings?.general?.siteName || 'Restoran';
  const logo = settings?.general?.logo;
  const phones = settings?.general?.phone || [];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              {logo ? (
                <Image src={logo} alt={siteName} width={40} height={40} className="object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {siteName[0]}
                </div>
              )}
              <span className="font-bold text-lg text-gray-900 hidden sm:block">{siteName}</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Anasayfa
              </Link>
              <Link href="/menu" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Menü
              </Link>
              <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Blog
              </Link>
              {phones[0] && (
                <a
                  href={`tel:${phones[0]}`}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <Phone size={14} />
                  {phones[0]}
                </a>
              )}
            </nav>

            {/* Cart + Mobile menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                aria-label="Sepet"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Menü"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium text-gray-700 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>
              Anasayfa
            </Link>
            <Link href="/menu" className="block text-sm font-medium text-gray-700 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>
              Menü
            </Link>
            <Link href="/blog" className="block text-sm font-medium text-gray-700 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            {phones[0] && (
              <a href={`tel:${phones[0]}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500">
                <Phone size={14} />
                {phones[0]}
              </a>
            )}
          </div>
        )}
      </header>

      <div className="h-16" />
      <CartDrawer />
    </>
  );
}
