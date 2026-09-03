import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Globe, MapPin, Phone } from "lucide-react";
import BidiText from "@/components/bidi-text";
import { getDealershipBySlug, getDealershipSlugs } from "@/lib/data/dealerships";
import { getVehicles } from "@/lib/data/vehicles";
import { getSavedVehicleIds, getSessionUser } from "@/lib/data/session";
import { vehicleFilterSchema } from "@/lib/validations/vehicle";
import { filtersFromSearchParams } from "@/lib/filter-params";
import { formatNumber } from "@/lib/vehicle-format";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink } from "@/lib/site-config";
import CarGrid from "@/components/cars/car-grid";
import CarGridSkeleton from "@/components/cars/car-grid-skeleton";
import Pagination from "@/components/cars/pagination";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import {
  BreadcrumbJsonLd,
  DealerJsonLd,
} from "@/components/cars/detail/structured-data";

type SearchParams = Record<string, string | string[] | undefined>;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

/**
 * Dealers are few and change rarely, so every dealer page is prerendered at
 * build time. That also makes `params` known ahead of the request, which lets
 * the page shell render statically with only the listings streaming in.
 *
 * Cache Components requires at least one param: an empty array fails the build
 * with `empty-generate-static-params`, because Next.js needs one path to
 * prerender in order to validate the route's static shell. A database with no
 * dealerships in it is not a broken state — it is every deployment before the
 * first dealer signs up — so fall back to one placeholder slug. Nothing links
 * to it and `notFound()` handles the request; it exists only to give the build
 * a shell to validate. Slugs that are not listed here are still served: Next
 * prerenders the shell and streams the dealer in at request time.
 */
const SHELL_SLUG = "__shell__";

export async function generateStaticParams() {
  const slugs = await getDealershipSlugs();
  if (slugs.length === 0) return [{ slug: SHELL_SLUG }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dealer = await getDealershipBySlug(slug);
  if (!dealer) return { title: "Dealer not found" };

  return {
    title: dealer.name,
    description:
      dealer.description ??
      `${dealer.name} has ${dealer._count.vehicles} cars for sale on Royal Cars.`,
    alternates: { canonical: `/dealers/${dealer.slug}` },
    openGraph: {
      title: dealer.name,
      description:
        dealer.description ?? `Cars for sale from ${dealer.name} in Jordan.`,
      url: `${siteConfig.url}/dealers/${dealer.slug}`,
      images: dealer.logoUrl ? [{ url: dealer.logoUrl }] : undefined,
    },
  };
}

export default async function DealerPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const dealer = await getDealershipBySlug(slug);
  if (!dealer) notFound();

  const crumbs = [
    { name: "Dealers", href: "/dealers" },
    { name: dealer.name, href: `/dealers/${dealer.slug}` },
  ];

  const whatsapp = dealer.whatsappNumber?.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-canvas">
      <DealerJsonLd dealer={dealer} />
      <BreadcrumbJsonLd items={crumbs} />

      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-page px-4 py-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-body-sm text-ink-3">
              {crumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-ink-2">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-brand-strong hover:underline">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-wrap items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card bg-brand-soft font-display text-display text-brand-strong"
            >
              {dealer.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-h2 text-ink">{dealer.name}</h1>
              <p className="mt-1 text-body-sm text-ink-3 tabular-nums">
                {formatNumber(dealer._count.vehicles)}{" "}
                {dealer._count.vehicles === 1 ? "car" : "cars"} for sale
              </p>
              {dealer.description && (
                <p className="mt-3 max-w-prose text-body-sm leading-relaxed text-ink-2">
                  <BidiText text={dealer.description} />
                </p>
              )}

              <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-ink-2">
                {dealer.address && (
                  <li className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                    {dealer.address}
                  </li>
                )}
                {dealer.phone && (
                  <li className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                    <a
                      href={`tel:${dealer.phone.replace(/\s/g, "")}`}
                      className="hover:text-brand-strong hover:underline"
                    >
                      {dealer.phone}
                    </a>
                  </li>
                )}
                {dealer.website && (
                  <li className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                    <a
                      href={dealer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-strong hover:underline"
                    >
                      {dealer.website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {whatsapp && (
              <a
                href={whatsappLink(
                  whatsapp,
                  `Hi ${dealer.name}, I saw your listings on Royal Cars.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-control bg-wa px-4 text-body-sm font-semibold text-white transition-colors hover:bg-wa-hover"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Message dealer
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-page px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<CarGridSkeleton />}>
          <DealerListings slug={dealer.slug} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function DealerListings({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const filters = vehicleFilterSchema.parse({
    ...filtersFromSearchParams(raw),
    dealer: slug,
  });

  const [{ vehicles, featured, total, page, totalPages }, savedIds, user] =
    await Promise.all([
      getVehicles(filters),
      getSavedVehicleIds(),
      getSessionUser(),
    ]);

  const all = [...featured, ...vehicles];

  if (all.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface px-6 py-14 text-center text-body text-ink-2">
        This dealer has no cars listed right now.
      </p>
    );
  }

  return (
    <>
      <p className="mb-4 text-body-sm text-ink-2">
        <span className="font-semibold text-ink tabular-nums">
          {formatNumber(total)}
        </span>{" "}
        {total === 1 ? "car" : "cars"}
      </p>
      <CarGrid
        vehicles={all}
        savedIds={savedIds}
        isLoggedIn={Boolean(user)}
        featuredIds={featured.map((v) => v.id)}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        searchParams={raw}
      />
    </>
  );
}
