/**
 * Site-level contact and identity values.
 *
 * Everything here is optional and read from the environment. A value that is
 * not configured is simply not rendered — the site never ships a placeholder
 * phone number or a link to an account that may not exist.
 *
 * Read from server components only.
 */

import { normalizeOrigin } from "@/lib/normalize-origin";

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Digits only, no `+`, as wa.me expects. */
function whatsappDigits(value: string | undefined): string | null {
  const digits = clean(value)?.replace(/[^0-9]/g, "");
  return digits && digits.length >= 7 ? digits : null;
}

/**
 * The site's absolute origin.
 *
 * `layout.tsx` passes this to `new URL()` for `metadataBase`, which throws on
 * anything that is not absolute — and the failure surfaces during the build as
 * `TypeError: Invalid URL` while collecting `/_not-found`, naming neither this
 * variable nor the value that broke it.
 *
 * A missing scheme is repaired rather than rejected; anything still unusable
 * gets an error that names the variable to go and look at.
 */
function siteUrl(): string {
  const raw = clean(process.env.NEXT_PUBLIC_APP_URL);
  if (!raw) return "http://localhost:3000";

  const normalized = normalizeOrigin(raw);
  if (!normalized) {
    throw new Error(
      `NEXT_PUBLIC_APP_URL is not a usable URL: ${JSON.stringify(raw)}.\n` +
        `  Expected an absolute origin, for example https://royalcars.jo`
    );
  }
  return normalized;
}

export const siteConfig = {
  name: "Royal Cars",
  /** Used for canonical URLs, sitemap, Open Graph. */
  url: siteUrl(),
  contact: {
    whatsapp: whatsappDigits(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP),
    instagram: clean(process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    address: clean(process.env.NEXT_PUBLIC_CONTACT_ADDRESS),
  },
} as const;

export function whatsappLink(digits: string, message?: string): string {
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function instagramLink(handle: string): string {
  const clean = handle.replace(/^@/, "");
  return `https://instagram.com/${clean}`;
}
