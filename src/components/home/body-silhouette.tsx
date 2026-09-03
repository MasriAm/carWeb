/**
 * Schematic side profiles for the body-type tiles.
 *
 * Drawn rather than iconified because the thing that separates a wagon from a
 * hatchback is the roofline, and no generic icon set carries that. Each shape
 * exaggerates the one feature that identifies the body type — roof length,
 * roof height, rear slope, open bed — so they stay legible at 80px wide.
 */

const PATHS: Record<string, string> = {
  // Three-box: bonnet, cabin, boot.
  SEDAN:
    "M4 20v-5c0-2 .6-2.5 3-2.9L18 11l6-5.5c.8-.7 1.4-1 2.6-1h11.8c1.3 0 2 .3 2.6 1L47 11l10 1.1c2.4.4 3 .9 3 2.9v5z",
  // Tall cabin, long flat roof, high body.
  SUV:
    "M4 20v-7c0-2 .6-2.5 3-2.9L15 9.4l5-6c.7-.8 1.4-1.1 2.6-1.1h21.8c1.2 0 1.9.3 2.6 1.1l5 6 7.6.7c2.4.4 3 .9 3 2.9V20z",
  // Short body, roof drops steeply straight to the tail.
  HATCHBACK:
    "M7 20v-6c0-2 .6-2.5 3-2.9l7.5-.8 5-6c.7-.8 1.4-1.1 2.6-1.1H44l9 9.9c2.2.4 3 .9 3 2.9V20z",
  // Roof runs all the way back, then falls vertically.
  WAGON:
    "M4 20v-6c0-2 .6-2.5 3-2.9L15 10.4l5-6c.7-.8 1.4-1.1 2.6-1.1H56c2 0 2.6.9 2.6 2.6V20z",
  // Low roof peaking forward, long fastback tail.
  COUPE:
    "M4 20v-5c0-2 .6-2.5 3-2.9L17.5 11 27 5.4c1-.6 1.7-.9 3-.9h5.4c1.4 0 2.2.4 3 1.4L54 12.5c2.6.5 3.6 1 3.6 3V20z",
  // No roof at all: a windscreen and an open cabin.
  CONVERTIBLE:
    "M4 20v-6c0-2 .6-2.5 3-2.9L21 10.3l5.6-5.5 1.6 5.5 27 1c2.4.4 3 .9 3 2.9V20z",
  // Tall short cab in front, open flat bed behind.
  PICKUP:
    "M5 20v-6c0-2 .6-2.5 3-2.9l7-.7 5-6c.7-.8 1.4-1.1 2.6-1.1h10c1.6 0 2.4.9 2.4 2.6V11h24v9z",
  // One tall box from windscreen to tail.
  VAN:
    "M4 20V10.2l7-6.4c.8-.7 1.5-1 2.7-1h40.7c2.4 0 3.6 1.2 3.6 3.4V20z",
};

export default function BodySilhouette({
  bodyType,
  className,
}: {
  bodyType: string;
  className?: string;
}) {
  const path = PATHS[bodyType] ?? PATHS.SEDAN;

  return (
    <svg
      viewBox="0 0 64 26"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} fill="currentColor" />
      <circle cx="18" cy="20" r="4" fill="currentColor" />
      <circle cx="46" cy="20" r="4" fill="currentColor" />
      {/* Hubs knocked back out so the wheels read as wheels, not blobs. */}
      <circle cx="18" cy="20" r="1.6" className="fill-surface" />
      <circle cx="46" cy="20" r="1.6" className="fill-surface" />
    </svg>
  );
}
