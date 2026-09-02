import Link from "next/link";
import { Crown, Mail, MapPin, Phone } from "lucide-react";
import {
  siteConfig,
  instagramLink,
  whatsappLink,
} from "@/lib/site-config";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";

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
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Crown className="h-6 w-6 text-amber-500" />
              <span className="text-lg font-bold text-white">Royal Cars</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
                  >
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagramLink(instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Royal Cars on Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
                  >
                    <InstagramIcon className="h-[18px] w-[18px]" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">
              Quick links
            </h2>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasContact && (
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">
                Contact
              </h2>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                {address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                    <span>{address}</span>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-zinc-600" />
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-white"
                    >
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-zinc-600" />
                    <a
                      href={`mailto:${email}`}
                      className="transition-colors hover:text-white"
                    >
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} Royal Cars Jordan. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
