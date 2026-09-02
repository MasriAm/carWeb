/**
 * Non-linear scales for the price and mileage sliders.
 *
 * A linear 0–500,000 JOD track put the 5,000–40,000 band — where most of the
 * Jordanian market actually sits — inside the first 7% of the slider. At the
 * sidebar's width that made one pixel worth about 2,170 JOD, so the control
 * was least usable for exactly the buyers who needed it most.
 *
 * Rather than a pure logarithm, which produces unreadable stop values, the
 * slider steps through an array of round numbers that get coarser as the
 * figure grows. Every position lands on something a person would say out
 * loud, and the dense part of the market gets most of the track.
 */

type Band = { until: number; step: number };

function buildStops(bands: Band[], max: number): number[] {
  const stops = [0];
  let current = 0;

  for (const band of bands) {
    while (current < band.until) {
      current += band.step;
      stops.push(current);
      if (current >= max) return stops;
    }
  }

  // Past the last band, keep the coarsest step until the ceiling is covered.
  const step = bands[bands.length - 1].step;
  while (current < max) {
    current += step;
    stops.push(current);
  }
  return stops;
}

const PRICE_BANDS: Band[] = [
  { until: 20_000, step: 1_000 },
  { until: 50_000, step: 2_500 },
  { until: 100_000, step: 5_000 },
  { until: 200_000, step: 10_000 },
  { until: 500_000, step: 25_000 },
];

const KM_BANDS: Band[] = [
  { until: 100_000, step: 10_000 },
  { until: 200_000, step: 25_000 },
  { until: 500_000, step: 50_000 },
];

export function priceStops(maxPrice: number): number[] {
  return buildStops(PRICE_BANDS, Math.max(maxPrice, 20_000));
}

export function kmStops(maxKm: number): number[] {
  return buildStops(KM_BANDS, Math.max(maxKm, 100_000));
}

/** Nearest slider index for a value. */
export function valueToIndex(stops: number[], value: number): number {
  let best = 0;
  let bestDelta = Infinity;
  for (let i = 0; i < stops.length; i++) {
    const delta = Math.abs(stops[i] - value);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  return best;
}

export function indexToValue(stops: number[], index: number): number {
  const clamped = Math.max(0, Math.min(stops.length - 1, Math.round(index)));
  return stops[clamped];
}
