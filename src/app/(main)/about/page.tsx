import Link from "next/link";
import {
  BadgeCheck,
  ClipboardCheck,
  Gauge,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMarketStats } from "@/lib/data/facets";
import { formatNumber } from "@/lib/vehicle-format";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  alternates: { canonical: "/about" },
  title: "About us",
  description:
    "Royal Cars is a car marketplace for Jordan. Listings carry mileage, spec origin and agency-import status, and put you in touch with the seller directly.",
};

/**
 * About page.
 *
 * The previous copy claimed things the product does not do: that every
 * vehicle is "inspected and verified before listing", that every listing
 * "comes with a verified Carseer inspection report", and that every dealer is
 * personally vetted. None of that is backed by anything in the system. It
 * also printed a hardcoded office address, two phone numbers and two email
 * addresses.
 *
 * What is below describes the product as it actually works, and contact
 * details come from the environment, so nothing is invented.
 */

const WHAT_IT_DOES = [
  {
    icon: Search,
    title: "Search that matches how people shop",
    body: "Filter by price in JOD, mileage, year, body type, fuel, transmission, spec origin and agency import. Every filter combination is a shareable link.",
  },
  {
    icon: BadgeCheck,
    title: "Agency import as a first-class field",
    body: "Whether a car came through the official agency (وارد وكالة) is stored on the listing and filterable, not buried in a paragraph of description.",
  },
  {
    icon: Gauge,
    title: "The numbers that decide it, upfront",
    body: "Asking price in full, kilometres, fuel, transmission and regional spec appear on the card itself, so comparing two cars does not mean opening both.",
  },
  {
    icon: MessageCircle,
    title: "Straight to the seller",
    body: "Every listing carries a WhatsApp number. No enquiry forms, no lead routing, no waiting for someone to call back.",
  },
];

const HONEST_LIMITS = [
  {
    icon: ClipboardCheck,
    title: "Inspection reports come from sellers",
    body: "Where a seller attaches a فحص report we show it in full and label it as theirs. Royal Cars does not carry out inspections and does not verify the reports it displays.",
  },
  {
    icon: Globe,
    title: "Listings are seller-supplied",
    body: "Prices, mileage and specification are entered by the dealer or private seller who owns the listing. Treat them as the starting point of a conversation, not a guarantee.",
  },
];

export default async function AboutPage() {
  const stats = await getMarketStats();
  const { phone, email, address } = siteConfig.contact;
  const hasContact = Boolean(phone || email || address);

  return (
    <div className="bg-canvas">
      <section className="bg-inverse">
        <div className="mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="max-w-3xl font-display text-display text-inverse-ink sm:text-hero">
            A car marketplace built for how people actually buy in Jordan
          </h1>
          <p className="mt-5 max-w-2xl text-lead leading-relaxed text-inverse-ink-2">
            Royal Cars lists {formatNumber(stats.onSale)} cars from{" "}
            {formatNumber(stats.dealerships)}{" "}
            {stats.dealerships === 1 ? "dealership" : "dealerships"} and private
            sellers across the country, and gets you to the person selling the
            car in one tap.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 px-6 text-body">
            <Link href="/cars">Browse cars</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-display text-h2 text-ink">What the site does</h2>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {WHAT_IT_DOES.map((item) => (
            <li key={item.title} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-brand-soft text-brand-strong"
              >
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-body font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-body-sm leading-relaxed text-ink-2">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-display text-h2 text-ink">
            What it does not do
          </h2>
          <p className="mt-2 max-w-prose text-body-sm text-ink-2">
            Being clear about this matters more than a badge. Here is what we
            do not claim.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {HONEST_LIMITS.map((item) => (
              <li key={item.title} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-surface-2 text-ink-2"
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-body font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-body-sm leading-relaxed text-ink-2">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {hasContact && (
        <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-display text-h2 text-ink">Get in touch</h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" aria-hidden="true" />
                <span className="text-body-sm text-ink-2">{address}</span>
              </li>
            )}
            {phone && (
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" aria-hidden="true" />
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-body-sm text-ink-2 hover:text-brand-strong hover:underline"
                >
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" aria-hidden="true" />
                <a
                  href={`mailto:${email}`}
                  className="text-body-sm text-ink-2 hover:text-brand-strong hover:underline"
                >
                  {email}
                </a>
              </li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
