import type { OrderingSettings, WorkingHours } from '@/types';

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
    closedDates: [],
    minOrderAmount: 0,
    busyMessage: 'Şu an yoğunluk nedeniyle sipariş alamıyoruz.',
  };
}

export function mergeOrderingWithDefaults(partial: Partial<OrderingSettings> | null | undefined): OrderingSettings {
  const defaults = getDefaultOrdering();
  if (!partial) return defaults;
  const result: OrderingSettings = {
    ...defaults,
    ...partial,
    workingHours: { ...defaults.workingHours },
    closedDates: partial.closedDates ?? defaults.closedDates,
  };
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
  for (const key of dayKeys) {
    result.workingHours[key] = partial.workingHours?.[key]
      ? { ...defaults.workingHours[key], ...partial.workingHours[key] }
      : defaults.workingHours[key];
  }
  return result;
}
