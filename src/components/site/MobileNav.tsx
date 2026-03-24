'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Clock } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/menu', label: 'Menü' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/blog', label: 'Blog' },
];

function formatWorkingHours(wh: { open: string; close: string; isClosed: boolean } | undefined): string {
  if (!wh || wh.isClosed) return 'Kapalı';
  return `${wh.open} - ${wh.close}`;
}

export function MobileNav({
  links = NAV_LINKS,
  onClose,
}: {
  links?: { href: string; label: string }[];
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { settings } = useSettingsStore();
  const phone = settings?.general?.phone?.[0] || '';
  const address = settings?.general?.address || '';
  const wh = settings?.ordering?.workingHours;
  const weekdays = wh?.mon ? formatWorkingHours(wh.mon) : '11:00 - 23:00';
  const weekend = wh?.sat ? formatWorkingHours(wh.sat) : '10:00 - 00:00';

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <nav
        className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface-950 border-l border-surface-800 flex flex-col"
      >
        <div className="flex-1 pt-24 px-6 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-500'
                        : 'text-surface-200 hover:bg-surface-900 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-surface-800 space-y-4">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-surface-200 hover:text-brand-400 transition-colors"
              >
                <Phone size={16} className="text-brand-500 shrink-0" />
                <span className="text-sm">{phone}</span>
              </a>
            )}
            {address && (
              <div className="flex items-start gap-3 text-surface-300">
                <MapPin size={16} className="text-brand-500 mt-0.5 shrink-0" />
                <span className="text-sm">{address}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-surface-300">
              <Clock size={16} className="text-brand-500 shrink-0" />
              <span className="text-sm">Hafta içi: {weekdays} / Hafta sonu: {weekend}</span>
            </div>
          </div>
        </div>

        {phone && (
          <div className="p-6 border-t border-surface-800">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition-colors"
            >
              <Phone size={16} />
              Hemen Ara
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
