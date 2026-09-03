import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { getMarketStats } from "@/lib/data/facets";
import { getFeaturedVehicles } from "@/lib/data/vehicles";
import { formatNumber } from "@/lib/vehicle-format";
import HeroSearch from "./hero-search";

/**
 * Landing hero.
 *
 * Replaces four auto-rotating gradient panels that showed no car, changed
 * the headline every five seconds with no way to pause, and sat above four
 * invented statistics.
 *
 * What is here instead: a real photograph from current inventory, a headline
 * that states how many cars are actually on the site right now, and a search
 * box as the first interactive element. Nothing rotates and nothing animates
 * in — the copy is readable in the first frame.
 */
export default async function Hero() {
  const [stats, featured] = await Promise.all([
    getMarketStats(),
    getFeaturedVehicles(1),
  ]);

  const backdrop = featured[0]?.imageUrls[0];

  return (
    <section className="relative isolate overflow-hidden bg-inverse">
      {backdrop && (
        <>
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          {/* Keeps the copy legible whatever the photograph is doing. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-inverse via-inverse/85 to-inverse/40"
          />
        </>
      )}

      <div className="relative mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-inverse-ink/20 px-3 py-1 text-caption font-semibold uppercase tracking-[0.08em] text-inverse-ink-2">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(stats.agencyImports)} agency imports listed
          </p>

          <h1 className="mt-5 font-display text-display text-inverse-ink sm:text-hero">
            {formatNumber(stats.onSale)} cars for sale in Jordan
          </h1>

          <p className="mt-4 max-w-xl text-lead text-inverse-ink-2">
            Filter by price in JOD, mileage and agency-import status, then
            message the seller straight from the listing.
          </p>

          <HeroSearch className="mt-7" />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-body-sm text-inverse-ink-2">Popular:</span>
            {[
              { label: "Under 10,000 JOD", href: "/cars?maxPrice=10000" },
              { label: "Agency import", href: "/cars?agency=1" },
              { label: "SUVs", href: "/cars?bodyType=SUV" },
              { label: "Hybrid", href: "/cars?fuelType=HYBRID" },
              { label: "2020 and newer", href: "/cars?minYear=2020" },
            ].map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="inline-flex min-h-9 items-center rounded-full border border-inverse-ink/25 px-3 text-body-sm text-inverse-ink transition-colors hover:bg-inverse-ink/10"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Real numbers, each one a query. */}
      <div className="relative border-t border-inverse-ink/10">
        <dl className="mx-auto grid max-w-page grid-cols-2 divide-x divide-inverse-ink/10 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { label: "Cars on sale", value: stats.onSale },
            { label: "Agency imports", value: stats.agencyImports },
            { label: "Brands", value: stats.brands },
            { label: "Dealerships", value: stats.dealerships },
          ].map((stat, i) => (
            <div key={stat.label} className={i === 0 ? "py-4 pe-4" : "px-4 py-4"}>
              <dt className="text-caption text-inverse-ink-2">{stat.label}</dt>
              <dd className="mt-0.5 font-display text-title text-inverse-ink">
                {formatNumber(stat.value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
