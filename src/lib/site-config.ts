/**
 * Site-level contact and identity values.
 *
 * Everything here is optional and read from the environment. A value that is
 * not configured is simply not rendered — the site never ships a placeholder
 * phone number or a link to an account that may not exist.
 *
 * Read from server components only.
 */

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Digits only, no `+`, as wa.me expects. */
function whatsappDigits(value: string | undefined): string | null {
  const digits = clean(value)?.replace(/[^0-9]/g, "");
  return digits && digits.length >= 7 ? digits : null;
}

export const siteConfig = {
  name: "Royal Cars",
  /** Used for canonical URLs, sitemap, Open Graph. */
  url:
    clean(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
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
