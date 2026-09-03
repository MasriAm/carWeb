/**
 * Display formatting for vehicle data.
 *
 * Prices are shown in full. The old card rendered "45K" for a 45,000 JOD car
 * and "3K" for a 3,000 JOD one — an abbreviation appropriate to a dashboard
 * metric, not to the number a person is deciding whether to spend.
 */

export const FUEL_LABEL: Record<string, string> = {
  GAS: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
};

export const TRANSMISSION_LABEL: Record<string, string> = {
  AUTO: "Automatic",
  MANUAL: "Manual",
};

export const BODY_LABEL: Record<string, string> = {
  SUV: "SUV",
  SEDAN: "Sedan",
  COUPE: "Coupe",
  HATCHBACK: "Hatchback",
  CONVERTIBLE: "Convertible",
  PICKUP: "Pickup",
  VAN: "Van",
  WAGON: "Wagon",
};

export const CONDITION_LABEL: Record<string, string> = {
  NEW: "New",
  USED: "Used",
};

export const SPEC_ORIGIN_LABEL: Record<string, string> = {
  GCC: "Gulf spec",
  US: "US spec",
  EU: "European spec",
  KOREAN: "Korean spec",
  JAPANESE: "Japanese spec",
  OTHER: "Other spec",
};

const numberFormat = new Intl.NumberFormat("en-JO");

/** "45,000" — the exact figure, always. */
export function formatPriceJOD(price: number): string {
  return numberFormat.format(price);
}

/** "45,000 JOD" for places that need the unit inline. */
export function formatPriceWithUnit(price: number): string {
  return `${numberFormat.format(price)} JOD`;
}

export function formatKm(km: number): string {
  return `${numberFormat.format(km)} km`;
}

export function formatNumber(n: number): string {
  return numberFormat.format(n);
}

/**
 * "2019 Toyota Prado VX" — the order people say it out loud, which is also
 * the order they scan for.
 */
export function vehicleTitle(v: {
  productionYear: number;
  brand: string;
  model: string;
}): string {
  return `${v.productionYear} ${v.brand} ${v.model}`;
}

/** Relative listing age, e.g. "Listed 3 days ago". */
export function listedAgo(date: Date, now: Date = new Date()): string {
  const days = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 86_400_000
  );
  if (days <= 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 30) return `Listed ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "Listed last month";
  if (months < 12) return `Listed ${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "Listed last year" : `Listed ${years} years ago`;
}
