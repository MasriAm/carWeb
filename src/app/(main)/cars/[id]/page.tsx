import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  Cog,
  Fuel,
  Gauge,
  Globe,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck,
  Store,
  TrendingDown,
} from "lucide-react";
import {
  getPriceContext,
  getSimilarVehicles,
  getVehicleById,
} from "@/lib/data/vehicles";
import { getSessionUser, isVehicleSaved } from "@/lib/data/session";
import { contactNumberFor, whatsappVehicleLink } from "@/lib/vehicle-contact";
import {
  BODY_LABEL,
  CONDITION_LABEL,
  FUEL_LABEL,
  SPEC_ORIGIN_LABEL,
  TRANSMISSION_LABEL,
  formatKm,
  formatNumber,
  formatPriceJOD,
  listedAgo,
  vehicleTitle,
} from "@/lib/vehicle-format";
import { siteConfig } from "@/lib/site-config";
import BidiText from "@/components/bidi-text";
import CarGrid from "@/components/cars/car-grid";
import SaveButton from "@/components/cars/save-button";
import WhatsAppButton from "@/components/cars/whatsapp-button";
import Gallery from "@/components/cars/detail/gallery";
import InstagramEmbed from "@/components/cars/detail/instagram-embed";
import ShareButton from "@/components/cars/detail/share-button";
import TrackView from "@/components/cars/detail/track-view";
import {
  BreadcrumbJsonLd,
  VehicleJsonLd,
} from "@/components/cars/detail/structured-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return { title: "Vehicle not found" };

  const title = vehicleTitle(vehicle);
  const description = `${title} for sale in Jordan at ${formatPriceJOD(
    vehicle.price
  )} JOD. ${formatKm(vehicle.mileageKm)}, ${
    FUEL_LABEL[vehicle.fuelType] ?? vehicle.fuelType
  }, ${TRANSMISSION_LABEL[vehicle.transmission] ?? vehicle.transmission}.`;

  return {
    // No " — Royal Cars" suffix here: the root layout's template already
    // appends it, which produced "… — Royal Cars | Royal Cars".
    title,
    description,
    alternates: { canonical: `/cars/${vehicle.id}` },
    openGraph: {
      title: `${title} — ${formatPriceJOD(vehicle.price)} JOD`,
      description,
      url: `${siteConfig.url}/cars/${vehicle.id}`,
      type: "website",
      // A car link pasted into WhatsApp previously showed no photo at all.
      images: vehicle.imageUrls.length
        ? [{ url: vehicle.imageUrls[0], alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${formatPriceJOD(vehicle.price)} JOD`,
      description,
      images: vehicle.imageUrls.slice(0, 1),
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const isSold = vehicle.status === "SOLD";
  const contact = contactNumberFor(vehicle);
  const whatsappHref = contact
    ? whatsappVehicleLink(contact, vehicle, siteConfig.url)
    : null;

  const specs = Array.isArray(vehicle.detailedSpecs)
    ? (vehicle.detailedSpecs as string[])
    : [];

  const crumbs = [
    { name: "Cars", href: "/cars" },
    { name: vehicle.brand, href: `/cars?brand=${encodeURIComponent(vehicle.brand)}` },
    { name: title, href: `/cars/${vehicle.id}` },
  ];

  const facts = [
    { icon: Calendar, label: "Year", value: String(vehicle.productionYear) },
    { icon: Gauge, label: "Mileage", value: formatKm(vehicle.mileageKm) },
    { icon: Fuel, label: "Fuel", value: FUEL_LABEL[vehicle.fuelType] ?? vehicle.fuelType },
    { icon: Cog, label: "Transmission", value: TRANSMISSION_LABEL[vehicle.transmission] ?? vehicle.transmission },
    { icon: Settings2, label: "Body", value: BODY_LABEL[vehicle.bodyType] ?? vehicle.bodyType },
    { icon: ShieldCheck, label: "Condition", value: CONDITION_LABEL[vehicle.condition] ?? vehicle.condition },
    ...(vehicle.engineCapacityCC
      ? [{ icon: Gauge, label: "Engine", value: `${formatNumber(vehicle.engineCapacityCC)} cc` }]
      : []),
    ...(vehicle.specOrigin
      ? [{ icon: Globe, label: "Spec", value: SPEC_ORIGIN_LABEL[vehicle.specOrigin] }]
      : []),
  ];

  return (
    <div className={`bg-canvas lg:pb-16 ${!isSold && whatsappHref ? "pb-24" : "pb-10"}`}>
      <VehicleJsonLd vehicle={vehicle} />
      <BreadcrumbJsonLd items={crumbs} />
      <TrackView id={vehicle.id} title={title} price={vehicle.price} />

      <div className="mx-auto max-w-page px-4 py-5 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-3">
            <Gallery
              images={vehicle.imageUrls}
              videoUrl={vehicle.videoUrl}
              title={title}
            />

            <section className="rounded-card border border-line bg-surface p-5">
              <h2 className="mb-4 text-body font-semibold text-ink">
                Key facts
              </h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-start gap-2.5">
                    <fact.icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-ink-3"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="text-caption text-ink-3">{fact.label}</dt>
                      <dd className="truncate text-body-sm font-medium text-ink">
                        {fact.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-card border border-line bg-surface p-5">
              <h2 className="mb-2 text-body font-semibold text-ink">
                About this car
              </h2>
              <p className="whitespace-pre-line text-body-sm leading-relaxed text-ink-2">
                <BidiText text={vehicle.shortDescription} />
              </p>
            </section>

            {vehicle.fa7s && (
              <section className="rounded-card border border-line bg-surface p-5">
                <h2 className="mb-2 flex items-center gap-2 text-body font-semibold text-ink">
                  <ClipboardCheck className="h-4 w-4 text-ink-3" aria-hidden="true" />
                  Inspection notes
                  <span lang="ar" dir="rtl" className="font-normal text-ink-3">
                    (فحص)
                  </span>
                </h2>
                <p className="whitespace-pre-line text-body-sm leading-relaxed text-ink-2">
                  <BidiText text={vehicle.fa7s} />
                </p>
                <p className="mt-3 text-caption text-ink-3">
                  Provided by the seller. Royal Cars does not independently
                  verify inspection reports.
                </p>
              </section>
            )}

            {specs.length > 0 && (
              <section className="rounded-card border border-line bg-surface p-5">
                <h2 className="mb-3 text-body font-semibold text-ink">
                  Features
                </h2>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-start gap-2 text-body-sm text-ink-2"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {spec}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {vehicle.instagramVideoUrl && (
              <InstagramEmbed url={vehicle.instagramVideoUrl} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:col-span-2">
            <section className="rounded-card border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-title font-semibold text-ink">{title}</h1>
                  <p className="mt-1 text-body-sm text-ink-3">
                    {listedAgo(vehicle.publicationDate)}
                  </p>
                </div>
                {isSold && (
                  <span className="shrink-0 rounded-control bg-ink px-2.5 py-1 text-caption font-bold uppercase text-inverse-ink">
                    Sold
                  </span>
                )}
              </div>

              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-display text-ink">
                  {formatPriceJOD(vehicle.price)}
                </span>
                <span className="text-lead font-semibold text-ink-3">JOD</span>
              </p>

              <Suspense fallback={null}>
                <PriceContext vehicleId={vehicle.id} price={vehicle.price} />
              </Suspense>

              {(vehicle.waredWakaleh || vehicle.specOrigin) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {vehicle.waredWakaleh && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-trust-soft px-2.5 py-1 text-caption font-semibold text-trust">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Agency import
                      <span lang="ar" dir="rtl">
                        (وارد وكالة)
                      </span>
                    </span>
                  )}
                  {vehicle.specOrigin && (
                    <span className="inline-flex items-center rounded-full bg-surface-2 px-2.5 py-1 text-caption font-semibold text-ink-2">
                      {SPEC_ORIGIN_LABEL[vehicle.specOrigin]}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-5 flex items-center gap-2">
                {whatsappHref && !isSold && (
                  <WhatsAppButton href={whatsappHref} label={title} />
                )}
                <Suspense fallback={<SaveFallback />}>
                  <SaveSlot vehicleId={vehicle.id} title={title} />
                </Suspense>
                <ShareButton title={title} />
              </div>
            </section>

            {vehicle.dealership ? (
              <section className="rounded-card border border-line bg-surface p-5">
                <h2 className="mb-3 text-body font-semibold text-ink">Seller</h2>
                <Link
                  href={`/dealers/${vehicle.dealership.slug}`}
                  className="flex items-center gap-3 rounded-control p-1 -m-1 transition-colors hover:bg-surface-2"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-brand-soft font-display text-lead text-brand-strong"
                  >
                    {vehicle.dealership.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-body font-semibold text-ink">
                      {vehicle.dealership.name}
                    </span>
                    <span className="flex items-center gap-1 text-body-sm text-brand-strong">
                      <Store className="h-3.5 w-3.5" aria-hidden="true" />
                      View all their cars
                    </span>
                  </span>
                </Link>

                <dl className="mt-4 space-y-2 text-body-sm text-ink-2">
                  {vehicle.dealership.address && (
                    <div className="flex items-start gap-2">
                      <dt className="sr-only">Address</dt>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                      <dd>{vehicle.dealership.address}</dd>
                    </div>
                  )}
                  {vehicle.dealership.phone && (
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Phone</dt>
                      <Phone className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                      <dd>
                        <a
                          href={`tel:${vehicle.dealership.phone.replace(/\s/g, "")}`}
                          className="hover:text-brand-strong hover:underline"
                        >
                          {vehicle.dealership.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {vehicle.dealership.website && (
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Website</dt>
                      <Globe className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                      <dd className="min-w-0">
                        <a
                          href={vehicle.dealership.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate hover:text-brand-strong hover:underline"
                        >
                          {vehicle.dealership.website.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            ) : (
              <section className="rounded-card border border-line bg-surface p-5">
                <h2 className="mb-1 text-body font-semibold text-ink">Seller</h2>
                <p className="text-body-sm text-ink-2">
                  Private seller{vehicle.user?.name ? ` · ${vehicle.user.name}` : ""}
                </p>
              </section>
            )}
          </div>
        </div>

        <Suspense fallback={null}>
          <SimilarVehicles vehicleId={vehicle.id} />
        </Suspense>
      </div>

      {/* Sticky mobile action bar. On a phone the price and the way to reach
          the seller should never be more than a thumb away. Save and share
          stay in the card above; crowding them in here squeezed the price
          down to "115,...". */}
      {!isSold && whatsappHref && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 shadow-overlay backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <p className="shrink-0 font-display text-lead text-ink">
              {formatPriceJOD(vehicle.price)}{" "}
              <span className="text-body-sm font-semibold text-ink-3">JOD</span>
            </p>
            <WhatsAppButton href={whatsappHref} label={title} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Streamed slots ────────────────────────────────────────────────── */

async function SaveSlot({
  vehicleId,
  title,
}: {
  vehicleId: string;
  title: string;
}) {
  const [user, saved] = await Promise.all([
    getSessionUser(),
    isVehicleSaved(vehicleId),
  ]);
  return (
    <SaveButton
      vehicleId={vehicleId}
      vehicleLabel={title}
      initialSaved={saved}
      isLoggedIn={Boolean(user)}
    />
  );
}

function SaveFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-11 w-11 shrink-0 rounded-control border border-line-control bg-surface"
    />
  );
}

/**
 * Price context, shown only when there are enough comparable listings to say
 * something honest. Below the threshold it renders nothing rather than
 * dressing up a comparison drawn from two other cars.
 */
async function PriceContext({
  vehicleId,
  price,
}: {
  vehicleId: string;
  price: number;
}) {
  const context = await getPriceContext(vehicleId);
  if (!context) return null;

  const diff = Math.round(((price - context.median) / context.median) * 100);
  if (Math.abs(diff) < 3) {
    return (
      <p className="mt-2 text-body-sm text-ink-3">
        About the median for comparable listings ({context.sampleSize} others).
      </p>
    );
  }

  const below = diff < 0;
  return (
    <p
      className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ${
        below ? "bg-trust-soft text-trust" : "bg-surface-2 text-ink-2"
      }`}
    >
      <TrendingDown
        className={`h-3.5 w-3.5 ${below ? "" : "rotate-180"}`}
        aria-hidden="true"
      />
      {Math.abs(diff)}% {below ? "below" : "above"} the median for comparable
      listings
    </p>
  );
}

async function SimilarVehicles({ vehicleId }: { vehicleId: string }) {
  const vehicles = await getSimilarVehicles(vehicleId, 3);
  if (vehicles.length === 0) return null;

  const [user] = await Promise.all([getSessionUser()]);

  return (
    <section className="mt-10">
      <h2 className="mb-5 font-display text-h2 text-ink">Similar cars</h2>
      <CarGrid vehicles={vehicles} savedIds={[]} isLoggedIn={Boolean(user)} />
    </section>
  );
}
