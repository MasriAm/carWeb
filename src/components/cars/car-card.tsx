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
  user?: { name: string | null } | null;
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
      <div className="aspect-[16/10] bg-neutral-100 flex items-center justify-center rounded-t-xl">
        <Car className="h-12 w-12 text-neutral-300" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-neutral-100 group">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
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
                  i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {slides[current].type === "video" && (
        <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-[10px]">
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

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
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
              : "bg-green-600 text-white"
          }`}
        >
          {vehicle.status === "SOLD" ? "SOLD" : "ON SALE"}
        </Badge>

        {isLoggedIn && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="absolute top-2 right-20 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
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
          <h3 className="font-bold text-lg text-neutral-900 leading-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-lg font-bold text-neutral-900 whitespace-nowrap">
            {vehicle.price.toLocaleString()} <span className="text-xs font-normal text-neutral-500">JOD</span>
          </span>
        </div>

        <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
          {vehicle.shortDescription}
        </p>

        {vehicle.dealership && (
          <p className="text-xs text-neutral-400 mb-3">
            by <span className="font-medium text-neutral-600">{vehicle.dealership.name}</span>
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 text-xs text-neutral-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-neutral-400" />
            {vehicle.productionYear}
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3 text-neutral-400" />
            {vehicle.mileageKm.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3 text-neutral-400" />
            {vehicle.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <Cog className="h-3 w-3 text-neutral-400" />
            {vehicle.transmission}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-neutral-400" />
            {vehicle.seats} seats
          </div>
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3 text-neutral-400" />
            {vehicle.originSpec}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary" className="text-[10px]">
            {vehicle.condition}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {vehicle.bodyType}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {vehicle.engineCapacityCC} CC
          </Badge>
        </div>

        {specs.length > 0 && (
          <div className="mt-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Info className="mr-2 h-3.5 w-3.5" />
                  Further Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {vehicle.brand} {vehicle.model} — Specs & Features
                  </DialogTitle>
                </DialogHeader>
                <ul className="grid gap-2 mt-4">
                  {specs.map((spec, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-neutral-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
