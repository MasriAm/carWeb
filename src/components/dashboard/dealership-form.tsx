"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDealership, updateDealership } from "@/lib/actions/dealership";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type DealershipData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  address: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  website: string | null;
} | null;

export default function DealershipForm({
  dealership,
}: {
  dealership: DealershipData;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      description: (form.get("description") as string) || "",
      logoUrl: (form.get("logoUrl") as string) || "",
      address: (form.get("address") as string) || "",
      phone: (form.get("phone") as string) || "",
      whatsappNumber: (form.get("whatsappNumber") as string) || "",
      website: (form.get("website") as string) || "",
    };

    const result = dealership
      ? await updateDealership(data)
      : await createDealership(data);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  };

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
              <Label htmlFor="name" className="text-zinc-200">Dealership Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={dealership?.name ?? ""}
                placeholder="Amman Luxury Motors"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-zinc-200">URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={dealership?.slug ?? ""}
                placeholder="amman-luxury-motors"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-200">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={dealership?.description ?? ""}
              placeholder="Tell buyers about your dealership..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl" className="text-zinc-200">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={dealership?.logoUrl ?? ""}
              placeholder="https://..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-200">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={dealership?.phone ?? ""}
                placeholder="+962791234567"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="text-zinc-200">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                defaultValue={dealership?.whatsappNumber ?? ""}
                placeholder="962791234567"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
              <p className="text-xs text-zinc-600">Country code without + (e.g. 962791234567)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-zinc-200">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={dealership?.website ?? ""}
              placeholder="https://example.com"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-zinc-200">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={dealership?.address ?? ""}
              placeholder="Abdali Boulevard, Amman, Jordan"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-amber-500 text-zinc-950 hover:bg-amber-400">
            {loading
              ? "Saving..."
              : dealership
                ? "Update Dealership"
                : "Create Dealership"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
