"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVehicle } from "@/lib/actions/vehicles";
import type { CreateVehicleInput } from "@/lib/validations/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import ImageDropzone from "@/components/dashboard/image-dropzone";

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

const inputCls = "bg-surface-2 border-line-control text-ink placeholder:text-ink-3 h-10";
const labelCls = "text-ink-2 text-sm font-medium";

const DEFAULT_SPEC = "UNSPECIFIED";

export default function DealerVehicleForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (imageUrls.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setLoading(true);

    const form = new FormData(e.currentTarget);
    const specsRaw = (form.get("detailedSpecs") as string) || "";
    const specs = specsRaw.split("\n").map((s) => s.trim()).filter(Boolean);

    const data = {
      brand: form.get("brand") as string,
      model: form.get("model") as string,
      price: Number(form.get("price")),
      shortDescription: form.get("shortDescription") as string,
      condition: form.get("condition") as "NEW" | "USED",
      bodyType: form.get("bodyType") as string,
      transmission: form.get("transmission") as "AUTO" | "MANUAL",
      engineCapacityCC: Number(form.get("engineCapacityCC")),
      fuelType: form.get("fuelType") as string,
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
    };

    try {
      const result = await createVehicle(data as CreateVehicleInput);
      setLoading(false);
      if (!result.success) {
        setError(result.error || "Something went wrong");
        return;
      }
      router.push("/dashboard/vehicles");
      router.refresh();
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            /rate limit/i.test(error)
              ? "bg-brand-soft border border-brand/30 text-brand-strong"
              : /unauthorized/i.test(error)
                ? "bg-danger-soft border border-danger/25 text-danger"
                : "bg-danger-soft border border-danger/25 text-danger"
          }`}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-brand-strong uppercase tracking-wider mb-4">Media</h2>
            <ImageDropzone images={imageUrls} onChange={setImageUrls} />
            <div className="mt-4 space-y-2">
              <Label htmlFor="videoUrl" className={labelCls}>Video URL (optional)</Label>
              <p className="text-caption text-ink-3">
                A direct MP4 or WebM file — a Cloudinary upload works. A
                YouTube or Instagram page link will not play; use the
                Instagram field below for reels.
              </p>
              <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://res.cloudinary.com/.../video.mp4" className={inputCls} />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="instagramVideoUrl" className={labelCls}>Instagram Reel URL (optional)</Label>
              <Input id="instagramVideoUrl" name="instagramVideoUrl" type="url" placeholder="https://www.instagram.com/reel/..." className={inputCls} />
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-brand-strong uppercase tracking-wider mb-4">Description</h2>
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className={labelCls}>Short Description *</Label>
              <Textarea id="shortDescription" name="shortDescription" rows={3} required placeholder="Gulf-spec 2024 G63 AMG, matte black, full carbon package..." className="bg-surface-2 border-line-control text-ink placeholder:text-ink-3" />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="fa7s" className={labelCls}>Inspection Report — فحص (optional)</Label>
              <Textarea id="fa7s" name="fa7s" rows={3} placeholder="Vehicle inspection details..." className="bg-surface-2 border-line-control text-ink placeholder:text-ink-3" />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="detailedSpecs" className={labelCls}>Features & Specs (one per line)</Label>
              <Textarea id="detailedSpecs" name="detailedSpecs" rows={5} placeholder={"360° Camera\nAdaptive Cruise Control\nBurmester Sound"} className="bg-surface-2 border-line-control text-ink placeholder:text-ink-3" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-brand-strong uppercase tracking-wider mb-4">Vehicle Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className={labelCls}>Brand *</Label>
                <Input id="brand" name="brand" required placeholder="Mercedes-Benz" className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className={labelCls}>Model *</Label>
                <Input id="model" name="model" required placeholder="G63 AMG" className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className={labelCls}>Price (JOD) *</Label>
                <Input id="price" name="price" type="number" required placeholder="115000" className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productionYear" className={labelCls}>Production Year *</Label>
                <Input id="productionYear" name="productionYear" type="number" required placeholder="2024" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-brand-strong uppercase tracking-wider mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className={labelCls}>Condition *</Label>
                <Select name="condition" defaultValue="USED">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-surface border-line-control">
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Transmission *</Label>
                <Select name="transmission" defaultValue="AUTO">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-surface border-line-control">
                    <SelectItem value="AUTO">Automatic</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Body Type *</Label>
                <Select name="bodyType" defaultValue="SUV">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-surface border-line-control">
                    {BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Fuel Type *</Label>
                <Select name="fuelType" defaultValue="GAS">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-surface border-line-control">
                    {FUEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
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
              <label className="flex items-center gap-2 cursor-pointer col-span-2 sm:col-span-1 self-end pb-2">
                <input
                  type="checkbox"
                  name="waredWakaleh"
                  className="h-4 w-4 rounded border-line-control bg-surface-2 text-brand-strong focus:ring-brand-strong"
                />
                <span className="text-sm text-ink-2">Agency Import</span>
              </label>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-brand-strong uppercase tracking-wider mb-4">Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engineCapacityCC" className={labelCls}>Engine CC *</Label>
                <Input id="engineCapacityCC" name="engineCapacityCC" type="number" required placeholder="3982" className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileageKm" className={labelCls}>Mileage (km) *</Label>
                <Input id="mileageKm" name="mileageKm" type="number" required placeholder="12500" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5">
            <h2 className="text-sm font-semibold text-brand-strong uppercase tracking-wider mb-4">Contact</h2>
            <div className="space-y-2">
              <Label htmlFor="specificWhatsapp" className={labelCls}>Direct WhatsApp for this car (optional)</Label>
              <Input id="specificWhatsapp" name="specificWhatsapp" placeholder="079XXXXXXX or 962791234567" className={inputCls} />
              <p className="text-xs text-ink-3">Leave blank to use your dealership&apos;s default WhatsApp number.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-brand text-brand-ink hover:bg-brand-hover font-semibold text-base">
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Publishing...</>
            ) : (
              <><Send className="mr-2 h-5 w-5" />Publish Listing</>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
