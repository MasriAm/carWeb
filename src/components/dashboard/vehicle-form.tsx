"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles";
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
  seats: number;
  transmission: string;
  engineCapacityCC: number;
  fuelType: string;
  mileageKm: number;
  originSpec: string;
  productionYear: number;
  status: string;
  videoUrl: string | null;
  imageUrls: string[];
  detailedSpecs: unknown;
  dealershipId: string | null;
  specificWhatsapp: string | null;
} | null;

const BODY_TYPES = ["SUV", "SEDAN", "COUPE", "HATCHBACK", "CONVERTIBLE", "PICKUP", "VAN", "WAGON"];
const FUEL_TYPES = ["GAS", "ELECTRIC", "DIESEL", "HYBRID"];
const ORIGINS = ["EUROPEAN", "CHINESE", "JORDANIAN", "AMERICAN", "GULF"];

const inputCls = "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500";
const labelCls = "text-zinc-200";

export default function VehicleForm({ vehicle }: { vehicle: VehicleData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const specsRaw = (form.get("detailedSpecs") as string) || "";
    const specs = specsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const imageUrlsRaw = (form.get("imageUrls") as string) || "";
    const imageUrls = imageUrlsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      brand: form.get("brand") as string,
      model: form.get("model") as string,
      price: Number(form.get("price")),
      shortDescription: form.get("shortDescription") as string,
      condition: form.get("condition") as "NEW" | "USED",
      bodyType: form.get("bodyType") as string,
      seats: Number(form.get("seats")),
      transmission: form.get("transmission") as "AUTO" | "MANUAL",
      engineCapacityCC: Number(form.get("engineCapacityCC")),
      fuelType: form.get("fuelType") as string,
      mileageKm: Number(form.get("mileageKm")),
      originSpec: form.get("originSpec") as string,
      productionYear: Number(form.get("productionYear")),
      videoUrl: (form.get("videoUrl") as string) || "",
      imageUrls,
      detailedSpecs: specs,
      specificWhatsapp: (form.get("specificWhatsapp") as string) || "",
      status: (form.get("status") as "ON_SALE" | "SOLD") || undefined,
      dealershipId: (form.get("dealershipId") as string) || undefined,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = vehicle
      ? await updateVehicle(vehicle.id, data as any)
      : await createVehicle(data as any);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    router.push("/dashboard/admin/vehicles");
    router.refresh();
  };

  const existingSpecs = Array.isArray(vehicle?.detailedSpecs)
    ? (vehicle.detailedSpecs as string[]).join("\n")
    : "";

  const existingImages = vehicle?.imageUrls?.join("\n") || "";

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
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
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Transmission *</Label>
              <Select name="transmission" defaultValue={vehicle?.transmission ?? "AUTO"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="AUTO">Automatic</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Body Type *</Label>
              <Select name="bodyType" defaultValue={vehicle?.bodyType ?? "SUV"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Fuel Type *</Label>
              <Select name="fuelType" defaultValue={vehicle?.fuelType ?? "GAS"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {FUEL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className={labelCls}>Origin Spec *</Label>
              <Select name="originSpec" defaultValue={vehicle?.originSpec ?? "GULF"}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {ORIGINS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats" className={labelCls}>Seats *</Label>
              <Input id="seats" name="seats" type="number" required defaultValue={vehicle?.seats ?? 5} placeholder="5" className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineCapacityCC" className={labelCls}>Engine CC *</Label>
              <Input id="engineCapacityCC" name="engineCapacityCC" type="number" required defaultValue={vehicle?.engineCapacityCC ?? ""} placeholder="3000" className={inputCls} />
            </div>
          </div>

          {vehicle && (
            <div className="space-y-2">
              <Label className={labelCls}>Status</Label>
              <Select name="status" defaultValue={vehicle.status}>
                <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="ON_SALE">On Sale</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className={labelCls}>Video URL</Label>
            <Input id="videoUrl" name="videoUrl" type="url" defaultValue={vehicle?.videoUrl ?? ""} placeholder="https://..." className={inputCls} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrls" className={labelCls}>Image URLs (one per line) *</Label>
            <Textarea id="imageUrls" name="imageUrls" rows={4} required defaultValue={existingImages} placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"} className={inputCls} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailedSpecs" className={labelCls}>Detailed Specs (one per line)</Label>
            <Textarea id="detailedSpecs" name="detailedSpecs" rows={4} defaultValue={existingSpecs} placeholder={"360° Camera System\nAdaptive Cruise Control\nBurmester Surround Sound"} className={inputCls} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificWhatsapp" className={labelCls}>Direct WhatsApp for this car (optional)</Label>
            <Input id="specificWhatsapp" name="specificWhatsapp" defaultValue={vehicle?.specificWhatsapp ?? ""} placeholder="079XXXXXXX or 962791234567" className={inputCls} />
            <p className="text-xs text-zinc-600">Leave blank to use the dealership default.</p>
          </div>

          <Button type="submit" disabled={loading} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
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
