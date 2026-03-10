import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVehicleById } from "@/lib/actions/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Fuel,
  Gauge,
  Cog,
  Car,
  MessageCircle,
  ArrowLeft,
  BadgeCheck,
  Star,
  ClipboardCheck,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return { title: "Vehicle Not Found" };
  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.productionYear} — Royal Cars`,
    description: vehicle.shortDescription,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const contactNumber =
    vehicle.specificWhatsapp ||
    vehicle.dealership?.whatsappNumber ||
    vehicle.dealership?.phone ||
    vehicle.user?.phone;
  const whatsappUrl = contactNumber
    ? `https://wa.me/${contactNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`I am interested in your ${vehicle.brand} ${vehicle.model} (${vehicle.productionYear}).`)}`
    : null;

  const specs = Array.isArray(vehicle.detailedSpecs)
    ? (vehicle.detailedSpecs as string[])
    : [];

  return (
    <section className="min-h-screen bg-zinc-950">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-500 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-3 space-y-4">
            {vehicle.imageUrls.length > 0 && (
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <Image
                  src={vehicle.imageUrls[0]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {vehicle.isPromoted && (
                  <Badge className="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-xs font-bold z-10">
                    <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                    SPONSORED
                  </Badge>
                )}
              </div>
            )}

            {vehicle.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.imageUrls.slice(1, 5).map((url, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <Image
                      src={url}
                      alt={`${vehicle.brand} ${vehicle.model} — ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="15vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Instagram Reel Embed */}
            {vehicle.instagramVideoUrl && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Video Reel</h3>
                <div className="relative w-full overflow-hidden rounded-xl" style={{ maxWidth: 540 }}>
                  <iframe
                    src={vehicle.instagramVideoUrl.replace(/\/$/, "") + "/embed"}
                    className="w-full border-0"
                    height={600}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-zinc-500 text-sm">{vehicle.productionYear} · {vehicle.condition}</p>
                </div>
                <Badge className={vehicle.status === "SOLD" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}>
                  {vehicle.status === "SOLD" ? "SOLD" : "ON SALE"}
                </Badge>
              </div>

              <div className="text-3xl font-bold text-amber-500 mb-4">
                {vehicle.price.toLocaleString()} <span className="text-lg font-normal text-zinc-500">JOD</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {vehicle.waredWakaleh && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                    <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                    Agency Import (وارد وكالة)
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Calendar className="h-4 w-4 text-zinc-600" />
                  <span className="text-zinc-500">Year:</span>
                  {vehicle.productionYear}
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Gauge className="h-4 w-4 text-zinc-600" />
                  <span className="text-zinc-500">Mileage:</span>
                  {vehicle.mileageKm.toLocaleString()} km
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Fuel className="h-4 w-4 text-zinc-600" />
                  <span className="text-zinc-500">Fuel:</span>
                  {vehicle.fuelType}
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Cog className="h-4 w-4 text-zinc-600" />
                  <span className="text-zinc-500">Trans:</span>
                  {vehicle.transmission}
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Car className="h-4 w-4 text-zinc-600" />
                  <span className="text-zinc-500">Body:</span>
                  {vehicle.bodyType}
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Gauge className="h-4 w-4 text-zinc-600" />
                  <span className="text-zinc-500">Engine:</span>
                  {vehicle.engineCapacityCC} CC
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Description</h3>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {vehicle.shortDescription}
              </p>
            </div>

            {/* Inspection Report */}
            {vehicle.fa7s && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Inspection Report (فحص)
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                  {vehicle.fa7s}
                </p>
              </div>
            )}

            {/* Features */}
            {specs.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Features & Specs</h3>
                <ul className="grid gap-2">
                  {specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dealership Info */}
            {vehicle.dealership && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Dealership</h3>
                <p className="text-lg font-semibold text-white mb-2">{vehicle.dealership.name}</p>
                <div className="space-y-1.5 text-sm text-zinc-400">
                  {vehicle.dealership.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      {vehicle.dealership.phone}
                    </div>
                  )}
                  {vehicle.dealership.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" />
                      <a href={vehicle.dealership.website} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
                        {vehicle.dealership.website}
                      </a>
                    </div>
                  )}
                  {vehicle.dealership.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {vehicle.dealership.address}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold rounded-2xl">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
