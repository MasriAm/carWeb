"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Calendar,
  Cog,
  Users,
  Globe,
  Car,
  Info,
  Heart,
  MessageCircle,
} from "lucide-react";
import { toggleSaveVehicle } from "@/lib/actions/vehicles";

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
  seats: number;
  transmission: string;
  engineCapacityCC: number;
  fuelType: string;
  mileageKm: number;
  originSpec: string;
  productionYear: number;
  detailedSpecs: unknown;
  dealership?: { name: string; slug: string } | null;
  user?: { name: string | null; phone?: string | null } | null;
};

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
  const slides: { type: "video" | "image"; url: string }[] = [];

  if (videoUrl) slides.push({ type: "video", url: videoUrl });
  imageUrls.forEach((url) => slides.push({ type: "image", url }));

  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  if (slides.length === 0) {
    return (
      <div className="aspect-[16/10] bg-zinc-800 flex items-center justify-center rounded-t-xl">
        <Car className="h-12 w-12 text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-zinc-800 group">
      {slides[current].type === "video" ? (
        <video
          src={slides[current].url}
          className="h-full w-full object-cover"
          controls
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <Image
          src={slides[current].url}
          alt={`${brand} ${model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-4 bg-amber-500" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {slides[current].type === "video" && (
        <Badge className="absolute top-2 left-2 bg-amber-500 text-zinc-950 text-[10px]">
          VIDEO
        </Badge>
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

  const specs = Array.isArray(vehicle.detailedSpecs)
    ? (vehicle.detailedSpecs as string[])
    : [];

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

  const dealerPhone = vehicle.user?.phone || vehicle.dealership?.slug;
  const whatsappUrl = dealerPhone
    ? `https://wa.me/${dealerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in the ${vehicle.brand} ${vehicle.model} listed on Royal Cars.`)}`
    : null;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden flex flex-col group/card">
      <div className="relative">
        <MediaSlider
          videoUrl={vehicle.videoUrl}
          imageUrls={vehicle.imageUrls}
          brand={vehicle.brand}
          model={vehicle.model}
        />

        <Badge
          className={`absolute top-2 right-2 text-[10px] font-semibold ${
            vehicle.status === "SOLD"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {vehicle.status === "SOLD" ? "SOLD" : "ON SALE"}
        </Badge>

        {isLoggedIn && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="absolute top-2 right-20 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Heart
              className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-lg text-white leading-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-lg font-bold text-amber-500 whitespace-nowrap">
            {vehicle.price.toLocaleString()} <span className="text-xs font-normal text-zinc-500">JOD</span>
          </span>
        </div>

        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
          {vehicle.shortDescription}
        </p>

        {vehicle.dealership && (
          <p className="text-xs text-zinc-500 mb-3">
            by <span className="font-medium text-zinc-300">{vehicle.dealership.name}</span>
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-zinc-600" />
            {vehicle.productionYear}
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3 text-zinc-600" />
            {vehicle.mileageKm.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3 text-zinc-600" />
            {vehicle.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <Cog className="h-3 w-3 text-zinc-600" />
            {vehicle.transmission}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-zinc-600" />
            {vehicle.seats} seats
          </div>
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3 text-zinc-600" />
            {vehicle.originSpec}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-300 border-zinc-700">
            {vehicle.condition}
          </Badge>
          <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-300 border-zinc-700">
            {vehicle.bodyType}
          </Badge>
          <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-300 border-zinc-700">
            {vehicle.engineCapacityCC} CC
          </Badge>
        </div>

        <div className="mt-auto flex gap-2">
          {specs.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  <Info className="mr-2 h-3.5 w-3.5" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-zinc-900 border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {vehicle.brand} {vehicle.model} — Specs & Features
                  </DialogTitle>
                </DialogHeader>
                <ul className="grid gap-2 mt-4">
                  {specs.map((spec, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
