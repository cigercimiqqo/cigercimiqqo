'use client';

import { MapPin, Phone, Clock } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export function RestaurantInfo() {
  const { settings } = useSettingsStore();
  const address = settings?.general?.address;
  const phones = settings?.general?.phone || [];
  const workingHours = settings?.ordering?.workingHours;

  if (!address && !phones.length) return null;

  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const todayHours = workingHours?.[todayKey as keyof typeof workingHours];

  return (
    <section className="py-20 md:py-28 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-surface-100 mb-8">Bize Ulaşın</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {address && (
            <div className="bg-surface-900 rounded-2xl p-6 border border-surface-800/50">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <MapPin size={22} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-surface-100 mb-2">Adres</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{address}</p>
            </div>
          )}

          {phones.length > 0 && (
            <div className="bg-surface-900 rounded-2xl p-6 border border-surface-800/50">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Phone size={22} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-surface-100 mb-2">Telefon</h3>
              <div className="space-y-1.5">
                {phones.map((phone: string, i: number) => (
                  <a
                    key={i}
                    href={`tel:${phone}`}
                    className="block text-sm text-brand-400 hover:text-brand-300 font-medium"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          )}

          {todayHours && (
            <div className="bg-surface-900 rounded-2xl p-6 border border-surface-800/50">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Clock size={22} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-surface-100 mb-2">Bugün</h3>
              {todayHours.isClosed ? (
                <p className="text-sm text-red-500 font-medium">Kapalı</p>
              ) : (
                <p className="text-sm text-surface-400">
                  {todayHours.open} – {todayHours.close}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
