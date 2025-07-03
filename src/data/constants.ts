const locationEntries = [
  { value: 'default', label: '기타' },
  { value: 'tokyo', label: '도쿄' },
  { value: 'osaka', label: '오사카' },
  { value: 'nagoya', label: '나고야' },
  { value: 'fukuoka', label: '후쿠오카' },
  { value: 'sapporo', label: '삿포로' },
] as const;

const locationCosts = {
  default: {
    min: 150000,
    max: 350000,
    avg: 250000,
  },
  tokyo: {
    min: 200000,
    max: 350000,
    avg: 275000,
  },
  osaka: {
    min: 150000,
    max: 300000,
    avg: 225000,
  },
  nagoya: {
    min: 150000,
    max: 350000,
    avg: 250000,
  },
  fukuoka: {
    min: 150000,
    max: 300000,
    avg: 225000,
  },
  sapporo: {
    min: 300000,
    max: 600000,
    avg: 450000,
  },
} as const;

const dailyHotelCosts = {
  1: {
    min: 50000,
    max: 100000,
    avg: 75000,
  },
  2: {
    min: 40000,
    max: 80000,
    avg: 60000,
  },
  default: {
    min: 40000,
    max: 60000,
    avg: 50000,
  },
} as const;

const extraOptionCosts = {
  drink: {
    daily: 30000,
    total: 0,
  },
  busy: {
    daily: 10000,
    total: 100000,
  },
} as const;

export type LocationEntry = (typeof locationEntries)[number];
export { locationEntries, locationCosts, dailyHotelCosts, extraOptionCosts };
