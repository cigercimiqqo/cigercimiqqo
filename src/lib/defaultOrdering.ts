import type { OrderingSettings, WorkingHours, SpecialDate } from '@/types';

const defaultDay = (open: string, close: string, isClosed = false): WorkingHours => ({
  open,
  close,
  isClosed,
});

export function getDefaultOrdering(): OrderingSettings {
  return {
    isOnline: true,
    workingHours: {
      mon: defaultDay('11:00', '23:00'),
      tue: defaultDay('11:00', '23:00'),
      wed: defaultDay('11:00', '23:00'),
      thu: defaultDay('11:00', '23:00'),
      fri: defaultDay('11:00', '23:00'),
      sat: defaultDay('10:00', '00:00'),
      sun: defaultDay('10:00', '00:00', true), // Pazar kapalı varsayılan
    },
    specialDates: [],
    minOrderAmount: 0,
    busyMessage: 'Şu an yoğunluk nedeniyle sipariş alamıyoruz.',
  };
}

/** Eski closedDates (sadece string[]) → specialDates migrasyonu */
function migrateClosedDatesToSpecial(closedDates: string[] | undefined): SpecialDate[] {
  if (!closedDates?.length) return [];
  return closedDates.map((date) => ({ date, isClosed: true }));
}

export function mergeOrderingWithDefaults(partial: Partial<OrderingSettings> | null | undefined): OrderingSettings {
  const defaults = getDefaultOrdering();
  if (!partial) return defaults;
  let specialDates: SpecialDate[] = partial.specialDates ?? defaults.specialDates ?? [];
  if (specialDates.length === 0 && partial.closedDates?.length) {
    specialDates = migrateClosedDatesToSpecial(partial.closedDates);
  }
  const result: OrderingSettings = {
    ...defaults,
    ...partial,
    workingHours: { ...defaults.workingHours },
    specialDates,
  };
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
  for (const key of dayKeys) {
    result.workingHours[key] = partial.workingHours?.[key]
      ? { ...defaults.workingHours[key], ...partial.workingHours[key] }
      : defaults.workingHours[key];
  }
  return result;
}
