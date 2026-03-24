'use client';

import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { getGoogleMapsEmbedSrc } from '@/lib/googleMapsEmbed';

function formatWh(wh: { open: string; close: string; isClosed: boolean } | undefined): string {
  if (!wh || wh.isClosed) return 'Kapalı';
  return `${wh.open} - ${wh.close}`;
}

export function RestaurantInfo() {
  const { settings } = useSettingsStore();
  const address = settings?.general?.address;
  const phones = settings?.general?.phone || [];
  const workingHours = settings?.ordering?.workingHours;
  const mapsLink = settings?.general?.googleMapsLink;
  const embedSrc = getGoogleMapsEmbedSrc(mapsLink);

  if (!address && !phones.length && !embedSrc) return null;

  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const todayHours = workingHours?.[todayKey as keyof typeof workingHours];
  const weekdays = workingHours?.mon ? formatWh(workingHours.mon) : '11:00 - 23:00';
  const weekend = workingHours?.sat ? formatWh(workingHours.sat) : '10:00 - 00:00';
  const hoursStr = `Hafta içi: ${weekdays} / Hafta sonu: ${weekend}`;

  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <span className="text-brand-500 text-sm tracking-[0.2em] uppercase font-medium">Bize Ulaşın</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-surface-100 mt-2 mb-10">
              Sizi Ağırlamaktan <br />
              <span className="text-brand-400">Mutluluk Duyarız</span>
            </h2>
            <div className="space-y-6">
              {address && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-100 mb-1">Adresimiz</h3>
                    <p className="text-surface-400 leading-relaxed">{address}</p>
                  </div>
                </div>
              )}
              {phones.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-100 mb-1">Telefon</h3>
                    <div className="space-y-1">
                      {phones.map((phone: string, i: number) => (
                        <a key={i} href={`tel:${phone}`} className="block text-surface-400 hover:text-brand-400 transition-colors">
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {(todayHours || workingHours) && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-100 mb-1">Çalışma Saatleri</h3>
                    <p className="text-surface-400">{hoursStr}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-full min-h-[320px] md:min-h-[400px] rounded-2xl overflow-hidden bg-surface-900 border border-surface-800/50 relative">
            {embedSrc ? (
              <>
                <iframe
                  src={embedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 320 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Konum"
                  className="absolute inset-0 w-full h-full"
                />
                <a
                  href={
                    mapsLink && mapsLink.includes('google.com/maps') && !mapsLink.includes('/embed')
                      ? mapsLink.startsWith('http') ? mapsLink : `https://${mapsLink}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 py-3 bg-white text-surface-900 font-semibold rounded-xl shadow-lg hover:bg-surface-100 transition-colors"
                >
                  <Navigation size={18} />
                  Yol Tarifi Al
                </a>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-surface-500 p-6 text-center">
                <MapPin size={40} className="mb-3 text-surface-600" />
                <p className="text-sm">Harita önizlemesi için Admin → Ayarlar → Genel</p>
                <p className="text-xs mt-1">Google Harita Linki alanına mekan linkinizi girin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
