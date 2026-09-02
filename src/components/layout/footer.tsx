import Link from "next/link";
import { Crown, Mail, MapPin, Phone } from "lucide-react";
import {
  siteConfig,
  instagramLink,
  whatsappLink,
} from "@/lib/site-config";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";

/* Evaluated once when the module loads, not per render. Reading the clock
   during render would make every page that includes the footer dynamic. */
const COPYRIGHT_YEAR = new Date().getFullYear();

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Browse cars" },
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "About us" },
];

export default function Footer() {
  const { whatsapp, instagram, phone, email, address } = siteConfig.contact;
  const hasContact = Boolean(whatsapp || instagram || phone || email || address);

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Crown className="h-6 w-6 text-brand-strong" />
              <span className="text-lg font-bold text-ink">Royal Cars</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-3">
              Browse cars for sale across Jordan. Every listing shows its
              agency-import status, mileage and asking price in JOD, with the
              seller one message away on WhatsApp.
            </p>

            {(whatsapp || instagram) && (
              <div className="mt-5 flex items-center gap-3">
                {whatsapp && (
                  <a
                    href={whatsappLink(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact Royal Cars on WhatsApp"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-line-control hover:text-ink"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5" />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagramLink(instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Royal Cars on Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-line-control hover:text-ink"
                  >
                    <InstagramIcon className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-strong">
              Quick links
            </h2>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-3 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasContact && (
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-strong">
                Contact
              </h2>
              <ul className="space-y-2.5 text-sm text-ink-3">
                {address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
                    <span>{address}</span>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-ink-3" />
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-ink"
                    >
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-ink-3" />
                    <a
                      href={`mailto:${email}`}
                      className="transition-colors hover:text-ink"
                    >
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center text-xs text-ink-3">
          &copy; {COPYRIGHT_YEAR} Royal Cars Jordan. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
