import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getBodyTypeFacets,
  getBrandFacets,
  getBudgetFacets,
} from "@/lib/data/facets";
import { getActiveDealerships } from "@/lib/data/dealerships";
import { BODY_LABEL, formatNumber } from "@/lib/vehicle-format";
import BodySilhouette from "./body-silhouette";

/**
 * Browse entry points.
 *
 * These replace four generic value-proposition cards ("100% Verified",
 * "Transparent Pricing") that told a visitor nothing and led nowhere. Each
 * tile here is a real query with a real count and a destination.
 */

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="font-display text-h2 text-ink">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-body-sm font-semibold text-brand-strong hover:underline"
        >
          {linkLabel ?? "See all"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export async function BrowseByBodyType() {
  const facets = await getBodyTypeFacets();
  if (facets.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading title="Browse by body type" href="/cars" linkLabel="All cars" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {facets.map((f) => (
          <li key={f.bodyType}>
            <Link
              href={`/cars?bodyType=${f.bodyType}`}
              className="flex h-full flex-col items-start gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-control"
            >
              <BodySilhouette
                bodyType={f.bodyType}
                className="h-8 w-20 text-ink-2"
              />
              <span className="text-body font-semibold text-ink">
                {BODY_LABEL[f.bodyType] ?? f.bodyType}
              </span>
              <span className="text-body-sm text-ink-3 tabular-nums">
                {formatNumber(f.count)} cars
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function BrowseByBudget() {
  const bands = await getBudgetFacets();
  const withStock = bands.filter((b) => b.count > 0);
  if (withStock.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <SectionHeading title="Browse by budget" />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {withStock.map((band) => {
            const params = new URLSearchParams();
            if (band.min != null) params.set("minPrice", String(band.min));
            if (band.max != null) params.set("maxPrice", String(band.max));
            return (
              <li key={band.label}>
                <Link
                  href={`/cars?${params.toString()}`}
                  className="flex h-full flex-col gap-1 rounded-card border border-line bg-surface p-4 transition-colors hover:border-brand"
                >
                  <span className="text-caption font-semibold uppercase tracking-[0.06em] text-ink-3">
                    JOD
                  </span>
                  <span className="font-display text-lead text-ink">
                    {band.label}
                  </span>
                  <span className="mt-auto pt-2 text-body-sm text-ink-3 tabular-nums">
                    {formatNumber(band.count)} cars
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Brand tiles.
 *
 * The previous strip pulled 14 logo PNGs from carlogos.org, unoptimised and
 * of uncertain licensing, and silently degraded to two-letter initials
 * whenever that host was unreachable. A wordmark tile with a live count says
 * more, costs no requests, and cannot break.
 */
export async function BrowseByBrand() {
  const brands = await getBrandFacets(12);
  if (brands.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading title="Browse by brand" href="/cars" linkLabel="All brands" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <li key={b.brand}>
            <Link
              href={`/cars?brand=${encodeURIComponent(b.brand)}`}
              className="flex h-full flex-col justify-between gap-2 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-control"
            >
              <span className="font-display text-body leading-tight text-ink">
                {b.brand}
              </span>
              <span className="text-body-sm text-ink-3 tabular-nums">
                {formatNumber(b.count)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function DealerStrip() {
  const dealers = await getActiveDealerships(6);
  if (dealers.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <SectionHeading
          title="Dealers with cars listed"
          href="/dealers"
          linkLabel="All dealers"
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dealers.map((d) => (
            <li key={d.id}>
              <Link
                href={`/dealers/${d.slug}`}
                className="flex h-full items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-control"
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-brand-soft font-display text-lead text-brand-strong"
                >
                  {d.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-body font-semibold text-ink">
                    {d.name}
                  </span>
                  <span className="block text-body-sm text-ink-3 tabular-nums">
                    {formatNumber(d.listingCount)}{" "}
                    {d.listingCount === 1 ? "car" : "cars"}
                    {d.address ? ` · ${d.address.split(",")[0]}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
