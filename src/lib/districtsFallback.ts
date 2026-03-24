import type { DistrictData } from '@/types';

/** Fetch 404 olduğunda kullanılacak minimal il/ilçe/mahalle verisi */
export const DISTRICTS_FALLBACK: DistrictData[] = [
  {
    il: 'İstanbul',
    ilceler: [
      { ilce: 'Kadıköy', mahalleler: ['Acıbadem', 'Bostancı', 'Fenerbahçe', 'Göztepe', 'Moda'] },
      { ilce: 'Beşiktaş', mahalleler: ['Bebek', 'Etiler', 'Levent', 'Ortaköy'] },
    ],
  },
  {
    il: 'Ankara',
    ilceler: [
      { ilce: 'Çankaya', mahalleler: ['Bahçelievler', 'Balgat', 'Kızılay'] },
    ],
  },
  {
    il: 'İzmir',
    ilceler: [
      { ilce: 'Konak', mahalleler: ['Alsancak', 'Basmane', 'Çankaya'] },
    ],
  },
];
