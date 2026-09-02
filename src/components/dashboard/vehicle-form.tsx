"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles";
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
} from "@/lib/validations/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";

type VehicleData = {
  id: string;
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
  status: string;
  videoUrl: string | null;
  instagramVideoUrl: string | null;
  imageUrls: string[];
  detailedSpecs: unknown;
  dealershipId: string | null;
  specificWhatsapp: string | null;
  fa7s: string | null;
  waredWakaleh: boolean;
  specOrigin: string | null;
  isPromoted: boolean;
} | null;

const BODY_TYPES = ["SUV", "SEDAN", "COUPE", "HATCHBACK", "CONVERTIBLE", "PICKUP", "VAN", "WAGON"];
const FUEL_OPTIONS = [
  { value: "GAS", label: "Gasoline" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
];

const SPEC_OPTIONS = [
  { value: "GCC", label: "Gulf spec" },
  { value: "US", label: "US spec" },
  { value: "EU", label: "European spec" },
  { value: "KOREAN", label: "Korean spec" },
  { value: "JAPANESE", label: "Japanese spec" },
  { value: "OTHER", label: "Other" },
];

const inputCls = "bg-surface-2 border-line-control text-ink placeholder:text-ink-3";
const labelCls = "text-ink-2";

const DEFAULT_SPEC = "UNSPECIFIED";

export default function VehicleForm({
  vehicle,
  redirectTo = "/dashboard/admin/vehicles",
}: {
  vehicle: VehicleData;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const specsRaw = (form.get("detailedSpecs") as string) || "";
    const specs = specsRaw.split("\n").map((s) => s.trim()).filter(Boolean);

    const imageUrlsRaw = (form.get("imageUrls") as string) || "";
    const imageUrls = imageUrlsRaw.split("\n").map((s) => s.trim()).filter(Boolean);

    const data = {
      brand: form.get("brand") as string,
      model: form.get("model") as string,
      price: Number(form.get("price")),
      shortDescription: form.get("shortDescription") as string,
      condition: form.get("condition") as CreateVehicleInput["condition"],
      bodyType: form.get("bodyType") as CreateVehicleInput["bodyType"],
      transmission: form.get("transmission") as CreateVehicleInput["transmission"],
      engineCapacityCC: Number(form.get("engineCapacityCC")),
      fuelType: form.get("fuelType") as CreateVehicleInput["fuelType"],
      mileageKm: Number(form.get("mileageKm")),
      productionYear: Number(form.get("productionYear")),
      videoUrl: (form.get("videoUrl") as string) || "",
      instagramVideoUrl: (form.get("instagramVideoUrl") as string) || "",
      imageUrls,
      detailedSpecs: specs,
      specificWhatsapp: (form.get("specificWhatsapp") as string) || "",
      fa7s: (form.get("fa7s") as string) || "",
      waredWakaleh: form.get("waredWakaleh") === "on",
      specOrigin:
        form.get("specOrigin") === DEFAULT_SPEC
          ? null
          : (form.get("specOrigin") as CreateVehicleInput["specOrigin"]),
      status: (form.get("status") as UpdateVehicleInput["status"]) || undefined,
      dealershipId: (form.get("dealershipId") as string) || undefined,
    } satisfies CreateVehicleInput & UpdateVehicleInput;

    try {
      const result = vehicle
        ? await updateVehicle(vehicle.id, data)
        : await createVehicle(data);
      setLoading(false);
      if (!result.success) {
        setError(result.error || "Something went wrong");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  };

  const existingSpecs = Array.isArray(vehicle?.detailedSpecs)
    ? (vehicle.detailedSpecs as string[]).join("\n")
    : "";
  const existingImages = vehicle?.imageUrls?.join("\n") || "";

  return (
    <Card className="bg-surface border-line">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                /rate limit/i.test(error)
                  ? "bg-brand-soft border border-brand/30 text-brand-strong"
                  : "bg-danger-soft border border-danger/25 text-danger"
              }`}
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className={labelCls}>Brand *</Label>
              <Input id="brand" name="brand" required defaultValue={vehicle?.brand ?? ""} placeholder="Mercedes-Benz" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className={labelCls}>Model *</Label>
              <Input id="model" name="model" required defaultValue={vehicle?.model ?? ""} placeholder="G63 AMG" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className={labelCls}>Price (JOD) *</Label>
              <Input id="price" name="price" type="number" required defaultValue={vehicle?.price ?? ""} placeholder="75000" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productionYear" className={labelCls}>Year *</Label>
              <Input id="productionYear" name="productionYear" type="number" required defaultValue={vehicle?.productionYear ?? ""} placeholder="2024" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileageKm" className={labelCls}>Mileage (km) *</Label>
              <Input id="mileageKm" name="mileageKm" type="number" required defaultValue={vehicle?.mileageKm ?? ""} placeholder="15000" className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription" className={labelCls}>Short Description *</Label>
            <Textarea id="shortDescription" name="shortDescription" rows={2} required defaultValue={vehicle?.shortDescription ?? ""} placeholder="Brief description of the vehicle..." className={inputCls} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className={labelCls}>Condition *</Label>
              <Select name="condition" defaultValue={vehicle?.condition ?? "USED"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-line-control">
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Transmission *</Label>
              <Select name="transmission" defaultValue={vehicle?.transmission ?? "AUTO"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-line-control">
                  <SelectItem value="AUTO">Automatic</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Body Type *</Label>
              <Select name="bodyType" defaultValue={vehicle?.bodyType ?? "SUV"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-line-control">
                  {BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Fuel Type *</Label>
              <Select name="fuelType" defaultValue={vehicle?.fuelType ?? "GAS"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-line-control">
                  {FUEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engineCapacityCC" className={labelCls}>Engine CC *</Label>
              <Input id="engineCapacityCC" name="engineCapacityCC" type="number" required defaultValue={vehicle?.engineCapacityCC ?? ""} placeholder="3000" className={inputCls} />
            </div>
            {vehicle && (
              <div className="space-y-2">
                <Label className={labelCls}>Status</Label>
                <Select name="status" defaultValue={vehicle.status}>
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-surface border-line-control">
                    <SelectItem value="ON_SALE">On Sale</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fa7s" className={labelCls}>Inspection Report (فحص)</Label>
            <Textarea id="fa7s" name="fa7s" rows={3} defaultValue={vehicle?.fa7s ?? ""} placeholder="Vehicle inspection details..." className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={labelCls}>Spec origin</Label>
                <Select name="specOrigin" defaultValue={DEFAULT_SPEC}>
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNSPECIFIED">Not specified</SelectItem>
                    {SPEC_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="waredWakaleh"
                defaultChecked={vehicle?.waredWakaleh ?? false}
                className="h-4 w-4 rounded border-line-control bg-surface-2 text-brand-strong focus:ring-brand-strong"
              />
              <span className="text-sm text-ink-2">Agency Import (وارد وكالة)</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className={labelCls}>Video URL</Label>
            <Input id="videoUrl" name="videoUrl" type="url" defaultValue={vehicle?.videoUrl ?? ""} placeholder="https://res.cloudinary.com/.../video.mp4" className={inputCls} />
            <p className="text-caption text-ink-3">Direct MP4 or WebM only; a YouTube link will not play.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramVideoUrl" className={labelCls}>Instagram Reel URL</Label>
            <Input id="instagramVideoUrl" name="instagramVideoUrl" type="url" defaultValue={vehicle?.instagramVideoUrl ?? ""} placeholder="https://www.instagram.com/reel/..." className={inputCls} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrls" className={labelCls}>Image URLs (one per line) *</Label>
            <Textarea id="imageUrls" name="imageUrls" rows={4} required defaultValue={existingImages} placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"} className={inputCls} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailedSpecs" className={labelCls}>Detailed Specs (one per line)</Label>
            <Textarea id="detailedSpecs" name="detailedSpecs" rows={4} defaultValue={existingSpecs} placeholder={"360° Camera System\nAdaptive Cruise Control"} className={inputCls} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificWhatsapp" className={labelCls}>Direct WhatsApp (optional)</Label>
            <Input id="specificWhatsapp" name="specificWhatsapp" defaultValue={vehicle?.specificWhatsapp ?? ""} placeholder="079XXXXXXX or 962791234567" className={inputCls} />
            <p className="text-xs text-ink-3">Leave blank to use the dealership default.</p>
          </div>

          <Button type="submit" disabled={loading} className="bg-brand text-brand-ink hover:bg-brand-hover">
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{vehicle ? "Updating..." : "Creating..."}</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />{vehicle ? "Update Vehicle" : "Create Vehicle"}</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
