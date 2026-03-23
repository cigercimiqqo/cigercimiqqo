'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const FOOTER_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/menu', label: 'Menümüz' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/blog', label: 'Blog' },
];

function formatWh(wh: { open: string; close: string; isClosed: boolean } | undefined): string {
  if (!wh || wh.isClosed) return 'Kapalı';
  return `${wh.open} - ${wh.close}`;
}

export function SiteFooter() {
  const { settings } = useSettingsStore();
  const siteName = settings?.general?.siteName || 'Restoran';
  const description = settings?.general?.siteDescription || '';
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
    <footer className="bg-surface-950 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8 ${
            footerColumns === 4 ? 'lg:grid-cols-4' : footerColumns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
          }`}
        >
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              {logo ? (
                <Image src={logo} alt={siteName} width={40} height={40} className="object-contain rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-lg">{siteName[0]}</span>
                </div>
              )}
              <div>
                <h3 className="text-surface-100 font-heading text-lg font-bold">{siteName}</h3>
                <p className="text-gold-400 text-[10px] tracking-[0.2em] uppercase">Lezzet</p>
              </div>
            </div>
            {description && (
              <p className="text-surface-400 text-sm leading-relaxed mb-6">{description}</p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-surface-100 font-heading text-base font-semibold mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-brand-500" />
              Hızlı Erişim
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
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

          <div>
            <h4 className="text-surface-100 font-heading text-base font-semibold mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-brand-500" />
              İletişim
            </h4>
            <ul className="space-y-4">
              {phones.map((phone, i) => (
                <li key={i}>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-surface-400 hover:text-brand-400 text-sm transition-colors"
                  >
                    <Phone size={15} className="text-brand-500 shrink-0" />
                    {phone}
                  </a>
                </li>
              ))}
              {address && (
                <li className="flex items-start gap-3 text-surface-400 text-sm">
                  <MapPin size={15} className="text-brand-500 shrink-0 mt-0.5" />
                  {address}
                </li>
              )}
            </ul>
          </div>

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
                  <p className="text-surface-500">{weekdays}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock size={15} className="text-brand-500 shrink-0" />
                <div>
                  <p className="text-surface-300 font-medium">Hafta Sonu</p>
                  <p className="text-surface-500">{weekend}</p>
                </div>
              </li>
            </ul>
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

      <div className="border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.</p>
          <p>Sevgiyle tasarlandı.</p>
        </div>
      </div>
    </footer>
  );
}
