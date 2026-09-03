import Link from "next/link";
import { BadgeCheck, Images, Star, Video } from "lucide-react";
import type { ListVehicle } from "@/lib/data/vehicles";
import { cn } from "@/lib/utils";
import {
  formatKm,
  formatPriceJOD,
  vehicleTitle,
  FUEL_LABEL,
  SPEC_ORIGIN_LABEL,
  TRANSMISSION_LABEL,
} from "@/lib/vehicle-format";
import { contactNumberFor, whatsappVehicleLink } from "@/lib/vehicle-contact";
import CarPhoto from "./car-photo";
import SaveButton from "./save-button";
import WhatsAppButton from "./whatsapp-button";

/**
 * Listing card.
 *
 * One link target. The previous card nested the slide controls, the dot
 * indicators, the save button and a second "Details" link inside a wrapping
 * anchor — invalid HTML, and every one of those controls needed
 * preventDefault/stopPropagation to work at all. Here the anchor covers the
 * card through `.link-cover`, and the two real controls sit outside it in a
 * higher stacking context.
 *
 * The photo carousel is gone too: a card shows one photo and says how many
 * more there are. Browsing images is what the detail page is for, and the old
 * version mounted a `<video controls preload="metadata">` as slide one, so
 * twelve cards meant twelve video elements fetching metadata on page load.
 */
export default function CarCard({
  vehicle,
  isSaved = false,
  isLoggedIn = false,
  isFeatured = false,
  priority = false,
}: {
  vehicle: ListVehicle;
  isSaved?: boolean;
  isLoggedIn?: boolean;
  isFeatured?: boolean;
  priority?: boolean;
}) {
  const href = `/cars/${vehicle.id}`;
  const isSold = vehicle.status === "SOLD";
  const title = vehicleTitle(vehicle);
  const photoCount = vehicle.imageUrls.length;
  const hasVideo = Boolean(vehicle.videoUrl);

  const contact = contactNumberFor(vehicle);
  const whatsappHref = contact ? whatsappVehicleLink(contact, vehicle) : null;
  const showWhatsApp = Boolean(whatsappHref) && !isSold;

  const meta = [
    formatKm(vehicle.mileageKm),
    FUEL_LABEL[vehicle.fuelType] ?? vehicle.fuelType,
    TRANSMISSION_LABEL[vehicle.transmission] ?? vehicle.transmission,
    vehicle.specOrigin ? SPEC_ORIGIN_LABEL[vehicle.specOrigin] : null,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border bg-surface shadow-card transition-shadow hover:shadow-lift",
        isFeatured ? "border-brand/40" : "border-line"
      )}
    >
      <div className="relative">
        <CarPhoto
          src={vehicle.imageUrls[0]}
          alt={title}
          priority={priority}
          className={isSold ? "grayscale" : undefined}
        />

        {(isFeatured || isSold) && (
          <div className="pointer-events-none absolute start-2.5 top-2.5 z-[2]">
            {isSold ? (
              <span className="rounded-control bg-ink px-2 py-1 text-caption font-bold uppercase tracking-wide text-inverse-ink">
                Sold
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-control bg-brand px-2 py-1 text-caption font-bold text-brand-ink">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>
        )}

        {(photoCount > 1 || hasVideo) && (
          <div className="pointer-events-none absolute bottom-2.5 end-2.5 z-[2] flex items-center gap-2 rounded-control bg-ink/70 px-2 py-1 text-caption font-semibold text-inverse-ink backdrop-blur-sm">
            {photoCount > 1 && (
              <span className="flex items-center gap-1">
                <Images className="h-3.5 w-3.5" aria-hidden="true" />
                {photoCount}
              </span>
            )}
            {hasVideo && (
              <span className="flex items-center gap-1">
                <Video className="h-3.5 w-3.5" aria-hidden="true" />
                Video
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-title text-ink">
            {formatPriceJOD(vehicle.price)}
          </span>
          <span className="text-body-sm font-semibold text-ink-3">JOD</span>
        </div>

        {/* The only link. `.link-cover` stretches it over the whole card, so
            the card has a single, correctly sized target. */}
        <h3 className="text-body font-semibold leading-snug text-ink">
          <Link href={href} className="link-cover rounded-control">
            {title}
          </Link>
        </h3>

        <p className="text-body-sm text-ink-3">{meta.join(" · ")}</p>

        {(vehicle.waredWakaleh || vehicle.dealership) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {vehicle.waredWakaleh && (
              <span className="inline-flex items-center gap-1 rounded-full bg-trust-soft px-2 py-0.5 text-caption font-semibold text-trust">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Agency import
              </span>
            )}
            {vehicle.dealership && (
              <span className="max-w-full truncate rounded-full bg-surface-2 px-2 py-0.5 text-caption font-medium text-ink-2">
                {vehicle.dealership.name}
              </span>
            )}
          </div>
        )}

        {/* Controls sit outside the anchor, above it in the stacking order. */}
        <div className="relative z-[2] mt-auto flex items-center gap-2 pt-2">
          {showWhatsApp && whatsappHref && (
            <WhatsAppButton href={whatsappHref} label={title} />
          )}
          <SaveButton
            vehicleId={vehicle.id}
            vehicleLabel={title}
            initialSaved={isSaved}
            isLoggedIn={isLoggedIn}
            className={showWhatsApp ? undefined : "ms-auto"}
          />
        </div>
      </div>
    </article>
  );
}
