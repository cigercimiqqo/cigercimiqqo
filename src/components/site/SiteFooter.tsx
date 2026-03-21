import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import type { SiteSettings } from '@/types';

interface SiteFooterProps {
  settings: SiteSettings | null;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const siteName = settings?.general?.siteName || 'Restoran';
  const description = settings?.general?.siteDescription || '';
  const phones = settings?.general?.phone || [];
  const address = settings?.general?.address || '';
  const social = settings?.general?.socialMedia || {};
  const logo = settings?.general?.logo;

  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {logo ? (
                <Image src={logo} alt={siteName} width={36} height={36} className="object-contain rounded" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                  {siteName[0]}
                </div>
              )}
              <span className="font-bold text-white text-lg">{siteName}</span>
            </div>
            {description && <p className="text-sm leading-relaxed mb-4">{description}</p>}
            {/* Social */}
            <div className="flex gap-3">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  <Facebook size={18} />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  <Youtube size={18} />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-orange-400 transition-colors">Anasayfa</Link></li>
              <li><Link href="/menu" className="hover:text-orange-400 transition-colors">Menü</Link></li>
              <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              {phones.map((phone, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Phone size={14} className="text-orange-400 shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-orange-400 transition-colors">{phone}</a>
                </li>
              ))}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-orange-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
