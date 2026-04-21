"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Calendar,
  Cog,
  Car,
  Heart,
  MessageCircle,
  Star,
  BadgeCheck,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { toggleSaveVehicle } from "@/lib/actions/vehicles";
import { cn } from "@/lib/utils";

/** Matches `MarketplaceListVehicle` from getVehicles (grid payload). */
type VehicleCard = {
  id: string;
  status: string;
  videoUrl: string | null;
  imageUrls: string[];
  brand: string;
  model: string;
  price: number;
  shortDescription: string;
  condition: string;
  bodyType: string;
  transmission: string;
  engineCapacityCC: number;
  fuelType: string;
  mileageKm: number;
  productionYear: number;
  isPromoted?: boolean;
  waredWakaleh?: boolean;
  specificWhatsapp?: string | null;
  dealership?: {
    name: string;
    slug: string;
    whatsappNumber?: string | null;
    phone?: string | null;
  } | null;
  user?: { name: string | null; phone?: string | null } | null;
};

const tactileSpring = { type: "spring" as const, stiffness: 400, damping: 17 };

const formatPriceShort = (price: number) =>
  price >= 1000 ? `${Math.round(price / 1000)}K` : price.toLocaleString();

const FUEL_LABEL: Record<string, string> = {
  GAS: "Gasoline",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
};

const TRANSMISSION_LABEL: Record<string, string> = {
  AUTO: "Auto",
  MANUAL: "Manual",
};

const BODY_LABEL: Record<string, string> = {
  SUV: "SUV",
  SEDAN: "Sedan",
  COUPE: "Coupe",
  HATCHBACK: "Hatchback",
  CONVERTIBLE: "Convertible",
  PICKUP: "Pickup",
  VAN: "Van",
  WAGON: "Wagon",
};

/** Infer a reasonable MIME type from a video URL extension so the browser
 * doesn't silently reject playable content (e.g. .mov served without a type). */
function guessVideoMime(url: string): string | undefined {
  const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
  if (cleanUrl.endsWith(".webm")) return "video/webm";
  if (cleanUrl.endsWith(".ogg") || cleanUrl.endsWith(".ogv"))
    return "video/ogg";
  if (cleanUrl.endsWith(".mov")) return "video/quicktime";
  if (cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".m4v"))
    return "video/mp4";
  return undefined;
}

function MediaSlider({
  videoUrl,
  imageUrls,
  brand,
  model,
}: {
  videoUrl: string | null;
  imageUrls: string[];
  brand: string;
  model: string;
}) {
  const [videoFailed, setVideoFailed] = useState(false);

  const slides: { type: "video" | "image"; url: string }[] = [];
  if (videoUrl && !videoFailed) slides.push({ type: "video", url: videoUrl });
  imageUrls.forEach((url) => slides.push({ type: "image", url }));

  const [current, setCurrent] = useState(0);

  // If the video fails after we advanced past it, clamp the index.
  const safeCurrent = Math.min(current, Math.max(slides.length - 1, 0));

  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  if (slides.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-zinc-800">
        <Car className="h-12 w-12 text-zinc-600" />
      </div>
    );
  }

  const activeSlide = slides[safeCurrent];

  return (
    <div className="group relative aspect-[16/10] overflow-hidden bg-zinc-900">
      {activeSlide.type === "video" ? (
        <video
          key={activeSlide.url}
          className="h-full w-full object-cover"
          controls
          muted
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onError={() => {
            setVideoFailed(true);
            setCurrent(0);
          }}
        >
          <source
            src={activeSlide.url}
            type={guessVideoMime(activeSlide.url)}
          />
          {/* Fallback: bare src for browsers that ignore <source> type. */}
          <source src={activeSlide.url} />
        </video>
      ) : (
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Image
            src={activeSlide.url}
            alt={`${brand} ${model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === safeCurrent ? "w-4 bg-amber-500" : "w-1.5 bg-white/50"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {activeSlide.type === "video" && (
        <span className="absolute left-2.5 top-10 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-zinc-950">
          VIDEO
        </span>
      )}
    </div>
  );
}

export default function CarCard({
  vehicle,
  isSaved: initialSaved = false,
  isLoggedIn = false,
}: {
  vehicle: VehicleCard;
  isSaved?: boolean;
  isLoggedIn?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!isLoggedIn) return;
    setSaving(true);
    try {
      const result = await toggleSaveVehicle(vehicle.id);
      setSaved(result.saved);
    } finally {
      setSaving(false);
    }
  };

  const contactNumber =
    vehicle.specificWhatsapp ||
    vehicle.dealership?.whatsappNumber ||
    vehicle.dealership?.phone ||
    vehicle.user?.phone;
  const whatsappUrl = contactNumber
    ? `https://wa.me/${contactNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `I am interested in your ${vehicle.brand} ${vehicle.model}.`
      )}`
    : null;

  const isSold = vehicle.status === "SOLD";
  const isElectric = vehicle.fuelType === "ELECTRIC";
  const fuelLabel = FUEL_LABEL[vehicle.fuelType] ?? vehicle.fuelType;
  const transLabel =
    TRANSMISSION_LABEL[vehicle.transmission] ?? vehicle.transmission;
  const bodyLabel = BODY_LABEL[vehicle.bodyType] ?? vehicle.bodyType;

  const detailsHref = `/cars/${vehicle.id}`;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border transition-shadow",
        vehicle.isPromoted
          ? "border-amber-500/40 bg-gradient-to-br from-zinc-900 to-[#1C1710] shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40",
        isSold && "opacity-65"
      )}
    >
      <Link
        href={detailsHref}
        className="relative block"
        aria-label={`View details for ${vehicle.brand} ${vehicle.model}`}
      >
        <MediaSlider
          videoUrl={vehicle.videoUrl}
          imageUrls={vehicle.imageUrls}
          brand={vehicle.brand}
          model={vehicle.model}
        />

        {/* Top-left badge (Sponsored / Verified) */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex gap-1.5">
          {vehicle.isPromoted ? (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-zinc-950">
              <Star className="h-2.5 w-2.5 fill-current" />
              SPONSORED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-zinc-950/75 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
              <ShieldCheck className="h-2.5 w-2.5" />
              VERIFIED
            </span>
          )}
        </div>

        {/* Top-right status badge */}
        <div className="pointer-events-none absolute right-2.5 top-2.5 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold text-white",
              isSold
                ? "bg-red-500/90"
                : isElectric
                ? "bg-blue-500/90"
                : "bg-emerald-500/90"
            )}
          >
            {isSold ? (
              "SOLD"
            ) : isElectric ? (
              <>
                <Zap className="h-2.5 w-2.5" />
                EV
              </>
            ) : (
              "ON SALE"
            )}
          </span>
        </div>

        {/* Save button */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handleSave();
            }}
            disabled={saving}
            aria-label={saved ? "Unsave" : "Save"}
            aria-pressed={saved}
            className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                saved ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        {/* Title + Price */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              {vehicle.brand}
            </div>
            <Link
              href={detailsHref}
              className="block text-[15px] font-bold leading-tight text-white hover:text-amber-400"
            >
              {vehicle.model}
            </Link>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[17px] font-extrabold leading-none text-amber-500">
              {formatPriceShort(vehicle.price)}
            </div>
            <div className="mt-0.5 text-[10px] text-zinc-500">JOD</div>
          </div>
        </div>

        {/* Dealership + Agency badge */}
        {(vehicle.dealership || vehicle.waredWakaleh) && (
          <div className="mb-2 flex items-center gap-2 text-[11px] text-zinc-500">
            {vehicle.dealership && (
              <span>
                by{" "}
                <span className="font-medium text-zinc-300">
                  {vehicle.dealership.name}
                </span>
              </span>
            )}
            {vehicle.waredWakaleh && (
              <span className="inline-flex items-center gap-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                <BadgeCheck className="h-2.5 w-2.5" />
                Agency
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="mb-2.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
          {vehicle.shortDescription}
        </p>

        {/* Spec grid */}
        <div className="mb-2.5 grid grid-cols-3 gap-x-1 gap-y-1.5">
          <SpecItem
            icon={<Calendar className="h-3 w-3" />}
            value={String(vehicle.productionYear)}
          />
          <SpecItem
            icon={<Gauge className="h-3 w-3" />}
            value={`${Math.round(vehicle.mileageKm / 1000)}k km`}
          />
          <SpecItem
            icon={<Fuel className="h-3 w-3" />}
            value={fuelLabel}
          />
          <SpecItem
            icon={<Cog className="h-3 w-3" />}
            value={transLabel}
          />
          <SpecItem icon={<Car className="h-3 w-3" />} value={bodyLabel} />
          <SpecItem
            icon={<Zap className="h-3 w-3" />}
            value={
              isElectric
                ? "EV"
                : vehicle.engineCapacityCC
                ? `${vehicle.engineCapacityCC}cc`
                : "—"
            }
          />
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-1.5 pt-1">
          {whatsappUrl && (
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileTap={{ scale: 0.97 }}
              transition={tactileSpring}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </motion.a>
          )}
          <Link
            href={detailsHref}
            className={cn(
              "flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-700",
              !whatsappUrl && "flex-1"
            )}
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SpecItem({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-zinc-400">
      <span className="text-zinc-600">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
