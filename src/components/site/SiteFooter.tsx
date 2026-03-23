'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Instagram, Facebook, ArrowUp, Send } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { getDefaultContent } from '@/lib/defaultContent';

const FOOTER_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/menu', label: 'Menü' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/galeri', label: 'Galeri' },
];

const SUPPORT_LINKS = [
  { href: '/iletisim', label: 'İletişim' },
  { href: '/iletisim#adres', label: 'Adres' },
  { href: '/iletisim#calisma', label: 'Çalışma Saatleri' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
];

function formatWh(wh: { open: string; close: string; isClosed: boolean } | undefined): string {
  if (!wh || wh.isClosed) return 'Kapalı';
  return `${wh.open} - ${wh.close}`;
}

export function SiteFooter() {
  const { settings } = useSettingsStore();
  const content = settings?.content ?? getDefaultContent();
  const footer = content.footer;
  const siteName = settings?.general?.siteName || 'Restoran';
  const description = footer.description || settings?.general?.siteDescription || '';
  const phones = settings?.general?.phone || [];
  const address = settings?.general?.address || '';
  const social = settings?.general?.socialMedia || {};
  const logo = settings?.general?.logo;
  const wh = settings?.ordering?.workingHours;
  const weekdays = wh?.mon ? formatWh(wh.mon) : '11:00 - 23:00';
  const weekend = wh?.sat ? formatWh(wh.sat) : '10:00 - 00:00';
  const footerColumns = settings?.layout?.footerColumns ?? 4;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { icon: Instagram, href: social.instagram },
    { icon: Facebook, href: social.facebook },
  ].filter((s) => s.href);

  return (
    <footer className="w-full mt-20 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <span className="text-xl font-bold text-brand-700 dark:text-brand-500 mb-4 block font-heading">
            {footer.tagline || siteName}
          </span>
          {description && (
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{description}</p>
          )}
          {socialLinks.length > 0 && (
            <div className="flex gap-4 mt-6">
              {socialLinks.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:border-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-widest text-xs">
            {footer.quickLinksLabel}
          </h4>
          <ul className="space-y-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-stone-500 dark:text-stone-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-widest text-xs">
            {footer.supportLabel}
          </h4>
          <ul className="space-y-4">
            {phones.map((phone, i) => (
              <li key={i}>
                <a href={`tel:${phone}`} className="text-stone-500 dark:text-stone-400 hover:text-brand-600 text-sm flex items-center gap-2">
                  <Phone size={14} />
                  {phone}
                </a>
              </li>
            ))}
            {address && (
              <li className="text-stone-500 dark:text-stone-400 text-sm flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                {address}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-widest text-xs">
            {footer.newsletterLabel}
          </h4>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
            Yeni tatlar ve özel indirimlerden haberdar olun.
          </p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={footer.newsletterPlaceholder}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-l-lg px-4 py-2 w-full text-sm focus:ring-1 focus:ring-brand-500 outline-none"
            />
            <button type="submit" className="bg-brand-500 text-white px-4 py-2 rounded-r-lg hover:bg-brand-600 transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-stone-200/50 dark:border-stone-800/50 text-center">
        <p className="font-heading text-sm text-stone-500 dark:text-stone-400">
          {footer.copyrightText.replace('2024', String(new Date().getFullYear()))}
        </p>
      </div>
    </footer>
  );
}
