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
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Bize Ulaşın</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {address && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <MapPin size={22} className="text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adres</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{address}</p>
          </div>
        )}

        {phones.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <Phone size={22} className="text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
            <div className="space-y-1.5">
              {phones.map((phone: string, i: number) => (
                <a
                  key={i}
                  href={`tel:${phone}`}
                  className="block text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
        )}

        {todayHours && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <Clock size={22} className="text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bugün</h3>
            {todayHours.isClosed ? (
              <p className="text-sm text-red-500 font-medium">Kapalı</p>
            ) : (
              <p className="text-sm text-gray-600">
                {todayHours.open} – {todayHours.close}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
