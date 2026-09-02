import { BadgeCheck, ClipboardCheck, Gauge, MessageCircle } from "lucide-react";

/**
 * What the product actually does.
 *
 * Replaces claims the database cannot back ("100% Verified", "Every listing
 * is verified", "verified Carseer inspection report"). Each line here
 * describes a field that exists on every listing or a behaviour the site
 * genuinely has.
 */
const POINTS = [
  {
    icon: MessageCircle,
    title: "Message the seller directly",
    body: "Every listing carries the seller's WhatsApp number. No forms, no lead routing, no waiting for a callback.",
  },
  {
    icon: BadgeCheck,
    title: "Agency import shown upfront",
    body: "Whether a car came through the official agency (وارد وكالة) is a field on the listing and a filter, not something buried in the description.",
  },
  {
    icon: Gauge,
    title: "Mileage and spec on every card",
    body: "Kilometres, fuel, transmission and regional spec are on the card itself, so comparing two listings does not mean opening both.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection notes where the seller provides them",
    body: "Sellers can attach their فحص report to a listing. Where one exists you will see it in full; where it does not, we do not pretend otherwise.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-display text-h2 text-ink">
          How buying works here
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {POINTS.map((point) => (
            <li key={point.title} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-brand-soft text-brand-strong"
              >
                <point.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-body font-semibold text-ink">
                  {point.title}
                </h3>
                <p className="mt-1 text-body-sm leading-relaxed text-ink-2">
                  {point.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
