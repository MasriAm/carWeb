"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVehicle } from "@/lib/actions/vehicles";
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
const FUEL_TYPES = ["GAS", "ELECTRIC", "DIESEL", "HYBRID"];
const ORIGINS = ["EUROPEAN", "CHINESE", "JORDANIAN", "AMERICAN", "GULF"];

const inputCls = "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 h-10";
const labelCls = "text-zinc-300 text-sm font-medium";

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
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await createVehicle(data as any);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    router.push("/dashboard/vehicles");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Media zone */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Media</h2>
            <ImageDropzone images={imageUrls} onChange={setImageUrls} />
            <div className="mt-4 space-y-2">
              <Label htmlFor="videoUrl" className={labelCls}>Video URL (optional)</Label>
              <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://youtube.com/..." className={inputCls} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Description</h2>
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className={labelCls}>Short Description *</Label>
              <Textarea id="shortDescription" name="shortDescription" rows={3} required placeholder="Gulf-spec 2024 G63 AMG, matte black, full carbon package..." className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="detailedSpecs" className={labelCls}>Features & Specs (one per line)</Label>
              <Textarea id="detailedSpecs" name="detailedSpecs" rows={5} placeholder={"360° Camera\nAdaptive Cruise Control\nBurmester Sound"} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Right: Specification inputs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Vehicle Info</h2>
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

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className={labelCls}>Condition *</Label>
                <Select name="condition" defaultValue="USED">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Transmission *</Label>
                <Select name="transmission" defaultValue="AUTO">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="AUTO">Automatic</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Body Type *</Label>
                <Select name="bodyType" defaultValue="SUV">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Fuel Type *</Label>
                <Select name="fuelType" defaultValue="GAS">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {FUEL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Origin Spec *</Label>
                <Select name="originSpec" defaultValue="GULF">
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {ORIGINS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats" className={labelCls}>Seats *</Label>
                <Input id="seats" name="seats" type="number" required defaultValue={5} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Performance</h2>
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

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">Contact</h2>
            <div className="space-y-2">
              <Label htmlFor="specificWhatsapp" className={labelCls}>Direct WhatsApp for this car (optional)</Label>
              <Input id="specificWhatsapp" name="specificWhatsapp" placeholder="079XXXXXXX or 962791234567" className={inputCls} />
              <p className="text-xs text-zinc-600">Leave blank to use your dealership&apos;s default WhatsApp number.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold text-base">
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
